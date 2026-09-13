import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExceptionErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      <div>
        <p className="text-sm font-medium">Unable to load exceptions</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
