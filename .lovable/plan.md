## What's wrong today

1. The "Complete Hanuman Chalisa" product **has no image on screen**. We generated `src/assets/hanuman-chalisa-complete.jpg`, but `ProductCard` and `ProductDetail` only render the abstract `ArtPreview` card — there is no `image_url` column on `products` and no per-slug image map. So Hanuman + the chalisa text never appear together anywhere in the store.
2. In the **Custom Quote Builder**, the only way to get a background is to upload your own image. There's no library of reference images (Hanuman, Krishna, Shiva, parchment, peacock feather…) the customer can pick from. You want them to be able to choose a reference like the ones you uploaded, *without* having to upload anything.

## The plan

### 1. Show the Hanuman Chalisa hero image on the product

- Add an optional `hero_image_url` column to `products` (text, nullable).
- Upload `src/assets/hanuman-chalisa-complete.jpg` into a new public storage bucket `product-images/` and set the URL on the `hanuman-chalisa-complete` row. (Other products keep using the abstract `ArtPreview` — nothing breaks.)
- Update `ProductCard` and `ProductDetail`: if `hero_image_url` exists, render the image with the verse text overlaid at the bottom (same composition as your reference uploads — image up top, verse + meaning beneath on a soft band). Otherwise keep the current `ArtPreview`.
- Result: opening the Hanuman Chalisa product shows Hanuman with the full chalisa text, exactly like the reference style.

### 2. Curated "Reference Backgrounds" library in Custom Builder

- New section in personal/movie-quote mode called **"Choose a background"** with three tabs:
  - **Solid colours** (existing 4 swatches — unchanged)
  - **Reference images** (NEW — curated gallery, no upload needed)
  - **Upload your own** (existing `ImageUploader` — unchanged)
- The reference gallery shows ~12 thumbnails grouped by deity/theme:
  - Hanuman (silhouette, statue, illustration)
  - Krishna (silhouette, parchment, blue form)
  - Shiva (meditating)
  - Parchment / aged paper
  - Peacock feather on cream
  - Plain temple wall textures
- Source: I'll generate these once with the Lovable AI image model (Nano Banana) and store them in a new public bucket `reference-backgrounds/`. They'll be served by URL — no per-user upload, no copyright worry.
- Clicking a thumbnail sets `bgImageUrl` to that public URL — `ArtPreview` already supports it, so the live preview just works.
- Also expose this library in **scripture mode**, so even traditional verses can sit on a Krishna/Hanuman backdrop.

### 3. Make the "no image" path nicer

Even when the customer doesn't pick any image, the current solid-colour preview is fine but plain. Add two small touches in `ArtPreview`:
- Faint "ॐ" watermark behind the text on solid-colour backgrounds (very low opacity).
- Decorative corner ornaments on the cream / saffron presets (matches your `bhagvad_gita_quote.jpg` reference style).

This way "customise without an image" still looks crafted.

### 4. Reference-only uploads (clarification)

Your uploaded screenshots will be treated as **style references only** — I will not embed them on the site directly (they're third-party images). The reference-background gallery in step 2 will be original AI-generated artwork inspired by their composition.

## Technical details

- **DB migration**: `ALTER TABLE products ADD COLUMN hero_image_url text;` plus an `UPDATE` for the chalisa row.
- **Storage migration**: create `product-images` and `reference-backgrounds` buckets (both public read, admin write).
- **New file**: `src/components/custom/ReferenceBackgroundPicker.tsx` — grid of thumbnails grouped by category, with a "None" option to clear.
- **Edits**: `CustomBuilder.tsx` (add picker + tabs), `ArtPreview.tsx` (watermark + corner ornaments), `ProductCard.tsx` & `ProductDetail.tsx` (render `hero_image_url` when present), `MeaningsEditor.tsx` (add field to edit `hero_image_url` so you can swap images later from /admin without code).
- **Asset generation**: ~10–12 reference backgrounds generated once via the AI image gateway, uploaded to `reference-backgrounds/` during the migration, then referenced by stable URLs. No per-request generation cost.
- **Types**: `src/integrations/supabase/types.ts` regenerates automatically after the migration.

## Out of scope (ask if you want them next)

- Letting *customers* upload AI-generated reference images (bigger storage policy + moderation).
- A separate "Today's Message" daily-quote product format (the parchment + Hanuman style from your `❤️🙏🏽.jpg` reference) — happy to add as a new product template after this lands.
