import { Link } from "react-router-dom";
import { LotusIcon } from "./icons/LotusIcon";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Please enter a valid email.");
    toast.success("Subscribed! Watch for sacred art inspiration.");
    setEmail("");
  }

  return (
    <footer className="bg-brand-dark text-brand-cream/90 mt-16">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <LotusIcon className="h-7 w-7 text-accent" />
              <span className="font-serif text-xl text-brand-cream">DivineVerse Art</span>
            </div>
            <p className="text-sm text-brand-cream/70 leading-relaxed mb-6 max-w-sm">
              Sacred wall art crafted in the UK — Bhagavad Gita verses, Hindu deity portraits, and hand-written Sanskrit calligraphy for modern, mindful homes.
            </p>
            <form onSubmit={subscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-dark/50 border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/40"
              />
              <Button type="submit" className="bg-gradient-saffron text-primary-foreground border-0">
                Subscribe
              </Button>
            </form>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-accent">All Wall Art</Link></li>
              <li><Link to="/bundles" className="hover:text-accent">Bundle Deals</Link></li>
              <li><Link to="/shop?category=gita_quote" className="hover:text-accent">Gita Quotes</Link></li>
              <li><Link to="/shop?category=god_portrait" className="hover:text-accent">God Portraits</Link></li>
              <li><Link to="/shop?category=hand_written" className="hover:text-accent">Hand-Written</Link></li>
              <li><Link to="/custom-builder" className="hover:text-accent">Custom Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-gita" className="hover:text-accent">About the Gita</Link></li>
              <li><Link to="/size-guide" className="hover:text-accent">Size Guide</Link></li>
              <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link to="/india" className="hover:text-accent">🇮🇳 India Soon</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Legal & Shipping</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms & Conditions</Link></li>
              <li><Link to="/refunds" className="hover:text-accent">Refunds & Returns</Link></li>
            </ul>
            <h4 className="font-serif text-accent mt-5 mb-3">We ship to</h4>
            <ul className="space-y-1 text-sm">
              <li>🇬🇧 UK · £3.99 (free £50+)</li>
              <li>🇪🇺 Europe · £7.99 (free £75+)</li>
              <li>🌍 World · £12.99 (free £100+)</li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-12" />
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-brand-cream/60">
          <p>© {new Date().getFullYear()} DivineVerse Art · Made with reverence in the UK</p>
          <p className="mt-2 md:mt-0">ॐ शान्तिः शान्तिः शान्तिः ॐ</p>
        </div>
      </div>
    </footer>
  );
}
