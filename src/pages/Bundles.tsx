import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { BundleCard } from "@/components/BundleCard";
import { fetchBundles, type BundleWithItems } from "@/lib/bundles";

export default function Bundles() {
  const [bundles, setBundles] = useState<BundleWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Bundle Deals — DivineVerse Art";
    fetchBundles().then((b) => {
      setBundles(b);
      setLoading(false);
    });
  }, []);

  return (
    <PageLayout>
      <div className="container py-16">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <LotusIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-6xl mb-3">Bundle Deals</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-4 text-lg">
            Save more when you buy together. Hand-picked sets for collectors and gift-givers.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-brand-mid">Loading bundles…</div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl text-accent mb-3">ॐ</p>
            <p className="text-brand-mid">No bundles available yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {bundles.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <BundleCard bundle={b} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-sm text-brand-mid">
          Bundle pricing applies automatically when you add a bundle. All items ship together as one order.
        </div>
      </div>
    </PageLayout>
  );
}
