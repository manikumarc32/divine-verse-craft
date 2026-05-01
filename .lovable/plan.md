# Extra Security Hardening

Building on what's already in place (RLS, validated public inserts, HIBP leaked-password check, role-based admin), here are the additional layers to add.

## 1. Stronger password policy
- Update Supabase Auth: minimum length **10**, require lowercase + uppercase + number + symbol.
- Update client-side Zod schemas in `src/pages/Register.tsx` and (if present) any password-reset form to match, with clear inline error messages.
- Show a small password-strength helper text under the password field on Register.

## 2. Anti-bot protection on public forms (no third-party key needed)
Add lightweight, zero-dependency protection to the **Contact** form (`src/pages/Contact.tsx`) and the **India waitlist** form (`src/components/IndiaBanner.tsx` / `src/pages/India.tsx`):
- **Honeypot field**: hidden input bots fill in; if filled, silently drop the submission.
- **Time-trap**: record form mount time; reject submissions completed in under ~1.5s (bots auto-fill instantly).
- **Per-browser cooldown**: localStorage timestamp to block repeat submissions within 30s.

This stops the vast majority of spam without CAPTCHA friction. (If you later want Cloudflare Turnstile / hCaptcha, that's a separate add-on requiring an account + key.)

## 3. Two-Factor Authentication (TOTP) for your admin account
- Add a **Security** section in `src/pages/Account.tsx` with:
  - "Enable two-factor authentication" button → `supabase.auth.mfa.enroll({ factorType: 'totp' })`, render the QR code, verify with `mfa.challenge` + `mfa.verify`.
  - List enrolled factors, allow unenroll.
- Add an MFA challenge step in `src/pages/Login.tsx`: after `signInWithPassword`, check `mfa.getAuthenticatorAssuranceLevel()`; if `aal1` but `aal2` required, prompt for the 6-digit code before proceeding.
- Works for any user, but especially recommended for admin accounts.

## 4. Session & route hardening (small fixes)
- In `src/hooks/useAuth.tsx`, listen for `SIGNED_OUT` / `TOKEN_REFRESHED` and clear admin state defensively.
- Ensure `/admin` and `/account` routes redirect unauthenticated users to `/login` (verify in `src/App.tsx` route guards; add if missing).
- Add `rel="noopener noreferrer"` to any external `target="_blank"` links (quick audit pass).

## 5. Security headers via `index.html`
Add `<meta>` tags for:
- `Content-Security-Policy` (script-src self + Supabase, img-src self + data: + https, connect-src Supabase),
- `Referrer-Policy: strict-origin-when-cross-origin`,
- `X-Content-Type-Options: nosniff`.

(These are best on the hosting layer too, but meta tags give baseline protection.)

## 6. Update security memory
Record the new posture: stronger password policy, MFA available, honeypot on public forms — so future scans don't re-flag these as gaps.

---

### Out of scope (call out, not building)
- **Backend rate limiting** — the platform doesn't have primitives for this yet; honeypot + cooldown above is the pragmatic substitute.
- **CAPTCHA (Turnstile/hCaptcha)** — needs an external account; can add later if spam persists.
- **WAF / DDoS** — handled at your DNS/CDN layer (Cloudflare on your custom domain).

### Files touched
- `supabase/config.toml` auth settings (via configure_auth tool, not direct edit)
- `src/pages/Register.tsx`, `src/pages/Login.tsx`, `src/pages/Account.tsx`
- `src/pages/Contact.tsx`, `src/components/IndiaBanner.tsx`, `src/pages/India.tsx`
- `src/hooks/useAuth.tsx`, `src/App.tsx`
- `index.html`
- security memory update

Approve and I'll implement all six in one pass.