// Curated subset of the Prodigi sandbox catalogue.
// Full list: https://www.prodigi.com/products/

export type ProdigiSkuOption = {
  sku: string;
  label: string;
  description: string;
  recommendedPx: { w: number; h: number };
};

export type ProdigiGroup = {
  key: string;
  label: string;
  description: string;
  options: ProdigiSkuOption[];
};

export const PRODIGI_CATALOGUE: ProdigiGroup[] = [
  {
    key: "poster",
    label: "Poster (paper)",
    description: "Cheapest option — great for quotes & symbols.",
    options: [
      { sku: "GLOBAL-PAP-A4", label: 'A4 poster (8.3 × 11.7")', description: "Lightweight matte poster", recommendedPx: { w: 2480, h: 3508 } },
      { sku: "GLOBAL-PAP-A3", label: 'A3 poster (11.7 × 16.5")', description: "Larger matte poster", recommendedPx: { w: 3508, h: 4961 } },
      { sku: "GLOBAL-PAP-16X20", label: 'Poster 16 × 20"', description: "Classic gallery size", recommendedPx: { w: 4800, h: 6000 } },
    ],
  },
  {
    key: "framed",
    label: "Framed print",
    description: "Premium feel — best for god portraits.",
    options: [
      { sku: "GLOBAL-FAP-16X20", label: 'Framed 16 × 20"', description: "Black wood frame, matte print", recommendedPx: { w: 4800, h: 6000 } },
      { sku: "GLOBAL-FAP-A3", label: "Framed A3", description: "Black wood frame, matte print", recommendedPx: { w: 3508, h: 4961 } },
    ],
  },
  {
    key: "canvas",
    label: "Canvas",
    description: "Premium gallery wrap — best for hero pieces.",
    options: [
      { sku: "GLOBAL-CAN-16X20", label: 'Canvas 16 × 20"', description: "1.25\" gallery wrap", recommendedPx: { w: 4800, h: 6000 } },
      { sku: "GLOBAL-CAN-20X30", label: 'Canvas 20 × 30"', description: "1.25\" gallery wrap", recommendedPx: { w: 6000, h: 9000 } },
    ],
  },
];

export const ALL_SKUS: ProdigiSkuOption[] = PRODIGI_CATALOGUE.flatMap((g) => g.options);

export function findSku(sku: string | null | undefined): ProdigiSkuOption | undefined {
  if (!sku) return undefined;
  return ALL_SKUS.find((o) => o.sku === sku);
}

// Suggest a default SKU based on this project's product `category`.
export function suggestSkuForCategory(category: string): string {
  switch (category) {
    case "god_portrait":
      return "GLOBAL-FAP-16X20";
    case "hand_written":
      return "GLOBAL-CAN-20X30";
    case "ramayana_quote":
    case "gita_quote":
      return "GLOBAL-PAP-A4";
    case "symbol":
      return "GLOBAL-PAP-A4";
    default:
      return "GLOBAL-PAP-A4";
  }
}
