-- RLS Policies for messages
CREATE POLICY "Users can view messages"
  ON messages FOR SELECT
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_ai = true);