import { cn } from "@/lib/utils";

interface ArtPreviewProps {
  sanskrit?: string | null;
  meaning?: string | null;
  subLine?: string | null;
  chapterRef?: string | null;
  heroImageUrl?: string | null; // when set, render the artwork image with text band beneath
  font?: "serif" | "elegant" | "modern" | "script";
  bgColor?: "cream" | "white" | "dark" | "saffron";
  bgImageUrl?: string | null;
  textColor?: string | null;
  overlay?: number; // 0..1
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
  subLine,
  chapterRef,
  heroImageUrl,
  font = 'serif',
  bgColor = 'cream',
  bgImageUrl,
  textColor,
  overlay = 0.35,
  size = 'md',
  frame = 'none',
  className,
}: ArtPreviewProps) {
  const dims = size === 'sm' ? 'min-h-[180px] p-4' : size === 'lg' ? 'min-h-[460px] p-10' : 'min-h-[280px] p-6';
  const sansSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const meaningSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  const useImage = !!bgImageUrl;
  const customColorStyle = textColor ? { color: textColor } : undefined;

  // Hero-image mode: artwork on top, text band below (used for products with a hero image)
  if (heroImageUrl) {
    const imgH = size === 'sm' ? 'h-44' : size === 'lg' ? 'h-[420px]' : 'h-72';
    return (
      <div className={cn('rounded-lg overflow-hidden bg-brand-cream', frameStyles[frame] ?? frameStyles.none, className)}>
        <img
          src={heroImageUrl}
          alt={meaning ?? sanskrit ?? 'Sacred art'}
          loading="lazy"
          className={cn('w-full object-cover', imgH)}
        />
        {(sanskrit || meaning || chapterRef) && (
          <div className={cn('px-4 py-4 text-center bg-gradient-cream', fontMap[font])}>
            {chapterRef && (
              <p className="text-[10px] uppercase tracking-widest text-accent mb-1">{chapterRef}</p>
            )}
            {sanskrit && (
              <p className={cn('sanskrit leading-relaxed text-brand-dark', size === 'sm' ? 'text-sm' : 'text-base')}>
                {sanskrit}
              </p>
            )}
            {meaning && (
              <p className={cn('mt-1.5 text-brand-mid leading-relaxed', meaningSize)}>"{meaning}"</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg overflow-hidden', frameStyles[frame] ?? frameStyles.none, className)}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center text-center',
          dims,
          !useImage && bgMap[bgColor],
          fontMap[font],
        )}
        style={useImage ? {
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: textColor ?? '#fff',
        } : customColorStyle}
      >
        {useImage && (
          <div
            aria-hidden
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay }}
          />
        )}
        {/* Faint Om watermark on solid-colour backgrounds */}
        {!useImage && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-serif text-accent pointer-events-none select-none"
            style={{ opacity: 0.06 }}
          >
            ॐ
          </span>
        )}
        {/* Decorative corner ornaments on cream/saffron */}
        {!useImage && (bgColor === 'cream' || bgColor === 'saffron') && (
          <>
            <span aria-hidden className="absolute top-2 left-2 text-accent/40 text-lg">❋</span>
            <span aria-hidden className="absolute top-2 right-2 text-accent/40 text-lg">❋</span>
            <span aria-hidden className="absolute bottom-2 left-2 text-accent/40 text-lg">❋</span>
            <span aria-hidden className="absolute bottom-2 right-2 text-accent/40 text-lg">❋</span>
          </>
        )}
        <div className="relative z-10 flex flex-col items-center">
          <span className={cn('text-lg mb-3 text-accent')}>ॐ</span>
          {sanskrit && (
            <p className={cn('sanskrit leading-relaxed mb-3', sansSize)}>{sanskrit}</p>
          )}
          <div className="gold-divider-sm mx-auto" />
          {meaning && (
            <p className={cn('mt-3 max-w-prose leading-relaxed opacity-90', meaningSize)}>"{meaning}"</p>
          )}
          {subLine && (
            <p className={cn('mt-2 max-w-prose leading-relaxed opacity-80 italic', meaningSize)}>{subLine}</p>
          )}
          {chapterRef && (
            <p className={cn('mt-4 text-xs uppercase tracking-widest opacity-70')}>{chapterRef}</p>
          )}
          <span className={cn('mt-4 text-base text-accent')}>ॐ</span>
        </div>
      </div>
    </div>
  );
}

