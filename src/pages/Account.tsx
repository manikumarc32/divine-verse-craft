import { Link, Navigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Package, Heart, Settings, Shield, LogOut } from "lucide-react";

export default function Account() {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <PageLayout><div className="container py-20 text-center text-brand-mid">Loading…</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;

  const cards = [
    { to: "/account/orders", icon: Package, label: "Order History", desc: "Track and review your past orders" },
    { to: "/wishlist", icon: Heart, label: "Wishlist", desc: "Sacred art you've saved for later" },
    { to: "/account", icon: Settings, label: "Settings", desc: "Manage profile & preferences" },
  ];
  if (isAdmin) cards.push({ to: "/admin", icon: Shield, label: "Admin Dashboard", desc: "Manage products, orders & posts" });

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-3xl">Namaste, {user.email?.split("@")[0]}</h1>
            <p className="text-brand-mid mt-1">Manage your account and orders</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="card-spiritual p-6 group">
              <c.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="font-serif text-lg mb-1">{c.label}</h2>
              <p className="text-sm text-brand-mid">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
