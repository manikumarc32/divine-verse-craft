import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";

export default function Refunds() {
  useEffect(() => { document.title = "Refunds & Returns — DivineVerse Art"; }, []);

  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Refunds & Returns</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">30-day satisfaction promise on all standard prints.</p>
        </div>

        <div className="space-y-6 text-brand-mid leading-relaxed">
          <Section title="Our 30-day return window">
            We accept returns within <strong className="text-foreground">30 days of delivery</strong>. The item must be
            unused, in its original packaging, and in the same condition you received it. Standard UK statutory rights
            also apply.
          </Section>

          <Section title="What you can return">
            All standard catalogue prints, frames, and bundle items.
          </Section>

          <Section title="What we cannot accept">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Custom Quote Builder orders (made-to-order with your chosen verse).</li>
              <li>Hand-written calligraphy commissioned for you.</li>
              <li>Items damaged through wear, framing changes, or improper handling after delivery.</li>
            </ul>
            Faulty or mis-printed items are always replaced or refunded in full.
          </Section>

          <Section title="How to start a return">
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Email <a href="mailto:returns@divineverseart.com" className="text-primary underline">returns@divineverseart.com</a> within 30 days, including your order number.</li>
              <li>We'll send a return address and instructions within 24 hours.</li>
              <li>Pack the item carefully and post it back. You pay return shipping unless the item was faulty.</li>
              <li>We refund within 5 business days of receiving and inspecting the item.</li>
            </ol>
          </Section>

          <Section title="Refund timing">
            Refunds are issued to your original payment method via Stripe. Banks typically show the refund within
            5–10 business days after we issue it.
          </Section>

          <Section title="Damaged in transit">
            Photograph the parcel and the damage and email us within 48 hours of delivery. We'll arrange a free
            replacement or full refund — no need to return the damaged item.
          </Section>
        </div>
      </article>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl mb-3 text-foreground">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
