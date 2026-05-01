import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ArtPreview } from "@/components/ArtPreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { calculatePrice, formatGBP, SIZE_MODIFIERS, FRAME_MODIFIERS } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { ImageUploader } from "@/components/custom/ImageUploader";
import { ReferenceBackgroundPicker } from "@/components/custom/ReferenceBackgroundPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const TEXT_COLORS = [
  { code: "auto", label: "Auto", value: null },
  { code: "white", label: "White", value: "#FFFFFF" },
  { code: "cream", label: "Cream", value: "#F5EBD8" },
  { code: "gold", label: "Gold", value: "#D4A24C" },
  { code: "dark", label: "Dark", value: "#1A0F0A" },
] as const;

const BASE = 22;

const schema = z.object({
  quote: z.string().trim().min(1, "Add your quote").max(280, "Keep your quote under 280 characters"),
  subLine: z.string().trim().max(160).optional(),
});

type Mode = "scripture" | "personal";

export default function CustomBuilder() {
  const cart = useCart();
  const [mode, setMode] = useState<Mode>("scripture");

  // Scripture mode (existing flow)
  const [sanskrit, setSanskrit] = useState("ॐ शान्तिः शान्तिः शान्तिः");
  const [scriptureMeaning, setScriptureMeaning] = useState("Om peace, peace, peace.");

  // Personal mode (new)
  const [quote, setQuote] = useState("Be the change you wish to see in the world.");
  const [subLine, setSubLine] = useState("— Mahatma Gandhi");
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [overlay, setOverlay] = useState(0.4);
  const [textColorCode, setTextColorCode] = useState<typeof TEXT_COLORS[number]["code"]>("auto");
  const [copyrightAck, setCopyrightAck] = useState(false);

  // Shared
  const [font, setFont] = useState<"serif" | "elegant" | "modern" | "script">("serif");
  const [bg, setBg] = useState<"cream" | "white" | "dark" | "saffron">("cream");
  const [size, setSize] = useState("A4");
  const [frame, setFrame] = useState("none");

  const price = calculatePrice(BASE, size, "poster", frame);
  const textColor = TEXT_COLORS.find((c) => c.code === textColorCode)?.value ?? null;

  function addToCart() {
    if (mode === "scripture") {
      if (!sanskrit.trim() || !scriptureMeaning.trim()) {
        toast.error("Please add the verse and its meaning");
        return;
      }
      cart.addItem({
        title: "Custom Sacred Verse",
        isCustom: true,
        customData: { sanskrit, meaning: scriptureMeaning, font, bgColor: bgImageUrl ? "image" : bg, bgImageUrl, textColor, overlay } as any,
        sanskrit,
        englishMeaning: scriptureMeaning,
        size, material: "poster", frame,
        quantity: 1, unitPrice: price,
      });
      toast.success("Custom quote added to cart");
      return;
    }

    // Personal mode
    const parsed = schema.safeParse({ quote, subLine: subLine || undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!copyrightAck) {
      toast.error("Please confirm you have the right to use this quote and image");
      return;
    }
    cart.addItem({
      title: "Personalised Quote Print",
      isCustom: true,
      customData: {
        sanskrit: quote,
        meaning: subLine,
        font,
        bgColor: bgImageUrl ? "image" : bg,
        bgImageUrl,
        textColor,
        overlay,
        copyrightAck: true,
      } as any,
      sanskrit: undefined,
      englishMeaning: quote,
      size, material: "poster", frame,
      quantity: 1, unitPrice: price,
    });
    toast.success("Personalised print added to cart");
  }

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Custom Quote Builder</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Design your own sacred verse or personal favourite — from £{BASE}</p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setMode("scripture")}
              className={cn(
                "px-5 py-2 rounded-full text-sm transition-all min-h-[44px]",
                mode === "scripture" ? "bg-gradient-saffron text-primary-foreground" : "text-brand-mid"
              )}
            >
              Sacred verse
            </button>
            <button
              onClick={() => setMode("personal")}
              className={cn(
                "px-5 py-2 rounded-full text-sm transition-all min-h-[44px]",
                mode === "personal" ? "bg-gradient-saffron text-primary-foreground" : "text-brand-mid"
              )}
            >
              Personal / movie quote
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {mode === "scripture" ? (
              <>
                <div>
                  <Label htmlFor="sk">Sanskrit / Devanagari verse</Label>
                  <Textarea id="sk" value={sanskrit} onChange={(e) => setSanskrit(e.target.value)} rows={3} maxLength={500} className="sanskrit text-lg mt-2" />
                </div>
                <div>
                  <Label htmlFor="me">Meaning / translation</Label>
                  <Textarea id="me" value={scriptureMeaning} onChange={(e) => setScriptureMeaning(e.target.value)} rows={3} maxLength={800} className="mt-2" />
                </div>
                <div>
                  <Label>Background (optional)</Label>
                  <p className="text-xs text-brand-mid mt-1 mb-2">Place this verse on a deity portrait or texture.</p>
                  <ReferenceBackgroundPicker value={bgImageUrl} onChange={setBgImageUrl} />
                </div>
                {bgImageUrl && (
                  <div>
                    <Label>Image darkening (for text readability)</Label>
                    <input
                      type="range"
                      min={0}
                      max={0.8}
                      step={0.05}
                      value={overlay}
                      onChange={(e) => setOverlay(Number(e.target.value))}
                      className="w-full mt-2 accent-primary"
                    />
                    <p className="text-xs text-brand-mid mt-1">{Math.round(overlay * 100)}%</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="qt">Your quote <span className="text-brand-mid text-xs">({quote.length}/280)</span></Label>
                  <Textarea
                    id="qt"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    rows={3}
                    maxLength={280}
                    className="mt-2 text-lg"
                    placeholder="Type any quote — movie line, poem, personal mantra…"
                  />
                </div>
                <div>
                  <Label htmlFor="sl">Author or sub-line <span className="text-brand-mid text-xs">(optional, {subLine.length}/160)</span></Label>
                  <Input
                    id="sl"
                    value={subLine}
                    onChange={(e) => setSubLine(e.target.value)}
                    maxLength={160}
                    className="mt-2"
                    placeholder="— Author name or translation"
                  />
                </div>
                <div>
                  <Label>Background image (optional)</Label>
                  <Tabs defaultValue="reference" className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="reference">Choose from library</TabsTrigger>
                      <TabsTrigger value="upload">Upload your own</TabsTrigger>
                    </TabsList>
                    <TabsContent value="reference" className="mt-3">
                      <ReferenceBackgroundPicker value={bgImageUrl} onChange={setBgImageUrl} />
                    </TabsContent>
                    <TabsContent value="upload" className="mt-3">
                      <ImageUploader value={bgImageUrl} onChange={setBgImageUrl} />
                    </TabsContent>
                  </Tabs>
                </div>
                {bgImageUrl && (
                  <div>
                    <Label>Image darkening (for text readability)</Label>
                    <input
                      type="range"
                      min={0}
                      max={0.8}
                      step={0.05}
                      value={overlay}
                      onChange={(e) => setOverlay(Number(e.target.value))}
                      className="w-full mt-2 accent-primary"
                    />
                    <p className="text-xs text-brand-mid mt-1">{Math.round(overlay * 100)}%</p>
                  </div>
                )}
                <div>
                  <Label>Text colour</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setTextColorCode(c.code)}
                        className={cn(
                          "chip min-h-[44px] px-4",
                          textColorCode === c.code ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border"
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

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

            {(mode === "scripture" || !bgImageUrl) && (
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
            )}

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

            {mode === "personal" && (
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50 cursor-pointer">
                <Checkbox
                  checked={copyrightAck}
                  onCheckedChange={(v) => setCopyrightAck(!!v)}
                  className="mt-0.5"
                />
                <span className="text-xs text-brand-mid leading-relaxed">
                  I confirm I have the right to use this quote and any uploaded image,
                  and that the content is not offensive or infringing on copyright.
                  DivineVerse may decline orders that violate these terms.
                </span>
              </label>
            )}

            <Button
              onClick={addToCart}
              size="lg"
              className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12"
            >
              Add to Cart — {formatGBP(price)}
            </Button>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-3 text-center">Live Preview</p>
            {mode === "scripture" ? (
              <ArtPreview
                sanskrit={sanskrit}
                meaning={scriptureMeaning}
                font={font}
                bgColor={bg}
                bgImageUrl={bgImageUrl}
                textColor={textColor}
                overlay={overlay}
                size="lg"
                frame={frame}
              />
            ) : (
              <ArtPreview
                sanskrit={null}
                meaning={quote}
                subLine={subLine || null}
                font={font}
                bgColor={bg}
                bgImageUrl={bgImageUrl}
                textColor={textColor}
                overlay={overlay}
                size="lg"
                frame={frame}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
