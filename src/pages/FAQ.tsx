import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SECTIONS = [
  {
    title: "Orders & shipping",
    items: [
      ["How long does delivery take?", "UK: 3–5 business days · EU: 5–10 days · Worldwide: 10–15 days. FREE shipping on UK orders over £50."],
      ["Can I track my order?", "Yes — once dispatched you'll receive a tracking link by email."],
      ["Do you ship internationally?", "Yes, worldwide. Customs duties may apply outside the UK and EU."],
    ],
  },
  {
    title: "Returns & refunds",
    items: [
      ["What's your returns policy?", "30 days from delivery. Item must be unused and in original packaging."],
      ["Can I return a custom order?", "Custom Quote Builder pieces and hand-written calligraphy are non-returnable unless faulty."],
      ["When do I get my refund?", "Within 5 business days of receiving the returned item, refunded to the original card."],
    ],
  },
  {
    title: "Sizes & materials",
    items: [
      ["What sizes do you offer?", "A4 (21×29.7cm), A3 (29.7×42cm), A2 (42×59.4cm). See our /size-guide."],
      ["Which materials are available?", "Poster Paper 200gsm, Canvas 340gsm, Cloth Tapestry, and Eco Paper 180gsm."],
      ["Do you offer frames?", "Yes — Black, White, Wood, and Gold finishes. Or order frame-free."],
    ],
  },
  {
    title: "Custom & languages",
    items: [
      ["Can I print my own verse?", "Yes — use our Custom Quote Builder to choose verse, font, background, and frame."],
      ["Do you offer Telugu / Hindi / Tamil?", "Telugu meanings are available now on most Gita prints. Hindi & Tamil launch with our India site — join the /india waitlist."],
      ["Are translations accurate?", "Translations are reviewed by Sanskrit and Telugu scholars. We welcome corrections from our community."],
    ],
  },
];

export default function FAQ() {
  useEffect(() => { document.title = "FAQ — DivineVerse Art"; }, []);

  return (
    <PageLayout>
      <div className="container max-w-3xl py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Frequently Asked Questions</h1>
          <div className="gold-divider-sm mx-auto" />
        </div>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-2xl mb-4">{s.title}</h2>
              <Accordion type="single" collapsible className="card-spiritual divide-y divide-border">
                {s.items.map(([q, a]) => (
                  <AccordionItem key={q} value={q} className="border-0 px-5">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">{q}</AccordionTrigger>
                    <AccordionContent className="text-brand-mid leading-relaxed">{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
