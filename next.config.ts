import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: bundles a minimal server.js with only the production deps it needs —
  // the standard, smallest-image pattern for running Next.js in Docker.
  output: "standalone",
};

export default nextConfig;
