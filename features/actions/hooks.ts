import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actionsApi } from "./api";
import { exceptionKeys } from "@/features/exceptions/hooks";

export const actionKeys = {
  all: ["actions"] as const,
  detail: (id: number) => [...actionKeys.all, "detail", id] as const,
  outcome: (id: number) => [...actionKeys.all, "outcome", id] as const,
};

export function useAction(id: number | null) {
  return useQuery({
    queryKey: actionKeys.detail(id ?? -1),
    queryFn: () => actionsApi.getById(id as number),
    enabled: id !== null,
  });
}

export function useActionOutcome(id: number | null) {
  return useQuery({
    queryKey: actionKeys.outcome(id ?? -1),
    queryFn: () => actionsApi.getOutcome(id as number),
    enabled: id !== null,
    retry: false,
  });
}

export function useCreateAction(exceptionDbId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => actionsApi.create(exceptionDbId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.actions(exceptionDbId) });
    },
  });
}

export function useApproveAction(exceptionDbId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: number) => actionsApi.approve(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.actions(exceptionDbId) });
    },
  });
}

export function useExecuteAction(exceptionDbId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: number) => actionsApi.execute(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.actions(exceptionDbId) });
      queryClient.invalidateQueries({ queryKey: exceptionKeys.detail(exceptionDbId) });
    },
  });
}
