"use client";

import { useApiHealth } from "@/features/health/hooks";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { data, isError, isLoading } = useApiHealth();

  const connected = !isLoading && !isError && data?.status === "ok";
  const label = isLoading ? "Connecting…" : connected ? "Live" : "Backend unreachable";

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground"
      title={connected ? "Connected to WMS Exception Engine" : "Could not reach the WMS Exception Engine API"}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isLoading ? "bg-muted-foreground/40" : connected ? "bg-emerald-500" : "bg-red-500",
        )}
        aria-hidden
      />
      {label}
    </div>
  );
}
