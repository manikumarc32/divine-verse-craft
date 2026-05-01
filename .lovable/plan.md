# Verse Meaning Popup

Many shoppers don't know Sanskrit. Right now we show a short one-line meaning on each card — but they want to understand the verse deeper before they buy. We'll add a small **"What does this mean?"** link under every verse. Tapping it opens a clean popup with the big verse and a short, friendly explanation (English + Telugu).

## What the user will see

A small link beneath every Sanskrit verse:
> ॐ सर्वे भवन्तु सुखिनः
> *"May all beings be happy."*
> [ What does this mean? → ]

Tapping it opens a centered modal:

```text
┌─────────────────────────────────────┐
│              ॐ                      │
│   सर्वे भवन्तु सुखिनः                │
│      ───── gold ─────               │
│   "May all beings be happy."        │
│                                     │
│   📖 The deeper meaning             │
│   A short, 2–3 sentence plain-      │
│   English explanation of what the   │
│   verse teaches and when people     │
│   chant it.                         │
│                                     │
│   📜 In Telugu                      │
│   తెలుగులో అర్థం…                    │
│                                     │
│   — Bhagavad Gita 2.47              │
│   [ Add to cart £39 ]  [ Close ]    │
└─────────────────────────────────────┘
```

## Where the popup will appear

1. **Product cards** on Shop, Bundles, Homepage featured collection — small "What does this mean?" link under the meaning line.
2. **Product detail page** — a more prominent "Read the full meaning" button below the verse.
3. **Homepage hero / featured verse** — same link.

## Content

We'll add a new **`deeper_meaning`** field (English) and **`deeper_meaning_te`** (Telugu) to each product — a 2–4 sentence friendly explanation written for someone with no Sanskrit background. I'll seed this for all existing products using authentic interpretations from established Gita/Ramayana sources.

For verses that don't yet have a deeper meaning written, the popup gracefully falls back to just showing the verse + short meaning + chapter reference (no empty section).

## Technical changes

- **Database migration**: add `deeper_meaning text` and `deeper_meaning_te text` columns to `products` (nullable). Backfill all existing rows with curated explanations.
- **New component** `src/components/VerseMeaningDialog.tsx` — uses existing shadcn `Dialog`, shows `ArtPreview` at the top + the deeper meaning sections + chapter ref + an "Add to cart" CTA.
- **Update `ProductCard.tsx`** — add the trigger link below the meaning line; render the dialog.
- **Update `ProductDetail.tsx`** — add a "Read the full meaning" button near the verse.
- **Update `Index.tsx`** featured section — same trigger link.
- **i18n keys** in `src/lib/i18n.ts` for English + Telugu: `verse.whatMeans`, `verse.deeper`, `verse.inTelugu`, `verse.close`, `verse.dialogTitle`.
- **Types**: regenerated automatically after migration.

## Out of scope

- No CAPTCHA / pre-launch polish (per your earlier note).
- Custom Builder verses won't get this popup (user-typed, no curated meaning).

Approve and I'll build it.
