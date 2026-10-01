import type { NextConfig } from "next";

/**
 * Response headers that do not vary per request. The per-request
 * Content-Security-Policy lives in middleware.ts because it carries a nonce.
 *
 * HSTS max-age: 63072000s (2 years). Long enough that a browser that has seen
 * the site once stops offering HTTP for it, while still recoverable within a
 * release cycle. `includeSubDomains` covers the products; `preload` is
 * deliberately omitted until every subdomain is audited as HTTPS-only, since
 * submission is effectively irreversible once browsers ship the list.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
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
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
