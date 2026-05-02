
# DivineVerse Art — Branded Email Templates + Triggers

Set up 3 transactional emails + 1 auth (password reset) email + wire automatic sending. Domain `notify.divinverseart.com` is already configured (DNS verifying).

---

## Important clarification on your request

- **Order confirmation, shipping notification, welcome** → these are **transactional emails** (correct, going via `send-transactional-email`)
- **Password reset** → this is an **auth email**, *not* transactional. It uses Supabase's auth-email-hook system, which is a **separate** scaffold tool. I'll set both up in this same run.
- **Reply-To header**: Lovable's transactional queue does not currently support custom Reply-To headers. Workaround: prominent **"Reply to: orders@divinverseart.com"** line in the footer of each email, and the From address will be `DivineVerse Art <noreply@notify.divinverseart.com>`. Customer replies to the noreply will bounce — but the in-email instruction directs them to your real address (which the ImprovMX/Cloudflare forwarding will route to Gmail).
- **"Sent from `orders@notify.divinverseart.com`"**: not changeable per-template — all transactional sends use the single `noreply@notify.divinverseart.com` From address baked into the send function. The "Reply to:" line in the footer makes this unambiguous to customers.
- **Stripe webhook**: doesn't exist yet (Stripe enable was interrupted). For now I'll trigger the order-confirmation email from `Checkout.tsx` right after the order row is inserted (current mock-paid flow). When we wire the real Stripe webhook later, we move the trigger there with `idempotencyKey = order.id` so retries don't double-send.

---

## What I'll build

### 1. Shared brand kit — `supabase/functions/_shared/transactional-email-templates/_brand.tsx`
Reusable React Email pieces:
- `<BrandHeader>` — cream background, lotus SVG (inlined as data URI so it works in Gmail/Outlook), "DivineVerse Art" wordmark in saffron Georgia, ॐ symbol in gold, optional tagline
- `<GoldDivider>` — gold gradient horizontal rule
- `<BrandFooter replyTo="orders@divinverseart.com">` — "Reply directly… or write to orders@divinverseart.com" + tagline + site link
- `styles` object — saffron `#D4760A` buttons, gold `#B8942D` accents, cream `#FFFAF3` content area, white outer Body (per email-system rule), Georgia serif headings, ink/mid text colors

### 2. Three transactional templates

**`order-confirmation.tsx`** — Subject: *"Your DivineVerse order #{shortId} is confirmed 🪷"*
- Brand header + heading "Namaste {firstName}, your order is confirmed"
- Order number + date + payment status (cards, gold-bordered)
- Items list (title, size/material/frame, qty, line total) using compact rows
- Shipping address block
- Subtotal / shipping / total
- Estimated delivery line (zone-aware: UK 3–5 days, EU 5–8, ROW 7–14)
- "View order" button → `https://divinverseart.com/account/orders` (saffron)
- Footer with reply-to

**`shipping-notification.tsx`** — Subject: *"Your DivineVerse order #{shortId} is on its way ✈️"*
- Brand header + "Your blessing is on its way"
- Order number, ship date, carrier (optional), tracking number (optional, with link template)
- Shipping address recap
- Estimated arrival
- "Track package" button if tracking provided
- Reassurance copy + reply-to footer

