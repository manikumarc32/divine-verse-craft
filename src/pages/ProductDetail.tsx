import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ArtPreview } from "@/components/ArtPreview";
import { ProductCard, ProductSummary } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerseMeaningDialog } from "@/components/VerseMeaningDialog";
import { supabase } from "@/integrations/supabase/client";
import { calculatePrice, formatGBP, SIZE_MODIFIERS, MATERIAL_MODIFIERS, FRAME_MODIFIERS } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { StockBar, isSoldOut } from "@/components/StockBar";
import { toast } from "sonner";
import { Heart, Star, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullProduct extends ProductSummary {
  telugu_meaning: string | null;
  deeper_meaning: string | null;
  deeper_meaning_te: string | null;
  description: string | null;
  stock_limit: number | null;
  sold_count: number | null;
  review_count?: number | null;
}

const LANGS = [
  { code: "telugu", label: "తెలుగు Telugu" },
  { code: "english", label: "English" },
  { code: "sanskrit", label: "संस्कृत Sanskrit" },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const cart = useCart();
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [related, setRelated] = useState<ProductSummary[]>([]);
  const [language, setLanguage] = useState("english");
  const [size, setSize] = useState("A4");
  const [material, setMaterial] = useState("poster");
  const [frame, setFrame] = useState("none");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (!data) return;
      setProduct(data as unknown as FullProduct);
      document.title = `${data.title} — DivineVerse Art`;
      const { data: rel } = await supabase
        .from("products").select("*")
        .eq("category", data.category).neq("id", data.id).limit(3);
      setRelated((rel ?? []) as unknown as ProductSummary[]);
    })();
  }, [slug]);

  if (!product) return <PageLayout><div className="container py-20 text-center text-brand-mid">Loading sacred art…</div></PageLayout>;

  const meaning =
    language === "telugu" ? product.telugu_meaning :
    language === "sanskrit" ? product.sanskrit :
    product.english_meaning;

  const price = calculatePrice(Number(product.base_price), size, material, frame);

  function addToCart() {
    cart.addItem({
      productId: product!.id,
      title: product!.title,
      sanskrit: product!.sanskrit ?? undefined,
      englishMeaning: product!.english_meaning ?? undefined,
      chapterRef: product!.chapter_ref,
      language, size, material, frame,
      quantity: 1,
      unitPrice: price,
    });
    toast.success("Added to your cart");
  }

  return (
    <PageLayout>
      <div className="container py-10">
        <Link to="/shop" className="text-sm text-accent hover:underline">← Back to shop</Link>

        <div className="grid lg:grid-cols-2 gap-12 mt-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ArtPreview
              sanskrit={product.sanskrit}
              meaning={meaning}
              chapterRef={product.chapter_ref}
              size="lg"
              frame={frame}
            />
          </div>

          <div>
            {product.chapter_ref && <p className="text-xs uppercase tracking-widest text-accent mb-2">{product.chapter_ref}</p>}
            <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.title}</h1>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}
              <span className="text-sm text-brand-mid ml-1">{Number(product.rating).toFixed(1)} ({product.review_count ?? 0} reviews)</span>
            </div>
            <p className="font-serif text-3xl text-primary mb-4">{formatGBP(price)}</p>

            {product.stock_limit != null && (
              <div className="mb-6 max-w-xs">
                <StockBar stockLimit={product.stock_limit} soldCount={product.sold_count ?? 0} />
              </div>
            )}

            <p className="text-brand-mid mb-4">{product.description}</p>

            {(product.deeper_meaning || product.deeper_meaning_te) && (
              <div className="mb-6">
                <VerseMeaningDialog
                  variant="button"
                  title={product.title}
                  sanskrit={product.sanskrit}
                  englishMeaning={product.english_meaning}
                  teluguMeaning={product.telugu_meaning}
                  deeperMeaning={product.deeper_meaning}
                  deeperMeaningTe={product.deeper_meaning_te}
                  chapterRef={product.chapter_ref}
                />
              </div>
            )}

            {(product.sanskrit || product.telugu_meaning) && (
              <OptionGroup label="Language">
                {LANGS.map((l) => (
                  <OptionPill key={l.code} active={language === l.code} onClick={() => setLanguage(l.code)}>
                    {l.label}
                  </OptionPill>
                ))}
              </OptionGroup>
            )}

            <OptionGroup label="Size">
              {Object.entries(SIZE_MODIFIERS).map(([code, mod]) => (
                <OptionPill key={code} active={size === code} onClick={() => setSize(code)}>
                  {code}{mod > 0 && <span className="text-xs ml-1 opacity-80">+{formatGBP(mod)}</span>}
                </OptionPill>
              ))}
            </OptionGroup>

            <OptionGroup label="Material">
              {[
                ["poster", "Poster Paper"], ["eco", "Eco Paper"],
                ["cloth", "Cloth Tapestry"], ["canvas", "Canvas"],
              ].map(([code, label]) => (
                <OptionPill key={code} active={material === code} onClick={() => setMaterial(code)}>
                  {label}{MATERIAL_MODIFIERS[code] > 0 && <span className="text-xs ml-1 opacity-80">+{formatGBP(MATERIAL_MODIFIERS[code])}</span>}
                </OptionPill>
              ))}
            </OptionGroup>

            <OptionGroup label="Frame">
              {[
                ["none", "No Frame"], ["black", "Black"], ["white", "White"],
                ["wood", "Wood"], ["gold", "Gold"],
              ].map(([code, label]) => (
                <OptionPill key={code} active={frame === code} onClick={() => setFrame(code)}>
                  {label}{FRAME_MODIFIERS[code] > 0 && <span className="text-xs ml-1 opacity-80">+{formatGBP(FRAME_MODIFIERS[code])}</span>}
                </OptionPill>
              ))}
            </OptionGroup>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={addToCart}
                size="lg"
                disabled={isSoldOut(product.stock_limit, product.sold_count)}
                className="flex-1 bg-gradient-saffron text-primary-foreground border-0 h-12"
              >
                {isSoldOut(product.stock_limit, product.sold_count) ? "Sold Out" : `Add to Cart · ${formatGBP(price)}`}
              </Button>
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-12 min-w-[44px]">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 p-4 rounded-lg border border-border bg-muted/40">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-4 w-4 text-accent" />
                <span className="font-medium">Shipping</span>
              </div>
              <ul className="text-sm text-brand-mid space-y-1">
                <li>🇬🇧 UK · £3.99 · FREE over £50</li>
                <li>🇪🇺 EU · £7.99 · FREE over £75</li>
                <li>🌍 World · £12.99 · FREE over £100</li>
              </ul>
            </div>
          </div>
        </div>

        <Tabs defaultValue="desc" className="mt-16">
          <TabsList>
            <TabsTrigger value="desc">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="mt-4 text-brand-mid leading-relaxed max-w-3xl">
            {product.description ?? "Premium UK-printed sacred art on archival paper. Each piece is checked by hand before shipping."}
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 text-brand-mid">
            Be the first to share your reflection on this piece.
          </TabsContent>
        </Tabs>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl mb-6">You may also love</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "chip min-h-[44px] px-4 transition-all",
        active ? "bg-primary text-primary-foreground border-transparent shadow-soft" : "bg-card border-border hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}
