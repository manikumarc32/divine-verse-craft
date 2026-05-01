import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const base = `${SUPABASE_URL}/storage/v1/object/public/reference-backgrounds`;

export interface RefBg {
  id: string;
  label: string;
  group: string;
  url: string;
}

// Note: deity images (Hanuman, Krishna, Shiva) are intentionally NOT auto-generated.
// Authentic photographs/artwork must be uploaded by the admin via the dashboard
// to ensure traditional, respectful representation. Only neutral textures ship by default.
export const REFERENCE_BACKGROUNDS: RefBg[] = [
  { id: "parchment", label: "Aged parchment", group: "Textures", url: `${base}/parchment.jpg` },
  { id: "peacock", label: "Peacock feather", group: "Textures", url: `${base}/peacock.jpg` },
  { id: "temple-wall", label: "Temple wall", group: "Textures", url: `${base}/temple-wall.jpg` },
];

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ReferenceBackgroundPicker({ value, onChange }: Props) {
  const groups = Array.from(new Set(REFERENCE_BACKGROUNDS.map((r) => r.group)));

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g}>
          <p className="text-[11px] uppercase tracking-widest text-brand-mid mb-2">{g}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {REFERENCE_BACKGROUNDS.filter((r) => r.group === g).map((r) => {
              const active = value === r.url;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChange(active ? null : r.url)}
                  className={cn(
                    "relative aspect-[3/4] rounded-md overflow-hidden border-2 transition-all min-h-[44px]",
                    active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/60",
                  )}
                  aria-label={r.label}
                  title={r.label}
                >
                  <img
                    src={r.url}
                    alt={r.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {active && (
                    <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-soft">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {value && REFERENCE_BACKGROUNDS.some((r) => r.url === value) && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-brand-mid hover:text-foreground inline-flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Clear background
        </button>
      )}
    </div>
  );
}
