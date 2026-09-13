import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exceptionsApi } from "./api";
import type { ExceptionListFilters } from "@/types/exception";

/**
 * Polling interval used in place of realtime push (the backend has no WebSocket/SSE — see
 * ARCHITECTURE.md and confirmed absent from src/app.ts/server.ts). Isolated here so swapping
 * to a real subscription later only touches this file, not every consuming component.
 */
const LIVE_REFETCH_INTERVAL_MS = 30_000;

export const exceptionKeys = {
  all: ["exceptions"] as const,
  lists: () => [...exceptionKeys.all, "list"] as const,
  list: (filters: ExceptionListFilters) => [...exceptionKeys.lists(), filters] as const,
  open: () => [...exceptionKeys.all, "open"] as const,
  critical: () => [...exceptionKeys.all, "critical"] as const,
  detail: (id: number) => [...exceptionKeys.all, "detail", id] as const,
  evidence: (id: number) => [...exceptionKeys.all, "evidence", id] as const,
  rootCause: (id: number) => [...exceptionKeys.all, "root-cause", id] as const,
  recommendation: (id: number) => [...exceptionKeys.all, "recommendation", id] as const,
  actions: (id: number) => [...exceptionKeys.all, "actions", id] as const,
};

export function useExceptions(filters: ExceptionListFilters) {
  return useQuery({
    queryKey: exceptionKeys.list(filters),
    queryFn: () => exceptionsApi.list(filters),
    refetchInterval: LIVE_REFETCH_INTERVAL_MS,
    placeholderData: (prev) => prev,
  });
}

export function useCriticalExceptions() {
  return useQuery({
    queryKey: exceptionKeys.critical(),
    queryFn: () => exceptionsApi.listCritical(),
    refetchInterval: LIVE_REFETCH_INTERVAL_MS,
  });
}

export function useOpenExceptions() {
  return useQuery({
    queryKey: exceptionKeys.open(),
    queryFn: () => exceptionsApi.listOpen(),
    refetchInterval: LIVE_REFETCH_INTERVAL_MS,
  });
}

export function useException(id: number) {
  return useQuery({
    queryKey: exceptionKeys.detail(id),
    queryFn: () => exceptionsApi.getById(id),
    enabled: Number.isFinite(id),
  });
}

export function useExceptionEvidence(id: number) {
  return useQuery({
    queryKey: exceptionKeys.evidence(id),
    queryFn: () => exceptionsApi.getEvidence(id),
    enabled: Number.isFinite(id),
  });
}

export function useExceptionRootCause(id: number) {
  return useQuery({
    queryKey: exceptionKeys.rootCause(id),
    queryFn: () => exceptionsApi.getRootCause(id),
    enabled: Number.isFinite(id),
    retry: false,
  });
}

export function useExceptionRecommendation(id: number) {
  return useQuery({
    queryKey: exceptionKeys.recommendation(id),
    queryFn: () => exceptionsApi.getRecommendation(id),
    enabled: Number.isFinite(id),
    retry: false,
  });
}

export function useExceptionActions(id: number) {
  return useQuery({
    queryKey: exceptionKeys.actions(id),
    queryFn: () => exceptionsApi.getActions(id),
    enabled: Number.isFinite(id),
  });
}

export function useResolveException() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => exceptionsApi.resolve(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.all });
      queryClient.invalidateQueries({ queryKey: exceptionKeys.detail(id) });
    },
  });
}
