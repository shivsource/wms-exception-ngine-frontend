export interface HealthStatus {
  success: boolean;
  status: string;
  database: string;
  timestamp: string;
  uptimeSeconds: number;
}

/** GET /health returns a bare object, not the {success,data} envelope every other route
 *  uses (see health.controller.ts) — call fetch directly rather than through wmsApi.get. */
export async function fetchHealth(): Promise<HealthStatus> {
  const baseUrl = process.env.NEXT_PUBLIC_WMS_API_URL ?? "/wms-api";
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
  return res.json();
}
