-- Create organisations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_organisations_name ON organisations(name);

-- Enable RLS
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can create organisations" ON organisations;
DROP POLICY IF EXISTS "Users can view their own organisation" ON organisations;
DROP POLICY IF EXISTS "Users can update their own organisation" ON organisations;

-- Create RLS policies
CREATE POLICY "Authenticated users can create organisations"
ON organisations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own organisation"
ON organisations FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organisation_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update their own organisation"
ON organisations FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT organisation_id 
    FROM users 
    WHERE id = auth.uid()
  )
);