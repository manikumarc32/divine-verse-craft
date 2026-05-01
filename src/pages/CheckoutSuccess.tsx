import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Gift, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Resolution = {
  code: string;
  label: string;
  size: string;
  premium?: boolean;
};

const RESOLUTIONS: Resolution[] = [
  { code: "phone", label: "Phone wallpaper", size: "1170 × 2532" },
  { code: "tablet", label: "Tablet wallpaper", size: "2048 × 2732" },
  { code: "desktop", label: "Desktop wallpaper", size: "2560 × 1440" },
  { code: "a4", label: "Printable A4 (300dpi)", size: "2480 × 3508", premium: true },
  { code: "a3", label: "Printable A3 (300dpi)", size: "3508 × 4961", premium: true },
];

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const totalParam = Number(params.get("total") ?? "0");
  const orderTotal = isNaN(totalParam) ? 0 : totalParam;

  const showGift = orderTotal >= 5 || true; // every order gets a free wallpaper
  const premiumUnlocked = orderTotal >= 25;

  const [picked, setPicked] = useState<string | null>(null);

  function handleDownload(res: Resolution) {
    setPicked(res.code);
    // Placeholder: in production this would call an edge function returning a signed URL
    // from the digital-bonuses bucket. For now we surface a friendly message.
    setTimeout(() => {
      window.alert(
        `Your ${res.label} (${res.size}) is being prepared.\n\nWe'll email it to you within a few minutes along with your order receipt.`
      );
    }, 100);
  }

  return (
    <PageLayout>
      <div className="container py-16 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-7xl text-accent mb-6">ॐ</p>
          <h1 className="font-serif text-4xl mb-3">Thank You</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-4 mb-2">
            Your sacred art is on its way to becoming a part of your home.
          </p>
          {orderId && (
            <p className="text-xs text-brand-mid mb-6">
              Order reference: <span className="font-mono">{orderId.slice(0, 8)}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild className="bg-gradient-saffron text-primary-foreground border-0">
              <Link to="/account/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {showGift && (
          <div className="card-spiritual p-6 md:p-8 border-2 border-accent/30">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-2xl">Your free gift</h2>
            </div>
            <p className="text-brand-mid mb-6">
              A blessed digital wallpaper of "Om Shanti" — yours with every order.
              Pick the resolution that fits your device.
              {premiumUnlocked ? (
                <span className="block mt-2 text-primary font-medium">
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  You spent over £25 — printable A4 & A3 versions are unlocked too!
                </span>
              ) : (
                <span className="block mt-2 text-xs">
                  Spend over £25 to unlock high-res printable A4 & A3 PDFs on your next order.
                </span>
              )}
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {RESOLUTIONS.map((res) => {
                const locked = res.premium && !premiumUnlocked;
                const isPicked = picked === res.code;
                return (
                  <button
                    key={res.code}
                    onClick={() => !locked && handleDownload(res)}
                    disabled={locked}
                    className={cn(
                      "text-left p-4 rounded-lg border transition-all",
                      locked
                        ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                        : isPicked
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        {res.label}
                      </span>
                      {res.premium && (
                        <span className="text-[10px] uppercase tracking-wider text-accent font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-mid font-mono">{res.size}</p>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-brand-mid mt-5">
              Your download links will also be emailed to you for future access.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
