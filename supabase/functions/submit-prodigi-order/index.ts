// Submits an existing order to Prodigi for fulfilment.
// Called by the Stripe webhook after payment, or manually from Admin UI.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "@supabase/supabase-js/cors";
import { createProdigiOrder, mapZoneToCountry } from "../_shared/prodigi.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { order_id, force } = await req.json();
    if (!order_id || typeof order_id !== "string") {
      return json({ error: "order_id required" }, 400);
    }

    const { data: order, error: oErr } = await supabase
      .from("orders").select("*").eq("id", order_id).maybeSingle();
    if (oErr || !order) return json({ error: oErr?.message ?? "Order not found" }, 404);

    if (order.prodigi_order_id && !force) {
      return json({ skipped: true, prodigi_order_id: order.prodigi_order_id });
    }

    const { data: items, error: iErr } = await supabase
      .from("order_items").select("*").eq("order_id", order_id);
    if (iErr) return json({ error: iErr.message }, 500);
    if (!items || items.length === 0) return json({ error: "No items" }, 400);

    const productIds = Array.from(new Set(items.map((i: any) => i.product_id).filter(Boolean)));
    const { data: products } = productIds.length
      ? await supabase.from("products").select("id, prodigi_sku, prodigi_print_area, prodigi_asset_url, hero_image_url").in("id", productIds)
      : { data: [] as any[] };

    const prodigiItems = [] as any[];
    const skipped: string[] = [];
    for (const it of items) {
      const p = products?.find((x: any) => x.id === it.product_id);
      const sku = p?.prodigi_sku;
      const asset = p?.prodigi_asset_url ?? p?.hero_image_url;
      if (!sku || !asset) { skipped.push(it.product_title); continue; }
      prodigiItems.push({
        merchantReference: it.id,
        sku,
        copies: it.quantity ?? 1,
        sizing: "fillPrintArea",
        assets: [{ printArea: p?.prodigi_print_area ?? "default", url: asset }],
      });
    }

    if (prodigiItems.length === 0) {
      const msg = `No Prodigi-mappable items (missing SKU/asset): ${skipped.join(", ")}`;
      await supabase.from("orders").update({
        prodigi_status: "skipped", prodigi_last_error: msg,
      }).eq("id", order_id);
      return json({ error: msg }, 422);
    }

    const result = await createProdigiOrder({
      merchantReference: order.id,
      shippingMethod: "Standard",
      recipient: {
        name: order.full_name,
        email: order.email,
        phoneNumber: order.phone ?? undefined,
        address: {
          line1: order.address_line1,
          line2: order.address_line2 ?? undefined,
          townOrCity: order.city,
          postalOrZipCode: order.postcode,
          countryCode: mapZoneToCountry(order.shipping_zone, order.country),
        },
      },
      items: prodigiItems,
      idempotencyKey: `order-${order.id}`,
    }, "sandbox");

    const prodigiOrderId = result?.order?.id ?? result?.id ?? null;
    const prodigiStatus = result?.order?.status?.stage ?? result?.outcome ?? "InProgress";

    await supabase.from("orders").update({
      prodigi_order_id: prodigiOrderId,
      prodigi_status: String(prodigiStatus),
      prodigi_submitted_at: new Date().toISOString(),
      prodigi_last_error: null,
      status: "in_production",
    }).eq("id", order_id);

    return json({ ok: true, prodigi_order_id: prodigiOrderId, prodigi_status: prodigiStatus, skipped });
  } catch (e: any) {
    console.error("submit-prodigi-order error", e);
    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body?.order_id) {
        await supabase.from("orders").update({
          prodigi_status: "failed",
          prodigi_last_error: String(e?.message ?? e),
        }).eq("id", body.order_id);
      }
    } catch { /* */ }
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
