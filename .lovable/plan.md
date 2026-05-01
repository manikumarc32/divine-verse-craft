
# Apply the two remaining fixes

Two small fixes left over from the previous round:

## 1. Cross-link the two epic pages

**`src/pages/AboutGita.tsx`** — add an `import { Link }` and insert a banner above the closing mantra that links to `/ramayana`:

> "The Other Great Epic"
> Read about the Ramayana →
> The story of Rama, Sita, and Hanuman — dharma in action.

**`src/pages/Ramayana.tsx`** — add the mirror banner linking to `/about-gita`:

> "The Other Great Epic"
> Read about the Bhagavad Gita →
> The wisdom of Krishna — Karma, Bhakti, and Jnana yoga.

Both styled as a soft accent-tinted card with a hover state (consistent with the existing site design).

## 2. Re-price the Ram Darbar Collection bundle

The bundle currently contains 6 items worth ~£122 but is priced at £59.99 — too aggressive a discount. Update via migration:

```sql
UPDATE public.bundles
SET title = 'Ram Darbar Collection',
    description = 'Six pieces — Lord Rama, Sita and Hanuman portraits with the Ram Darbar scene, Hanuman lifting Sanjeevani, and the Sita-Ram mantra calligraphy.',
    bundle_price = 89.99,
    badge = 'Save £30'
WHERE slug = 'ram-darbar-trio';
```

That's a healthy ~25% saving while protecting margin.

---

No new files. No new routes. No risk to existing functionality. Approve and I'll apply both immediately.
