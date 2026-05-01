import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart";
import { formatGBP } from "@/lib/pricing";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ArtPreview } from "./ArtPreview";

export function CartDrawer() {
  const cart = useCart();
  const navigate = useNavigate();

  function checkout() {
    cart.close();
    navigate("/checkout");
  }

  return (
    <Sheet open={cart.isOpen} onOpenChange={(o) => (o ? cart.open() : cart.close())}>
      <SheetContent side="right" className="w-[92vw] sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-serif text-xl">
            Your Cart {cart.count() > 0 && <span className="text-brand-mid font-sans text-sm">({cart.count()} items)</span>}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4 text-accent">ॐ</div>
            <p className="font-serif text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-brand-mid mb-6">Sacred art awaits — explore our collections.</p>
            <Button onClick={() => { cart.close(); navigate("/shop"); }} className="bg-gradient-saffron text-primary-foreground">
              Browse Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className="w-20 shrink-0">
                    <ArtPreview
                      sanskrit={item.customData?.sanskrit ?? item.sanskrit}
                      meaning={item.customData?.meaning ?? item.englishMeaning}
                      size="sm"
                      frame={item.frame}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-brand-mid mt-0.5">
                      {item.size} · {item.material} · {item.frame === 'none' ? 'No frame' : item.frame + ' frame'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-md">
                        <button onClick={() => cart.updateQty(item.id, item.quantity - 1)} className="p-1.5 hover:bg-muted" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => cart.updateQty(item.id, item.quantity + 1)} className="p-1.5 hover:bg-muted" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-medium text-sm">{formatGBP(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="text-brand-mid hover:text-destructive p-1"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-6 bg-muted/30">
              <div className="flex justify-between mb-2">
                <span className="text-brand-mid">Subtotal</span>
                <span className="font-serif text-lg font-semibold">{formatGBP(cart.subtotal())}</span>
              </div>
              <p className="text-xs text-brand-mid mb-4">Shipping calculated at checkout · Free UK delivery over £50</p>
              <Button onClick={checkout} className="w-full bg-gradient-saffron text-primary-foreground border-0 h-12">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
