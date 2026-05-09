## Goal
Stop displaying the placeholder 4.8 ★ rating that appears on every product even when no real customer reviews exist.

## Where fake ratings show today
1. **Product cards** (`src/components/ProductCard.tsx`) — always shows star + "4.8" on every product in Shop, Bundles, related products
2. **Product detail page** (`src/pages/ProductDetail.tsx`) — already correctly hidden when `review_count = 0`, no change needed
3. **Homepage hero stat** (`src/pages/Index.tsx` line 99) — hardcoded "4.8 ★ Rating" stat tile
4. **Shop sort dropdown** (`src/pages/Shop.tsx` line 98) — "Top Rated" sort option (relies on the fake rating)

## Changes

**`src/components/ProductCard.tsx`**
- Only render the star + rating block when `review_count > 0`. Otherwise hide the rating entirely.

**`src/pages/Index.tsx`**
- Replace the hardcoded "4.8 ★ Rating" stat tile with something honest, e.g. "Free UK Shipping" or "Handcrafted in UK" — keeps the 3-stat layout intact.
- Leave the testimonials section as-is (those are written quotes, not numerical ratings).

**`src/pages/Shop.tsx`**
- Remove the "Top Rated" option from the sort dropdown (would sort by fake data).

## Out of scope
- Product detail page (already gated correctly)
- Database column removal — keep `rating` and `review_count` columns; they'll populate naturally as real reviews come in via the existing reviews table
- Testimonial quotes on homepage (real-looking, not numeric ratings)

## Result
No fake numbers anywhere on the storefront. Once real customers leave reviews, ratings will appear automatically.
