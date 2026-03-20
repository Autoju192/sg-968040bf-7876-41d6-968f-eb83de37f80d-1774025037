-- Create portal_connections table for managing external portal integrations
CREATE TABLE IF NOT EXISTS portal_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('public_feed', 'email_alert', 'portal_login', 'link_watcher')),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
  config JSONB NOT NULL DEFAULT '{}',
  credentials_encrypted TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portal_connections_org ON portal_connections(organisation_id);
CREATE INDEX IF NOT EXISTS idx_portal_connections_type ON portal_connections(connection_type);
CREATE INDEX IF NOT EXISTS idx_portal_connections_status ON portal_connections(status);

-- Enable RLS
ALTER TABLE portal_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view connections from their organisation"
  ON portal_connections FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create connections for their organisation"
  ON portal_connections FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update connections from their organisation"
  ON portal_connections FOR UPDATE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete connections from their organisation"
  ON portal_connections FOR DELETE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );