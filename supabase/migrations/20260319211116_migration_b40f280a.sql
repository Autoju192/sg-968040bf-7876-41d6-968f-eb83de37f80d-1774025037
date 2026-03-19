-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  organisation_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  tender_id uuid REFERENCES tenders(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (
    user_id = auth.uid() OR 
    organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create index
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_organisation_id ON notifications(organisation_id);