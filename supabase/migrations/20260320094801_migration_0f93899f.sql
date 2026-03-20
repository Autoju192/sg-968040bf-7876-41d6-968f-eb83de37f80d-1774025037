-- Add external_id to tenders table for deduplication
ALTER TABLE tenders
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS source_type TEXT,
ADD COLUMN IF NOT EXISTS raw_data JSONB;

-- Create unique index for deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenders_external_id_org ON tenders(external_id, organisation_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenders_source_type ON tenders(source_type);