
# Phase 1 Launch — Payments, Email, Phone, Badge

Four parallel actions to get DivineVerse Art ready for real customers.

---

## 1. Enable Stripe Payments (Step C)

Launch the Lovable-hosted Stripe setup form. You'll fill in:
- Business name (e.g. "DivineVerse Art")
- Email (defaults to your Lovable account email — editable, can use `you+divineverse@…`)

**What happens automatically:**
- Test environment created instantly — you can run mock checkouts with test cards (no real money)
- Live payments unlock after you claim/verify the Stripe account
- No API keys needed from you

**Tax handling:** going with **Option 3 (no tax automation)** for Phase 1, as previously agreed. Easy to upgrade later.

**After enabling**, I will:
1. Create Stripe products for the 6 launch-ready items (mapped to their `base_price` in GBP)
2. Replace the mock "paid" insert in `src/pages/Checkout.tsx` with a real `create-checkout` edge function that opens a Stripe Checkout session
3. Add a `stripe-webhook` edge function to mark orders `paid` and decrement stock only after Stripe confirms payment
4. Update `CheckoutSuccess.tsx` to verify the session via the webhook/order status

---

## 2. Transactional Email — Recommendation

You need emails for: order confirmation, shipping update, password reset, contact form replies.

**Recommended: Lovable Emails (built-in, via Resend)**
- No third-party signup — uses Lovable's email infrastructure
- Custom-branded auth emails (verification, password reset, magic link)
- Transactional emails (order confirmation, shipping) sent from your domain
- Requires verifying a sending domain you own (e.g. `divinverseart.com` — you already own it ✅)

**Setup steps after approval:**
1. Verify `divinverseart.com` as the sending domain (DNS records — I'll show you exactly what to add at your registrar)
2. Scaffold auth email templates (branded saffron/gold to match the site)
3. Scaffold a `send-order-confirmation` transactional function, called from the Stripe webhook after a successful payment
4. Optional: a `send-contact-reply` for the contact form

**Alternative considered:** raw Resend/SendGrid integration — rejected, more setup and no built-in template UI.

---

## 3. Customer Phone Call — Recommendation

You don't need a real phone line for Phase 1. Recommendation:

**Primary: WhatsApp Business "Click to Chat" link** (free, instant)
- Add a floating WhatsApp button next to the existing `ChatWidget`
- Link format: `https://wa.me/44XXXXXXXXXX?text=Hi%20DivineVerse...`
- Works on mobile (opens WhatsApp app) and desktop (opens WhatsApp Web)
- Show your number on Contact page + footer

**Secondary (if you want a real phone callback): Twilio**
- Lovable has a built-in Twilio connector (no scraping API keys)
- Adds a "Request a callback" form on Contact page → triggers an SMS to your phone with the customer's number + message
- Costs ~£0.04 per SMS, requires a Twilio number (~£1/month)
- I'd build this only if you confirm — Phase 1 likely doesn't need it

**My pick for Phase 1:** WhatsApp button only. Add Twilio later if you get callback requests.

**You need to give me:** the WhatsApp number to use (e.g. `+44 7XXX XXXXXX`).

---

## 4. Hide "Edit with Lovable" Badge

Toggle the badge off on the published site (`divinverseart.com` and `divine-verse-craft.lovable.app`).

Requires Pro plan or higher (you should already be on it since payments needs Pro too — I'll verify when toggling).

---

## Execution Order Once Approved

1. **Hide badge** (instant, 1 tool call)
2. **Enable Stripe** (you fill the form → I wire up products + checkout + webhook)
3. **Set up Lovable Emails** (you add DNS records → I scaffold templates + order-confirmation function)
4. **Add WhatsApp button** (need your number; I'll add it to Footer + ChatWidget area)

## Questions before I start

- WhatsApp number to use? (or skip and just add Twilio callback later?)
- For Stripe products: should I price them exactly at the `base_price` from the DB, or do you want a different launch price?
- Email "from" address — `orders@divinverseart.com` and `hello@divinverseart.com` OK?

Reply **"go"** to start with steps 1 + 2 (badge + Stripe enable form) immediately, and answer the 3 questions in the same message so I can keep momentum.
