import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth } from "@/lib/auth/server"

export async function requireAdmin() {
  const { data } = await getAuth().getSession()
  if (!data?.user || !isAdminEmail(data.user.email)) {
    throw new Error("Brak uprawnień administratora")
  }
  return data.user
}
