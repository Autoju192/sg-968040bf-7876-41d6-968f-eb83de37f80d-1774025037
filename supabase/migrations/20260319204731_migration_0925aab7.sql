-- Add missing columns to organisations
ALTER TABLE organisations 
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS geography_focus text[];

-- Add missing columns to tenders
ALTER TABLE tenders
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS link text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS dedup_key text;

-- Modify value column type
ALTER TABLE tenders ALTER COLUMN value TYPE numeric USING value::numeric;

-- Add missing columns to tender_files
ALTER TABLE tender_files
ADD COLUMN IF NOT EXISTS file_url text,
ADD COLUMN IF NOT EXISTS parsed_text text;