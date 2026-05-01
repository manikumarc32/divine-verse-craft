import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";

export default function AboutGita() {
  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">About the Bhagavad Gita</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="sanskrit text-lg text-accent mt-4">श्रीमद्भगवद्गीता</p>
        </div>

        <Section title="What is the Gita">
          The Bhagavad Gita ("The Song of God") is a 700-verse dialogue between Prince Arjuna and the divine Lord Krishna,
          set on the battlefield of Kurukshetra. Composed roughly 2,000-2,500 years ago and embedded within the great epic
          Mahabharata, the Gita has guided seekers across every continent for two millennia.
        </Section>

        <Section title="Core Teachings">
          At the heart of the Gita lie three intertwined paths: <em>karma yoga</em> (selfless action),
          <em> bhakti yoga</em> (loving devotion), and <em>jnana yoga</em> (the wisdom of the eternal Self).
          Krishna teaches Arjuna — and through him, all of us — to act without attachment to results, to see the divine
          in every being, and to recognize the imperishable soul that animates all life.
        </Section>

        <Section title="Why Sacred Wall Art">
          The verses of the Gita were never meant to live only in libraries. For thousands of years, devotees have
          inscribed shlokas on temple walls, palace beams, and household shrines as a daily reminder of dharma. Bringing
          a single verse into your home is a quiet, continuous act of remembrance — wisdom you encounter every time you
          pass by.
        </Section>

        <Section title="Our Mission">
          DivineVerse Art exists to translate this living tradition into pieces that belong in modern homes. Every print
          is designed in collaboration with Sanskrit scholars and traditional calligraphers, then produced in the UK on
          archival materials. We are not just selling decor — we are stewarding a centuries-old conversation.
        </Section>

        <Section title="Authentic Sources">
          Our Sanskrit verses and translations are drawn from established editions of the Bhagavad Gita including the
          translations of Eknath Easwaran, Swami Prabhupada, and Swami Sivananda. Telugu meanings are reviewed by native
          Telugu-speaking scholars. We welcome corrections from our community of devotees.
        </Section>

        <p className="text-center sanskrit text-lg text-accent mt-12">ॐ शान्तिः शान्तिः शान्तिः ॐ</p>
      </article>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl mb-3">{title}</h2>
      <p className="text-brand-mid leading-relaxed">{children}</p>
    </section>
  );
}
