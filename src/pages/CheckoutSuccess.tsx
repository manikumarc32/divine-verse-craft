import { Link, useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  return (
    <PageLayout>
      <div className="container py-24 text-center max-w-xl">
        <p className="text-7xl text-accent mb-6">ॐ</p>
        <h1 className="font-serif text-4xl mb-3">Thank You</h1>
        <div className="gold-divider-sm mx-auto" />
        <p className="text-brand-mid mt-4 mb-2">Your sacred art is on its way to becoming a part of your home.</p>
        {orderId && <p className="text-xs text-brand-mid mb-8">Order reference: <span className="font-mono">{orderId.slice(0, 8)}</span></p>}
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-gradient-saffron text-primary-foreground border-0"><Link to="/account/orders">View Orders</Link></Button>
          <Button asChild variant="outline"><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    </PageLayout>
  );
}
