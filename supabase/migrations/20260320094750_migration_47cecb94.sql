-- Create connection_logs table for tracking sync operations
CREATE TABLE IF NOT EXISTS connection_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID NOT NULL REFERENCES portal_connections(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  run_status TEXT NOT NULL CHECK (run_status IN ('success', 'partial_success', 'failed', 'running')),
  items_fetched INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE connection_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view org connection logs"
  ON connection_logs FOR SELECT
  USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can create connection logs"
  ON connection_logs FOR INSERT
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_connection_logs_connection ON connection_logs(connection_id);
CREATE INDEX idx_connection_logs_org ON connection_logs(organisation_id);
CREATE INDEX idx_connection_logs_created_at ON connection_logs(created_at DESC);