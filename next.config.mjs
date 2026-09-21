/** @type {import('next').NextConfig} */

const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'"

const nextConfig = {
  reactCompiler: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1366,
      1440,
      1600,
      1920,
      2048,
      3840,
    ],
    imageSizes: [
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: https://i.ytimg.com blob:; style-src 'self' 'unsafe-inline'; script-src ${scriptSrc}; connect-src 'self' https://*.neon.tech; font-src 'self' data:; object-src 'none'`,
          },
        ],
      },
    ]
  },
}

export default nextConfig