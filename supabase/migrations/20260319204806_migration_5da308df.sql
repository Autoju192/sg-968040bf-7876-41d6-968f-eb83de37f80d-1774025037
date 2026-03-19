-- Create historical_bids table
CREATE TABLE IF NOT EXISTS historical_bids (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tender_id uuid REFERENCES tenders(id) ON DELETE SET NULL,
  outcome text,
  content text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE historical_bids ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view historical bids in their organisation"
  ON historical_bids FOR SELECT
  USING (organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert historical bids"
  ON historical_bids FOR INSERT
  WITH CHECK (organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update historical bids in their organisation"
  ON historical_bids FOR UPDATE
  USING (organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete historical bids in their organisation"
  ON historical_bids FOR DELETE
  USING (organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  ));

-- Create index
CREATE INDEX IF NOT EXISTS idx_historical_bids_organisation_id ON historical_bids(organisation_id);