## Replace the Hanuman Chalisa product text with your final Telugu version

You want the product at `/product/hanuman-chalisa-doha` updated so its scripture body matches the exact Telugu Chalisa you just pasted (Doha → Dhyanam → 40 Chaupais with `అర్థం:` after each → closing Doha). No code rewrites of meanings, no AI rephrasing — your text, verbatim.

### What will change

**1. Database update only (no schema change)**

Update the single row `products.slug = 'hanuman-chalisa-doha'`:
- `title` → `శ్రీ హనుమాన్ చాలీసా`
- `layout_mode` → `'chalisa'` (already set, will reaffirm)
- `full_text_te` → the complete text you pasted, verbatim, with paragraphs separated by blank lines so the parser recognises each verse + meaning block.
- Leave `sanskrit`, `english_meaning`, `telugu_meaning` as `NULL` (already cleared) so no short-quote UI reappears.

**2. Tiny parser tweak in `ChalisaView.tsx`**

Your verse 14 & 15 are written as **one combined block** with a single shared `అర్థం (14 & 15):` line. The current parser regex `^(అర్థం|అర్ధం|Meaning|अर्थ)\s*[:：]` requires the colon to come right after the word. We'll relax it slightly so things like `అర్థం (14 & 15):` are also recognised as a meaning block:

```
const MEANING_PREFIX = /^(అర్థం|అర్ధం|Meaning|अर्थ)\s*(?:\([^)]*\))?\s*[:：]\s*/;
```

Also: some of your verses have the verse number markers like `|| ౧ ||` using single bars (`|`) instead of `॥`. The current verse-number regex only matches `॥ … ॥`. We'll extend it to also accept `||`:

```
/(?:॥|\|\|)\s*([\d౦-౯०-९]+)\s*(?:॥|\|\|)/
```

That's the only code change needed — visuals, print styles, and product UI behaviour stay as they are.

### Files touched

- `src/components/ChalisaView.tsx` — two regex updates (meaning prefix + verse number markers).
- DB update via insert tool on `products` row `slug = 'hanuman-chalisa-doha'` — title + `full_text_te` set to your exact text.

### Notes

- No image generation, no AI rewriting of any meaning.
- The `4.8 (0 reviews)` row is already hidden when there are no reviews.
- Language toggle and "Show deeper meaning" button stay hidden for chalisa products (already done).
- Print / Save as PDF continues to work via the existing `@media print` rules.

Approve and I'll apply the DB update and the small parser tweak.