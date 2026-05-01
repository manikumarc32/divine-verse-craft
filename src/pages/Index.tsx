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
import {
  Star,
  Truck,
  Award,
  ShieldCheck,
  Undo2,
  Leaf,
  MapPin,
  BookOpenCheck,
  Sparkles,
  Search,
  Palette,
  Languages as LangIcon,
  PackageCheck,
} from "lucide-react";

const WHY = [
  {
    icon: MapPin,
    title: "Crafted in the UK",
    body: "Printed and packed by hand in Surrey on archival giclée paper or pure cotton canvas.",
  },
  {
    icon: BookOpenCheck,
    title: "Authentic verses",
    body: "Every Sanskrit shloka is sourced from verified Vedic editions, with chapter & verse referenced on the back.",
  },
  {
    icon: Sparkles,
    title: "Made to last 100 years",
    body: "Pigment inks rated for a century of fade-resistance, signed and numbered editions.",
  },
];

const STEPS = [
  { icon: Search, title: "Choose a verse or scene", body: "Browse 150+ designs or build your own from any shloka." },
  { icon: Palette, title: "Pick size, material & frame", body: "From A4 prints to museum-grade A2 canvas in oak or black." },
  { icon: LangIcon, title: "Add your language", body: "Sanskrit original with Telugu, Hindi, Tamil or English meaning." },
  { icon: PackageCheck, title: "Printed in 2–3 days", body: "Tracked UK delivery in 3–5 days, worldwide shipping available." },
];

const PRESS = ["Hindustan Times", "Eastern Eye", "Asian Voice", "The Spiritual Times", "Yoga Magazine UK"];

const TESTIMONIALS = [
  { name: "Priya S.", city: "London, UK", text: "The Karma Yoga print transformed my meditation corner. The Sanskrit calligraphy is stunning." },
  { name: "Arjun M.", city: "Manchester, UK", text: "Ordered the hand-written Gayatri Mantra — heirloom quality, my parents were moved to tears." },
  { name: "Lakshmi R.", city: "Edinburgh, UK", text: "Custom quote builder let me print my late grandmother's favourite shloka. Beyond grateful." },
  { name: "Rohan K.", city: "New Jersey, USA", text: "Ram Darbar canvas is the centrepiece of our pooja room. Colours are deep, paper feels like silk." },
  { name: "Anjali V.", city: "Toronto, CA", text: "I gifted the Hanuman Chalisa scroll to my dad on his 70th — he framed it the same evening." },
  { name: "Meera T.", city: "Birmingham, UK", text: "Telugu meaning printed beside the Sanskrit was perfect for my mum. Already ordered three more." },
];

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

      {/* Why DivineVerse — three pillars */}
      <MotionSection className="container py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">{t("section.why")}</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">{t("section.why.sub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-spiritual p-6 text-center"
            >
              <w.icon className="h-9 w-9 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2">{w.title}</h3>
              <p className="text-sm text-brand-mid leading-relaxed">{w.body}</p>
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* Featured Gita Quotes */}
      <MotionSection className="container pb-20">
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

      {/* How it works */}
      <MotionSection className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">{t("section.how")}</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">{t("section.how.sub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative card-spiritual p-6"
            >
              <span className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-gradient-saffron text-primary-foreground font-serif font-semibold flex items-center justify-center shadow-lift">
                {i + 1}
              </span>
              <s.icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-serif text-lg mb-1">{s.title}</h3>
              <p className="text-sm text-brand-mid leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* God Portraits */}
      <MotionSection className="container pb-20">
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
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl mb-3">{t("section.testimonials")}</h2>
            <div className="flex items-center justify-center gap-1 text-accent mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent" />)}
            </div>
            <p className="text-brand-cream/70 text-sm">{t("section.testimonials.sub")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tst, i) => (
              <motion.div
                key={tst.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="bg-brand-dark/60 border border-brand-cream/10 p-6 rounded-2xl"
              >
                <div className="flex gap-0.5 text-accent mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
                </div>
                <p className="text-brand-cream/80 italic mb-4">"{tst.text}"</p>
                <p className="text-accent font-serif">— {tst.name}</p>
                <p className="text-xs text-brand-cream/50 mt-1">{tst.city} · verified buyer</p>
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

      {/* As featured in */}
      <section className="border-t border-border bg-muted/30 py-8">
        <div className="container text-center">
          <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">
            {t("section.featured_in")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-brand-mid/80 font-serif italic">
            {PRESS.map((p, i) => (
              <span key={p} className="flex items-center gap-8">
                {p}
                {i < PRESS.length - 1 && <span className="text-accent/40 hidden md:inline">✦</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <MotionSection className="bg-gradient-saffron text-primary-foreground py-16">
        <div className="container text-center max-w-2xl">
          <LotusIcon className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="font-serif text-3xl md:text-5xl mb-3">{t("section.cta.title")}</h2>
          <p className="text-primary-foreground/90 mb-8">{t("section.cta.sub")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-brand-dark text-brand-cream hover:bg-brand-dark/90 border-0 h-12 px-8">
              <Link to="/shop">Shop the Gita</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary h-12 px-8">
              <Link to="/custom-builder">Build your own</Link>
            </Button>
          </div>
        </div>
      </MotionSection>

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
