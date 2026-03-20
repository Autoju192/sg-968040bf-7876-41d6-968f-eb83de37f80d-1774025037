-- Drop existing portal_connections table to recreate with enhanced schema
DROP TABLE IF EXISTS portal_connections CASCADE;

-- Create enhanced portal_connections table
CREATE TABLE portal_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  connection_name TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('PUBLIC_API', 'EMAIL', 'LINK_WATCHER', 'PORTAL_SESSION')),
  source_type TEXT, -- e.g., 'find_a_tender', 'contracts_finder', 'gmail', 'custom_portal'
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('connected', 'error', 'syncing', 'inactive', 'pending')),
  config JSONB, -- Stores connection-specific configuration (keywords, filters, etc.)
  credentials JSONB, -- Encrypted credentials (tokens, refresh tokens, etc.)
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'every_6_hours', 'daily', 'weekly', 'manual')),
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portal_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view org connections"
  ON portal_connections FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create org connections"
  ON portal_connections FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update org connections"
  ON portal_connections FOR UPDATE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete org connections"
  ON portal_connections FOR DELETE
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_portal_connections_org ON portal_connections(organisation_id);
CREATE INDEX idx_portal_connections_status ON portal_connections(status);
CREATE INDEX idx_portal_connections_next_sync ON portal_connections(next_sync_at);