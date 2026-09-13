import { wmsApi } from "@/lib/api/wms-client";
import type { EntityPredictionsView, PersistedPrediction, PredictionListFilters } from "@/types/prediction";

/** Direct mapping to /predictions routes (src/routes/prediction.routes.ts). */
export const predictionsApi = {
  list: (filters: PredictionListFilters = {}) =>
    wmsApi.getList<PersistedPrediction>("/predictions", { ...filters }),

  getById: (id: number) => wmsApi.get<PersistedPrediction>(`/predictions/${id}`),

  getByEntityId: (entityId: string) =>
    wmsApi.get<EntityPredictionsView>(`/predictions/entity/${entityId}`),
};
