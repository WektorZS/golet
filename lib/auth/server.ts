import { createNeonAuth } from "@neondatabase/auth/next/server"
import { headers } from "next/headers"

export function isAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET)
}

export function getAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  const secret = process.env.NEON_AUTH_COOKIE_SECRET
  if (!baseUrl || !secret) throw new Error("Neon Auth is not configured")
  return createNeonAuth({ baseUrl, cookies: { secret }, logLevel: "warn" })
}

export async function resetPasswordWithOtp(input: {
  email: string
  otp: string
  password: string
}) {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  if (!baseUrl) return { error: "Neon Auth is not configured" }

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
