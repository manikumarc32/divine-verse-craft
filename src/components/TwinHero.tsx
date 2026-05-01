import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

const GITA_VERSES = [
  { sans: "योगः कर्मसु कौशलम्", ref: "Bhagavad Gita 2.50" },
  { sans: "वासुदेवः सर्वम् इति", ref: "Bhagavad Gita 7.19" },
  { sans: "सर्वधर्मान् परित्यज्य", ref: "Bhagavad Gita 18.66" },
];

const RAMAYANA_VERSES = [
  { sans: "रघुकुल रीति सदा चली आई", ref: "Ramcharitmanas, Ayodhya Kand" },
  { sans: "राम नाम सत्य है", ref: "Ramayana" },
  { sans: "जय हनुमान ज्ञान गुन सागर", ref: "Hanuman Chalisa" },
];

export function TwinHero() {
  const { t } = useLanguage();
  const [gIdx, setGIdx] = useState(0);
  const [rIdx, setRIdx] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setGIdx((i) => (i + 1) % GITA_VERSES.length), 5500);
    const b = setInterval(() => setRIdx((i) => (i + 1) % RAMAYANA_VERSES.length), 5500);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <section className="bg-gradient-hero text-brand-cream relative overflow-hidden grain">
      <span className="absolute top-12 left-6 text-accent/15 text-7xl float-gentle pointer-events-none select-none hidden md:block">ॐ</span>
      <span className="absolute bottom-16 right-10 text-accent/10 text-9xl spin-slow pointer-events-none select-none hidden md:block">ॐ</span>

      <div className="container py-20 md:py-24 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent text-xs md:text-sm tracking-[0.4em] mb-6 text-center"
        >
          {t("hero.eyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl md:text-6xl leading-[1.1] mb-3 text-shadow-soft text-center"
        >
          {t("hero.title.a")}<br />
          <span className="text-accent italic">{t("hero.title.b")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-brand-cream/70 max-w-2xl mx-auto mb-12 text-center text-base md:text-lg"
        >
          {t("hero.tagline")}
        </motion.p>

        {/* Twin panels */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <EpicPanel
            label={t("hero.epic.gita.sub")}
            title={t("hero.epic.gita")}
            verse={GITA_VERSES[gIdx]}
            verseKey={`g-${gIdx}`}
            ctaLabel={t("hero.cta.gita")}
            ctaTo="/shop?epic=gita"
            accent="from-accent/20 to-transparent"
          />
          <EpicPanel
            label={t("hero.epic.ramayana.sub")}
            title={t("hero.epic.ramayana")}
            verse={RAMAYANA_VERSES[rIdx]}
            verseKey={`r-${rIdx}`}
            ctaLabel={t("hero.cta.ramayana")}
            ctaTo="/shop?epic=ramayana"
            accent="from-primary/25 to-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button asChild size="lg" className="bg-gradient-saffron text-primary-foreground border-0 h-12 px-8 shadow-elegant">
            <Link to="/shop">{t("hero.cta.shop")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-12 px-8">
            <Link to="/custom-builder">{t("hero.cta.custom")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function EpicPanel({
  label, title, verse, verseKey, ctaLabel, ctaTo, accent,
}: {
  label: string; title: string;
  verse: { sans: string; ref: string }; verseKey: string;
  ctaLabel: string; ctaTo: string; accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className={cn(
        "relative rounded-2xl border border-accent/20 bg-brand-dark/30 backdrop-blur-sm p-7 md:p-9 overflow-hidden",
        "hover:border-accent/40 transition-colors group",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60 pointer-events-none", accent)} />
      <div className="relative z-10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-accent/80 mb-2">{label}</p>
        <h3 className="font-serif text-2xl md:text-3xl text-brand-cream mb-5">{title}</h3>
        <div className="h-20 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={verseKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.55 }}
            >
              <p className="sanskrit text-lg md:text-xl text-brand-cream/90">{verse.sans}</p>
              <p className="text-[10px] tracking-widest uppercase text-accent/70 mt-2">{verse.ref}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="gold-divider-sm my-5" />
        <Link
          to={ctaTo}
          className="inline-flex items-center gap-2 text-accent text-sm tracking-wide hover:gap-3 transition-all"
        >
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
