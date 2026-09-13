import { cn } from "@/lib/utils";
import type { ExceptionSeverity } from "@/types/enums";

const SEVERITY_STYLES: Record<ExceptionSeverity, string> = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  LOW: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
};

/** Severity is always shown as a labeled badge, never a bare color swatch — color alone
 *  must never be the only signal (accessibility requirement). */
export function SeverityBadge({ severity, className }: { severity: ExceptionSeverity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide",
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}
