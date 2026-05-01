import { useEffect, useRef, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MessageSquare } from "lucide-react";
import { checkAntiBot, markSubmitted, honeypotClass } from "@/lib/antiBot";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Valid email required").max(320),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Tell us a bit more").max(4000),
});

export default function Contact() {
  useEffect(() => { document.title = "Contact — DivineVerse Art"; }, []);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hp, setHp] = useState("");
  const mountedAt = useRef(Date.now());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const guard = checkAntiBot({ honeypot: hp, mountedAt: mountedAt.current, formKey: "contact" });
    if (!guard.ok) {
      if (!guard.silent) toast.error(guard.reason);
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    markSubmitted("contact");
    toast.success("Message sent! We usually reply within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <PageLayout>
      <div className="container max-w-3xl py-16">
        <div className="text-center mb-10">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Get in touch</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">We'd love to hear from you — about a verse, a custom piece, or anything else.</p>
        </div>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-8">
          <aside className="space-y-4">
            <div className="card-spiritual p-5">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <p className="font-serif text-lg">Email us</p>
              <a href="mailto:hello@divineverseart.com" className="text-sm text-primary hover:underline">
                hello@divineverseart.com
              </a>
            </div>
            <div className="card-spiritual p-5">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <p className="font-serif text-lg">Live chat</p>
              <p className="text-sm text-brand-mid">Tap the 💬 bubble in the corner — answers in seconds.</p>
            </div>
            <p className="text-xs text-brand-mid">
              Response time: usually under 24 hours, Mon–Fri.
            </p>
          </aside>

          <form onSubmit={submit} className="card-spiritual p-6 space-y-4">
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className={honeypotClass}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Subject (optional)</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12"
            >
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
