import type { NextConfig } from "next";
import path from "path";

/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` on script-src is still required: Next.js injects inline
 * bootstrap/flight scripts and this app has no middleware issuing per-request
 * nonces. The policy is therefore not XSS-proof on its own, but it does close
 * the wider holes — it pins which third-party origins may serve script,
 * styles, images, and connections, blocks plugins and `<base>` hijacking,
 * stops form posts to foreign origins, and forbids framing the site.
 *
 * Origins in the allowlist:
 *   unpkg / jsdelivr        Leaflet + Chart.js on trail pages (loaded with SRI)
 *   *.tile.openstreetmap.org  map tiles
 *   google.com / gstatic    reCAPTCHA, only when a site key is configured
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://unpkg.com https://cdn.jsdelivr.net",
  "frame-src https://www.google.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
