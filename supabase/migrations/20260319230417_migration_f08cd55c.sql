-- Create Email Settings Table
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
  smtp_host TEXT,
  smtp_port TEXT,
  smtp_username TEXT,
  smtp_password TEXT,
  from_email TEXT,
  from_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organisation_id)
);

ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org email settings" 
ON email_settings FOR SELECT 
USING (
  organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can update their org email settings" 
ON email_settings FOR ALL 
USING (
  organisation_id IN (
    SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deadline_reminders BOOLEAN DEFAULT true,
  new_tender_alerts BOOLEAN DEFAULT true,
  status_updates BOOLEAN DEFAULT true,
  team_mentions BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'instant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification settings" 
ON notification_settings FOR ALL 
USING (
  user_id = auth.uid()
);