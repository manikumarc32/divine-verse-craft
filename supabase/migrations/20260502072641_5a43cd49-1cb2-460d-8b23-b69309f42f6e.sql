
-- 1. Storage: lock down custom-uploads to per-user folders
UPDATE storage.buckets SET public = false WHERE id = 'custom-uploads';

-- Drop any existing permissive policies on custom-uploads (idempotent)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname LIKE 'custom-uploads%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "custom-uploads owner read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'custom-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "custom-uploads owner insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'custom-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "custom-uploads owner update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'custom-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "custom-uploads owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'custom-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "custom-uploads admin all"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'custom-uploads' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'custom-uploads' AND public.is_admin(auth.uid()));

-- 2. Reviews: require authenticated user_id
DELETE FROM public.reviews WHERE user_id IS NULL;
ALTER TABLE public.reviews ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Users insert own reviews" ON public.reviews;
CREATE POLICY "Users insert own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
