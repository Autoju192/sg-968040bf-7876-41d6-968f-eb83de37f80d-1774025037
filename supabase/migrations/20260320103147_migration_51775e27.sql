-- Create tutorials table for storing help content
CREATE TABLE IF NOT EXISTS tutorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb,
  troubleshooting JSONB DEFAULT '[]'::jsonb,
  tips JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  screenshots JSONB DEFAULT '[]'::jsonb,
  search_terms TEXT[],
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published tutorials"
  ON tutorials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage tutorials"
  ON tutorials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_tutorials_feature_key ON tutorials(feature_key);
CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_tutorials_published ON tutorials(is_published);
CREATE INDEX idx_tutorials_search_terms ON tutorials USING gin(search_terms);

-- Full-text search
CREATE INDEX idx_tutorials_search ON tutorials USING gin(to_tsvector('english', title || ' ' || summary || ' ' || COALESCE(description, '')));