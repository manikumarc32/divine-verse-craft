import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ArtPreview } from "@/components/ArtPreview";
import { ProductCard, ProductSummary } from "@/components/ProductCard";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Star, Truck, Award, ShieldCheck, Undo2, Leaf } from "lucide-react";

export default function Home() {
  const [gita, setGita] = useState<ProductSummary[]>([]);
  const [portraits, setPortraits] = useState<ProductSummary[]>([]);

  useEffect(() => {
    document.title = "DivineVerse Art — Sacred Wall Art From the Bhagavad Gita";
    (async () => {
      const { data: g } = await supabase
        .from("products").select("*").eq("category", "gita_quote")
        .order("sort_order").limit(3);
      setGita((g ?? []) as unknown as ProductSummary[]);
      const { data: p } = await supabase
        .from("products").select("*").eq("category", "god_portrait")
        .order("sort_order").limit(3);
      setPortraits((p ?? []) as unknown as ProductSummary[]);
    })();
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-hero text-brand-cream relative overflow-hidden">
        <div className="container py-20 md:py-28 text-center relative z-10">
          <p className="text-accent text-sm tracking-[0.3em] mb-4">ॐ &nbsp; SACRED WALL ART &nbsp; ॐ</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-2">
            Ancient Wisdom <span className="text-accent">For Modern Walls</span>
          </h1>
          <p className="sanskrit text-xl md:text-2xl italic text-brand-cream/80 mt-6 mb-8">
            "योगः कर्मसु कौशलम्"
          </p>
          <p className="text-brand-cream/70 max-w-xl mx-auto mb-10">
            Yoga is skill in action — Bhagavad Gita 2.50. Bring centuries of devotion onto your walls with verses, portraits, and hand-written calligraphy printed in the UK.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-saffron text-primary-foreground border-0 h-12 px-8">
              <Link to="/shop">Shop Wall Art</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-12 px-8">
              <Link to="/custom-builder">Custom Quote Builder</Link>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-14">
            <Stat n="150+" l="Sacred Designs" />
            <Stat n="4.8 ★" l="Customer Rating" />
            <Stat n="🇬🇧" l="UK Printed" />
          </div>
        </div>
      </section>

      {/* Featured Gita Quotes */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Featured Gita Quotes</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Timeless verses, beautifully framed for daily inspiration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gita.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Multilingual banner */}
      <section className="bg-accent/15 py-16 border-y border-accent/30">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="chip bg-accent text-accent-foreground border-accent mb-4">
              <span>✦</span> Unique Feature
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Read in Your Language</h2>
            <p className="text-brand-mid mb-5">Every Gita quote can be ordered with the meaning printed in Sanskrit, Telugu, or English — without losing the original verse.</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-card border-border">संस्कृत Sanskrit</span>
              <span className="chip bg-card border-border">తెలుగు Telugu</span>
              <span className="chip bg-card border-border">🇬🇧 English</span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-lift border border-border">
            <p className="text-xs uppercase tracking-widest text-accent mb-3">Karma Yoga · Ch 2.47</p>
            <p className="sanskrit text-xl mb-4">कर्मण्येवाधिकारस्ते मा फलेषु कदाचन</p>
            <div className="gold-divider-sm" />
            <p className="text-sm italic text-brand-mid mt-3">English: "You have the right to perform your duties, but never to the fruits of action."</p>
            <p className="text-sm italic text-brand-mid mt-2">తెలుగు: "మీకు మీ కర్తవ్యాన్ని నిర్వహించే హక్కు ఉంది, కాని ఫలాలపై హక్కు లేదు."</p>
          </div>
        </div>
      </section>

      {/* God Portraits */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Hindu God Portraits</h2>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Devotional art of beloved deities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portraits.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-dark text-brand-cream py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Words from Our Devotees</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", text: "The Karma Yoga print transformed my meditation corner. The Sanskrit calligraphy is stunning." },
              { name: "Arjun M.", text: "Ordered the hand-written Gayatri Mantra — heirloom quality, my parents were moved to tears." },
              { name: "Lakshmi R.", text: "Custom quote builder let me print my late grandmother's favourite shloka. Beyond grateful." },
            ].map((t) => (
              <div key={t.name} className="bg-brand-dark/60 border border-brand-cream/10 p-6 rounded-xl">
                <div className="flex gap-0.5 text-accent mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
                </div>
                <p className="text-brand-cream/80 italic mb-4">"{t.text}"</p>
                <p className="text-accent font-serif">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
