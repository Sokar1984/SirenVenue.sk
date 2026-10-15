import type { NextConfig } from "next";

/**
 * Response headers that do not vary per request. The per-request
 * Content-Security-Policy lives in middleware.ts because it carries a nonce.
 *
 * HSTS max-age: 63072000s (2 years). Long enough that a browser that has seen
 * the site once stops offering HTTP for it, while still recoverable within a
 * release cycle. `includeSubDomains` covers the products. `preload` is on
 * (approved in the SEO batch): every *.sirenvenue.sk host must stay HTTPS-only,
 * and submission to hstspreload.org is a separate, deliberate step.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Brand marks change rarely; a day of cache, revalidated after.
      {
        source: "/brand/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
