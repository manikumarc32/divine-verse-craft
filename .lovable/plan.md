## Add full Hanuman Chalisa (Telugu) as a dedicated product

You want the complete Hanuman Chalisa text — Doha, Dhyanam, 40 Chaupais, and closing Doha — displayed in Telugu script on the Jai Hanuman product page (and as a printable poster), instead of just one short verse line.

### What will change

**1. Database — store the full text properly**

Add two new columns to the `products` table:
- `full_text_te` (text, nullable) — full Telugu chalisa/stotra text
- `full_text_en` (text, nullable) — optional English transliteration/translation
- `layout_mode` (text, default `'verse'`) — `'verse'` for short quote products, `'chalisa'` for long-form scripture

Then insert the full Telugu Hanuman Chalisa text you provided into `full_text_te` for the `jai-hanuman-gyan` product (and rename it to "Sri Hanuman Chalisa" if appropriate).

**2. New component — `ChalisaView.tsx`**

A scripture-style reader optimised for long Sanskrit/Telugu text:
- Section headings (దోహా, ధ్యానం, చౌపాఈ, closing దోహా) auto-styled
- Verse numbering (॥ 1 ॥ … ॥ 40 ॥) highlighted in accent gold
- Cream parchment background, serif Telugu-friendly font, generous line-height
- Read-aloud-friendly typography (≥ 18px on mobile, ≥ 20px on desktop)
- Optional decorative ॐ divider between sections
- Scrolls within a framed card so it feels like a printed prayer book

**3. ProductDetail page changes**

When `layout_mode === 'chalisa'` and `full_text_te` is present:
- Replace the small `ArtPreview` quote card with the full `ChalisaView`
- Keep the language toggle (English ↔ Telugu) — switches between `full_text_en` and `full_text_te`
- Keep the existing buy/customise controls below
- Add a "Print / Save as PDF" button (uses browser print with a print stylesheet so only the chalisa renders cleanly on A4)

**4. ProductCard (shop grid)**

For chalisa-mode products, show a compact preview: title + first 2 lines of Doha + "Read full Chalisa →", instead of the artwork mock.

**5. Admin editor (`MeaningsEditor.tsx`)**

Add two large textareas: "Full text (Telugu)" and "Full text (English)", plus a `layout_mode` dropdown. So you (or future scripture additions like Vishnu Sahasranamam, Lalitha Sahasranamam, Lingashtakam) can be added without code changes.

**6. Custom Builder note**

The custom builder stays for short personal/movie quotes (one verse, one image). Long scriptures live as products only — they wouldn't fit on a poster anyway.

### Technical notes

- Telugu text rendered via system fonts with `font-family: 'Noto Sans Telugu', 'Tiro Telugu', serif` fallback added to `tailwind.config.ts` and loaded from Google Fonts in `index.html`.
- Print stylesheet: `@media print { hide nav/footer/buttons; .chalisa-print { font-size: 12pt; } }`.
- No AI-generated deity imagery — the chalisa stands on its own typography. If you later upload an authentic Hanuman image, it will appear as the hero banner above the text via the existing `hero_image_url` field.
- Migration is additive (new columns, nullable) — no risk to existing products.

### Files to be created / edited

- migration: add `full_text_te`, `full_text_en`, `layout_mode` to `products`
- data insert: populate Hanuman Chalisa Telugu text
- new: `src/components/ChalisaView.tsx`
- new: `src/styles/print.css` (or scoped Tailwind classes)
- edited: `src/pages/ProductDetail.tsx`
- edited: `src/components/ProductCard.tsx`
- edited: `src/components/admin/MeaningsEditor.tsx`
- edited: `tailwind.config.ts`, `index.html` (Telugu font)
- edited: `src/integrations/supabase/types.ts` (auto)

Approve and I'll implement.