import { CheckCircle2, SearchX } from "lucide-react";

export function ExceptionEmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">No exceptions match these filters</p>
        <p className="text-sm text-muted-foreground">Try widening your search, status, or date range.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
      <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden />
      <p className="text-sm font-medium">No active exceptions</p>
      <p className="text-sm text-muted-foreground">
        Your warehouse currently has no detected operational exceptions.
      </p>
    </div>
  );
}
