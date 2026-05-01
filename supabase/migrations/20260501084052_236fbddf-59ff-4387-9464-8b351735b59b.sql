-- Replace the unbounded public INSERT policies on the two public-form tables
-- with bounded WITH CHECK conditions that mirror the client-side Zod validation.
-- This silences the 0024_permissive_rls_policy linter warnings and adds a real
-- defense-in-depth check at the database layer.

-- india_signups: public waitlist signup
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.india_signups;

CREATE POLICY "Public can join waitlist (validated)"
ON public.india_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

COMMENT ON POLICY "Public can join waitlist (validated)" ON public.india_signups IS
  'Intentional public INSERT for the India launch waitlist form (src/pages/India.tsx). Anonymous users may submit, but only with a syntactically valid email. Read access remains admin-only.';

-- contact_messages: public contact form
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;

CREATE POLICY "Public can submit contact (validated)"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL
  AND char_length(name) BETWEEN 1 AND 120
  AND email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND message IS NOT NULL
  AND char_length(message) BETWEEN 5 AND 4000
  AND (subject IS NULL OR char_length(subject) <= 200)
);

COMMENT ON POLICY "Public can submit contact (validated)" ON public.contact_messages IS
  'Intentional public INSERT for the Contact form (src/pages/Contact.tsx). Anonymous users may submit, but payloads must satisfy the same length and email-format checks as the client-side Zod schema. Read access remains admin-only.';