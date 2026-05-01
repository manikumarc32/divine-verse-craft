import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  stockLimit: number;
  soldCount: number;
  className?: string;
}

export function StockBar({ stockLimit, soldCount, className }: Props) {
  const remaining = Math.max(0, stockLimit - soldCount);
  const pct = Math.min(100, Math.round((soldCount / stockLimit) * 100));
  const soldOut = remaining === 0;
  const lowStock = !soldOut && remaining <= 5;

  if (soldOut) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="chip bg-destructive text-destructive-foreground border-transparent text-xs">SOLD OUT</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "h-full rounded-full",
            lowStock ? "bg-destructive" : "bg-gradient-saffron",
          )}
        />
      </div>
      <p className={cn("text-xs", lowStock ? "text-destructive font-semibold" : "text-brand-mid")}>
        {lowStock ? `Only ${remaining} left!` : `${remaining} of ${stockLimit} remaining`}
      </p>
    </div>
  );
}

export function isSoldOut(stockLimit: number | null | undefined, soldCount: number | null | undefined) {
  if (stockLimit == null) return false;
  return Math.max(0, stockLimit - (soldCount ?? 0)) === 0;
}
