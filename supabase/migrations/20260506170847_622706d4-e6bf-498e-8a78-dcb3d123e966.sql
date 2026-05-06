ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS prodigi_sku TEXT,
  ADD COLUMN IF NOT EXISTS prodigi_print_area TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS prodigi_asset_url TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS prodigi_order_id TEXT,
  ADD COLUMN IF NOT EXISTS prodigi_status TEXT,
  ADD COLUMN IF NOT EXISTS prodigi_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prodigi_last_error TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT,
  ADD COLUMN IF NOT EXISTS carrier TEXT;

DO $$ BEGIN
  ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'in_production';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'shipped';
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'delivered';
EXCEPTION WHEN others THEN NULL; END $$;