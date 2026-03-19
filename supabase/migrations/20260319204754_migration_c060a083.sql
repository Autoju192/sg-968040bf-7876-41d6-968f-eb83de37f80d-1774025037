-- Create tender_pipeline table
CREATE TABLE IF NOT EXISTS tender_pipeline (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id uuid NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  status text,
  owner uuid REFERENCES users(id) ON DELETE SET NULL,
  priority text,
  next_action text,
  next_action_date date,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE tender_pipeline ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view pipeline"
  ON tender_pipeline FOR SELECT
  USING (tender_id IN (
    SELECT id FROM tenders 
    WHERE organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert pipeline"
  ON tender_pipeline FOR INSERT
  WITH CHECK (tender_id IN (
    SELECT id FROM tenders 
    WHERE organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can update pipeline"
  ON tender_pipeline FOR UPDATE
  USING (tender_id IN (
    SELECT id FROM tenders 
    WHERE organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  ));

-- Create index
CREATE INDEX IF NOT EXISTS idx_tender_pipeline_tender_id ON tender_pipeline(tender_id);