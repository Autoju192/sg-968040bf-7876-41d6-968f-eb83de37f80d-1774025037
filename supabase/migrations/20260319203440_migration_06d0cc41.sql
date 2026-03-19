-- RLS Policies for evidence_library
CREATE POLICY "Users can view evidence in their organisation"
  ON evidence_library FOR SELECT
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert evidence"
  ON evidence_library FOR INSERT
  WITH CHECK (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update evidence in their organisation"
  ON evidence_library FOR UPDATE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can delete evidence in their organisation"
  ON evidence_library FOR DELETE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));