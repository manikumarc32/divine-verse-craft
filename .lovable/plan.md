# Prodigi Print-on-Demand Integration (Sandbox)

Wire Prodigi into the order pipeline so paid Stripe orders are automatically submitted to Prodigi for printing & shipping.

## 1. Secrets
- Store the Prodigi API key as `PRODIGI_API_KEY` (sandbox value `9749728c-...`) via the secrets tool.
- Hardcode sandbox base URL `https://api.sandbox.prodigi.com/v4.0` in the edge function (env-flag-ready for later).

## 2. Database (migration)
- Add to `products`:
  - `prodigi_sku TEXT` — Prodigi's SKU (e.g. `GLOBAL-CFPM-16X20`)
  - `prodigi_print_area TEXT` default `'default'`
  - `prodigi_asset_url TEXT` — print-ready image URL (falls back to `hero_image_url`)
- Add to `orders`:
  - `prodigi_order_id TEXT`
  - `prodigi_status TEXT`
  - `prodigi_submitted_at TIMESTAMPTZ`
  - `prodigi_last_error TEXT`
  - `tracking_number TEXT`, `tracking_url TEXT`, `carrier TEXT`
- Extend `order_status` enum if needed (`in_production`, `shipped`, `delivered`).

## 3. Edge functions
- **`submit-prodigi-order`** (service role, internal): given an `order_id`, loads order + items, maps each item's product → `prodigi_sku` + asset URL, POSTs to `/Orders` with shipping address and `merchantReference = order.id`. Stores `prodigi_order_id` + status. Idempotent (skips if already submitted).
- **Wire into Stripe webhook** (`payments-webhook`): on `checkout.session.completed` → after marking order paid and sending order-confirmation email → invoke `submit-prodigi-order`. Failures are logged to `prodigi_last_error` but do not fail the webhook (admin can retry).
- **`retry-prodigi-order`** (admin-only): manual retry from Admin UI.

## 4. Admin UI (`src/pages/Admin.tsx`)
- Products table: add `Prodigi SKU` + `Print Asset URL` editable fields.
- Orders table: show `prodigi_status`, `prodigi_order_id`, tracking; add **Retry Prodigi** button when status is failed/missing.

## 5. Out of scope (for follow-up)
- Status sync from Prodigi back to orders (you skipped this question) — we'll leave a TODO in the webhook handler. Can be added via Prodigi status webhook or polling later, which would also trigger the shipping-notification email.
- Live environment toggle.

## Technical notes
- Prodigi `/Orders` payload shape: `{ shippingMethod, recipient: {name,address:{line1,...,countryCode}}, items: [{ merchantReference, sku, copies, sizing:'fillPrintArea', assets:[{printArea:'default', url}] }] }`.
- Map `orders.country` (already ISO-2) → `recipient.address.countryCode`.
- Currency stays GBP on our side; Prodigi pricing handled separately on their dashboard.
- Sandbox orders never actually print/ship.

After approval I will run the migration first, request the `PRODIGI_API_KEY` secret, then build the functions and admin wiring.