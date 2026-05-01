
DROP POLICY IF EXISTS "Public read custom-uploads" ON storage.objects;

-- Allow reading individual files (object-level) but not listing the whole bucket.
-- Storage list operations check this same policy with name = '' for the root,
-- so requiring name length > 0 blocks listing while still permitting direct GETs.
CREATE POLICY "Public read custom-upload files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'custom-uploads' AND name IS NOT NULL AND length(name) > 0 AND position('/' in name) > 0);
