export function getAdminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!email) {
    throw new Error("ADMIN_EMAIL is not configured")
  }

  return email
}