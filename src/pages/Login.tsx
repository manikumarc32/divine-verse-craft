import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mfaStep, setMfaStep] = useState<{ factorId: string; challengeId: string } | null>(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse({ email, password });
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    // Check MFA requirement
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.find((f) => f.status === "verified");
      if (totp) {
        const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: totp.id });
        setBusy(false);
        if (chErr || !ch) return toast.error(chErr?.message ?? "MFA challenge failed");
        setMfaStep({ factorId: totp.id, challengeId: ch.id });
        return;
      }
    }
    setBusy(false);
    toast.success("Welcome back");
    navigate("/account");
  }

  async function verifyMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!mfaStep) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.verify({
      factorId: mfaStep.factorId,
      challengeId: mfaStep.challengeId,
      code: code.trim(),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate("/account");
  }

  return (
    <PageLayout>
      <div className="container py-16 max-w-md">
        <div className="card-spiritual p-8">
          <div className="text-center mb-6">
            <LotusIcon className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-serif text-2xl">Welcome Back</h1>
            <p className="text-sm text-brand-mid mt-1">
              {mfaStep ? "Enter your 6-digit authenticator code" : "Sign in to continue your journey"}
            </p>
          </div>

          {!mfaStep ? (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" autoComplete="email" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" autoComplete="current-password" />
              </div>
              <Button disabled={busy} className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
                {busy ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyMfa} className="space-y-4">
              <div>
                <Label>6-digit code</Label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1.5 tracking-widest text-center text-lg"
                  autoFocus
                />
              </div>
              <Button disabled={busy || code.length !== 6} className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
                {busy ? "Verifying…" : "Verify & continue"}
              </Button>
            </form>
          )}

          <p className="text-sm text-brand-mid text-center mt-6">
            New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
