-- Verify users table exists and has correct foreign key
DO $$ 
BEGIN
  -- Add organisation_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'organisation_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index on organisation_id for faster joins
CREATE INDEX IF NOT EXISTS idx_users_organisation_id ON users(organisation_id);