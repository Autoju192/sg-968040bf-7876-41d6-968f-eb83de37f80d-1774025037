-- RLS Policies for tasks
CREATE POLICY "Users can view tasks"
  ON tasks FOR SELECT
  USING (tender_id IN (SELECT id FROM tenders WHERE organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks assigned to them"
  ON tasks FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can delete their tasks"
  ON tasks FOR DELETE
  USING (created_by = auth.uid());