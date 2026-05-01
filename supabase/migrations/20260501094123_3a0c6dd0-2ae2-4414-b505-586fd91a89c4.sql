
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('custom-uploads', 'custom-uploads', true, 8388608, ARRAY['image/jpeg','image/png','image/webp']),
  ('digital-bonuses', 'digital-bonuses', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read custom-uploads"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'custom-uploads');

CREATE POLICY "Anyone upload custom-uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'custom-uploads');

CREATE POLICY "Admins manage digital-bonuses"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'digital-bonuses' AND is_admin(auth.uid()))
WITH CHECK (bucket_id = 'digital-bonuses' AND is_admin(auth.uid()));

CREATE TABLE public.custom_quote_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payload JSONB NOT NULL,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_quote_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own drafts"
ON public.custom_quote_drafts FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER touch_custom_quote_drafts
BEFORE UPDATE ON public.custom_quote_drafts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.products (slug, title, category, base_price, badge, sanskrit, english_meaning, telugu_meaning, deeper_meaning, deeper_meaning_te, chapter_ref, description, sort_order, is_active)
VALUES (
  'hanuman-chalisa-complete',
  'Complete Hanuman Chalisa — All 40 Verses',
  'hand_written',
  39.99,
  'best_seller'::product_badge,
  'श्री हनुमान चालीसा — चालीस चौपाइयाँ',
  'The complete 40-verse devotional hymn to Lord Hanuman, hand-lettered in one masterpiece composition with His blessed image at the centre.',
  'శ్రీ హనుమంతుని 40 చౌపాయీలతో కూడిన పూర్ణ హనుమాన్ చాలీసా — ఒకే అందమైన చిత్రంలో.',
  'Composed by Tulsidas in the 16th century, the Hanuman Chalisa is recited by millions every dawn for courage, protection, and removal of obstacles. Owning the complete text in a single frame transforms any wall into a daily anchor of devotion and strength.',
  'తులసీదాస్ రచించిన హనుమాన్ చాలీసా — ధైర్యం, రక్షణ మరియు అడ్డంకుల తొలగింపు కోసం ప్రతి ఉదయం కోట్లాది మంది పఠిస్తారు. మొత్తం పాఠాన్ని ఒకే ఫ్రేంలో కలిగి ఉండటం మీ గోడను ప్రతిరోజూ భక్తి మరియు శక్తి యొక్క కేంద్రంగా మారుస్తుంది.',
  'Tulsidas — Hanuman Chalisa (40 verses)',
  'A premium hand-lettered piece featuring all 40 chaupais of the Hanuman Chalisa around a central illustration of Lord Hanuman. Printed on archival fine-art paper.',
  5,
  true
) ON CONFLICT (slug) DO NOTHING;
