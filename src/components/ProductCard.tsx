import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArtPreview } from "./ArtPreview";
import { StockBar, isSoldOut } from "./StockBar";
import { Button } from "./ui/button";
import { VerseMeaningDialog } from "./VerseMeaningDialog";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/hooks/useLanguage";
import { formatGBP } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  category: string;
  base_price: number;
  badge: string | null;
  chapter_ref: string | null;
  sanskrit: string | null;
  english_meaning: string | null;
  telugu_meaning?: string | null;
  deeper_meaning?: string | null;
  deeper_meaning_te?: string | null;
  hero_image_url?: string | null;
  layout_mode?: string | null;
  rating: number;
  review_count?: number | null;
  stock_limit?: number | null;
  sold_count?: number | null;
}

const badgeStyles: Record<string, string> = {
  best_seller: 'bg-primary text-primary-foreground',
  new: 'bg-accent text-accent-foreground',
  premium: 'bg-brand-dark text-brand-cream',
  hand_written: 'bg-purple-brand text-white',
};
const badgeLabels: Record<string, string> = {
  best_seller: 'Best Seller',
  new: 'New',
  premium: 'Premium',
  hand_written: 'Hand-Written',
};

export function ProductCard({ product }: { product: ProductSummary }) {
  const [wished, setWished] = useState(false);
  const cart = useCart();
  const { lang } = useLanguage();
  const soldOut = isSoldOut(product.stock_limit, product.sold_count);

  const meaning = lang === "te" && product.telugu_meaning
    ? product.telugu_meaning
    : product.english_meaning;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    cart.addItem({
      productId: product.id,
      title: product.title,
      sanskrit: product.sanskrit ?? undefined,
      englishMeaning: product.english_meaning ?? undefined,
      chapterRef: product.chapter_ref,
      language: 'english',
      size: 'A4',
      material: 'poster',
      frame: 'none',
      quantity: 1,
      unitPrice: Number(product.base_price),
    });
    toast.success(`${product.title} added to cart`);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="card-spiritual group flex flex-col overflow-hidden h-full">
        <div className="relative overflow-hidden">
          <div className="transition-transform duration-700 group-hover:scale-[1.04]">
            <ArtPreview
              sanskrit={product.sanskrit}
              meaning={lang === "te" ? null : meaning}
              chapterRef={product.chapter_ref}
              heroImageUrl={product.hero_image_url}
              size="sm"
            />
          </div>
          {product.badge && (
            <span className={cn('absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider', badgeStyles[product.badge])}>
              {badgeLabels[product.badge]}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            className="absolute top-3 right-3 bg-card rounded-full p-2 shadow-soft hover:bg-primary hover:text-primary-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <Heart className={cn('h-4 w-4', wished && 'fill-primary text-primary')} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          {product.chapter_ref && (
            <p className="text-[11px] uppercase tracking-widest text-accent mb-1">{product.chapter_ref}</p>
          )}
          <h3 className="font-serif font-semibold text-base mb-1">{product.title}</h3>
          {lang === "te" && product.telugu_meaning && (
            <p className="telugu text-xs text-brand-mid mb-2 line-clamp-2">{product.telugu_meaning}</p>
          )}
          <div className="flex items-center justify-between gap-2 text-xs text-brand-mid mb-3">
            {(product.review_count ?? 0) > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span>{Number(product.rating).toFixed(1)}</span>
              </div>
            ) : <span />}
            {(product.deeper_meaning || product.deeper_meaning_te || product.sanskrit) && (
              <VerseMeaningDialog
                title={product.title}
                sanskrit={product.sanskrit}
                englishMeaning={product.english_meaning}
                teluguMeaning={product.telugu_meaning}
                deeperMeaning={product.deeper_meaning}
                deeperMeaningTe={product.deeper_meaning_te}
                chapterRef={product.chapter_ref}
              />
            )}
          </div>

          {product.stock_limit != null && (
            <div className="mb-3">
              <StockBar stockLimit={product.stock_limit} soldCount={product.sold_count ?? 0} />
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="font-serif font-semibold text-lg">From {formatGBP(Number(product.base_price))}</span>
            <Button
              size="sm"
              onClick={quickAdd}
              disabled={soldOut}
              className="bg-gradient-saffron text-primary-foreground border-0"
            >
              {soldOut ? "Sold out" : "Add"}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
