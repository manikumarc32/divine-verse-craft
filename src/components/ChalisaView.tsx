import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChalisaViewProps {
  text: string;
  title?: string;
  heroImageUrl?: string | null;
  className?: string;
}

// Section headings we want to style distinctly (Telugu + Devanagari + English fallbacks)
const HEADINGS = new Set([
  "దోహా", "ధ్యానం", "చౌపాఈ", "చౌపాఇ",
  "दोहा", "ध्यानम्", "ध्यानम", "चौपाई",
  "Doha", "Dhyanam", "Chaupai",
]);

const MEANING_PREFIX = /^(అర్థం|అర్ధం|Meaning|अर्थ)\s*[:：]\s*/;

interface Block {
  kind: "heading" | "verse" | "meaning";
  lines: string[];
  number?: string;
}

function parse(text: string): Block[] {
  const paragraphs = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const blocks: Block[] = [];
  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 1 && HEADINGS.has(lines[0])) {
      blocks.push({ kind: "heading", lines });
      continue;
    }
    if (MEANING_PREFIX.test(lines[0])) {
      // Strip prefix from first line, keep the rest
      const cleanedFirst = lines[0].replace(MEANING_PREFIX, "");
      const meaningLines = [cleanedFirst, ...lines.slice(1)].filter(Boolean);
      blocks.push({ kind: "meaning", lines: meaningLines });
      continue;
    }
    // Detect verse number on any line e.g. "॥ 1 ॥", "॥1॥", or Telugu digits "౧"
    let number: string | undefined;
    for (const ln of lines) {
      const m = ln.match(/॥\s*([\d౦-౯०-९]+)\s*॥/);
      if (m) { number = m[1]; break; }
    }
    blocks.push({ kind: "verse", lines, number });
  }
  return blocks;
}

export function ChalisaView({ text, title, heroImageUrl, className }: ChalisaViewProps) {
  const blocks = useMemo(() => parse(text), [text]);

  return (
    <div className={cn("rounded-lg overflow-hidden bg-gradient-cream border border-border shadow-soft", className)}>
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          alt={title ?? "Sacred art"}
          loading="lazy"
          className="w-full h-72 object-cover"
        />
      )}

      <div className="px-5 md:px-10 py-8 chalisa-print">
        <div className="text-center mb-6 print:mb-4">
          <span className="text-3xl text-accent font-serif">ॐ</span>
          {title && (
            <h2 className="font-serif text-2xl md:text-3xl mt-2 text-brand-dark">{title}</h2>
          )}
          <div className="gold-divider-sm mx-auto mt-3" />
        </div>

        <div className="max-w-2xl mx-auto telugu text-brand-dark space-y-6 leading-loose text-[1.05rem] md:text-[1.15rem]">
          {blocks.map((b, i) => {
            if (b.kind === "heading") {
              return (
                <div key={i} className="text-center pt-2">
                  <h3 className="font-serif text-xl md:text-2xl text-accent tracking-wide">
                    {b.lines[0]}
                  </h3>
                </div>
              );
            }
            if (b.kind === "meaning") {
              return (
                <div
                  key={i}
                  className="chalisa-meaning text-left text-[0.95rem] md:text-base text-brand-mid leading-relaxed border-l-2 border-accent/40 pl-4 ml-0 md:ml-2"
                >
                  <span className="text-accent font-semibold mr-1">అర్థం:</span>
                  {b.lines.map((line, j) => (
                    <span key={j}>{j === 0 ? " " : " "}{line}</span>
                  ))}
                </div>
              );
            }
            return (
              <div key={i} className="text-center">
                {b.lines.map((line, j) => {
                  // strip trailing verse number from whichever line carries it
                  const clean = b.number
                    ? line.replace(/॥\s*[\d౦-౯०-९]+\s*॥\s*$/, "").replace(/॥\s*[\d౦-౯०-९]+\s*॥/, "").trim()
                    : line;
                  if (!clean) return null;
                  return (
                    <p key={j} className="leading-relaxed">
                      {clean}
                    </p>
                  );
                })}
                {b.number && (
                  <p className="mt-1 text-sm text-accent font-semibold">॥ {b.number} ॥</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <span className="text-2xl text-accent font-serif">ॐ</span>
        </div>
      </div>

      <div className="px-5 md:px-10 pb-6 flex justify-center print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
}