**`welcome.tsx`** — Subject: *"Namaste! Welcome to DivineVerse Art 🙏"*
- Brand header with tagline "SACRED ART · CRAFTED WITH DEVOTION"
- Greeting "Namaste {firstName}, welcome to our family"
- Short paragraph about the brand mission (Sanskrit verses, sacred art, crafted in UK)
- 3 quick-action cards: "Browse the Shop" / "Build a Custom Piece" / "Read About the Gita"
- 10% off welcome chip is **deliberately omitted** (would make this a marketing email, which Lovable's transactional system blocks)
- Reply-to footer

### 3. Registry — `supabase/functions/_shared/transactional-email-templates/registry.ts`
Standard `TEMPLATES` map with the 3 entries + each template's `previewData` for the dashboard preview.

### 4. Config — `supabase/config.toml`
Append the 4 transactional function blocks (`send-transactional-email`, `preview-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`) — required by the scaffold tool.

### 5. Unsubscribe page — `src/pages/Unsubscribe.tsx` + route in `src/App.tsx`
- Reads `?token=` from URL
- GET to `handle-email-unsubscribe` to validate (uses raw fetch + apikey because supabase.functions.invoke is POST-only)
- Branded states: "Confirm unsubscribe" button (saffron) → POST → success / already-unsubscribed / invalid-token
- Wrapped in `PageLayout` for consistent navbar/footer

### 6. Wire the triggers

**Order confirmation — `src/pages/Checkout.tsx`**
After `order_items` insert succeeds (and before `cart.clear()`), call:
```ts
await supabase.functions.invoke('send-transactional-email', {
  body: {
    templateName: 'order-confirmation',
    recipientEmail: form.email,
    idempotencyKey: `order-confirm-${order.id}`,
    templateData: {
      firstName, orderShortId, items, address, subtotal, shipping, total, zone, estimatedDelivery
    }
  }
})
```
Wrapped in try/catch — email failure must NOT block the user landing on the success page.

**Welcome email — `src/pages/Register.tsx`**
After successful `supabase.auth.signUp`, fire the `welcome` template (idempotencyKey = `welcome-${user.id}`). Same try/catch pattern.

**Shipping notification — `src/pages/Admin.tsx`**
In the orders-management section, when admin updates `orders.status` to `'shipped'`, invoke `shipping-notification` with `idempotencyKey = shipped-${order.id}`. (If Admin.tsx doesn't yet have an order-status updater, I'll add a small "Mark as shipped" button on each order row that updates status + sends the email atomically.)

### 7. Password reset (auth email)
Run `scaffold_auth_email_templates` → it creates 6 auth templates (signup, magic-link, recovery, invite, email-change, reauthentication). I'll style **all 6** with the same brand kit so they're visually consistent — then deploy `auth-email-hook`. Recovery template = the password-reset branded email you asked for.

### 8. Deploy
Deploy: `send-transactional-email`, `preview-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`, `auth-email-hook`.

---

## What I will NOT do (and why)
- ❌ Add discount codes / promo banners / "shop more" CTAs to welcome → would re-classify it as marketing, blocked by Lovable
- ❌ Change `noreply@notify.divinverseart.com` to `orders@notify.divinverseart.com` per-template → not supported; cosmetic only
- ❌ Wire to a Stripe webhook → webhook doesn't exist yet (Stripe enable was interrupted). Trigger from Checkout.tsx for now; migrate when webhook lands.

---

## Files created/edited

**New:**
- `supabase/functions/_shared/transactional-email-templates/_brand.tsx`
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx`
- `supabase/functions/_shared/transactional-email-templates/shipping-notification.tsx`
- `supabase/functions/_shared/transactional-email-templates/welcome.tsx`
- `src/pages/Unsubscribe.tsx`
- (auth email templates auto-created by scaffold tool, then re-styled)

**Edited:**
- `supabase/config.toml` — append 4 function blocks
- `src/App.tsx` — add `/unsubscribe` route
- `src/pages/Checkout.tsx` — fire order-confirmation after order insert
- `src/pages/Register.tsx` — fire welcome after signup
- `src/pages/Admin.tsx` — add "Mark as shipped" action that fires shipping-notification

---

## Notes for you
- **Domain warmup**: `notify.divinverseart.com` is brand new. Deliverability improves over the first 2–4 weeks as Gmail/Outlook build trust. Start with low volumes — your real customers in Phase 1 will be perfect for warming.
- **Setup status**: monitor in **Cloud → Emails**. Templates will queue immediately, but actual delivery only starts once DNS verification flips to active.
- **Forwarding** (`orders@divinverseart.com → manikumarc32@gmail.com`) — you still need to set this up separately at your registrar (ImprovMX recommendation from earlier). Without it, the "Reply to: orders@divinverseart.com" line in emails goes nowhere.

Reply **"go"** and I'll execute everything in one pass.
