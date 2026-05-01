import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/pricing";
import { toast } from "sonner";
import { Package, ShoppingBag, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    refresh();
  }, [isAdmin]);

  async function refresh() {
    const [{ data: p }, { data: o }, { data: bp }] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("published_at", { ascending: false }),
    ]);
    setProducts(p ?? []);
    setOrders(o ?? []);
    setPosts(bp ?? []);
    const revenue = (o ?? []).filter((x: any) => ["paid", "fulfilled", "shipped", "delivered"].includes(x.status))
      .reduce((s: number, x: any) => s + Number(x.total), 0);
    setStats({ revenue, orders: o?.length ?? 0, products: p?.length ?? 0, users: 0 });
  }

  if (loading) return <PageLayout><div className="container py-20 text-center">Loading…</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return (
    <PageLayout>
      <div className="container py-20 text-center">
        <p className="text-6xl text-accent mb-4">🛡️</p>
        <h1 className="font-serif text-3xl mb-2">Admin only</h1>
        <p className="text-brand-mid">You don't have admin access. Contact the store owner.</p>
      </div>
    </PageLayout>
  );

  async function updatePrice(id: string, base_price: number) {
    const { error } = await supabase.from("products").update({ base_price }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Price updated");
    refresh();
  }
  async function updateStock(id: string, stock_limit: number | null) {
    const { error } = await supabase.from("products").update({ stock_limit }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Stock limit updated");
    refresh();
  }
  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    refresh();
  }
  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    refresh();
  }
  async function newPost() {
    const title = prompt("Post title?"); if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const excerpt = prompt("Short excerpt?") ?? "";
    const category = prompt("Category?") ?? "Reflection";
    const { error } = await supabase.from("blog_posts").insert({ slug, title, excerpt, category, read_time_min: 5 });
    if (error) return toast.error(error.message);
    refresh();
  }

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="font-serif text-3xl mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={ShoppingBag} label="Revenue" value={formatGBP(stats.revenue)} />
          <StatCard icon={Package} label="Orders" value={String(stats.orders)} />
          <StatCard icon={BookOpen} label="Products" value={String(stats.products)} />
          <StatCard icon={Users} label="Posts" value={String(posts.length)} />
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="card-spiritual overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Base price</th>
                    <th className="p-3">Stock limit</th>
                    <th className="p-3">Sold</th>
                    <th className="p-3">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-3 font-serif">
                        <div className="flex items-center gap-2">
                          {p.title}
                          {p.category === "hand_written" && (
                            <span className="chip bg-purple-brand text-white border-transparent text-[10px] px-2 py-0.5">
                              Hand-Written
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 capitalize">{p.category.replace('_', ' ')}</td>
                      <td className="p-3">
                        <Input type="number" step="0.01" defaultValue={p.base_price}
                          onBlur={(e) => updatePrice(p.id, Number(e.target.value))} className="w-24 h-9" />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          defaultValue={p.stock_limit ?? ""}
                          placeholder="∞"
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            updateStock(p.id, v === "" ? null : Number(v));
                          }}
                          className="w-24 h-9"
                        />
                      </td>
                      <td className={cn("p-3 font-mono", p.sold_count > 0 && "text-primary font-semibold")}>
                        {p.sold_count ?? 0}
                      </td>
                      <td className="p-3">{p.is_active ? "✓" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="card-spiritual overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr><th className="p-3">#</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                      <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-3">{o.email}</td>
                      <td className="p-3">{formatGBP(Number(o.total))}</td>
                      <td className="p-3">
                        <Select defaultValue={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["pending","paid","fulfilled","shipped","delivered","cancelled","refunded"].map(s =>
                              <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-brand-mid">No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <Button onClick={newPost} className="bg-gradient-saffron text-primary-foreground border-0 mb-4">+ New Post</Button>
            <div className="card-spiritual divide-y divide-border">
              {posts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-serif">{p.title}</p>
                    <p className="text-xs text-brand-mid">{p.category} · {p.read_time_min} min</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => deletePost(p.id)}>Delete</Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="card-spiritual p-5">
      <Icon className="h-6 w-6 text-primary mb-3" />
      <p className="text-xs text-brand-mid uppercase tracking-wider">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
