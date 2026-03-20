-- Drop and recreate tender_inbox with enhanced schema
DROP TABLE IF EXISTS tender_inbox CASCADE;

CREATE TABLE tender_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES portal_connections(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('API', 'EMAIL', 'LINK_WATCHER', 'PORTAL_SESSION', 'MANUAL')),
  source_type TEXT, -- 'find_a_tender', 'contracts_finder', 'gmail', etc.
  type TEXT NOT NULL CHECK (type IN ('new_tender', 'update', 'clarification', 'amendment', 'deadline_change', 'message', 'document_added')),
  title TEXT NOT NULL,
  summary TEXT,
  raw_content TEXT,
  action_required BOOLEAN DEFAULT false,
  action_text TEXT,
  action_deadline DATE,
  suggested_owner UUID REFERENCES users(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'actioned', 'archived')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  read_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  external_id TEXT, -- For deduplication
  external_link TEXT,
  metadata JSONB, -- Additional data from source
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tender_inbox ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view org inbox items"
  ON tender_inbox FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create inbox items"
  ON tender_inbox FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can create inbox items"
  ON tender_inbox FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update inbox items"
  ON tender_inbox FOR UPDATE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete inbox items"
  ON tender_inbox FOR DELETE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_tender_inbox_org ON tender_inbox(organisation_id);
CREATE INDEX idx_tender_inbox_tender ON tender_inbox(tender_id);
CREATE INDEX idx_tender_inbox_connection ON tender_inbox(connection_id);
CREATE INDEX idx_tender_inbox_status ON tender_inbox(status);
CREATE INDEX idx_tender_inbox_priority ON tender_inbox(priority);
CREATE INDEX idx_tender_inbox_created_at ON tender_inbox(created_at DESC);
CREATE INDEX idx_tender_inbox_external_id ON tender_inbox(external_id);