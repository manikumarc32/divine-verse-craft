import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Printer, Truck, Wallet, Languages } from "lucide-react";
import { checkAntiBot, markSubmitted, honeypotClass } from "@/lib/antiBot";

const PRICES = [
  { item: "A4 Poster", price: "₹499" },
  { item: "A3 Poster", price: "₹749" },
  { item: "A4 Canvas", price: "₹1,299" },
  { item: "A3 Canvas", price: "₹1,799" },
  { item: "Premium A2", price: "₹4,999" },
];

const FEATURES = [
  { icon: Printer, title: "Local printing", desc: "Printed in India for faster delivery and lower cost." },
  { icon: Truck, title: "Fast delivery", desc: "Pan-India shipping in 3–7 business days." },
  { icon: Wallet, title: "UPI payments", desc: "Pay seamlessly with UPI, cards, or net-banking." },
  { icon: Languages, title: "Telugu · Hindi · Tamil", desc: "Sanskrit verses with regional translations." },
];

const emailSchema = z.string().trim().email("Enter a valid email").max(320);

export default function India() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [hp, setHp] = useState("");
  const mountedAt = useRef(Date.now());

  useEffect(() => { document.title = "Coming Soon to India — DivineVerse Art"; }, []);

  async function notify(e: React.FormEvent) {
    e.preventDefault();
    const guard = checkAntiBot({ honeypot: hp, mountedAt: mountedAt.current, formKey: "india_waitlist" });
    if (guard.ok === false) {
      if (!guard.silent) toast.error(guard.reason);
      return;
    }
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    const { error } = await supabase.from("india_signups").insert({ email: parsed.data });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setSigned(true);
        return toast.success("You're already on the waitlist 🙏");
      }
      return toast.error(error.message);
    }
    markSubmitted("india_waitlist");
    setSigned(true);
    setEmail("");
    toast.success("Added to the India waitlist! 🇮🇳");
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-hero text-brand-cream relative overflow-hidden grain">
        <div className="container py-20 md:py-28 text-center relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl mb-6"
          >
            🇮🇳
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl leading-tight mb-4"
          >
            DivineVerse Art<br />
            <span className="text-accent italic">Coming Soon to India</span>
          </motion.h1>
          <p className="text-brand-cream/80 text-lg mb-8 max-w-xl mx-auto">
            Authentic Sanskrit verses with Telugu, Hindi, and Tamil meanings — printed locally in India for faster delivery and INR pricing.
          </p>

          <form onSubmit={notify} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="company"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className={honeypotClass}
            />
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting || signed}
              className="bg-brand-dark/40 border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/40 h-12"
            />
            <Button
              type="submit"
              disabled={submitting || signed}
              className="bg-gradient-saffron text-primary-foreground border-0 h-12 px-6 shrink-0"
            >
              {signed ? "✓ You're in" : submitting ? "…" : "Notify Me"}
            </Button>
          </form>
          <p className="text-xs text-brand-cream/60 mt-3">No spam. We'll only email when India launch is live.</p>
        </div>
      </section>

      {/* INR pricing */}
      <section className="container py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Indian Pricing Preview</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-sm text-brand-mid mt-3 italic">
            Prices shown in ₹ (INR) — checkout in INR launches with the India site.
          </p>
        </div>
        <div className="card-spiritual overflow-hidden">
          <table className="w-full">
            <tbody>
              {PRICES.map((p, i) => (
                <tr key={p.item} className={i > 0 ? "border-t border-border" : ""}>
                  <td className="p-4 font-serif">{p.item}</td>
                  <td className="p-4 text-right font-serif text-primary text-lg">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center mt-6 text-brand-mid">
          🚚 <strong className="text-foreground">Free delivery</strong> across India on orders above ₹1,999.
        </p>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-16 border-y border-border">
        <div className="container">
          <h2 className="font-serif text-3xl text-center mb-10">Built for India</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-spiritual p-6 text-center"
              >
                <f.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-serif text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-brand-mid">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
