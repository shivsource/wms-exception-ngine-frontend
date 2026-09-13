import { createApiClient } from "./client";

export const WMS_API_URL = process.env.NEXT_PUBLIC_WMS_API_URL ?? "/wms-api";

/** API client for the WMS Exception Engine backend. A future TMS backend gets its own client
 *  the same way, pointed at its own base URL — nothing here is WMS-specific. */
export const wmsApi = createApiClient(WMS_API_URL);
