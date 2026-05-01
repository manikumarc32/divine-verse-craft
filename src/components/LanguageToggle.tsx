import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium",
        className,
      )}
    >
      <button
        onClick={() => setLang("en")}
        className={cn(
          "px-3 py-1.5 rounded-full transition-all min-h-[32px]",
          lang === "en" ? "bg-primary text-primary-foreground shadow-soft" : "text-brand-mid hover:text-primary",
        )}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("te")}
        className={cn(
          "px-3 py-1.5 rounded-full transition-all min-h-[32px] telugu",
          lang === "te" ? "bg-primary text-primary-foreground shadow-soft" : "text-brand-mid hover:text-primary",
        )}
        aria-pressed={lang === "te"}
      >
        తెలుగు
      </button>
    </div>
  );
}
