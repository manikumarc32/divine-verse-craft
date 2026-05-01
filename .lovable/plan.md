
# DivineVerse Art — Phase 1 Build Plan

A spiritual ecommerce site for Bhagavad Gita quote art, Hindu god portraits, and hand-written calligraphy prints. Cream/saffron/gold aesthetic with Sanskrit and Om motifs throughout.

## Design system

Set up the global theme so every page inherits it automatically:

- **Colors** (HSL tokens in `index.css`): saffron primary `#D4760A`, cream bg `#FFFAF3`, gold accent `#B8942D`, dark brown headings `#2D1B0E`, mid brown body `#5C4033`, purple `#6B3FA0` for the Hand-Written collection.
- **Typography**: Georgia serif for headings, system sans-serif for body.
- **Components**: 12px rounded cards, soft shadows, saffron gradient buttons with hover lift, gold gradient dividers, reusable `LotusIcon` and `OmDivider` components.
- **Product preview component**: a single `ArtPreview` component renders the Sanskrit verse, gold divider, meaning text, chapter ref, and Om symbol on a cream "framed" background. Used everywhere a product image would normally appear (cards, detail page, cart, custom builder).

## Pages (12)

```text
/                       Homepage
/shop                   Shop with filters & search
/product/:slug          Product detail with live preview & options
/custom-builder         Custom Quote Builder
/checkout               Checkout (+ /checkout/success)
/login  /register       Auth pages
/account                Dashboard (Orders, Wishlist, Settings, Admin*)
/account/orders         Order history
/wishlist               Wishlisted products
/about-gita             About the Bhagavad Gita
/blog                   Blog index
/admin                  Admin dashboard (admin role only)
```

Cart is a slide-out drawer available from the navbar on every page (not a route).

### Page contents (highlights)

- **Homepage**: dark-brown hero with Om subtitle, gold-accent headline, italic Sanskrit quote, dual CTAs, 3 stats. Featured Gita Quotes (3 cards), Multilingual Feature gold banner with Sanskrit/Telugu/English example card, God Portraits (3 cards), dark-brown testimonials (3), trust badges row, newsletter signup, 5-column dark-brown footer.
- **Shop**: search bar, category pills (All, Gita Quotes, God Portraits, Symbols, Hand-Written-purple), sort dropdown, live product count, auto-fill grid (min 270px) of product cards with badge, wishlist heart, chapter ref, stars, price-from, Add to Cart.
- **Product detail**: two-column layout. Left = sticky `ArtPreview` reflecting current selections. Right = title, rating, dynamic price, selectors for **Language** (Telugu/English/Sanskrit — switches preview meaning text), **Size** (A4/A3+£8/A2+£18), **Material** (Poster / Canvas+£15 / Cloth Tapestry+£12 / Eco+£3), **Frame** (None / Black+£12 / Wood+£15 / White+£12 / Gold+£20), Add to Cart, Wishlist, shipping info card, Description/Reviews tabs, related products row.
- **Custom Quote Builder**: left form (Sanskrit textarea, meaning textarea, font selector, background swatches, frame, size); right sticky live preview. Base £22 + size/frame add-ons.
- **Cart drawer**: right overlay (92% width on mobile), item count, Om empty state, line items with thumbnail mini-preview / options / qty / remove, subtotal + shipping note, Checkout button.
- **Checkout**: shipping form, shipping zone selector with the 3 zones and free-shipping thresholds, sticky order summary, "Pay with Stripe 🔒" → Stripe Checkout → success screen on return.
- **Account dashboard**: grid cards for Order History, Wishlist, Settings, and Admin (Admin card only renders if the signed-in user has the admin role).
- **Wishlist**: product grid + empty state.
- **About Bhagavad Gita**: max-width 780px, 5 sections (What is the Gita, Core Teachings, Why Sacred Wall Art, Our Mission, Authentic Sources).
- **Blog**: 6 seeded post cards (category badge, date, read time, title, excerpt). Detail pages can come in Phase 2.
- **Admin dashboard** (full): stats overview (revenue, orders, products, users), products CRUD table, orders table with status updates, blog post editor.

## Backend (Lovable Cloud / Supabase)

### Tables
`products`, `sizes`, `materials`, `frames`, `shipping_zones`, `profiles`, `user_roles`, `wishlists`, `reviews`, `orders`, `order_items`, `blog_posts`.

`products` includes: slug, title, category, base_price, badge, chapter_ref, sanskrit, english_meaning, telugu_meaning, stock_limit (nullable), sort_order. Hand-Written items use stockLimit 50/30/15.

### Auth & roles
- Email/password auth via Supabase Auth.
- `user_roles` table with `role` enum-like check (`customer`/`admin`/`super_admin`).
- `has_role(_user_id, _role)` security-definer function used in all role checks (no recursion).
- Trigger creates a `profiles` row + a default `customer` role on signup.
- First admin assigned manually after your first signup (you'll insert into `user_roles` via the database tool).

### RLS policies
- Public read on `products`, `blog_posts`, `shipping_zones`, `sizes`, `materials`, `frames`, `reviews`.
- Users read/write their own `profiles`, `wishlists`, `orders`, `order_items`, can insert `reviews`.
- Admins (via `has_role`) get full write on `products`, `blog_posts`, and read/update on all `orders`.
- `user_roles`: users read their own; only admins can insert/update/delete.

### Seed data
All 18 products from the spec with their Sanskrit, chapter refs, prices, badges, and stock limits. Plus the 3 size options, 4 materials, 5 frames, 3 shipping zones, ~6 blog posts, a few starter reviews.

## Stripe checkout

Using Lovable's built-in Stripe payments integration:
1. After the plan is approved I'll run the eligibility check and enable built-in Stripe.
2. Create Stripe products mirroring the catalog (or use one-off price line items computed from cart — recommended so size/material/frame/custom items work cleanly).
3. Edge function `create-checkout` builds a Stripe Checkout Session from the cart and returns the URL.
4. Edge function `stripe-webhook` listens for `checkout.session.completed` and writes `orders` + `order_items` rows.
5. `/checkout/success` shows the Om confirmation screen and links to order history.

Test mode works immediately so you can place fake orders end-to-end. Live payments require Stripe account verification later.

## Mobile responsiveness

Single column under 768px, hamburger nav, cart drawer at 92% width, all touch targets ≥44px, sticky panels collapse to inline on small screens.

## Technical notes

- React Router routes added in `App.tsx`. Admin route guarded by a `RequireAdmin` wrapper that calls `has_role`.
- Cart state in a Zustand store, persisted to localStorage; on login it merges with a `cart_items` table (optional, can defer).
- React Query for all Supabase reads.
- Zod schemas for checkout form, custom builder, and admin forms.
- Pricing helper `calculatePrice(base, size, material, frame)` shared between product page, custom builder, cart, and Stripe session creation (server-side recompute prevents tampering).
- `ArtPreview` is a pure component driven by props so it's identical across product page, cart, and builder.

## Out of scope for Phase 1

- Blog post detail pages (index only).
- Per-user OAuth (Google/Apple) sign-in.
- Live Stripe verification (test mode only).
- AI-generated product imagery (using text-rendered previews instead).
- Multi-currency / i18n beyond the 3-language meaning toggle on Gita products.
