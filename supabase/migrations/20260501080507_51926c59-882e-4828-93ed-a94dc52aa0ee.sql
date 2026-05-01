
-- 1. products: sold_count
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sold_count integer NOT NULL DEFAULT 0;

-- 2. bundles
CREATE TABLE public.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  bundle_price numeric NOT NULL,
  badge text,
  sort_order integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bundles" ON public.bundles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage bundles" ON public.bundles FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER bundles_touch BEFORE UPDATE ON public.bundles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. bundle_items
CREATE TABLE public.bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  sort_order integer DEFAULT 100
);
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bundle_items" ON public.bundle_items FOR SELECT USING (true);
CREATE POLICY "Admins manage bundle_items" ON public.bundle_items FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE INDEX idx_bundle_items_bundle ON public.bundle_items(bundle_id);

-- 4. india_signups
CREATE TABLE public.india_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.india_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.india_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read waitlist" ON public.india_signups FOR SELECT USING (public.is_admin(auth.uid()));

-- 5. contact_messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contact" ON public.contact_messages FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 6. Seed bundles
INSERT INTO public.bundles (slug, title, description, bundle_price, badge, sort_order) VALUES
  ('karma-collection', 'Karma Collection', '3 Bhagavad Gita quote posters on the path of selfless action.', 18.99, 'Save £2', 10),
  ('divine-trinity', 'Divine Trinity', 'Krishna, Shiva, and Ganesh portraits — devotion in three forms.', 23.99, 'Save £3', 20),
  ('meditation-set', 'Meditation Set', 'Om, Lotus, and Mandala symbols for a calm sacred space.', 14.99, 'Save £3', 30),
  ('complete-gita', 'Complete Gita', 'All 7 Bhagavad Gita quote posters — a full library of wisdom.', 39.99, 'Save £9', 40);

-- 7. Seed bundle_items by joining slugs (uses LIMIT to handle missing slugs gracefully)
INSERT INTO public.bundle_items (bundle_id, product_id, quantity, sort_order)
SELECT b.id, p.id, 1, 10
FROM public.bundles b, public.products p
WHERE b.slug = 'karma-collection' AND p.category = 'gita_quote'
ORDER BY p.sort_order
LIMIT 3;

INSERT INTO public.bundle_items (bundle_id, product_id, quantity, sort_order)
SELECT b.id, p.id, 1, 10
FROM public.bundles b
JOIN public.products p ON p.slug IN ('krishna-portrait','shiva-portrait','ganesh-portrait')
WHERE b.slug = 'divine-trinity';

INSERT INTO public.bundle_items (bundle_id, product_id, quantity, sort_order)
SELECT b.id, p.id, 1, 10
FROM public.bundles b
JOIN public.products p ON p.slug IN ('om-symbol','lotus-symbol','mandala-symbol')
WHERE b.slug = 'meditation-set';

INSERT INTO public.bundle_items (bundle_id, product_id, quantity, sort_order)
SELECT b.id, p.id, 1, 10
FROM public.bundles b, public.products p
WHERE b.slug = 'complete-gita' AND p.category = 'gita_quote'
ORDER BY p.sort_order
LIMIT 7;
