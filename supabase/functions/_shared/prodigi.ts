// Shared Prodigi client (sandbox by default).
// Docs: https://www.prodigi.com/print-api/docs/reference/

const SANDBOX_BASE = "https://api.sandbox.prodigi.com/v4.0";
const LIVE_BASE = "https://api.prodigi.com/v4.0";

export type ProdigiEnv = "sandbox" | "live";

export function prodigiBase(env: ProdigiEnv = "sandbox") {
  return env === "live" ? LIVE_BASE : SANDBOX_BASE;
}

export function getProdigiKey(): string {
  const k = Deno.env.get("PRODIGI_API_KEY");
  if (!k) throw new Error("PRODIGI_API_KEY not configured");
  return k;
}

export interface ProdigiRecipient {
  name: string;
  email?: string;
  phoneNumber?: string;
  address: {
    line1: string;
    line2?: string;
    townOrCity: string;
    postalOrZipCode: string;
    countryCode: string; // ISO-2
    stateOrCounty?: string;
  };
}

export interface ProdigiItem {
  merchantReference?: string;
  sku: string;
  copies: number;
  sizing?: "fillPrintArea" | "fitPrintArea" | "stretchToPrintArea";
  assets: { printArea: string; url: string }[];
}

export interface CreateProdigiOrderInput {
  merchantReference: string;
  shippingMethod?: "Budget" | "Standard" | "Express" | "Overnight";
  recipient: ProdigiRecipient;
  items: ProdigiItem[];
  idempotencyKey?: string;
}

export async function createProdigiOrder(
  input: CreateProdigiOrderInput,
  env: ProdigiEnv = "sandbox",
) {
  const res = await fetch(`${prodigiBase(env)}/Orders`, {
    method: "POST",
    headers: {
      "X-API-Key": getProdigiKey(),
      "Content-Type": "application/json",
      ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      merchantReference: input.merchantReference,
      shippingMethod: input.shippingMethod ?? "Standard",
      recipient: input.recipient,
      items: input.items,
    }),
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* */ }
  if (!res.ok) {
    throw new Error(`Prodigi ${res.status}: ${json?.outcome ?? text ?? "error"}`);
  }
  return json;
}

export function mapZoneToCountry(zone: string, country?: string): string {
  // Orders table stores "GB"/"EU"/"ROW" — Prodigi needs ISO-2.
  if (country && country.length === 2) return country;
  if (zone === "UK" || country === "GB") return "GB";
  if (zone === "EU") return "DE"; // sandbox default; admin should refine via address
  return "US";
}
