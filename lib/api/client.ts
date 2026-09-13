import { HttpError } from "./http-error";
import type { ApiResponse } from "./types";

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Thin fetch wrapper for one backend's envelope ({success, data} / {success:false, error}).
 * Factory rather than a singleton so a future TMS (or other) backend can get its own client
 * pointed at its own base URL without touching this file.
 */
export function createApiClient(baseUrl: string) {
  async function request<T>(
    path: string,
    options: { method?: string; params?: QueryParams; body?: unknown } = {},
  ): Promise<T> {
    const { method = "GET", params, body } = options;
    const url = `${baseUrl}${path}${buildQueryString(params)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new HttpError(
        `Unable to reach the WMS Exception Engine API at ${baseUrl}. Is the backend running?`,
        0,
      );
    }

    let payload: ApiResponse<T> | undefined;
    try {
      payload = (await response.json()) as ApiResponse<T>;
    } catch {
      // no JSON body (e.g. network-level error page) — fall through to status-based error
    }

    if (!response.ok || !payload || payload.success === false) {
      const message =
        (payload && payload.success === false && payload.error?.message) ||
        `Request to ${path} failed with status ${response.status}`;
      const details = payload && payload.success === false ? payload.error?.details : undefined;
      throw new HttpError(message, response.status, details);
    }

    return payload.data;
  }

  /**
   * For list endpoints, which also return `count`. NOTE: `count` is the length of the
   * returned page, not a total row count — the backend's list endpoints (see
   * exception.controller.ts / prediction.controller.ts) never compute one. Callers must not
   * treat it as "total matching records".
   */
  async function requestList<T>(path: string, params?: QueryParams): Promise<{ data: T[]; count: number }> {
    const url = `${baseUrl}${path}${buildQueryString(params)}`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      throw new HttpError(
        `Unable to reach the WMS Exception Engine API at ${baseUrl}. Is the backend running?`,
        0,
      );
    }

    let payload: ApiResponse<T[]> | undefined;
    try {
      payload = (await response.json()) as ApiResponse<T[]>;
    } catch {
      // fall through
    }

    if (!response.ok || !payload || payload.success === false) {
      const message =
        (payload && payload.success === false && payload.error?.message) ||
        `Request to ${path} failed with status ${response.status}`;
      throw new HttpError(message, response.status);
    }

    return { data: payload.data, count: payload.count ?? payload.data.length };
  }

  return {
    get: <T>(path: string, params?: QueryParams) => request<T>(path, { params }),
    getList: <T>(path: string, params?: QueryParams) => requestList<T>(path, params),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  };
}
