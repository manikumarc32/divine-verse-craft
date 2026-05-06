# Guided Prodigi Setup

Right now the Prodigi plumbing exists, but two things block real orders:

1. None of your 20+ products have a `hero_image_url` OR a `prodigi_sku` / `prodigi_asset_url` set.
2. The current Admin UI shows two raw text fields per product with no guidance — that's why setup feels random.

This plan replaces "guess and type" with a guided wizard so you can finish setup confidently.

## What you'll see

A new **Prodigi Setup** tab in `/admin` with three sections:

### 1. Connection check (top)
- A "Test Prodigi connection" button that calls `/Quotes` on the sandbox API and shows green ✓ or the error.
- Confirms your API key works before you waste time on data entry.

### 2. SKU picker (per product)
Instead of a free-text box, each product row shows:
- A **product type dropdown** with curated Prodigi SKUs grouped by what your shop sells:
  - **Posters** (cheapest, good for quotes/symbols): `GLOBAL-PAP-A4`, `GLOBAL-PAP-A3`, `GLOBAL-PAP-16X20`
  - **Framed prints** (god portraits): `GLOBAL-FAP-16X20`, `GLOBAL-FAP-A3`
  - **Canvas** (premium pieces like Hanuman Chalisa): `GLOBAL-CAN-16X20`, `GLOBAL-CAN-20X30`
- A "Suggest by category" button that auto-fills based on `category` (e.g. `gita_quote` → A4 poster, `god_portrait` → framed 16x20, `hand_written` → canvas).
- A live link "View on prodigi.com →" next to the chosen SKU so you can confirm.

### 3. Print file uploader (per product)
- An image dropzone per product that uploads the print-ready file to the existing `product-images` storage bucket and auto-fills `prodigi_asset_url` with the public URL.
- Also sets `hero_image_url` to the same file if it's empty (so your shop page actually shows the image too — currently all products are imageless).
- Shows a thumbnail + DPI/size warning if the file is smaller than recommended for the chosen SKU.

### 4. "Ready to sell" checklist
For each product, a green/red badge: needs SKU? needs asset? ready ✓.
Filter to "Show only incomplete" so you can power through the 20 products quickly.

## After setup — how to test

A short banner at the top of the Setup tab:
> "Place a test order at /checkout using card 4242 4242 4242 4242. Sandbox orders never ship. Check the Orders tab — `prodigi_order_id` will appear within seconds."

## Out of scope
- Live (real) Prodigi environment — stays sandbox until you flip a future toggle.
- Prodigi → orders status sync (already deferred).
- Bulk CSV import of SKUs (can add later if you want).

## Technical notes
- New component `src/components/admin/ProdigiSetupTab.tsx`, added as a tab inside `Admin.tsx`.
- New edge function `prodigi-test-connection` (admin-only via `is_admin`) that hits `GET /v4.0/Quotes` to validate the key.
- SKU catalogue lives in `src/lib/prodigiCatalogue.ts` (curated list above; easy to extend).
- Uploader reuses the existing `product-images` public bucket — no new storage setup.
- DB: no schema changes — fields already exist on `products`.
