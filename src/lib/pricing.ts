export const SIZE_MODIFIERS: Record<string, number> = { A4: 0, A3: 8, A2: 18 };
export const MATERIAL_MODIFIERS: Record<string, number> = {
  poster: 0,
  eco: 3,
  cloth: 12,
  canvas: 15,
};
export const FRAME_MODIFIERS: Record<string, number> = {
  none: 0,
  black: 12,
  white: 12,
  wood: 15,
  gold: 20,
};

export function calculatePrice(
  base: number,
  size: string = "A4",
  material: string = "poster",
  frame: string = "none",
): number {
  return (
    Number(base) +
    (SIZE_MODIFIERS[size] ?? 0) +
    (MATERIAL_MODIFIERS[material] ?? 0) +
    (FRAME_MODIFIERS[frame] ?? 0)
  );
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
