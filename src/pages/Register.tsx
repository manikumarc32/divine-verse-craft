import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(10, "At least 10 characters")
  .max(72)
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a symbol");

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: passwordSchema,
});

function strengthHints(pw: string) {
  return [
    { ok: pw.length >= 10, label: "10+ characters" },
    { ok: /[a-z]/.test(pw), label: "lowercase" },
    { ok: /[A-Z]/.test(pw), label: "uppercase" },
    { ok: /[0-9]/.test(pw), label: "number" },
    { ok: /[^A-Za-z0-9]/.test(pw), label: "symbol" },
  ];
}

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const mountedAt = useRef(Date.now());
  const [hp, setHp] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot — silent drop
    if (Date.now() - mountedAt.current < 1500) return;
    const p = schema.safeParse(form);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: form.full_name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — welcome!");
    navigate("/account");
  }

  const hints = strengthHints(form.password);

  return (
    <PageLayout>
      <div className="container py-16 max-w-md">
        <div className="card-spiritual p-8">
          <div className="text-center mb-6">
            <LotusIcon className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-serif text-2xl">Begin Your Journey</h1>
            <p className="text-sm text-brand-mid mt-1">Create your DivineVerse Art account</p>
          </div>
          <form onSubmit={submit} className="space-y-4" autoComplete="on">
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0 pointer-events-none"
              name="company"
            />
            <div>
              <Label>Full name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1.5" autoComplete="name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" autoComplete="email" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" autoComplete="new-password" />
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {hints.map((h) => (
                  <li key={h.label} className={h.ok ? "text-primary" : "text-brand-mid"}>
                    {h.ok ? "✓" : "○"} {h.label}
                  </li>
                ))}
              </ul>
            </div>
            <Button disabled={busy} className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
              {busy ? "Creating account…" : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-brand-mid text-center mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
