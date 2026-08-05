"use server"

import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { inquiries, trips } from "@/lib/db/schema"
import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth } from "@/lib/auth/server"

async function requireAdmin() {
  const { data } = await getAuth().getSession()
  if (!data?.user || !isAdminEmail(data.user.email)) throw new Error("Unauthorized")
  return data.user.id
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  const status = String(formData.get("status"))
  if (!Number.isInteger(id) || !["new", "contacted", "closed"].includes(status)) return
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id))
  revalidatePath("/admin")
}

export async function toggleTripStatus(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  const current = String(formData.get("current"))
  if (!Number.isInteger(id)) return
  await db.update(trips).set({ status: current === "published" ? "draft" : "published", updatedAt: new Date() }).where(and(eq(trips.id, id), eq(trips.status, current)))
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/wyjazdy")
}
