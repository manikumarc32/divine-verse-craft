ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS deeper_meaning text,
  ADD COLUMN IF NOT EXISTS deeper_meaning_te text;