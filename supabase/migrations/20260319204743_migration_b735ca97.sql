-- Create tender_questions table
CREATE TABLE IF NOT EXISTS tender_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id uuid NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  question_text text,
  section text,
  weight numeric,
  required boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE tender_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tender questions"
  ON tender_questions FOR SELECT
  USING (tender_id IN (
    SELECT id FROM tenders 
    WHERE organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert tender questions"
  ON tender_questions FOR INSERT
  WITH CHECK (tender_id IN (
    SELECT id FROM tenders 
    WHERE organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  ));

-- Create index
CREATE INDEX IF NOT EXISTS idx_tender_questions_tender_id ON tender_questions(tender_id);