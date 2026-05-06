import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getProdigiKey, prodigiBase } from "../_shared/prodigi.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Require admin
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: u } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    if (!u.user) return json({ error: "Unauthorized" }, 401);
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: u.user.id });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    // Hit a lightweight endpoint to verify the API key works.
    const res = await fetch(`${prodigiBase("sandbox")}/Quotes`, {
      method: "POST",
      headers: {
        "X-API-Key": getProdigiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shippingMethod: "Budget",
        destinationCountryCode: "GB",
        items: [{ sku: "GLOBAL-PAP-A4", copies: 1, attributes: {}, assets: [{ printArea: "default" }] }],
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      return json({ ok: false, status: res.status, error: text.slice(0, 500) }, 200);
    }
    return json({ ok: true, env: "sandbox" }, 200);
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 200);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
