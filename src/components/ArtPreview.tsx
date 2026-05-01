import { cn } from "@/lib/utils";

interface ArtPreviewProps {
  sanskrit?: string | null;
  meaning?: string | null;
  chapterRef?: string | null;
  font?: "serif" | "elegant" | "modern" | "script";
  bgColor?: "cream" | "white" | "dark" | "saffron";
  size?: "sm" | "md" | "lg";
  frame?: string;
  className?: string;
}

const fontMap = {
  serif: 'font-serif',
  elegant: 'font-serif italic',
  modern: 'font-sans',
  script: 'font-serif italic',
};

const bgMap = {
  cream: 'bg-gradient-cream text-brand-dark',
  white: 'bg-white text-brand-dark',
  dark: 'bg-brand-dark text-brand-cream',
  saffron: 'bg-primary/20 text-brand-dark',
};

const frameStyles: Record<string, string> = {
  none: 'border-transparent',
  black: 'border-[10px] border-brand-dark',
  white: 'border-[10px] border-white shadow-soft',
  wood: 'border-[12px] border-amber-900',
  gold: 'border-[10px] border-accent shadow-elegant',
};

export function ArtPreview({
  sanskrit,
  meaning,
  chapterRef,
  font = 'serif',
  bgColor = 'cream',
  size = 'md',
  frame = 'none',
  className,
}: ArtPreviewProps) {
  const dims = size === 'sm' ? 'min-h-[180px] p-4' : size === 'lg' ? 'min-h-[460px] p-10' : 'min-h-[280px] p-6';
  const sansSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const meaningSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  const isDark = bgColor === 'dark';

  return (
    <div className={cn('rounded-lg overflow-hidden', frameStyles[frame] ?? frameStyles.none, className)}>
      <div className={cn('flex flex-col items-center justify-center text-center', dims, bgMap[bgColor], fontMap[font])}>
        <span className={cn('text-lg mb-3', isDark ? 'text-accent' : 'text-accent')}>ॐ</span>
        {sanskrit && (
          <p className={cn('sanskrit leading-relaxed mb-3', sansSize)}>{sanskrit}</p>
        )}
        <div className="gold-divider-sm mx-auto" />
        {meaning && (
          <p className={cn('mt-3 max-w-prose leading-relaxed opacity-90', meaningSize)}>"{meaning}"</p>
        )}
        {chapterRef && (
          <p className={cn('mt-4 text-xs uppercase tracking-widest opacity-70')}>{chapterRef}</p>
        )}
        <span className={cn('mt-4 text-base', isDark ? 'text-accent' : 'text-accent')}>ॐ</span>
      </div>
    </div>
  );
}
