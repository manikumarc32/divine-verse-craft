import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ArtPreview } from "@/components/ArtPreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { calculatePrice, formatGBP, SIZE_MODIFIERS, FRAME_MODIFIERS } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

const FONTS = [
  { code: "serif", label: "Classic Serif" },
  { code: "elegant", label: "Elegant" },
  { code: "modern", label: "Modern Sans" },
  { code: "script", label: "Script" },
] as const;

const BG_COLORS = [
  { code: "cream", label: "Cream", swatch: "bg-brand-cream border border-border" },
  { code: "white", label: "White", swatch: "bg-white border border-border" },
  { code: "dark", label: "Dark Brown", swatch: "bg-brand-dark" },
  { code: "saffron", label: "Soft Saffron", swatch: "bg-primary/30" },
] as const;

const BASE = 22;

const schema = z.object({
  sanskrit: z.string().trim().min(1, "Add the Sanskrit verse").max(500),
  meaning: z.string().trim().min(1, "Add the meaning").max(800),
});

export default function CustomBuilder() {
  const cart = useCart();
  const [sanskrit, setSanskrit] = useState("ॐ शान्तिः शान्तिः शान्तिः");
  const [meaning, setMeaning] = useState("Om peace, peace, peace.");
  const [font, setFont] = useState<"serif" | "elegant" | "modern" | "script">("serif");
  const [bg, setBg] = useState<"cream" | "white" | "dark" | "saffron">("cream");
  const [size, setSize] = useState("A4");
  const [frame, setFrame] = useState("none");

  const price = calculatePrice(BASE, size, "poster", frame);

  function addToCart() {
    const parsed = schema.safeParse({ sanskrit, meaning });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    cart.addItem({
      title: "Custom Quote Art",
      isCustom: true,
      customData: { sanskrit, meaning, font, bgColor: bg },
      sanskrit, englishMeaning: meaning,
      size, material: "poster", frame,
      quantity: 1, unitPrice: price,
    });
    toast.success("Custom quote added to cart");
  }

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Custom Quote Builder</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Design your own sacred verse — from £{BASE}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <Label htmlFor="sk">Sanskrit / Devanagari verse</Label>
              <Textarea id="sk" value={sanskrit} onChange={(e) => setSanskrit(e.target.value)} rows={3} maxLength={500} className="sanskrit text-lg mt-2" />
            </div>
            <div>
              <Label htmlFor="me">Meaning / translation</Label>
              <Textarea id="me" value={meaning} onChange={(e) => setMeaning(e.target.value)} rows={3} maxLength={800} className="mt-2" />
            </div>

            <div>
              <Label>Font style</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {FONTS.map((f) => (
                  <button key={f.code} onClick={() => setFont(f.code)}
                    className={cn("chip min-h-[44px] px-4", font === f.code ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border")}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Background</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {BG_COLORS.map((c) => (
                  <button key={c.code} onClick={() => setBg(c.code)}
                    className={cn("flex flex-col items-center gap-1.5 group min-h-[44px]")}>
                    <span className={cn("w-12 h-12 rounded-lg transition-all", c.swatch, bg === c.code && "ring-2 ring-primary ring-offset-2 ring-offset-background")} />
                    <span className="text-xs text-brand-mid">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Size</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(SIZE_MODIFIERS).map(([code, mod]) => (
                  <button key={code} onClick={() => setSize(code)}
                    className={cn("chip min-h-[44px] px-4", size === code ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border")}>
                    {code}{mod > 0 && <span className="text-xs ml-1 opacity-80">+{formatGBP(mod)}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Frame</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(FRAME_MODIFIERS).map(([code, mod]) => (
                  <button key={code} onClick={() => setFrame(code)}
                    className={cn("chip min-h-[44px] px-4", frame === code ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border")}>
                    {code === 'none' ? 'No Frame' : code.charAt(0).toUpperCase() + code.slice(1)}
                    {mod > 0 && <span className="text-xs ml-1 opacity-80">+{formatGBP(mod)}</span>}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={addToCart} size="lg" className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
              Add to Cart — {formatGBP(price)}
            </Button>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-3 text-center">Live Preview</p>
            <ArtPreview sanskrit={sanskrit} meaning={meaning} font={font} bgColor={bg} size="lg" frame={frame} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
