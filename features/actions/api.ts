import { wmsApi } from "@/lib/api/wms-client";
import type { Action, ActionOutcome, ExecuteActionResult } from "@/types/action";

/** Direct mapping to /actions routes (src/routes/action.routes.ts). Approve/execute are real
 *  operations against the backend's Action Engine — not simulated in the frontend. */
export const actionsApi = {
  create: (exceptionId: number) => wmsApi.post<Action>("/actions", { exceptionId }),
  getById: (id: number) => wmsApi.get<Action>(`/actions/${id}`),
  approve: (id: number) => wmsApi.post<Action>(`/actions/${id}/approve`),
  execute: (id: number) => wmsApi.post<ExecuteActionResult>(`/actions/${id}/execute`),
  getOutcome: (id: number) => wmsApi.get<ActionOutcome>(`/actions/${id}/outcome`),
};
