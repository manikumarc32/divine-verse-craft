
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'super_admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- Auto-create profile + customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PRODUCT CATEGORIES + PRODUCTS ============
CREATE TYPE public.product_category AS ENUM ('gita_quote', 'god_portrait', 'symbol', 'hand_written');
CREATE TYPE public.product_badge AS ENUM ('best_seller', 'new', 'premium', 'hand_written');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category public.product_category NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  badge public.product_badge,
  chapter_ref TEXT,
  sanskrit TEXT,
  english_meaning TEXT,
  telugu_meaning TEXT,
  description TEXT,
  stock_limit INT,
  rating NUMERIC(3,2) DEFAULT 4.8,
  review_count INT DEFAULT 0,
  sort_order INT DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ OPTIONS ============
CREATE TABLE public.sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INT DEFAULT 100
);
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sizes" ON public.sizes FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage sizes" ON public.sizes FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INT DEFAULT 100
);
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read materials" ON public.materials FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage materials" ON public.materials FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INT DEFAULT 100
);
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read frames" ON public.frames FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage frames" ON public.frames FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ SHIPPING ZONES ============
CREATE TABLE public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  flag TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  free_threshold NUMERIC(10,2) NOT NULL,
  sort_order INT DEFAULT 100
);
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read shipping" ON public.shipping_zones FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage shipping" ON public.shipping_zones FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ WISHLISTS ============
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ ORDERS ============
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'fulfilled', 'shipped', 'delivered', 'cancelled', 'refunded');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'GB',
  shipping_zone TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status public.order_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins read all orders" ON public.orders FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update all orders" ON public.orders FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  custom_data JSONB,
  size_code TEXT,
  material_code TEXT,
  frame_code TEXT,
  language_code TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL))
);
CREATE POLICY "Admins read all order items" ON public.order_items FOR SELECT USING (public.is_admin(auth.uid()));

-- ============ BLOG POSTS ============
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT,
  category TEXT NOT NULL,
  read_time_min INT NOT NULL DEFAULT 5,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published blog" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ updated_at triggers ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SEED OPTIONS ============
INSERT INTO public.sizes (code, label, price_modifier, sort_order) VALUES
  ('A4', 'A4', 0, 1),
  ('A3', 'A3', 8, 2),
  ('A2', 'A2', 18, 3);

INSERT INTO public.materials (code, label, price_modifier, sort_order) VALUES
  ('poster', 'Poster Paper', 0, 1),
  ('eco', 'Eco Paper', 3, 2),
  ('cloth', 'Cloth Tapestry', 12, 3),
  ('canvas', 'Canvas', 15, 4);

INSERT INTO public.frames (code, label, price_modifier, sort_order) VALUES
  ('none', 'No Frame', 0, 1),
  ('black', 'Black Frame', 12, 2),
  ('white', 'White Frame', 12, 3),
  ('wood', 'Wood Frame', 15, 4),
  ('gold', 'Gold Frame', 20, 5);

INSERT INTO public.shipping_zones (code, label, flag, price, free_threshold, sort_order) VALUES
  ('UK', 'United Kingdom', '🇬🇧', 3.99, 50, 1),
  ('EU', 'Europe', '🇪🇺', 7.99, 75, 2),
  ('WORLD', 'Rest of World', '🌍', 12.99, 100, 3);

