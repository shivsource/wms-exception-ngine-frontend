import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function SectionSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

/** A single section failing (e.g. root cause 422s for an exception type with no analyzer)
 *  must never take down the rest of the detail page — see error-handling requirements. */
export function SectionError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry ? (
          <Button variant="link" size="sm" className="h-auto p-0 text-sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
