import type { NextConfig } from "next";

/**
 * Hostinger shared / static hosting: use `output: "export"` (default here).
 * Hostinger VPS / Node hosting: set NEXT_OUTPUT=standalone (or remove export)
 * and deploy with `next start` / standalone server.
 */
const useStaticExport = process.env.NEXT_OUTPUT !== "standalone";

const nextConfig: NextConfig = {
  ...(useStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        output: "standalone" as const,
      }),
};

export default nextConfig;
