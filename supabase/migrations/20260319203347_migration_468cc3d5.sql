-- RLS Policies for organisations
CREATE POLICY "Users can view their organisation"
  ON organisations FOR SELECT
  USING (id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their organisation"
  ON organisations FOR UPDATE
  USING (id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin'));