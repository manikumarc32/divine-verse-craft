# Backup Plan — Pre-Transfer Restore Point

Goal: produce a downloadable archive containing **everything you'd need to rebuild this project** if the transfer goes wrong.

## What gets backed up

### 1. Database (all tables → CSV + JSON)
Every table in your backend exported as both CSV (easy to read in Excel) and JSON (easy to re-import):

- `products`, `bundles`, `bundle_items`
- `orders`, `order_items`
- `profiles`, `user_roles`
- `reviews`, `wishlists`
- `blog_posts`
- `frames`, `materials`, `sizes`, `shipping_zones`
- `contact_messages`, `newsletter_subscribers`, `india_signups`
- `custom_quote_drafts`
- `email_send_log`, `email_send_state`, `email_unsubscribe_tokens`, `suppressed_emails`

Auth users (`auth.users`) cannot be exported via SQL — Supabase keeps password hashes private. A list of user emails + IDs + roles will be included so you can re-invite them if needed.

### 2. Database schema
- Full SQL dump of table definitions, RLS policies, functions, triggers, enums
- Lets you recreate the exact same database structure on a fresh project

### 3. Storage buckets (file inventory)
- List of all files in `product-images`, `reference-backgrounds`, `custom-uploads`, `digital-bonuses` with public URLs where applicable
- Note: actual file *contents* in private buckets can't be bulk-downloaded from here — I'll include a script you can run later if needed

### 4. Configuration snapshot
- `supabase/config.toml`
- List of edge functions deployed
- List of secret **names** (values stay hidden — you'll re-enter them on the new account: Stripe, Prodigi, etc.)
- `.env` variable names

### 5. Codebase
- Already in your Lovable project + GitHub (if connected). I'll remind you to download the codebase ZIP from the Code Editor as a final safety copy.

## Output

Single zip file at `/mnt/documents/divine-verse-craft-backup-{date}.zip` containing:
```
backup/
  data/
    products.csv, products.json
    orders.csv, orders.json
    ... (one pair per table)
    auth-users-list.csv
  schema/
    schema.sql
    rls-policies.sql
    functions.sql
  storage/
    bucket-inventory.json
  config/
    supabase-config.toml
    edge-functions.txt
    secret-names.txt
    env-vars.txt
  README.md  (restore instructions)
```

## Restore instructions (included in README)

If the transfer fails, on a fresh Lovable project you would:
1. Run `schema.sql` to recreate tables
2. Re-add secrets (names listed in `secret-names.txt`)
3. Bulk-import CSVs back into tables
4. Re-invite users from `auth-users-list.csv`
5. Re-upload storage files

## Not included / limitations

- **Auth user passwords** — never exportable; users would need to reset
- **Stripe/Prodigi data** — lives in those services, not in your DB
- **Private storage file contents** — inventory only; bulk download needs a separate script

Approve and I'll generate the zip.