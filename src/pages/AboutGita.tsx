import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { MotionSection } from "@/components/MotionSection";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function AboutGita() {
  const { lang, t } = useLanguage();
  const isTe = lang === "te";

  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className={cn("font-serif text-4xl md:text-5xl mb-2", isTe && "telugu")}>
            {t("about.title")}
          </h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="sanskrit text-lg text-accent mt-4">श्रीमद्भगवद्गीता</p>
        </div>

        <MotionSection>
          <Section title={t("about.what.title")} isTe={isTe}>
            {t("about.what.body")}
          </Section>
        </MotionSection>

        <MotionSection delay={0.05}>
          <Section title={t("about.teach.title")} isTe={isTe}>
            {t("about.teach.body")}
          </Section>
        </MotionSection>

        <MotionSection delay={0.1}>
          <Section title={t("about.mission.title")} isTe={isTe}>
            {t("about.mission.body")}
          </Section>
        </MotionSection>

        {!isTe && (
          <MotionSection delay={0.15}>
            <Section title="Authentic Sources" isTe={false}>
              Our Sanskrit verses and translations are drawn from established editions of the Bhagavad Gita including the
              translations of Eknath Easwaran, Swami Prabhupada, and Swami Sivananda. Telugu meanings are reviewed by
              native Telugu-speaking scholars. We welcome corrections from our community of devotees.
            </Section>
          </MotionSection>
        )}

        <p className="text-center sanskrit text-lg text-accent mt-12">ॐ शान्तिः शान्तिः शान्तिः ॐ</p>
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
