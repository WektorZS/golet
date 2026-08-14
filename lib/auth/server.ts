import { createNeonAuth } from "@neondatabase/auth/next/server"
import { headers } from "next/headers"

function getAuthBaseUrl() {
  return (process.env.NEON_AUTH_BASE_URL ?? process.env.VITE_NEON_AUTH_URL)?.trim()
}

export function isAuthConfigured() {
  return Boolean(getAuthBaseUrl() && process.env.NEON_AUTH_COOKIE_SECRET?.trim())
}

export function getAuth() {
  const baseUrl = getAuthBaseUrl()
  const secret = process.env.NEON_AUTH_COOKIE_SECRET?.trim()
  if (!baseUrl && !secret) throw new Error("Neon Auth is not configured: missing NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET")
  if (!baseUrl) throw new Error("Neon Auth is not configured: missing NEON_AUTH_BASE_URL")
  if (!secret) throw new Error("Neon Auth is not configured: missing NEON_AUTH_COOKIE_SECRET")
  return createNeonAuth({ baseUrl, cookies: { secret }, logLevel: "warn" })
}

export async function resetPasswordWithOtp(input: {
  email: string
  otp: string
  password: string
}) {
  const baseUrl = getAuthBaseUrl()
  if (!baseUrl) return { error: "Neon Auth is not configured: missing Neon Auth base URL" }

  const requestHeaders = await headers()
  const referer = requestHeaders.get("referer")
  const origin =
    requestHeaders.get("origin") ??
    (referer ? new URL(referer).origin : null) ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")

  const response = await fetch(
    new URL("email-otp/reset-password", `${baseUrl.replace(/\/$/, "")}/`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(input),
      cache: "no-store",
    },
  )

  if (response.ok) return { error: null }

  const result = (await response.json().catch(() => null)) as
    | { message?: string }
    | null
  return { error: result?.message ?? "Nie udało się ustawić hasła." }
}
