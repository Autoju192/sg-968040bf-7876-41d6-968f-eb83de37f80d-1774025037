-- RLS Policies for users
CREATE POLICY "Users can view users in their organisation"
  ON users FOR SELECT
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert themselves"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can update users in their organisation"
  ON users FOR UPDATE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete users in their organisation"
  ON users FOR DELETE
  USING (organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin'));