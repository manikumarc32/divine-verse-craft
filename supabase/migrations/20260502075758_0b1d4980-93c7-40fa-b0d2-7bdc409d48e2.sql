-- Phase 1: product tier + launch-ready flag
CREATE TYPE public.product_tier AS ENUM ('standard', 'premium', 'custom');

ALTER TABLE public.products
  ADD COLUMN tier public.product_tier NOT NULL DEFAULT 'standard',
  ADD COLUMN is_launch_ready boolean NOT NULL DEFAULT false,
  ADD COLUMN risk_notes text;

CREATE INDEX idx_products_launch_ready ON public.products(is_launch_ready) WHERE is_launch_ready = true;
CREATE INDEX idx_products_tier ON public.products(tier);