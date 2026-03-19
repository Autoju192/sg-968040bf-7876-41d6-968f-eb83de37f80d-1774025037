-- Update messages table to match new schema
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS message_text text,
ADD COLUMN IF NOT EXISTS parsed_action text,
ADD COLUMN IF NOT EXISTS deadline date;

-- Add missing columns to documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS file_url text;