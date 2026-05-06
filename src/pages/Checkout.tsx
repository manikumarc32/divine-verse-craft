import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/pricing";
import { ArtPreview } from "@/components/ArtPreview";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

const ZONES = [
  { code: "UK", flag: "🇬🇧", label: "United Kingdom", price: 3.99, free: 50 },
  { code: "EU", flag: "🇪🇺", label: "Europe", price: 7.99, free: 75 },
  { code: "WORLD", flag: "🌍", label: "Rest of World", price: 12.99, free: 100 },
];

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  address_line1: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postcode: z.string().trim().min(1).max(20),
});

export default function Checkout() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [zone, setZone] = useState("UK");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address_line1: "", city: "", postcode: "" });

  useEffect(() => {
    document.title = "Checkout — DivineVerse Art";
    if (user?.email) setForm((f) => ({ ...f, email: user.email ?? "" }));
  }, [user]);

  if (cart.items.length === 0) {
    return (
      <PageLayout>
        <div className="container py-20 text-center">
          <p className="text-6xl text-accent mb-4">ॐ</p>
          <h1 className="font-serif text-2xl mb-3">Your cart is empty</h1>
          <Button onClick={() => navigate("/shop")} className="bg-gradient-saffron text-primary-foreground border-0">Browse Shop</Button>
        </div>
      </PageLayout>
    );
  }

  const subtotal = cart.subtotal();
  const z = ZONES.find((zz) => zz.code === zone)!;
  const shipping = subtotal >= z.free ? 0 : z.price;
  const total = subtotal + shipping;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user?.id ?? null,
        email: form.email,
        full_name: form.full_name,
        phone: form.phone,
        address_line1: form.address_line1,
        city: form.city,
        postcode: form.postcode,
        country: zone === "UK" ? "GB" : zone === "EU" ? "EU" : "ROW",
        shipping_zone: zone,
        subtotal, shipping_cost: shipping, total,
        status: "paid", // mock — no real Stripe yet
      }).select().single();
      if (error) throw error;

      const items = cart.items.map((i) => ({
        order_id: order.id,
        product_id: i.productId ?? null,
        product_title: i.title,
        is_custom: !!i.isCustom,
        custom_data: i.customData ?? null,
        size_code: i.size,
        material_code: i.material,
        frame_code: i.frame,
        language_code: i.language,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        line_total: i.unitPrice * i.quantity,
      }));
      const { error: itErr } = await supabase.from("order_items").insert(items);
      if (itErr) throw itErr;

      // Decrement stock for items linked to a product (mock checkout — real Stripe webhook would do this)
      const productItems = cart.items.filter((i) => !!i.productId);
      if (productItems.length > 0) {
        const ids = Array.from(new Set(productItems.map((i) => i.productId!)));
        const { data: stocked } = await supabase
          .from("products")
          .select("id, stock_limit, sold_count")
          .in("id", ids);
        for (const item of productItems) {
          const p = stocked?.find((x: any) => x.id === item.productId);
          if (!p || p.stock_limit == null) continue;
          const newSold = (p.sold_count ?? 0) + item.quantity;
          await supabase
            .from("products")
            .update({
              sold_count: newSold,
              is_active: newSold < p.stock_limit,
            })
            .eq("id", item.productId);
        }
      }

      // Send branded order confirmation email (non-blocking).
      // TODO: when real Stripe webhook lands, move this trigger into the webhook
      // handler so retries are server-driven; idempotencyKey already covers that.
      try {
        const firstName = form.full_name.trim().split(/\s+/)[0] || undefined;
        const orderShortId = order.id.slice(0, 6).toUpperCase();
        const orderDate = new Date(order.created_at).toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        });
        const eta =
          zone === "UK" ? "3–5 working days (UK)"
          : zone === "EU" ? "5–8 working days (Europe)"
          : "7–14 working days (Rest of World)";
        const addressLines = [
          form.full_name,
          form.address_line1,
          form.city,
          form.postcode,
          zone === "UK" ? "United Kingdom" : zone === "EU" ? "Europe" : "International",
        ].filter(Boolean);
        const emailItems = cart.items.map((i) => ({
          title: i.title,
          quantity: i.quantity,
          lineTotal: formatGBP(i.unitPrice * i.quantity),
          details: [i.size, i.material, i.frame, i.language].filter(Boolean).join(" · "),
        }));
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "order-confirmation",
            recipientEmail: form.email,
            idempotencyKey: `order-confirm-${order.id}`,
            templateData: {
              firstName,
              orderShortId,
              orderDate,
              items: emailItems,
              addressLines,
              subtotal: formatGBP(subtotal),
              shipping: shipping === 0 ? "FREE" : formatGBP(shipping),
              total: formatGBP(total),
              estimatedDelivery: eta,
              viewOrderUrl: `${window.location.origin}/account/orders`,
            },
          },
        });
      } catch (e) {
        console.warn("order confirmation email enqueue failed", e);
      }

      // Submit to Prodigi for fulfilment (sandbox). Non-blocking — admin can retry from dashboard.
      // TODO: move into Stripe webhook once real payment flow is wired.
      try {
        await supabase.functions.invoke("submit-prodigi-order", {
          body: { order_id: order.id },
        });
      } catch (e) {
        console.warn("prodigi submission failed", e);
      }

      cart.clear();
      navigate(`/checkout/success?order=${order.id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Order failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <div className="container py-12 grid lg:grid-cols-[1fr,420px] gap-10">
        <form onSubmit={placeOrder} className="space-y-6">
          <h1 className="font-serif text-3xl">Checkout</h1>

          <fieldset className="space-y-4">
            <legend className="font-serif text-lg mb-2">Shipping details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" v={form.full_name} on={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Email" type="email" v={form.email} on={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone (optional)" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
              <Field label="Postcode" v={form.postcode} on={(v) => setForm({ ...form, postcode: v })} />
            </div>
            <Field label="Address" v={form.address_line1} on={(v) => setForm({ ...form, address_line1: v })} />
            <Field label="City" v={form.city} on={(v) => setForm({ ...form, city: v })} />
          </fieldset>

          <fieldset>
            <legend className="font-serif text-lg mb-3">Shipping zone</legend>
            <div className="grid sm:grid-cols-3 gap-3">
              {ZONES.map((zn) => (
                <button type="button" key={zn.code} onClick={() => setZone(zn.code)}
                  className={cn("p-4 rounded-xl border text-left transition-all", zone === zn.code ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/50")}>
                  <p className="text-2xl mb-1">{zn.flag}</p>
                  <p className="font-medium">{zn.label}</p>
                  <p className="text-sm text-brand-mid">{formatGBP(zn.price)} · FREE over {formatGBP(zn.free)}</p>
                </button>
              ))}
            </div>
          </fieldset>

          <Button type="submit" disabled={submitting} size="lg" className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
            {submitting ? "Processing…" : `Pay with Stripe 🔒 — ${formatGBP(total)}`}
          </Button>
          <p className="text-xs text-brand-mid text-center">Phase 1 demo: payment is simulated. No card is charged.</p>
        </form>

        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((i) => (
              <div key={i.id} className="flex gap-3 items-start text-sm">
                <div className="w-16 shrink-0">
                  <ArtPreview sanskrit={i.customData?.sanskrit ?? i.sanskrit} meaning={i.customData?.meaning ?? i.englishMeaning} size="sm" frame={i.frame} />
                </div>
                <div className="flex-1">
                  <p className="font-serif">{i.title} × {i.quantity}</p>
                  <p className="text-xs text-brand-mid">{i.size} · {i.material} · {i.frame}</p>
                </div>
                <p className="font-medium">{formatGBP(i.unitPrice * i.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="gold-divider" />
          <Row label="Subtotal" v={formatGBP(subtotal)} />
          <Row label="Shipping" v={shipping === 0 ? "FREE" : formatGBP(shipping)} />
          <div className="gold-divider" />
          <Row label="Total" v={formatGBP(total)} bold />
        </aside>
      </div>
    </PageLayout>
  );
}

function Field({ label, v, on, type = "text" }: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label className="text-sm text-brand-mid">{label}</Label>
      <Input type={type} value={v} onChange={(e) => on(e.target.value)} className="mt-1.5" />
    </div>
  );
}
function Row({ label, v, bold }: { label: string; v: string; bold?: boolean }) {
  return (
    <div className={cn("flex justify-between", bold && "font-serif text-lg")}>
      <span className={bold ? "" : "text-brand-mid"}>{label}</span><span>{v}</span>
    </div>
  );
}
