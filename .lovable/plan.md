## Convert "Buddhi-heen Tanu Janike" into the full Hanuman Chalisa with verse-by-verse meanings

You're on `/product/hanuman-chalisa-doha` and you don't want a single short quote anymore. You want this product to display the complete Hanuman Chalisa in Telugu — Doha, Dhyanam, all 40 Chaupais, closing Doha — with the **అర్థం (meaning)** shown beneath each verse, exactly in the format you pasted.

### What will change

**1. Update the existing product (`hanuman-chalisa-doha`)**
- Rename title: `"Buddhi-heen Tanu Janike"` → `"Sri Hanuman Chalisa (శ్రీ హనుమాన చాలీసా)"`
- Set `layout_mode = 'chalisa'`
- Populate `full_text_te` with the full text you pasted, with verses and their అర్థం paragraphs preserved.
- Clear the small one-line `telugu_meaning` / `english_meaning` / `sanskrit` fields so the old short-quote UI no longer appears.

**2. Upgrade `ChalisaView.tsx` to render verse + meaning blocks**

Currently it parses paragraphs as headings or numbered verses. We'll extend the parser to also recognise lines starting with `అర్థం:` and render them as a distinct meaning block:

```text
verse (centered, serif Telugu, gold ॥ N ॥)
   ↓
అర్థం: ... (left-aligned, smaller, muted brand colour, italic-ish, 
            indented "meaning ribbon" with subtle left border)
```

This keeps the scripture/meaning rhythm clear and makes it readable both on screen and in print.

**3. Hide the "4.8 (0 reviews)" stars block when there are no reviews**

In `ProductDetail.tsx`, only render the rating row when `review_count > 0`. So new/unreviewed products show a clean header without the misleading "4.8 (0 reviews)".

**4. Hide the small "verse quote" UI for chalisa products**

For `layout_mode === 'chalisa'`:
- Don't show the **Language** pill row (the chalisa is Telugu-only by design here).
- Don't show the `VerseMeaningDialog` "Show deeper meaning" button (meanings are inline now).
- Keep Size / Material / Frame / Add to Cart — buying a printed chalisa poster still makes sense.

**5. Print stylesheet polish**

Already added in `index.css`. We'll just make sure the new `.chalisa-meaning` block prints in dark grey on white with comfortable line-height.

### Files to be edited

- `src/components/ChalisaView.tsx` — parser + new meaning block styling
- `src/pages/ProductDetail.tsx` — conditional rating row, hide language/deeper-meaning for chalisa
- `src/index.css` — print + screen styles for `.chalisa-meaning`
- DB update (via insert tool) on `products` row `slug = 'hanuman-chalisa-doha'`:
  - `title`, `layout_mode`, `full_text_te`, plus null out `sanskrit/english_meaning/telugu_meaning`

### Notes

- I'll use the full Telugu text (Doha + Dhyanam + 40 verses + meanings + closing Doha) exactly as you pasted, no AI rewriting, no deity image generation.
- The existing `hanuman-chalisa-complete` and `jai-hanuman-gyan` rows remain untouched (you can decide later whether to merge or delete duplicates).

Approve and I'll implement.