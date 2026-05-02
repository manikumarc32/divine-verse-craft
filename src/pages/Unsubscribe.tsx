import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type State =
  | { kind: "loading" }
  | { kind: "ready"; email: string }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting"; email: string }
  | { kind: "done"; email: string }
  | { kind: "error"; message: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    document.title = "Unsubscribe — DivineVerse Art";
  }, []);

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({ kind: "invalid" });
          return;
        }
        if (body?.alreadyUnsubscribed || body?.already_unsubscribed) {
          setState({ kind: "already" });
          return;
        }
        setState({ kind: "ready", email: body?.email ?? "your email" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  async function confirm() {
    if (state.kind !== "ready") return;
    setState({ kind: "submitting", email: state.email });
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if ((data as any)?.success === false) {
        setState({ kind: "error", message: (data as any)?.error ?? "Could not unsubscribe" });
        return;
      }
      setState({ kind: "done", email: state.email });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message ?? "Could not unsubscribe" });
    }
  }

  return (
    <PageLayout>
      <div className="container py-20 max-w-lg">
        <div className="card-spiritual p-8 text-center">
          <LotusIcon className="h-12 w-12 text-primary mx-auto mb-4" />

          {state.kind === "loading" && (
            <>
              <h1 className="font-serif text-2xl mb-2">One moment…</h1>
              <p className="text-brand-mid">Verifying your unsubscribe link.</p>
            </>
          )}

          {state.kind === "invalid" && (
            <>
              <h1 className="font-serif text-2xl mb-2">Link not valid</h1>
              <p className="text-brand-mid">
                This unsubscribe link is invalid or has expired. If you keep receiving emails you'd like to stop,
                reply to any email with "unsubscribe" and we'll remove you immediately.
              </p>
            </>
          )}

          {state.kind === "already" && (
            <>
              <h1 className="font-serif text-2xl mb-2">You're already unsubscribed</h1>
              <p className="text-brand-mid">No further app emails will be sent to this address.</p>
            </>
          )}

          {(state.kind === "ready" || state.kind === "submitting") && (
            <>
              <h1 className="font-serif text-2xl mb-2">Unsubscribe from DivineVerse Art emails?</h1>
              <p className="text-brand-mid mb-6">
                We'll stop sending app emails to <span className="text-foreground font-medium">{state.email}</span>.
                You'll still receive essential account & order emails.
              </p>
              <Button
                onClick={confirm}
                disabled={state.kind === "submitting"}
                size="lg"
                className="bg-gradient-saffron text-primary-foreground border-0 h-12 px-8"
              >
                {state.kind === "submitting" ? "Unsubscribing…" : "Confirm unsubscribe"}
              </Button>
            </>
          )}

          {state.kind === "done" && (
            <>
              <p className="text-4xl text-accent mb-3">🪷</p>
              <h1 className="font-serif text-2xl mb-2">You've been unsubscribed</h1>
              <p className="text-brand-mid">
                <span className="text-foreground font-medium">{state.email}</span> has been removed from our app email list.
                We're sorry to see you go.
              </p>
            </>
          )}

          {state.kind === "error" && (
            <>
              <h1 className="font-serif text-2xl mb-2">Something went wrong</h1>
              <p className="text-brand-mid">{state.message}</p>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
