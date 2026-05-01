import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { MotionSection } from "@/components/MotionSection";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function Ramayana() {
  const { lang, t } = useLanguage();
  const isTe = lang === "te";

  useEffect(() => {
    document.title = "About the Ramayana — DivineVerse Art";
  }, []);

  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className={cn("font-serif text-4xl md:text-5xl mb-2", isTe && "telugu")}>
            {t("ram.title")}
          </h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="sanskrit text-lg text-accent mt-4">श्रीमद्रामायणम्</p>
        </div>

        <MotionSection>
          <Section title={t("ram.what.title")} isTe={isTe}>
            {t("ram.what.body")}
          </Section>
        </MotionSection>

        <MotionSection delay={0.05}>
          <Section title={t("ram.kandas.title")} isTe={isTe}>
            {t("ram.kandas.body")}
          </Section>
        </MotionSection>

        {!isTe && (
          <MotionSection delay={0.08}>
            <div className="mb-10 grid sm:grid-cols-2 gap-3">
              {[
                ["Bala Kand", "Childhood of Rama"],
                ["Ayodhya Kand", "Exile begins"],
                ["Aranya Kand", "The forest, Sita's abduction"],
                ["Kishkindha Kand", "Alliance with Hanuman & Sugriva"],
                ["Sundara Kand", "Hanuman's leap to Lanka"],
                ["Yuddha Kand", "The great battle"],
                ["Uttara Kand", "Return to Ayodhya"],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-serif text-primary">{name}</p>
                  <p className="text-sm text-brand-mid mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </MotionSection>
        )}

        <MotionSection delay={0.12}>
          <Section title={t("ram.chars.title")} isTe={isTe}>
            {t("ram.chars.body")}
          </Section>
        </MotionSection>

        <MotionSection delay={0.16}>
          <Section title={t("about.mission.title")} isTe={isTe}>
            {t("ram.mission.body")}
          </Section>
        </MotionSection>

        <MotionSection delay={0.2}>
          <Link
            to="/about-gita"
            className="block rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center hover:bg-accent/20 transition-colors mt-10 group"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">The Other Great Epic</p>
            <p className="font-serif text-2xl text-brand-dark mb-1 group-hover:text-primary transition-colors">Read about the Bhagavad Gita →</p>
            <p className="text-sm text-brand-mid">The wisdom of Krishna — Karma, Bhakti, and Jnana yoga.</p>
          </Link>
        </MotionSection>

        <p className="text-center sanskrit text-lg text-accent mt-12">
          ॐ श्रीराम जय राम जय जय राम ॐ
        </p>
      </article>
    </PageLayout>
  );
}

function Section({ title, children, isTe }: { title: string; children: React.ReactNode; isTe: boolean }) {
  return (
    <section className="mb-10">
      <h2 className={cn("font-serif text-2xl mb-3", isTe && "telugu")}>{title}</h2>
      <p className={cn("text-brand-mid leading-relaxed", isTe && "telugu")}>{children}</p>
    </section>
  );
}
