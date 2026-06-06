-- Storage policies for public sponsorship file uploads
-- Run in Supabase SQL Editor after creating the bucket

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-attachments',
  'event-attachments',
  true,
  10485760, -- 10 MB
  ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Policy: anon users can upload to events/* path
CREATE POLICY "anon_insert_events"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'event-attachments'
  AND (storage.foldername(name))[1] = 'events'
);

-- Policy: anon users can read any file
CREATE POLICY "anon_select_events"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'event-attachments');