-- ============ SEED PRODUCTS ============
INSERT INTO public.products (slug, title, category, base_price, badge, chapter_ref, sanskrit, english_meaning, telugu_meaning, description, stock_limit, sort_order) VALUES
  ('karma-yoga', 'Karma Yoga', 'gita_quote', 6.99, 'best_seller', 'Ch 2.47', 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', 'You have the right to perform your duties, but never to the fruits of action.', 'మీకు మీ కర్తవ్యాన్ని నిర్వహించే హక్కు ఉంది, కాని ఫలాలపై హక్కు లేదు.', 'The timeless principle of selfless action — work without attachment to results.', NULL, 1),
  ('inner-peace', 'Inner Peace', 'gita_quote', 6.99, 'new', 'Ch 6.15', 'शान्तिं निर्वाणपरमां मत्संस्थामधिगच्छति', 'Attains peace, the supreme nirvana that abides in Me.', 'నాలో నివసించే పరమ శాంతిని పొందుతాడు.', 'A meditation on stillness and the supreme peace found through devotion.', NULL, 2),
  ('soul-eternal', 'Soul Eternal', 'gita_quote', 6.99, NULL, 'Ch 2.23', 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः', 'Weapons cannot cut the soul, fire cannot burn it.', 'ఆయుధాలు ఆత్మను ఛేదించలేవు, అగ్ని దహించలేదు.', 'The eternal nature of the soul — beyond destruction or harm.', NULL, 3),
  ('dharma-rising', 'Dharma Rising', 'gita_quote', 6.99, NULL, 'Ch 4.7', 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', 'Whenever there is decay of righteousness, O Bharata, I manifest Myself.', 'ధర్మం క్షీణించినప్పుడల్లా, ఓ భారత, నేను అవతరిస్తాను.', 'Krishna''s promise to rise whenever righteousness declines.', NULL, 4),
  ('self-mastery', 'Self Mastery', 'gita_quote', 6.99, NULL, 'Ch 6.5', 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्', 'Lift yourself by your own self; do not let yourself sink.', 'మిమ్మల్ని మీరు ఉద్ధరించుకోండి; మిమ్మల్ని మీరు పడిపోనివ్వకండి.', 'You are your own greatest friend and your own greatest enemy.', NULL, 5),
  ('equal-vision', 'Equal Vision', 'gita_quote', 6.99, NULL, 'Ch 6.29', 'सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि', 'Sees the Self in all beings and all beings in the Self.', 'అన్ని జీవులలో ఆత్మను, ఆత్మలో అన్ని జీవులను చూస్తాడు.', 'The yogi sees the divine equally in all beings.', NULL, 6),
  ('devoted-heart', 'Devoted Heart', 'gita_quote', 6.99, 'premium', 'Ch 18.65', 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु', 'Fix your mind on Me, be My devotee, worship Me, bow to Me.', 'నీ మనస్సును నాపై నిలుపు, నా భక్తుడవై, నన్ను పూజించు, నాకు నమస్కరించు.', 'Krishna''s ultimate teaching of devotion and surrender.', NULL, 7),
  ('lord-krishna', 'Lord Krishna', 'god_portrait', 8.99, 'best_seller', NULL, NULL, 'The eighth avatar of Vishnu, divine flute player and teacher of the Gita.', 'విష్ణువు యొక్క ఎనిమిదవ అవతారం.', 'Lord Krishna — divine cowherd, lover, warrior, and teacher.', NULL, 10),
  ('lord-shiva', 'Lord Shiva', 'god_portrait', 8.99, NULL, NULL, NULL, 'The transformer — destroyer of illusion and meditative ascetic.', 'మహాదేవుడు — లయకారుడు మరియు తపస్వి.', 'Lord Shiva — the auspicious one, lord of meditation.', NULL, 11),
  ('lord-ganesh', 'Lord Ganesh', 'god_portrait', 8.99, 'new', NULL, NULL, 'Remover of obstacles and patron of new beginnings.', 'విఘ్నహర్త మరియు కొత్త ప్రారంభాలకు దేవుడు.', 'Lord Ganesh — bringer of wisdom and remover of obstacles.', NULL, 12),
  ('goddess-lakshmi', 'Goddess Lakshmi', 'god_portrait', 8.99, NULL, NULL, NULL, 'Goddess of wealth, prosperity, and fortune.', 'సంపద మరియు సమృద్ధికి దేవత.', 'Goddess Lakshmi — bestower of abundance and grace.', NULL, 13),
  ('radha-krishna', 'Radha Krishna', 'god_portrait', 9.99, 'premium', NULL, NULL, 'The eternal divine love of Radha and Krishna.', 'రాధ మరియు కృష్ణుల శాశ్వత ప్రేమ.', 'Radha Krishna — symbol of pure, devotional love.', NULL, 14),
  ('om-symbol', 'Om Symbol', 'symbol', 5.99, 'best_seller', NULL, 'ॐ', 'The primordial sound of the universe — Om.', 'విశ్వం యొక్క ఆది ధ్వని — ఓం.', 'The sacred Om — sound of creation, preservation, and dissolution.', NULL, 20),
  ('lotus-mandala', 'Lotus Mandala', 'symbol', 5.99, NULL, NULL, NULL, 'The lotus mandala — symbol of spiritual awakening.', 'తామర మండలం — ఆధ్యాత్మిక మేల్కొలుపు చిహ్నం.', 'A meditative mandala built around the sacred lotus.', NULL, 21),
  ('sri-yantra', 'Sri Yantra', 'symbol', 5.99, 'premium', NULL, NULL, 'The most sacred geometry — union of the divine masculine and feminine.', 'శ్రీ యంత్రం — అత్యంత పవిత్ర జ్యామితి.', 'Sri Yantra — the supreme sacred geometry of the universe.', NULL, 22),
  ('gayatri-mantra', 'Gayatri Mantra (Hand-Written)', 'hand_written', 29.99, 'hand_written', NULL, 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं', 'May we meditate on the divine light of the Sun, may it illuminate our intellect.', 'మేము సూర్యుని దివ్య కాంతిని ధ్యానిద్దాం, అది మా బుద్ధిని ప్రకాశింపజేయాలి.', 'Hand-written by master calligraphers on archival paper. Limited edition.', 50, 30),
  ('maha-mrityunjaya', 'Maha Mrityunjaya (Hand-Written)', 'hand_written', 35.00, 'hand_written', NULL, 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्', 'We worship the three-eyed Lord, fragrant and nourishing.', 'మేము ముక్కంటి శివుని పూజిస్తాము.', 'The great death-conquering mantra. Hand-written, limited to 30 pieces.', 30, 31),
  ('complete-gita-ch2', 'Complete Gita Ch 2 (Hand-Written)', 'hand_written', 45.00, 'hand_written', 'Ch 2', 'सांख्ययोग — Sankhya Yoga', 'The complete second chapter of the Bhagavad Gita — the foundation of Krishna''s teaching.', 'భగవద్గీత యొక్క పూర్తి రెండవ అధ్యాయం.', 'Master calligrapher hand-writes the entire 72 verses of Chapter 2. Heirloom quality.', 15, 32);

-- ============ SEED BLOG ============
INSERT INTO public.blog_posts (slug, title, excerpt, body, category, read_time_min) VALUES
  ('understanding-karma-yoga', 'Understanding Karma Yoga', 'A practical guide to selfless action in everyday life, drawn from Chapter 2 of the Gita.', 'Karma Yoga is the path of action without attachment...', 'Philosophy', 6),
  ('art-of-sanskrit-calligraphy', 'The Art of Sanskrit Calligraphy', 'How master calligraphers preserve a 3,000-year-old tradition with brush and ink.', 'Sanskrit calligraphy is more than writing — it is meditation in motion...', 'Craft', 4),
  ('symbolism-of-the-lotus', 'Symbolism of the Lotus', 'Why the lotus appears across every Hindu deity, and what it teaches about awakening.', 'The lotus rises pure from muddy waters...', 'Symbolism', 5),
  ('gayatri-mantra-meaning', 'The Gayatri Mantra Explained', 'Word by word translation and meditation on the most powerful Vedic mantra.', 'Om bhur bhuvah svah — three worlds invoked in a single breath...', 'Mantras', 8),
  ('placing-sacred-art-at-home', 'Placing Sacred Art at Home', 'Vastu-inspired guidance for displaying spiritual wall art in your home.', 'Direction matters. East-facing meditation walls...', 'Home', 5),
  ('story-of-bhagavad-gita', 'The Story of the Bhagavad Gita', 'A short, accessible introduction to the battlefield dialogue that changed the world.', 'On the eve of war, a warrior lays down his bow...', 'History', 7);
