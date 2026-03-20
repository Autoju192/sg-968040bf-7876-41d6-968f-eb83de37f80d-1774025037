-- Create tender_inbox table for aggregating all tender-related messages
CREATE TABLE IF NOT EXISTS tender_inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('portal', 'email', 'api', 'manual', 'link_watcher')),
  type TEXT NOT NULL CHECK (type IN ('new_tender', 'update', 'clarification', 'amendment', 'deadline_change', 'message', 'document')),
  subject TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  action_required BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tender_inbox_organisation ON tender_inbox(organisation_id);
CREATE INDEX IF NOT EXISTS idx_tender_inbox_tender ON tender_inbox(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_inbox_assigned ON tender_inbox(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tender_inbox_unread ON tender_inbox(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_tender_inbox_action ON tender_inbox(action_required) WHERE action_required = true;

-- Enable RLS
ALTER TABLE tender_inbox ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view inbox items from their organisation"
  ON tender_inbox FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert inbox items for their organisation"
  ON tender_inbox FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update inbox items from their organisation"
  ON tender_inbox FOR UPDATE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete inbox items from their organisation"
  ON tender_inbox FOR DELETE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );