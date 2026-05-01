
# Phase 2 — DivineVerse Art

Builds on Phase 1. Adds 7 new pages, stock + bundle systems, Telugu language toggle, FAQ chatbot, and a site-wide modernisation pass (fonts, scroll animations, micro-interactions).

---

## 1. Visual modernisation pass (applied first, site-wide)

**Why first:** every new page inherits the upgraded look, so we don't restyle twice.

- **Fonts:** Add Fraunces (display, for h1/h2) + Inter (body) via Google Fonts. Keep Sanskrit font stack. Update `index.css` font tokens.
- **Framer Motion** (`framer-motion`) for scroll-reveal, page transitions, stagger.
- **Navbar:** glass blur + shrink-on-scroll (height 64→56px), subtle border glow on scroll.
- **Hero:** larger editorial type, animated gradient background, gentle floating Om/lotus accents, Sanskrit verse fades through 3 rotating quotes.
- **Product cards:** image-zoom on hover, frame glow, lift shadow, animated price reveal.
- **Section reveals:** fade-up + stagger on scroll using `whileInView`.
- **Animated gold divider:** shimmer animation on the existing `.gold-divider`.
- **Page transitions:** 200ms fade between routes via `AnimatePresence` in `App.tsx`.
- **Buttons:** existing `btn-saffron` gets a subtle shine sweep on hover.

No layout breaking changes — purely additive polish.

---

## 2. Bundles (new `/bundles` route)

**DB (migration):**
```
bundles(id, slug, title, description, bundle_price, badge, sort_order, is_active)
bundle_items(id, bundle_id, product_id, quantity)
```
Public read RLS; admin manage via `is_admin()`.

Seed 4 bundles referencing existing product slugs:
- Karma Collection (3 Gita posters)
- Divine Trinity (Krishna + Shiva + Ganesh)
- Meditation Set (Om + Lotus + Mandala)
- Complete Gita (all 7 Gita posters)

**Pricing:** `original_price` is computed at render time as `sum(bundle_items.product.base_price)` so discounts stay accurate as you edit products. Saving badge = `original − bundle_price`.

**Page:** hero, 4 bundle cards with thumbnail strip (3 mini ArtPreviews), strikethrough original, big bundle price, "Save £X" badge, "Add Bundle to Cart" button (adds each item with default size/material).

---

## 3. India coming-soon (new `/india` route)

**DB:** `india_signups(id, email unique, created_at)`. Public insert allowed; admin read.

**Page sections:**
- Hero: 🇮🇳 flag, heading, description, email capture → inserts to `india_signups`, success toast.
- Note line: "Prices shown in ₹ (INR) — checkout in INR launches with the India site."
- INR price preview table (5 rows as specified).
- "Free delivery across India on orders above ₹1999."
- Features grid (4 tiles): local printing, fast delivery, UPI, multilingual.

**Homepage banner:** narrow saffron strip above the footer's newsletter, "Coming Soon to India 🇮🇳 — Join the waitlist", links to `/india`.

---

## 4. Stock management

**DB migration:** `products` already has `stock_limit`; add `sold_count int default 0`.

**Decrement logic:** done in the existing `stripe-webhook` edge function on `checkout.session.completed`, inside a transaction:
- For each order_item, `update products set sold_count = sold_count + qty, is_active = (sold_count + qty < stock_limit) where id = ?`.
- No DB trigger — keeps test/admin inserts safe and lets us reverse on refunds later.

**`<StockBar />` component:** progress bar (sold/total), "X of Y remaining" label, red "Only X left!" when ≤5, "SOLD OUT" badge + disabled CTA at 0. Animated fill on mount.

**Where shown:** Shop card and ProductDetail — only when `stock_limit !== null`. Spec says hand-written category; we'll show whenever `stock_limit` is set so admin controls it per product.

---

## 5. Telugu language toggle

- `LanguageProvider` in `src/hooks/useLanguage.tsx` with React context, persisted in `localStorage`.
- `EN | తెలుగు` pill in navbar (desktop + mobile menu).
- `src/lib/i18n.ts` typed dictionary covering ~30 keys: hero headline, section titles ("Featured Gita Quotes", "Hindu God Portraits", "Words from Our Devotees"), About-Gita body (3 paragraphs from your spec), CTAs.
- Product cards and detail page swap `english_meaning` → `telugu_meaning` when Telugu active (data already exists).
- **Always English:** navbar links, footer, checkout, legal, admin, blog.

No `translations` table — dictionary is faster and type-safe. Easy to add later if non-devs need to edit copy.

---

## 6. FAQ chatbot (floating, all pages)

- `<ChatWidget />` mounted in `PageLayout`.
- Floating 💬 bubble bottom-right, opens animated panel (Framer Motion scale+slide).
- Header "DivineVerse Support", greeting "Namaste! 🙏 How can we help you today?".
- 4 quick-reply buttons with the exact answers from your spec.
- Text input does **keyword matching** against an FAQ map (delivery/return/size/custom/contact/india keywords → matching answer). Unknown → "I'm not sure — try a quick reply above, or email hello@divineverseart.com."
- Conversation kept in component state only (not persisted).

---

## 7. Admin enhancement

- Products table gains `stock_limit` + `sold_count` columns (sold_count read-only).
- Inline edit for `stock_limit` (number input + save).
- Hand-written category rows render a purple `chip` badge.

---

## 8. Legal + supporting pages

New routes, all linked from footer (replace `#` placeholders):
- `/privacy` — GDPR-aware Privacy Policy (data collected, lawful basis, rights, contact).
- `/terms` — UK e-commerce T&Cs (orders, pricing, delivery, IP, liability, governing law).
- `/refunds` — 30-day returns, conditions, process, refund timing, custom-order exclusions.
- `/contact` — email + form (writes to a new `contact_messages` table; admin reads).
- `/faq` — sectioned FAQ mirroring chatbot answers + more.
- `/size-guide` — visual A4/A3/A2 rectangles at relative scale with cm dimensions; 4 material cards (Poster 200gsm, Canvas 340gsm, Cloth Tapestry, Eco Paper 180gsm) with descriptions.

---

## 9. Navigation updates

Navbar (desktop): Shop · Bundles · Custom · About Gita · Blog · `EN|తె` toggle.
Footer: add Bundles, India, Size Guide, Contact, FAQ, Privacy, Terms, Refunds.

---

## Technical notes

**New deps:** `framer-motion`.

**New files:**
- `src/components/ChatWidget.tsx`, `StockBar.tsx`, `LanguageToggle.tsx`, `MotionSection.tsx` (scroll-reveal wrapper), `BundleCard.tsx`
- `src/hooks/useLanguage.tsx`
- `src/lib/i18n.ts`, `src/lib/bundles.ts`
- `src/pages/Bundles.tsx`, `India.tsx`, `Privacy.tsx`, `Terms.tsx`, `Refunds.tsx`, `Contact.tsx`, `FAQ.tsx`, `SizeGuide.tsx`

**Migrations (one file):**
- `bundles`, `bundle_items`, `india_signups`, `contact_messages` tables + RLS
- `alter table products add column sold_count int not null default 0`
- Seed 4 bundles + their items

**Edge function:** update `stripe-webhook` to decrement stock on `paid`.

**Out of scope (deferred):**
- Real INR checkout / Stripe India.
- AI chatbot (using keyword match per your choice).
- Translations DB table (using typed dictionary).
- DB trigger for stock (using webhook for safety).

---

## What you'll get

12 routes → 19 routes. New: `/bundles`, `/india`, `/privacy`, `/terms`, `/refunds`, `/contact`, `/faq`, `/size-guide`. Plus stock bars, Telugu toggle, floating chatbot, and a noticeably more modern, animated feel across the whole site.
