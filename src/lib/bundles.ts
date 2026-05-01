import { supabase } from "@/integrations/supabase/client";

export interface BundleProduct {
  id: string;
  slug: string;
  title: string;
  base_price: number;
  sanskrit: string | null;
  english_meaning: string | null;
  chapter_ref: string | null;
  category: string;
}

export interface BundleWithItems {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bundle_price: number;
  badge: string | null;
  items: { product: BundleProduct; quantity: number }[];
  original_price: number;
  saving: number;
}

export async function fetchBundles(): Promise<BundleWithItems[]> {
  const { data: bundles } = await supabase
    .from("bundles")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (!bundles) return [];

  const { data: items } = await supabase
    .from("bundle_items")
    .select("bundle_id, quantity, products(id, slug, title, base_price, sanskrit, english_meaning, chapter_ref, category)")
    .order("sort_order");

  return bundles.map((b: any) => {
    const myItems = (items ?? []).filter((it: any) => it.bundle_id === b.id);
    const products = myItems.map((it: any) => ({
      product: it.products as BundleProduct,
      quantity: it.quantity,
    })).filter((it) => it.product);
    const original = products.reduce(
      (sum, it) => sum + Number(it.product.base_price) * it.quantity,
      0,
    );
    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      description: b.description,
      bundle_price: Number(b.bundle_price),
      badge: b.badge,
      items: products,
      original_price: original,
      saving: Math.max(0, original - Number(b.bundle_price)),
    };
  });
}
