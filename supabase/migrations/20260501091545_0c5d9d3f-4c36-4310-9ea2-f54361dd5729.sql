CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'footer',
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can subscribe (validated)"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source IS NOT NULL
  AND char_length(source) <= 50
);

CREATE POLICY "Admins read subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

COMMENT ON POLICY "Public can subscribe (validated)" ON public.newsletter_subscribers
IS 'Public newsletter signup from the footer form. Validation mirrors client-side Zod schema. Read access is admin-only.';

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
ON public.newsletter_subscribers (created_at DESC);