export const DEFAULT_ADMIN_EMAIL = "michu1209@gmail.com"

export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase()
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && email.trim().toLowerCase() === getAdminEmail())
}
