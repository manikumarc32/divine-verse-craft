# Disconnect Stripe & Prodigi — Shutdown Plan

You're shutting the project down. I'll remove every external integration I can from this project, and give you exact steps to revoke the keys on Stripe's and Prodigi's websites so they can't be reused.

Lovable Cloud (your backend) cannot be removed — it's part of the project. It will go away when you delete the project itself.

---

## Part A — What I will do inside Lovable

### 1. Disconnect Stripe
- Unlink the **Stripe (sandbox)** connector from this project
- Delete the secret `STRIPE_SANDBOX_API_KEY`
- Delete the secret `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
- Remove the Stripe checkout edge function and code paths (Checkout page will show a "payments disabled" message instead of crashing)

### 2. Disconnect Prodigi
- Delete the secret `PRODIGI_API_KEY`
- Delete edge functions `submit-prodigi-order` and `prodigi-test-connection`
- Remove the Prodigi admin tab (`ProdigiSetupTab`) and related catalogue code
- Remove Prodigi calls from order flow

### 3. Cleanup
- Remove the Stripe publishable key from `.env` references in code
- Add a banner on Checkout: "This store is no longer accepting orders"

---

## Part B — What YOU must do on the provider websites

I cannot log into these for you. Do this **after** I finish Part A:

### Stripe (https://dashboard.stripe.com)
1. Log in → top-left, switch to **Test mode** (since this project used sandbox)
2. **Developers → API keys** → next to your secret key click **⋯ → Roll key** (or delete restricted keys)
3. **Developers → Webhooks** → delete any endpoint pointing to `nodrmbkrlposqytxpevv.supabase.co`
4. If you also want to close the Stripe account: **Settings → Account → Close account** (only do this if you have no other projects using it)

### Prodigi (https://dashboard.prodigi.com)
1. Log in → **Settings → API** (or **Integrations → API keys**)
2. Find the key used for this project → **Revoke / Delete**
3. If you want to close the Prodigi account entirely, contact their support — there's no self-serve close button

---

## Part C — What stays / what's untouched

- **Lovable Cloud (Supabase)** — stays until you delete the project. When you delete the project from Lovable, the backend, database, storage and all secrets go with it.
- **Lovable AI key** (`LOVABLE_API_KEY`) — managed by Lovable, removed automatically with the project
- **Custom domain** `divinverseart.com` — you'll need to remove or repoint that at your domain registrar separately
- **Stripe publishable key** in `.env` — public key, harmless, but I'll clean it up anyway

---

## Order of operations (recommended)

1. Confirm you've already downloaded the backup zip (`divine-verse-craft-backup-2026-05-09.zip`)
2. I run Part A (disconnect everything inside Lovable)
3. You do Part B (revoke keys on Stripe + Prodigi sites)
4. When ready, delete the project from your Lovable dashboard (Project settings → Delete project)
5. Cancel your Lovable subscription if you no longer need the account
6. Repoint or release the custom domain at your registrar

Approve this plan and I'll start with Part A.