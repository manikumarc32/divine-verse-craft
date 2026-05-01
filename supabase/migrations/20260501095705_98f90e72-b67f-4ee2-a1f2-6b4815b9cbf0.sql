-- 1. Add hero image column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hero_image_url text;

-- 2. Create public storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images', 'product-images', true),
  ('reference-backgrounds', 'reference-backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies: public read, admin write
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins manage product-images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Public read reference-backgrounds"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reference-backgrounds');

CREATE POLICY "Admins manage reference-backgrounds"
  ON storage.objects FOR ALL
  USING (bucket_id = 'reference-backgrounds' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'reference-backgrounds' AND public.is_admin(auth.uid()));