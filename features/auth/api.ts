import { HttpError } from "@/lib/api/http-error";
import { WMS_API_URL } from "@/lib/api/wms-client";

export interface LoginResult {
  email: string;
}

interface LoginResponseBody {
  success: boolean;
  message?: string;
  data?: { email: string };
}

/**
 * POST /api/auth/login has a deliberately different, flatter response contract than every
 * other wms-exception-engine-backend endpoint (`{success, message}` instead of
 * `{success, error: {message}}` — see backend src/controllers/auth.controller.ts), so it can't
 * go through lib/api/client.ts's generic envelope parsing. This talks to the same backend, via
 * the same same-origin /wms-api proxy (WMS_API_URL), just with its own minimal parsing.
 */
export const authApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    let response: Response;
    try {
      response = await fetch(`${WMS_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new HttpError("Unable to connect to server. Please try again.", 0);
    }

    let payload: LoginResponseBody | undefined;
    try {
      payload = (await response.json()) as LoginResponseBody;
    } catch {
      // no JSON body — fall through to status-based handling below
    }

    if (response.ok && payload?.success && payload.data) {
      return payload.data;
    }

    if (response.status === 401) {
      throw new HttpError(payload?.message ?? "Invalid email or password", 401);
    }
    if (response.status === 400) {
      throw new HttpError(payload?.message ?? "Invalid email or password", 400);
    }
    throw new HttpError("Unable to connect to server. Please try again.", response.status);
  },
};
