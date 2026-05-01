import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { LotusIcon } from "./icons/LotusIcon";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export function Navbar() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/shop", label: "Shop" },
    { to: "/custom-builder", label: "Custom" },
    { to: "/about-gita", label: "About Gita" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-brand-dark">
          <LotusIcon className="h-7 w-7 text-primary" />
          <span className="font-serif text-xl font-semibold">DivineVerse Art</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-brand-mid hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Wishlist" onClick={() => navigate("/wishlist")} className="min-w-[44px] min-h-[44px]">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" onClick={() => navigate(user ? "/account" : "/login")} className="min-w-[44px] min-h-[44px]">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" onClick={cart.toggle} className="relative min-w-[44px] min-h-[44px]">
            <ShoppingCart className="h-5 w-5" />
            {cart.count() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.count()}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px]" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container flex flex-col py-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-brand-mid hover:text-primary border-b border-border/40"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
