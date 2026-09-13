import { useQuery } from "@tanstack/react-query";
import { exceptionsApi } from "@/features/exceptions/api";
import { exceptionKeys } from "@/features/exceptions/hooks";
import { ExceptionStatus, type ExceptionSeverity } from "@/types/enums";

/** Matches the polling cadence used across the rest of the app (see features/exceptions/hooks.ts). */
const LIVE_REFETCH_INTERVAL_MS = 30_000;

/**
 * The backend has no standalone recommendations list endpoint — recommendations are computed
 * per-exception (GET /exceptions/:id/recommendation, via useExceptionRecommendation). This page
 * instead pages through open HIGH/CRITICAL exceptions and fetches a recommendation for each one
 * on the current page.
 */
export function useOpenExceptionsBySeverity(severity: ExceptionSeverity, limit: number, offset: number) {
  const filters = { status: ExceptionStatus.OPEN, severity, limit, offset };
  return useQuery({
    queryKey: exceptionKeys.list(filters),
    queryFn: () => exceptionsApi.list(filters),
    refetchInterval: LIVE_REFETCH_INTERVAL_MS,
    placeholderData: (prev) => prev,
  });
}
