import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArtPreview } from "@/components/ArtPreview";
import { useCart } from "@/lib/cart";
import { formatGBP } from "@/lib/pricing";
import { type BundleWithItems } from "@/lib/bundles";
import { toast } from "sonner";

export function BundleCard({ bundle }: { bundle: BundleWithItems }) {
  const cart = useCart();

  function addBundle() {
    if (bundle.items.length === 0) return toast.error("This bundle has no items yet.");
    // Distribute the bundle discount across items proportionally
    const ratio = bundle.bundle_price / Math.max(0.01, bundle.original_price);
    bundle.items.forEach(({ product, quantity }) => {
      cart.addItem({
        productId: product.id,
        title: product.title,
        sanskrit: product.sanskrit ?? undefined,
        englishMeaning: product.english_meaning ?? undefined,
        chapterRef: product.chapter_ref,
        language: "english",
        size: "A4",
        material: "poster",
        frame: "none",
        quantity,
        unitPrice: Math.round(Number(product.base_price) * ratio * 100) / 100,
      });
    });
    toast.success(`${bundle.title} added to cart — saved ${formatGBP(bundle.saving)}`);
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card-spiritual flex flex-col overflow-hidden h-full"
    >
      <div className="relative bg-gradient-cream p-5">
        {bundle.badge && (
          <span className="absolute top-3 right-3 z-10 chip bg-destructive text-destructive-foreground border-transparent text-xs font-semibold">
            {bundle.badge}
          </span>
        )}
        <div className="grid grid-cols-3 gap-2">
          {bundle.items.slice(0, 3).map(({ product }) => (
            <div key={product.id} className="aspect-square">
              <ArtPreview
                sanskrit={product.sanskrit}
                meaning={null}
                size="sm"
                className="h-full"
              />
            </div>
          ))}
        </div>
        {bundle.items.length > 3 && (
          <p className="mt-2 text-center text-xs text-brand-mid">
            + {bundle.items.length - 3} more inside
          </p>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl mb-1.5">{bundle.title}</h3>
        <p className="text-sm text-brand-mid mb-4 flex-1">{bundle.description}</p>

        <div className="flex items-end gap-3 mb-4">
          <span className="font-serif text-2xl text-primary">{formatGBP(bundle.bundle_price)}</span>
          {bundle.saving > 0 && (
            <span className="text-sm text-brand-mid line-through mb-0.5">{formatGBP(bundle.original_price)}</span>
          )}
        </div>

        <Button onClick={addBundle} className="bg-gradient-saffron text-primary-foreground border-0 w-full h-11">
          Add Bundle to Cart
        </Button>
      </div>
    </motion.article>
  );
}
