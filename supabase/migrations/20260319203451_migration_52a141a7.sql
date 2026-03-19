-- RLS Policies for documents
CREATE POLICY "Users can view documents"
  ON documents FOR SELECT
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert documents"
  ON documents FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their documents"
  ON documents FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their documents"
  ON documents FOR DELETE
  USING (created_by = auth.uid());