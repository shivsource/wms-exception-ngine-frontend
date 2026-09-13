import http from "node:http";
import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy to the WMS Exception Engine backend.
 *
 * Three problems this solves at once:
 * 1. Port 6000 (the backend's port) is on the WHATWG Fetch spec's forbidden-port list (reserved
 *    for X11) — a browser refuses to fetch it directly (ERR_UNSAFE_PORT), in dev and in any real
 *    deployment. The browser instead calls same-origin /wms-api/*, which this route forwards to
 *    the real backend from the server.
 * 2. That same forbidden-port list is enforced by Node's own `fetch()`/undici too, not just
 *    browsers — so the server side of this proxy can't use `fetch()` either, or it hits the
 *    identical `TypeError: fetch failed` / `bad port` even though the backend is reachable
 *    (curl, wget, and Node's `http` module aren't Fetch-spec-compliant and don't enforce it).
 *    That's why this uses `node:http` directly instead of `fetch()`.
 * 3. This reads `process.env.WMS_BACKEND_ORIGIN` fresh on every request — unlike a
 *    `next.config.ts` `rewrites()` destination (resolved once at build time and frozen into
 *    the production build), a Route Handler runs per-request in the Node.js server process, so
 *    the backend origin stays configurable via the container's runtime environment (docker
 *    compose `.env`) without rebuilding the image.
 */
const WMS_BACKEND_ORIGIN = process.env.WMS_BACKEND_ORIGIN ?? "http://localhost:6000";

type BackendResponse = { status: number; contentType: string | undefined; body: string };

function forward(targetUrl: string, method: string, body: string | undefined): Promise<BackendResponse> {
  const url = new URL(targetUrl);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method,
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 502,
            contentType: res.headers["content-type"],
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    req.on("error", reject);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const targetUrl = `${WMS_BACKEND_ORIGIN}/${path.join("/")}${req.nextUrl.search}`;

  let backendResponse: BackendResponse;
  try {
    backendResponse = await forward(
      targetUrl,
      req.method,
      req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: `Unable to reach the WMS Exception Engine backend at ${WMS_BACKEND_ORIGIN}.` },
      },
      { status: 502 },
    );
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: { "Content-Type": backendResponse.contentType ?? "application/json" },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxy(req, path);
}
