-- Create user_tutorial_progress table to track user completion
CREATE TABLE IF NOT EXISTS user_tutorial_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id UUID NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  current_step INTEGER DEFAULT 0,
  bookmarked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

-- RLS Policies
ALTER TABLE user_tutorial_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_tutorial_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_tutorial_progress FOR ALL
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_user_tutorial_progress_user ON user_tutorial_progress(user_id);
CREATE INDEX idx_user_tutorial_progress_tutorial ON user_tutorial_progress(tutorial_id);
CREATE INDEX idx_user_tutorial_progress_completed ON user_tutorial_progress(completed);