import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";

export default function Terms() {
  useEffect(() => { document.title = "Terms & Conditions — DivineVerse Art"; }, []);

  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Terms & Conditions</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-sm text-brand-mid mt-3">Last updated: 1 May 2026</p>
        </div>

        <div className="space-y-6 text-brand-mid leading-relaxed">
          <Section title="1. About these terms">
            These terms govern your use of divineverseart.com and any orders you place with us. By using the site or
            placing an order, you agree to these terms. We are a UK-based retailer.
          </Section>

          <Section title="2. Orders & contract">
            Your order is an offer to buy. A binding contract is formed only when we send an order confirmation email.
            We may refuse or cancel an order if a product is unavailable, mispriced, or where fraud is suspected.
          </Section>

          <Section title="3. Pricing & payment">
            All prices are shown in pounds sterling (£) and include UK VAT where applicable. Payment is taken at
            checkout via Stripe. We do not store full card details.
          </Section>

          <Section title="4. Delivery">
            Delivery times are estimates: UK 3–5 business days, EU 5–10 business days, Worldwide 10–15 business days.
            Risk passes to you when the parcel is delivered. Customs duties on international orders are your responsibility.
          </Section>

          <Section title="5. Returns">
            Under the UK Consumer Contracts Regulations you have 14 days from delivery to cancel. We voluntarily extend
            this to 30 days — see the Refunds & Returns page for details. Custom-made art is non-returnable except
            where faulty.
          </Section>

          <Section title="6. Intellectual property">
            All artwork, layouts, photography, and copy on this site are owned by DivineVerse Art or our scholarly
            partners. You may not reproduce, resell, or redistribute our designs without written permission. Sanskrit
            verses themselves are part of the public sacred tradition.
          </Section>

          <Section title="7. Limitation of liability">
            Nothing in these terms limits liability for death, personal injury, or fraud. To the fullest extent
            permitted by law, our liability for any single order is limited to the price paid for that order.
          </Section>

          <Section title="8. Governing law">
            These terms are governed by the laws of England and Wales. Disputes are subject to the exclusive
            jurisdiction of the courts of England and Wales.
          </Section>

          <Section title="9. Contact">
            Questions? Email <a href="mailto:hello@divineverseart.com" className="text-primary underline">hello@divineverseart.com</a>.
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
