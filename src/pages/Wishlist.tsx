import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ProductCard, ProductSummary } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Wishlist() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<ProductSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("wishlists").select("product_id, products(*)").eq("user_id", user.id)
      .then(({ data }) => {
        const products = (data ?? []).map((row: any) => row.products).filter(Boolean);
        setItems(products as ProductSummary[]);
      });
  }, [user]);

  if (loading) return <PageLayout><div className="container py-20 text-center">Loading…</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="font-serif text-3xl mb-8">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl text-accent mb-4">ॐ</p>
            <p className="text-brand-mid mb-6">Your wishlist is empty — save sacred art for later.</p>
            <Button asChild className="bg-gradient-saffron text-primary-foreground border-0"><Link to="/shop">Browse Shop</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
