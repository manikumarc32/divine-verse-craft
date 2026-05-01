import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";

export default function Privacy() {
  useEffect(() => { document.title = "Privacy Policy — DivineVerse Art"; }, []);

  return (
    <PageLayout>
      <article className="container max-w-[780px] py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Privacy Policy</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-sm text-brand-mid mt-3">Last updated: 1 May 2026</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-brand-mid leading-relaxed">
          <Section title="Who we are">
            DivineVerse Art ("we", "us") is an online retailer of sacred wall art, operated from the United Kingdom.
            For privacy questions email <a href="mailto:privacy@divineverseart.com" className="text-primary underline">privacy@divineverseart.com</a>.
          </Section>

          <Section title="Data we collect">
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong>Account:</strong> name, email, password (hashed), order history.</li>
              <li><strong>Orders:</strong> shipping address, phone (optional), order details.</li>
              <li><strong>Payments:</strong> processed by Stripe — we never store full card numbers.</li>
              <li><strong>Site usage:</strong> standard server logs (IP, user-agent, pages viewed).</li>
              <li><strong>Marketing:</strong> email address if you subscribe to our newsletter or India waitlist.</li>
            </ul>
          </Section>

          <Section title="Lawful basis (UK GDPR)">
            We process personal data on the basis of: (a) <em>contract</em> — to fulfil your orders;
            (b) <em>legitimate interests</em> — site security, fraud prevention, basic analytics;
            (c) <em>consent</em> — for marketing emails and non-essential cookies, which you can withdraw at any time.
          </Section>

          <Section title="Sharing">
            We share data only with the providers necessary to run the store: Stripe (payments), our shipping carriers,
            our backend host, and our email provider. We never sell your data.
          </Section>

          <Section title="Your rights">
            Under UK GDPR you may request access to, correction of, or deletion of your personal data, object to
            processing, withdraw consent, or lodge a complaint with the UK Information Commissioner's Office (ICO).
            Email <a href="mailto:privacy@divineverseart.com" className="text-primary underline">privacy@divineverseart.com</a> to exercise these rights.
          </Section>

          <Section title="Retention">
            Order records are retained for 6 years to comply with HMRC requirements. Marketing emails are kept until
            you unsubscribe. Account data is deleted within 30 days of account closure.
          </Section>

          <Section title="Cookies">
            Essential cookies are used to keep you signed in and to remember your cart. Analytics cookies are loaded
            only after you accept them.
          </Section>

          <Section title="International transfers">
            Some providers may process data outside the UK. Where this happens we rely on UK-recognised safeguards
            such as the International Data Transfer Addendum.
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
