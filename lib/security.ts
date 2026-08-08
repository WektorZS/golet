import crypto from "node:crypto"

/** Trims a value and collapses control characters that have no legitimate use in short text fields. */
export function cleanText(value: FormDataEntryValue | null, maxLength = 500) {
  const raw = String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
  return raw.slice(0, maxLength)
}

/** Parses a positive integer id from untrusted input, returning null when invalid. */
export function safeId(value: FormDataEntryValue | null) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

/** Clamps a number into an inclusive range, falling back to a default when the input is not a finite number. */
export function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

/**
 * Escapes a value for CSV output and neutralizes spreadsheet formula injection
 * (values starting with =, +, -, @, tab or CR are prefixed with a single quote).
 */
export function csvCell(value: unknown) {
  let text = String(value ?? "")
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

/** Only allows http(s) URLs, rejecting javascript:, data:, and other unsafe schemes. */
export function safeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

/** Derives a best-effort client identifier from trusted proxy headers, never trusting client-supplied values. */
export function getClientIp(headers: Headers) {
  return headers.get("x-real-ip") || headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

const HASH_SECRET = process.env.BETTER_AUTH_SECRET || process.env.NEON_AUTH_COOKIE_SECRET || "letsgol-fallback-secret"

/** One-way HMAC so raw IPs/emails are never stored in the anti-spam table. */
export function hmac(value: string) {
  return crypto.createHmac("sha256", HASH_SECRET).update(value.toLowerCase().trim()).digest("hex")
}

/** Generic, non-revealing error message returned to clients instead of internal exception details. */
export const GENERIC_ERROR = "Coś poszło nie tak. Spróbuj ponownie później."
