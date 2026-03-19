-- RLS Policies for tenders
CREATE POLICY "Users can view tenders in their organisation"
  ON tenders FOR SELECT
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert tenders"
  ON tenders FOR INSERT
  WITH CHECK (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update tenders in their organisation"
  ON tenders FOR UPDATE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can delete tenders in their organisation"
  ON tenders FOR DELETE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));