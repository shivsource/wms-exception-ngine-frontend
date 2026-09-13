import { cn } from "@/lib/utils";
import type { CauseConfidence } from "@/types/root-cause";

const CONFIDENCE_STYLES: Record<CauseConfidence, string> = {
  HIGH: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  LOW: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
  INSUFFICIENT_EVIDENCE: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
};

const CONFIDENCE_LABELS: Record<CauseConfidence, string> = {
  HIGH: "High confidence",
  MEDIUM: "Medium confidence",
  LOW: "Low confidence",
  INSUFFICIENT_EVIDENCE: "Insufficient evidence",
};

export function ConfidenceBadge({ level, className }: { level: CauseConfidence; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        CONFIDENCE_STYLES[level],
        className,
      )}
    >
      {CONFIDENCE_LABELS[level]}
    </span>
  );
}

/** OBSERVED = a fact read directly off evidence; INFERRED = a projection from it — the
 *  trust/explainability distinction the product spec requires never be blurred. */
export function OriginBadge({ origin, className }: { origin: "OBSERVED" | "INFERRED"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        origin === "OBSERVED"
          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
          : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
        className,
      )}
    >
      {origin === "OBSERVED" ? "Observed" : "Inferred"}
    </span>
  );
}
