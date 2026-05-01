# Plan — Editable meanings + Customer custom-quote builder

You raised 4 separate ideas. Quick verdict on each, then a combined build plan.

## 1. Admin UI to edit meanings — YES, strongly recommended
Right now `english_meaning`, `telugu_meaning`, `deeper_meaning`, `deeper_meaning_te` live in the DB but can only be changed via code/migrations. An admin form means you can fix typos, refine translations, or add depth anytime without redeploying. Low effort, high value.

## 2. Customer custom quotes (incl. movie quotes / personal lines) — YES, with guardrails
This becomes a real product line ("Personalised Quote Print") and is a strong upsell. Needs:
- A typed-in quote (with length limits)
- Optional second line / translation
- Optional uploaded background image (the quote overlays the image)
- Choice of font, alignment, text colour, overlay darkness
- Live preview before adding to cart

Guardrails: profanity/length checks, copyright disclaimer ("you confirm you have the right to use this quote/image"), max upload 8MB, only JPG/PNG/WebP.

## 3. Full Hanuman Chalisa as one image — YES, as a NEW premium SKU
Don't replace the existing single-doha card. Add a new product **"Complete Hanuman Chalisa — All 40 Verses"** (category `hand_written`, price ~£39.99) with Hanuman illustration + all 40 chaupais laid out in one large composition. Sells better as a separate hero piece. We can do the same later for Gita Ch 2, Lalitha Sahasranamam, etc.

## 4. Free bonus images when spending over £5, customer picks resolution — PARTIAL YES
My honest recommendation: instead of "free image over £5" (£5 is your average single product, so this would erode margin on every order), do this:
- **Free digital wallpaper download with every order** (any value) — phone + desktop + tablet resolutions. Costs you nothing, delights customers, grows brand.
- **Spend over £25 → unlock a premium printable PDF** (high-res, A4/A3/Letter) of any one verse from a curated set.
- Resolution picker on the download page: Phone (1170×2532), Tablet (2048×2732), Desktop (2560×1440), Print A4 (300dpi), Print A3 (300dpi).

This protects margin while still feeling generous.

---

# What I'll build

### A. Admin Meanings Editor
- New tab in `/admin` called **"Meanings"** listing all products (search + category filter).
- Inline edit for: `english_meaning`, `telugu_meaning`, `deeper_meaning`, `deeper_meaning_te`, `chapter_ref`, `sanskrit`.
- Save per row, success toast, optimistic update.

### B. Customer Custom Quote Builder
- New page `/custom-quote` (also linked from `/custom` and Shop hero).
- Form: quote text (max 280 chars), optional sub-line (max 120), language tag, font (4 curated), alignment, text colour (5 swatches), background option (solid colour OR upload image).
- Live canvas preview (`<canvas>`) in chosen frame size.
- Upload goes to a new public Storage bucket `custom-uploads` (RLS: anyone can insert, only owner/admin can read after order).
- Adds to cart as a `is_custom: true` order item with all design choices saved in `custom_data` JSON (already exists on `order_items`).
- Pricing: base £14.99 + size/material/frame modifiers (reuses existing options).
- Copyright checkbox required before "Add to cart".

### C. Full Hanuman Chalisa product
- Insert a new product row (category `hand_written`, slug `hanuman-chalisa-complete`, £39.99) with full 40-verse text in `description` and short summary in `english_meaning`.
- Generate a hero image (Hanuman illustration + all 40 verses laid out) — I'll produce a high-quality composition.
- Featured on Shop and Hanuman Chalisa category page.

### D. Free Digital Bonus on Checkout Success
- On `/checkout/success`, show a **"Your free gift"** card.
- Order total ≥ £5 → wallpaper download (phone/tablet/desktop chooser).
- Order total ≥ £25 → also unlock a printable A4/A3 PDF picker.
- Files served from a new public bucket `digital-bonuses` with signed URLs valid 30 days.

---

## Technical details

**Database migrations**
- New table `custom_quote_drafts` (optional, lets logged-in users save drafts): `id, user_id, payload jsonb, created_at`. RLS: owner-only.
- New storage buckets:
  - `custom-uploads` (public read, validated insert: anon+auth, mime check)
  - `digital-bonuses` (private, signed URLs only)
- Insert one new product row for the complete Hanuman Chalisa.
- No schema change needed for meanings — fields already exist; only adding admin UI.

**New / changed files**
- `src/pages/admin/MeaningsEditor.tsx` (new tab) + route in `Admin.tsx`
- `src/pages/CustomQuote.tsx` (new) + route in `App.tsx`
- `src/components/custom/QuoteCanvasPreview.tsx` (canvas renderer)
- `src/components/custom/ImageUploader.tsx` (drag-drop, size/mime validation, uploads to `custom-uploads`)
- `src/pages/CheckoutSuccess.tsx` — add "Free gift" section with resolution picker
- `src/lib/i18n.ts` — keys for builder, copyright notice, gift section
- `src/pages/Shop.tsx` & nav — add "Design your own quote" CTA

**Validation (client + server)**
- Zod schema for custom quote payload (length, allowed fonts, hex colour pattern).
- Storage RLS enforces mime + size.
- Copyright disclaimer stored as boolean in `custom_data`.

**Out of scope for this plan (ask separately if you want them)**
- AI-generated background images for custom quotes
- Auto-translation of customer quotes to Telugu/Hindi
- Movie-quote licensing partnerships

---

## Suggested build order
1. Admin Meanings Editor (fastest win, you can use it immediately)
2. Complete Hanuman Chalisa product + image
3. Custom Quote Builder (biggest piece)
4. Free digital bonus on checkout success

Reply **"approve"** to build all four, or tell me which ones to skip / reorder.
