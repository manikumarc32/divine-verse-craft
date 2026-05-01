import { Link } from "react-router-dom";
import { LotusIcon } from "./icons/LotusIcon";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Instagram, Facebook, Mail } from "lucide-react";

const emailSchema = z.string().trim().email("Please enter a valid email").max(320);

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState("");
  const mountedAt = useRef(Date.now());

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot — silent drop
    if (Date.now() - mountedAt.current < 1500) return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data, source: "footer" });
    setBusy(false);

    if (error) {
      // Duplicate email — treat as success so we don't leak which addresses are subscribed
      if (error.code === "23505") {
        setEmail("");
        return toast.success("You're already on the list 🙏");
      }
      return toast.error(error.message);
    }
    setEmail("");
    toast.success("Subscribed! Watch for sacred art inspiration. 🪷");
  }

  return (
    <footer className="bg-brand-dark text-brand-cream/90 mt-16">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <LotusIcon className="h-7 w-7 text-accent" />
              <span className="font-serif text-xl text-brand-cream">DivineVerse Art</span>
            </div>
            <p className="text-xs text-brand-cream/60 mb-4">Made with 🪷 in the UK</p>
            <p className="text-sm text-brand-cream/70 leading-relaxed mb-6 max-w-sm">
              Two epics. One eternal dharma. Sacred wall art crafted in the UK — Bhagavad Gita verses, Ramayana scenes, Hindu deity portraits, and hand-written Sanskrit calligraphy for modern, mindful homes.
            </p>

            <div className="mb-2">
              <p className="font-serif text-accent">Join our circle</p>
              <p className="text-xs text-brand-cream/60 mb-3">
                New verses, story drops, and 10% off your first order. No spam, ever.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-2 relative">
              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                name="company"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0 pointer-events-none"
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                className="bg-brand-dark/50 border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/40"
                aria-label="Email address for newsletter"
              />
              <Button
                type="submit"
                disabled={busy}
                className="bg-gradient-saffron text-primary-foreground border-0 shrink-0"
              >
                {busy ? "…" : "Subscribe"}
              </Button>
            </form>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/divineverseart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-brand-cream/70 hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/divineverseart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-brand-cream/70 hover:text-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@divineverseart.com"
                aria-label="Email us"
                className="text-brand-cream/70 hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Bhagavad Gita</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?epic=gita" className="hover:text-accent">Gita Wall Art</Link></li>
              <li><Link to="/shop?category=gita_quote" className="hover:text-accent">Gita Quotes</Link></li>
              <li><Link to="/about-gita" className="hover:text-accent">About the Gita</Link></li>
              <li><Link to="/custom-builder" className="hover:text-accent">Custom Verse</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Ramayana</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?epic=ramayana" className="hover:text-accent">Ramayana Art</Link></li>
              <li><Link to="/shop?category=ramayana_scene" className="hover:text-accent">Ram Darbar & Scenes</Link></li>
              <li><Link to="/shop?category=hanuman_chalisa" className="hover:text-accent">Hanuman Chalisa</Link></li>
              <li><Link to="/ramayana" className="hover:text-accent">About the Ramayana</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-accent mb-3">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-accent">All Wall Art</Link></li>
              <li><Link to="/bundles" className="hover:text-accent">Bundle Deals</Link></li>
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

        {/* Accepted payments */}
        <div className="mt-10 pt-6 border-t border-brand-cream/10">
          <p className="text-xs text-brand-cream/50 uppercase tracking-widest mb-3 text-center">
            Secure checkout
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-brand-cream/70 text-sm font-medium">
            <span>VISA</span>
            <span className="text-brand-cream/30">·</span>
            <span>Mastercard</span>
            <span className="text-brand-cream/30">·</span>
            <span>Amex</span>
            <span className="text-brand-cream/30">·</span>
            <span>PayPal</span>
            <span className="text-brand-cream/30">·</span>
            <span>Apple Pay</span>
            <span className="text-brand-cream/30">·</span>
            <span>Google Pay</span>
          </div>
        </div>

        <div className="gold-divider mt-8" />
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-brand-cream/60 gap-2">
          <p>© {new Date().getFullYear()} DivineVerse Art · Made with reverence in the UK</p>
          <p>ॐ शान्तिः शान्तिः शान्तिः ॐ</p>
        </div>
      </div>
    </footer>
  );
}
