import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { ProductCard, ProductSummary } from "@/components/ProductCard";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { MotionSection } from "@/components/MotionSection";
import { IndiaBanner } from "@/components/IndiaBanner";
import { TwinHero } from "@/components/TwinHero";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Star, Truck, Award, ShieldCheck, Undo2, Leaf } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const [gita, setGita] = useState<ProductSummary[]>([]);
  const [ramayana, setRamayana] = useState<ProductSummary[]>([]);
  const [portraits, setPortraits] = useState<ProductSummary[]>([]);

  useEffect(() => {
    document.title = "DivineVerse Art — Bhagavad Gita & Ramayana Wall Art";
    (async () => {
      const { data: g } = await supabase
        .from("products").select("*").eq("category", "gita_quote")
        .order("sort_order").limit(3);
      setGita((g ?? []) as unknown as ProductSummary[]);
      const { data: r } = await supabase
        .from("products").select("*")
        .in("category", ["ramayana_quote", "ramayana_scene", "hanuman_chalisa"])
        .order("sort_order").limit(3);
      setRamayana((r ?? []) as unknown as ProductSummary[]);
      const { data: p } = await supabase
        .from("products").select("*").eq("category", "god_portrait")
        .order("sort_order").limit(3);
      setPortraits((p ?? []) as unknown as ProductSummary[]);
    })();
  }, []);

  return (
    <PageLayout>
      <TwinHero />

      {/* Stats strip */}
      <section className="bg-brand-dark text-brand-cream border-b border-brand-cream/10">
        <div className="container py-8 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <Stat n="150+" l={t("stat.designs")} />
          <Stat n="4.8 ★" l={t("stat.rating")} />
          <Stat n="🇬🇧" l={t("stat.uk")} />
        </div>
      </section>

      {/* Featured Gita Quotes */}
      <MotionSection className="container py-20">
        <div className="text-center mb-12">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-5xl mb-2">{t("section.featured")}</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">{t("section.featured.sub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gita.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* Featured Ramayana Art */}
      <MotionSection className="bg-brand-cream/60 py-20 border-y border-accent/20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="sanskrit text-3xl text-accent">श्रीराम</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 mb-2">{t("section.ramayana")}</h2>
            <div className="gold-divider-sm mx-auto" />
            <p className="text-brand-mid mt-3">{t("section.ramayana.sub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ramayana.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/shop?epic=ramayana">View all Ramayana art →</Link>
            </Button>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-accent/15 py-16 border-y border-accent/30">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="chip bg-accent text-accent-foreground border-accent mb-4">
              <span>✦</span> Unique Feature
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Read in Your Language</h2>
            <p className="text-brand-mid mb-5">Every Gita quote can be ordered with the meaning printed in Sanskrit, Telugu, or English — without losing the original verse.</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-card border-border">संस्कृत Sanskrit</span>
              <span className="chip bg-card border-border telugu">తెలుగు Telugu</span>
              <span className="chip bg-card border-border">🇬🇧 English</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-xl p-6 shadow-lift border border-border"
          >
            <p className="text-xs uppercase tracking-widest text-accent mb-3">Karma Yoga · Ch 2.47</p>
            <p className="sanskrit text-xl mb-4">कर्मण्येवाधिकारस्ते मा फलेषु कदाचन</p>
            <div className="gold-divider-sm" />
            <p className="text-sm italic text-brand-mid mt-3">English: "You have the right to perform your duties, but never to the fruits of action."</p>
            <p className="text-sm italic text-brand-mid mt-2 telugu">తెలుగు: "మీకు మీ కర్తవ్యాన్ని నిర్వహించే హక్కు ఉంది, కానీ ఫలాలపై హక్కు లేదు."</p>
          </motion.div>
        </div>
      </MotionSection>

      {/* God Portraits */}
      <MotionSection className="container py-20">
        <div className="text-center mb-12">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-5xl mb-2">{t("section.portraits")}</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">{t("section.portraits.sub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portraits.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* Testimonials */}
      <MotionSection className="bg-brand-dark text-brand-cream py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-12">{t("section.testimonials")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", text: "The Karma Yoga print transformed my meditation corner. The Sanskrit calligraphy is stunning." },
              { name: "Arjun M.", text: "Ordered the hand-written Gayatri Mantra — heirloom quality, my parents were moved to tears." },
              { name: "Lakshmi R.", text: "Custom quote builder let me print my late grandmother's favourite shloka. Beyond grateful." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-brand-dark/60 border border-brand-cream/10 p-6 rounded-2xl"
              >
                <div className="flex gap-0.5 text-accent mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
                </div>
                <p className="text-brand-cream/80 italic mb-4">"{t.text}"</p>
                <p className="text-accent font-serif">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Trust badges */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { icon: Truck, label: "UK Printed" },
            { icon: Award, label: "Premium Quality" },
            { icon: ShieldCheck, label: "Secure Payment" },
            { icon: Undo2, label: "30-Day Returns" },
            { icon: Leaf, label: "Eco Options" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-brand-mid">
              <Icon className="h-7 w-7 text-primary" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <IndiaBanner />
    </PageLayout>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-accent">{n}</p>
      <p className="text-xs text-brand-cream/70 uppercase tracking-wider mt-1">{l}</p>
    </div>
  );
}
