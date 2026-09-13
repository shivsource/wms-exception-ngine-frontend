import { wmsApi } from "@/lib/api/wms-client";
import type { Action } from "@/types/action";
import type { EnrichedException, ExceptionListFilters, PersistedException } from "@/types/exception";
import type { RecommendationView } from "@/types/recommendation";
import type { RootCauseView } from "@/types/root-cause";

/**
 * Direct mapping to wms-exception-engine-backend's /exceptions routes
 * (src/routes/exception.routes.ts). No client-side invention of endpoints.
 */
export const exceptionsApi = {
  list: (filters: ExceptionListFilters = {}) =>
    wmsApi.getList<PersistedException>("/exceptions", { ...filters }),

  listOpen: () => wmsApi.getList<PersistedException>("/exceptions/open"),

  listCritical: () => wmsApi.getList<PersistedException>("/exceptions/critical"),

  getById: (id: number) => wmsApi.get<PersistedException>(`/exceptions/${id}`),

  getEvidence: (id: number) => wmsApi.get<EnrichedException>(`/exceptions/${id}/evidence`),

  /** Read-only, recomputed live — does not persist a snapshot (see exception.service.ts's
   *  getRootCause vs createRootCauseAnalysis). Safe to call on every detail-page view. */
  getRootCause: (id: number) => wmsApi.get<RootCauseView>(`/exceptions/${id}/root-cause`),

  /** Read-only counterpart to getRecommendation — same non-persisting distinction as above. */
  getRecommendation: (id: number) => wmsApi.get<RecommendationView>(`/exceptions/${id}/recommendation`),

  getActions: (id: number) => wmsApi.getList<Action>(`/exceptions/${id}/actions`),

  resolve: (id: number) => wmsApi.post<PersistedException>(`/exceptions/${id}/resolve`),
};
