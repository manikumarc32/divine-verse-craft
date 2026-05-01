
# Add Ramayana alongside Bhagavad Gita

Right now DivineVerse Art is 90% Gita-focused. We'll re-position the brand as honouring **two great epics** equally: the **Bhagavad Gita** (wisdom of Krishna) and the **Ramayana** (story of Rama). This gives you a much wider audience — Ram bhakts, Hanuman devotees, Sita-Ram families, and the huge Ayodhya / post-Ram-Mandir market.

---

## 1. New Product Categories (database)

Add Ramayana-themed categories to the `product_category` enum:
- `ramayana_quote` — verses/shlokas from Valmiki Ramayana & Ramcharitmanas
- `ramayana_scene` — Ram-Sita-Lakshman, Ram Darbar, Hanuman lifting mountain, Ram returning to Ayodhya, Ram-Ravan yuddh
- `hanuman_chalisa` — verse art from the 40 chaupais

(Existing `god_portrait` already covers single Ram/Sita/Hanuman portraits.)

Seed ~8–10 starter Ramayana products with sample shlokas (Sanskrit + Telugu + English meaning) using the same product schema you already have.

## 2. Twin-Epic Homepage Hero

Replace the current single-verse hero with a **split / rotating dual hero**:

```text
+-----------------------------------------------+
|   THE WISDOM       ||      THE STORY          |
|   Bhagavad Gita    ||      Ramayana           |
|   "Karmanyeva..."  ||   "Raghukul reet..."    |
|   [Shop Gita Art]  ||   [Shop Ramayana Art]   |
+-----------------------------------------------+
```

Each side rotates through 3 verses with Framer Motion fade. Mobile stacks vertically.

## 3. New Dedicated Pages

- **`/ramayana`** — mirror of the existing `/about-gita` page. Tells the story of Rama, the 7 Kandas (Bala, Ayodhya, Aranya, Kishkindha, Sundara, Yuddha, Uttara), key characters, and why each scene matters spiritually. Beautiful long-form editorial with gold dividers.
- **Rename `/about-gita` → `/about`** with two tabs: *Bhagavad Gita* | *Ramayana*. (Old URL redirects so nothing breaks.)
- **`/shop?epic=ramayana`** and **`/shop?epic=gita`** — Shop page filter chips at top: *All · Gita · Ramayana · Portraits · Calligraphy*.

## 4. New Themed Bundles

Add to the bundles table:
- **Ram Darbar Trio** — Ram + Sita + Hanuman portraits
- **Sundara Kanda Set** — 3 Hanuman Chalisa calligraphy prints
- **Twin Wisdom Bundle** — 1 Gita verse + 1 Ramayana verse (cross-sell hero)
- **Ayodhya Collection** — 4 scenes: Ram's birth, Vanvas, Ram-Ravan yuddh, Ram returning home

## 5. Navigation & Footer

Navbar dropdown becomes:

```text
Shop ▾
  ├─ Bhagavad Gita Art
  ├─ Ramayana Art
  ├─ God Portraits
  ├─ Hand-written Calligraphy
  └─ Bundles

Learn ▾
  ├─ About the Gita
  └─ About the Ramayana
```

Footer gets matching "Explore the Gita" and "Explore the Ramayana" columns.

## 6. Custom Verse Builder Update

The existing `/custom` builder currently only offers Gita verses. Add a **toggle at the top: Gita ⇄ Ramayana** so customers can build personalised art from either epic (e.g., "Raghupati Raghav Raja Ram" calligraphy).

## 7. Brand Tagline Update

Update tagline everywhere from *"Wisdom of the Bhagavad Gita on your wall"* to:

> **"Two epics. One eternal dharma. On your wall."**

Hero subtitle: *Hand-crafted art celebrating the wisdom of the Bhagavad Gita and the timeless story of the Ramayana.*

## 8. Translations (i18n)

Add Telugu + English entries for all new Ramayana strings (epic names, kanda names, character names, CTAs) to `src/lib/i18n.ts`.

## 9. FAQ + Blog

- Add 3 Ramayana FAQ entries (Which Ramayana? Valmiki vs Tulsidas? Is the Sanskrit accurate?)
- Add 2 starter blog posts: *"7 Kandas of the Ramayana explained"* and *"Why every home needs a Ram Darbar"*

---

## Technical notes

- **Migration**: `ALTER TYPE product_category ADD VALUE 'ramayana_quote'` etc. (must be separate migration from inserts because Postgres requires enum values to be committed before use).
- **Seed data**: insert ~10 products + 4 bundles + bundle_items via migration.
- **Routing**: add `/ramayana` and `/about` routes in `src/App.tsx`; keep `/about-gita` as redirect.
- **Components**: new `TwinHero.tsx`, update `Shop.tsx` with `?epic=` query param filter, update `Navbar.tsx` dropdowns.
- **No breaking changes** to existing Gita products, bundles, or orders.

---

## What you get

- Doubles your addressable market (Ram bhakts are arguably bigger than pure Gita audience right now post-Ayodhya)
- Strong brand differentiation: most "Hindu art" stores sell scattered deities — you'll be the only one structured around the **two great epics** as twin pillars
- Cross-sell opportunity via Twin Wisdom Bundle
- Better SEO: ranks for both "Bhagavad Gita wall art" AND "Ramayana wall art" / "Ram Darbar painting" / "Hanuman Chalisa frame"

Approve and I'll build it all in one go.
