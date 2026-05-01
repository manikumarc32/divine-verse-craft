import { ReactNode, useState } from "react";
import { BookOpen, ScrollText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArtPreview } from "./ArtPreview";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface VerseMeaningDialogProps {
  title: string;
  sanskrit?: string | null;
  englishMeaning?: string | null;
  teluguMeaning?: string | null;
  deeperMeaning?: string | null;
  deeperMeaningTe?: string | null;
  chapterRef?: string | null;
  trigger?: ReactNode;
  variant?: "link" | "button";
}

export function VerseMeaningDialog({
  title,
  sanskrit,
  englishMeaning,
  teluguMeaning,
  deeperMeaning,
  deeperMeaningTe,
  chapterRef,
  trigger,
  variant = "link",
}: VerseMeaningDialogProps) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const isTe = lang === "te";

  const shortMeaning = isTe && teluguMeaning ? teluguMeaning : englishMeaning;
  const deeperPrimary = isTe && deeperMeaningTe ? deeperMeaningTe : deeperMeaning;
  const deeperSecondary = isTe ? deeperMeaning : deeperMeaningTe;

  // Click handler stops propagation so the dialog trigger inside a Link card
  // doesn't navigate the user away.
  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  const defaultTrigger =
    variant === "button" ? (
      <Button
        type="button"
        variant="outline"
        onClick={stop}
        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        {t("verse.readFull")}
      </Button>
    ) : (
      <button
        type="button"
        onClick={stop}
        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-primary transition-colors underline-offset-4 hover:underline"
      >
        <BookOpen className="h-3.5 w-3.5" />
        {t("verse.whatMeans")}
      </button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={stop}>
        {trigger ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className={cn("font-serif text-2xl text-center", isTe && "telugu")}>
            {title}
          </DialogTitle>
        </DialogHeader>

        {(sanskrit || shortMeaning) && (
          <div className="mt-2">
            <ArtPreview
              sanskrit={sanskrit}
              meaning={shortMeaning}
              chapterRef={chapterRef}
              size="md"
              bgColor="cream"
            />
          </div>
        )}

        {deeperPrimary && (
          <section className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className={cn("font-serif text-lg", isTe && "telugu")}>
                {t("verse.deeper")}
              </h3>
            </div>
            <p className={cn("text-brand-mid leading-relaxed", isTe && "telugu")}>
              {deeperPrimary}
            </p>
          </section>
        )}

        {deeperSecondary && (
          <section className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <ScrollText className="h-4 w-4 text-accent" />
              <h3 className={cn("font-serif text-base", !isTe && "telugu")}>
                {isTe ? t("verse.inEnglish") : t("verse.inTelugu")}
              </h3>
            </div>
            <p className={cn("text-sm text-brand-mid leading-relaxed", !isTe && "telugu")}>
              {deeperSecondary}
            </p>
          </section>
        )}

        {chapterRef && (
          <p className="text-xs uppercase tracking-widest text-accent text-center mt-4">
            — {chapterRef}
          </p>
        )}

        <div className="flex justify-end mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-brand-mid"
          >
            {t("verse.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
