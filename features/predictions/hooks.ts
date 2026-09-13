import { useQuery } from "@tanstack/react-query";
import { predictionsApi } from "./api";
import type { PredictionListFilters } from "@/types/prediction";

const LIVE_REFETCH_INTERVAL_MS = 30_000;

export const predictionKeys = {
  all: ["predictions"] as const,
  lists: () => [...predictionKeys.all, "list"] as const,
  list: (filters: PredictionListFilters) => [...predictionKeys.lists(), filters] as const,
  byEntity: (entityId: string) => [...predictionKeys.all, "entity", entityId] as const,
};

export function usePredictions(filters: PredictionListFilters) {
  return useQuery({
    queryKey: predictionKeys.list(filters),
    queryFn: () => predictionsApi.list(filters),
    refetchInterval: LIVE_REFETCH_INTERVAL_MS,
    placeholderData: (prev) => prev,
  });
}

export function usePredictionsForEntity(entityId: string) {
  return useQuery({
    queryKey: predictionKeys.byEntity(entityId),
    queryFn: () => predictionsApi.getByEntityId(entityId),
    enabled: Boolean(entityId),
  });
}
