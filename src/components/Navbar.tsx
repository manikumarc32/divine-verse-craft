import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LotusIcon } from "./icons/LotusIcon";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: "/shop", label: "Shop" },
    { to: "/bundles", label: "Bundles" },
    { to: "/custom-builder", label: "Custom" },
    { to: "/about-gita", label: "About Gita" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <motion.header
      initial={false}
      animate={{ height: scrolled ? 60 : 72 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled ? "glass border-border/80 shadow-soft" : "bg-background border-transparent",
      )}
    >
      <div className="container flex items-center justify-between h-full">
        <Link to="/" className="flex items-center gap-2 text-brand-dark group">
          <motion.span whileHover={{ rotate: 12 }} transition={{ duration: 0.4 }}>
            <LotusIcon className="h-7 w-7 text-primary" />
          </motion.span>
          <span className="font-serif text-xl font-semibold">DivineVerse Art</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative text-sm transition-colors py-2",
                  active ? "text-primary" : "text-brand-mid hover:text-primary",
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-saffron rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block mr-2">
            <LanguageToggle />
          </div>
          <Button variant="ghost" size="icon" aria-label="Wishlist" onClick={() => navigate("/wishlist")} className="min-w-[44px] min-h-[44px]">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" onClick={() => navigate(user ? "/account" : "/login")} className="min-w-[44px] min-h-[44px]">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" onClick={cart.toggle} className="relative min-w-[44px] min-h-[44px]">
            <ShoppingCart className="h-5 w-5" />
            {cart.count() > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {cart.count()}
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px]" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background"
        >
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
            <div className="pt-3"><LanguageToggle /></div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
