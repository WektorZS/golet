/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: { unoptimized: true },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: https://i.ytimg.com blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.neon.tech; font-src 'self' data:; object-src 'none'",
        },
      ],
    }]
  },
}

export default nextConfig
