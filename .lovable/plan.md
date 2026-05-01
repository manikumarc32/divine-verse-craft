# Document & harden public INSERT policies (waitlist + contact)

## Background
Two Supabase RLS policies allow anonymous inserts and trip the `0024_permissive_rls_policy` linter warning:

- `contact_messages` → "Anyone can submit contact" — `WITH CHECK (true)`
- `india_signups` → "Anyone can join waitlist" — `WITH CHECK (true)`

Both are intentional (public forms used by `src/pages/Contact.tsx` and `src/pages/India.tsx`), but `WITH CHECK (true)` is unbounded — anyone can flood the tables with arbitrary payloads, and the warnings will keep appearing in every scan.

The goal: keep anonymous submissions working, replace the bare `true` checks with light server-side validation, document the intent so future scans/agents don't re-flag them, and clear the warnings from production logs.

## Changes

### 1. Database migration — tighten the two public INSERT policies
Replace `WITH CHECK (true)` with bounded conditions that mirror the client-side Zod validation. This satisfies the linter and adds a real defense-in-depth check (the client can be bypassed; RLS cannot).

`india_signups` — "Anyone can join waitlist":
```sql
DROP POLICY "Anyone can join waitlist" ON public.india_signups;

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
```

`contact_messages` — "Anyone can submit contact":
```sql
DROP POLICY "Anyone can submit contact" ON public.contact_messages;

CREATE POLICY "Public can submit contact (validated)"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  name    IS NOT NULL AND char_length(name)    BETWEEN 1 AND 120
  AND email IS NOT NULL AND char_length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND message IS NOT NULL AND char_length(message) BETWEEN 5 AND 4000
  AND (subject IS NULL OR char_length(subject) <= 200)
);

COMMENT ON POLICY "Public can submit contact (validated)" ON public.contact_messages IS
  'Intentional public INSERT for the Contact form (src/pages/Contact.tsx). Anonymous users may submit, but payloads must satisfy the same length/email-format checks as the client-side Zod schema. Read access remains admin-only.';
```

These mirror the existing Zod schemas in `Contact.tsx` and `India.tsx`, so legitimate form submissions keep working unchanged.

### 2. Update the security memory
Use `security--update_memory` to record that:
- These two tables intentionally accept anonymous INSERTs from public forms.
- The policies now include a validating `WITH CHECK` (no longer `true`).
- Read access on both is admin-only; nothing sensitive is exposed.
- Future scanners should not re-flag these as permissive.

### 3. Mark the two linter findings as fixed
After the migration runs, call `security--manage_security_finding` with `mark_as_fixed` for the two `0024_permissive_rls_policy` findings, explaining that `WITH CHECK (true)` was replaced with bounded validation.

## What does NOT change
- No client code changes — `src/pages/Contact.tsx` and `src/pages/India.tsx` already send payloads that satisfy the new check.
- No change to admin SELECT / management policies on either table.
- No change to other public policies (e.g. `bundles`, `products` public SELECT) — those are read-only and intentional.

## Outcome
- The two `0024_permissive_rls_policy` warnings stop appearing in scans and production linter output.
- `contact_messages` and `india_signups` keep accepting anonymous form submissions.
- Junk inserts with empty/oversized fields or malformed emails are rejected at the database layer.
- Intent is documented in both Postgres policy comments and the project security memory.