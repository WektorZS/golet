export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL ?? "")
    .trim()
    .toLowerCase()
}

export function isAdminEmail(email?: string | null) {
  return Boolean(
    email &&
    email.trim().toLowerCase() === getAdminEmail()
  )
}