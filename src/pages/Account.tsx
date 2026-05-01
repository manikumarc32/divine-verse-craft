import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Heart, Settings, Shield, LogOut, KeyRound, Trash2 } from "lucide-react";

type Factor = { id: string; friendly_name?: string | null; status: string };

export default function Account() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [factors, setFactors] = useState<Factor[]>([]);
  const [enrolling, setEnrolling] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadFactors() {
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp ?? []) as Factor[]);
  }

  useEffect(() => { if (user) loadFactors(); }, [user]);

  if (loading) return <PageLayout><div className="container py-20 text-center text-brand-mid">Loading…</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;

  async function startEnroll() {
    setBusy(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setBusy(false);
    if (error || !data) return toast.error(error?.message ?? "Could not start enrollment");
    setEnrolling({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrolling) return;
    setBusy(true);
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: enrolling.factorId });
    if (chErr || !ch) { setBusy(false); return toast.error(chErr?.message ?? "Challenge failed"); }
    const { error } = await supabase.auth.mfa.verify({ factorId: enrolling.factorId, challengeId: ch.id, code: code.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Two-factor authentication enabled");
    setEnrolling(null);
    setCode("");
    loadFactors();
  }

  async function unenroll(factorId: string) {
    if (!confirm("Disable two-factor authentication?")) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) return toast.error(error.message);
    toast.success("Two-factor authentication disabled");
    loadFactors();
  }

  const cards = [
    { to: "/account/orders", icon: Package, label: "Order History", desc: "Track and review your past orders" },
    { to: "/wishlist", icon: Heart, label: "Wishlist", desc: "Sacred art you've saved for later" },
    { to: "/account", icon: Settings, label: "Settings", desc: "Manage profile & preferences" },
  ];
  if (isAdmin) cards.push({ to: "/admin", icon: Shield, label: "Admin Dashboard", desc: "Manage products, orders & posts" });

  const verified = factors.filter((f) => f.status === "verified");

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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="card-spiritual p-6 group">
              <c.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="font-serif text-lg mb-1">{c.label}</h2>
              <p className="text-sm text-brand-mid">{c.desc}</p>
            </Link>
          ))}
        </div>

        {/* Security / MFA */}
        <section className="card-spiritual p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-xl">Security</h2>
          </div>
          <p className="text-sm text-brand-mid mb-5">
            Add two-factor authentication for an extra layer of protection — required when signing in.
          </p>

          {verified.length > 0 ? (
            <div className="space-y-3">
              {verified.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-sm">Authenticator app</p>
                    <p className="text-xs text-brand-mid">{f.friendly_name || "TOTP"} · enabled</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => unenroll(f.id)}>
                    <Trash2 className="h-4 w-4 mr-1.5" />Disable
                  </Button>
                </div>
              ))}
            </div>
          ) : enrolling ? (
            <form onSubmit={verifyEnroll} className="space-y-4">
              <p className="text-sm">Scan this QR code in Google Authenticator, 1Password, Authy, etc.:</p>
              <div className="flex justify-center bg-white p-4 rounded-lg border border-border">
                <img src={enrolling.qr} alt="MFA QR code" className="h-44 w-44" />
              </div>
              <p className="text-xs text-brand-mid text-center break-all">
                Or enter this secret manually: <code className="font-mono">{enrolling.secret}</code>
              </p>
              <div>
                <Label>6-digit code from your app</Label>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1.5 tracking-widest text-center text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setEnrolling(null); setCode(""); }}>Cancel</Button>
                <Button type="submit" disabled={busy || code.length !== 6} className="bg-gradient-saffron text-primary-foreground border-0 flex-1">
                  {busy ? "Verifying…" : "Verify & enable"}
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={startEnroll} disabled={busy} className="bg-gradient-saffron text-primary-foreground border-0">
              {busy ? "Setting up…" : "Enable two-factor authentication"}
            </Button>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
