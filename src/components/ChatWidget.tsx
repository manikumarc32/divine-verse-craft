import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const QUICK = [
  {
    q: "Delivery times?",
    a: "UK: 3–5 business days · EU: 5–10 days · Worldwide: 10–15 days. FREE shipping on UK orders over £50! 🇬🇧",
  },
  {
    q: "Can I return?",
    a: "Yes — 30-day returns on all items. Item must be unused and in original packaging. Custom orders are non-refundable.",
  },
  {
    q: "Sizes available?",
    a: "A4 (21×29.7cm), A3 (29.7×42cm), A2 (42×59.4cm). See our Size Guide for details and material options.",
  },
  {
    q: "Custom orders?",
    a: "Yes! Use our Quote Builder to create custom Sanskrit art with your chosen verse, font, and frame.",
  },
];

const FAQ_KEYWORDS: { match: RegExp; reply: string }[] = [
  { match: /(deliver|ship|arrive|when.*get|how long)/i, reply: QUICK[0].a },
  { match: /(return|refund|exchange|money.*back)/i, reply: QUICK[1].a },
  { match: /(size|dimension|a4|a3|a2|how big|inch|cm)/i, reply: QUICK[2].a },
  { match: /(custom|own|personal|builder|sanskrit.*write)/i, reply: QUICK[3].a },
  { match: /(india|indian|inr|rupee|telugu|hindi|tamil)/i, reply: "We're launching in India soon! Visit /india to join the waitlist and see INR pricing." },
  { match: /(price|cost|how much|cheap|expensive)/i, reply: "Posters start from £6.99. Bundles save up to £9. Final price depends on size, material, and frame — check the product page or /size-guide." },
  { match: /(material|paper|canvas|cloth|tapestry|frame)/i, reply: "We offer Poster Paper 200gsm, Eco Paper 180gsm, Cloth Tapestry, and Canvas 340gsm. Frames in black, white, wood, or gold. See /size-guide." },
  { match: /(contact|email|reach|support|help|talk)/i, reply: "You can email us at hello@divineverseart.com or visit /contact." },
  { match: /(payment|pay|stripe|card|secure)/i, reply: "We accept all major cards securely via Stripe. Your payment details never touch our servers." },
  { match: /(hello|hi|hey|namaste|namaskar)/i, reply: "Namaste 🙏 How can we help you today? Pick a quick reply above or ask me anything." },
];

const FALLBACK = "I'm not sure — try one of the quick replies above, or email us at hello@divineverseart.com 🪷";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Namaste! 🙏 How can we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = FAQ_KEYWORDS.find((k) => k.match.test(trimmed))?.reply ?? FALLBACK;
    setMessages((m) => [...m, { from: "user", text: trimmed }, { from: "bot", text: reply }]);
    setInput("");
  }

  function quickReply(q: string, a: string) {
    setMessages((m) => [...m, { from: "user", text: q }, { from: "bot", text: a }]);
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gradient-saffron text-primary-foreground shadow-elegant flex items-center justify-center"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="msg" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[540px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-lift flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-saffron text-primary-foreground p-4">
              <p className="font-serif text-lg leading-tight">DivineVerse Support</p>
              <p className="text-xs opacity-90">We usually reply in minutes</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-cream">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      m.from === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-brand-dark rounded-bl-sm",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border bg-card">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK.map((q) => (
                  <button
                    key={q.q}
                    onClick={() => quickReply(q.q, q.a)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {q.q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={500}
                  className="h-10"
                />
                <Button type="submit" size="icon" className="bg-gradient-saffron text-primary-foreground border-0 h-10 w-10 shrink-0" aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
