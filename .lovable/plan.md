## Goal

Enable Lovable's built-in Stripe payments, deploy a Stripe webhook handler, and move the `order-confirmation` email trigger from `src/pages/Checkout.tsx` into the webhook so the email only sends after a real payment is confirmed by Stripe.

## Steps

1. **Run Stripe eligibility check** (`recommend_payment_provider`) on the project to confirm Stripe is the right fit (digital + physical art prints — Stripe is appropriate; Paddle excludes physical goods).

2. **Enable Stripe payments** via `enable_stripe_payments`. This provisions a test (sandbox) Stripe environment immediately so we can wire and verify the webhook before going live. Going live later requires the user to claim/verify the Stripe account.

3. **Decide tax handling** (one short question after enable): full compliance handling, tax calculation only, or none. This affects only checkout session config — it does not block the webhook work.

4. **Create checkout + webhook Edge Functions** following the post-enable Stripe knowledge that Lovable provides:
   - `create-checkout` — creates a Stripe Checkout Session from the cart, stamps `metadata.order_id` (and `client_reference_id`) with the DB order id so the webhook can correlate.
   - `stripe-webhook` — verifies the Stripe signature using `STRIPE_WEBHOOK_SECRET`, handles `checkout.session.completed` (and `payment_intent.succeeded` as a safety net), marks the order as paid in the DB, then invokes `send-transactional-email` with `templateName: "order-confirmation"` and `idempotencyKey: \`order-confirm-${order.id}\`` (same key used today, so no duplicate sends during the transition).
   - Both functions registered in `supabase/config.toml` with `verify_jwt = false` for the webhook (Stripe can't send a JWT) and signature verification done in code.

5. **Update `src/pages/Checkout.tsx`**:
   - Remove the direct `send-transactional-email` call (lines around 147–151).
   - Replace the current "create order then email" flow with: create order (status `pending_payment`) → call `create-checkout` → redirect to Stripe Checkout URL.
   - On return, `CheckoutSuccess.tsx` just shows a confirmation — the email is now sent by the webhook, not the page.

6. **Wire the webhook in Stripe**:
   - After deploy, give the user the webhook URL (`https://<project>.functions.supabase.co/stripe-webhook`) and instruct them to add it in the Stripe Dashboard for events `checkout.session.completed` and `payment_intent.succeeded`.
   - Add `STRIPE_WEBHOOK_SECRET` (and `STRIPE_SECRET_KEY` if not already present from the enable step) via the secrets tool.

7. **Verify**:
   - Trigger a test-mode checkout, confirm webhook log shows signature verified, order marked paid, and `send-transactional-email` invoked once.
   - Confirm `email_send_log` has a single `sent` row for that `order-confirm-${order.id}` key.

## Notes / Risks

- Idempotency key is preserved (`order-confirm-${order.id}`) so if the webhook fires twice (Stripe retries), the email is sent only once.
- Until the user adds the webhook secret in Stripe and pastes it into Lovable secrets, the webhook will reject events — order email won't send. We'll call this out clearly after deploy.
- Live payments require the user to claim/verify the Stripe account in the Lovable Payments dashboard; test mode works immediately.

Reply with **"Implement plan"** to proceed.
