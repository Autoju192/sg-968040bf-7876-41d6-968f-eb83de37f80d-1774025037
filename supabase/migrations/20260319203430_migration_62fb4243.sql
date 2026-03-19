-- RLS Policies for tender_scores
CREATE POLICY "Users can view tender scores"
  ON tender_scores FOR SELECT
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "System can insert tender scores"
  ON tender_scores FOR INSERT
  WITH CHECK (true);