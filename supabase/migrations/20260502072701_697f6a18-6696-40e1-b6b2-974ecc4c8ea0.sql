
-- Drop old broad SELECT policies if they exist
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (policyname ILIKE '%product-images%'
        OR policyname ILIKE '%reference-backgrounds%'
        OR policyname ILIKE 'Public read product%'
        OR policyname ILIKE 'Public read reference%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Make buckets non-public so listing requires policy; direct URL access uses signed/render path
-- Keep them public so existing getPublicUrl links continue to work
UPDATE storage.buckets SET public = true WHERE id IN ('product-images', 'reference-backgrounds');

-- Admin-only management (insert/update/delete + list)
CREATE POLICY "product-images admin manage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "reference-backgrounds admin manage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'reference-backgrounds' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'reference-backgrounds' AND public.is_admin(auth.uid()));

-- NOTE: We intentionally do NOT add a broad SELECT policy on storage.objects for these buckets.
-- Public access to individual files continues to work through Supabase's public bucket render
-- endpoint (/storage/v1/object/public/...) which bypasses RLS for buckets marked public=true,
-- but the LIST endpoint requires a matching SELECT policy — so anonymous listing is blocked.
