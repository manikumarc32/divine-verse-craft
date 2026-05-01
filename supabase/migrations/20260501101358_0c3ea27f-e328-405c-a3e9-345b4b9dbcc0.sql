ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS full_text_te text,
  ADD COLUMN IF NOT EXISTS full_text_en text,
  ADD COLUMN IF NOT EXISTS layout_mode text NOT NULL DEFAULT 'verse';