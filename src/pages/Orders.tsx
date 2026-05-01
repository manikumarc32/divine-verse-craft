import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/pricing";

interface Order { id: string; created_at: string; status: string; total: number; shipping_zone: string; }

export default function Orders() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id,created_at,status,total,shipping_zone").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as Order[]));
  }, [user]);

  if (loading) return <PageLayout><div className="container py-20 text-center">Loading…</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="font-serif text-3xl mb-8">Order History</h1>
        {orders.length === 0 ? (
          <div className="text-center py-16 text-brand-mid">
            <p className="text-5xl text-accent mb-4">ॐ</p>
            <p>No orders yet — your journey begins with one verse.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="card-spiritual p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-mono text-xs text-brand-mid">#{o.id.slice(0, 8)}</p>
                  <p className="font-serif">{new Date(o.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className="chip bg-primary/10 border-primary/30 text-primary capitalize">{o.status}</span>
                <span className="text-sm">{o.shipping_zone}</span>
                <p className="font-serif text-lg">{formatGBP(Number(o.total))}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
