-- RLS Policies for tender_files
CREATE POLICY "Users can view tender files"
  ON tender_files FOR SELECT
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert tender files"
  ON tender_files FOR INSERT
  WITH CHECK (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can delete tender files"
  ON tender_files FOR DELETE
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));