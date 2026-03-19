-- Create the tender-files storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tender-files', 'tender-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for tender-files
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'tender-files' );

CREATE POLICY "Authenticated Users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'tender-files' );

CREATE POLICY "Authenticated Users can delete files"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'tender-files' );