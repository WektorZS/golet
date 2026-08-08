"use server"

import { del, put } from "@vercel/blob"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/require-admin"
import { db } from "@/lib/db"
import {
  adminActivity,
  galleryItems,
  inquiries,
  mediaAssets,
  siteSettings,
  testimonials,
  tripGalleryItems,
  trips,
} from "@/lib/db/schema"

const statuses = ["draft", "published", "archived"] as const
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim()
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

async function logActivity(userId: string, action: string, entityType: string, entityId?: string, details = "") {
  await db.insert(adminActivity).values({ userId, action, entityType, entityId, details })
}

function refreshPublic() {
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/wyjazdy")
}

const tripSchema = z.object({
  title: z.string().min(3).max(120), opponent: z.string().min(2).max(100), city: z.string().min(2).max(100),
  country: z.string().min(2).max(100), startDate: z.string().date(), endDate: z.string().optional(),
  price: z.coerce.number().int().nonnegative().max(1_000_000), status: z.enum(statuses), description: z.string().max(8000),
})

export async function saveTrip(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))
  const parsed = tripSchema.safeParse({
    title: clean(formData.get("title")), opponent: clean(formData.get("opponent")), city: clean(formData.get("city")),
    country: clean(formData.get("country")), startDate: clean(formData.get("startDate")), endDate: clean(formData.get("endDate")) || undefined,
    price: clean(formData.get("price")), status: clean(formData.get("status")), description: clean(formData.get("description")),
  })
  if (!parsed.success) throw new Error("Sprawdź wymagane pola wyjazdu")
  const slug = slugify(clean(formData.get("slug")) || parsed.data.title)
  const duplicate = await db.select({ id: trips.id }).from(trips).where(id ? and(eq(trips.slug, slug), ne(trips.id, id)) : eq(trips.slug, slug)).limit(1)
  if (duplicate.length) throw new Error("Ten adres URL jest już używany")
  const values = {
    ...parsed.data, slug, endDate: parsed.data.endDate || null, image: clean(formData.get("image")) || "/placeholder.jpg",
    featured: formData.get("featured") === "on", includes: clean(formData.get("includes")).split("\n").map((item) => item.trim()).filter(Boolean),
    sortOrder: Number(formData.get("sortOrder")) || 0, seoTitle: clean(formData.get("seoTitle")), seoDescription: clean(formData.get("seoDescription")), updatedAt: new Date(),
  }
  if (Number.isInteger(id) && id > 0) {
    await db.update(trips).set(values).where(eq(trips.id, id))
    await logActivity(user.id, "updated", "trip", String(id), parsed.data.title)
  } else {
    const [created] = await db.insert(trips).values(values).returning({ id: trips.id })
    await logActivity(user.id, "created", "trip", String(created.id), parsed.data.title)
  }
  refreshPublic()
}

export async function setTripStatus(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id")); const status = clean(formData.get("status"))
  if (!Number.isInteger(id) || !statuses.includes(status as typeof statuses[number])) return
  await db.update(trips).set({ status, updatedAt: new Date() }).where(eq(trips.id, id))
  await logActivity(user.id, status, "trip", String(id))
  refreshPublic()
}

export async function duplicateTrip(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  const [trip] = await db.select().from(trips).where(eq(trips.id, id)).limit(1)
  if (!trip) return
  const [{ id: createdId }] = await db.insert(trips).values({ ...trip, id: undefined, slug: `${trip.slug}-kopia-${Date.now().toString().slice(-5)}`, title: `${trip.title} — kopia`, status: "draft", featured: false, createdAt: new Date(), updatedAt: new Date() }).returning({ id: trips.id })
  await logActivity(user.id, "duplicated", "trip", String(createdId), trip.title)
  refreshPublic()
}

export async function updateInquiry(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id")); const status = clean(formData.get("status"))
  if (!Number.isInteger(id) || !["new", "contacted", "closed"].includes(status)) return
  await db.update(inquiries).set({ status, adminNote: clean(formData.get("adminNote")), updatedAt: new Date() }).where(eq(inquiries.id, id))
  await logActivity(user.id, "updated", "inquiry", String(id), status)
  revalidatePath("/admin")
}

export async function saveTestimonial(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  const values = { author: clean(formData.get("author")), tripName: clean(formData.get("tripName")), content: clean(formData.get("content")), rating: Math.min(5, Math.max(1, Number(formData.get("rating")) || 5)), status: clean(formData.get("status")) === "published" ? "published" : "draft", sortOrder: Number(formData.get("sortOrder")) || 0, updatedAt: new Date() }
  if (!values.author || !values.content) throw new Error("Autor i treść opinii są wymagane")
  if (id > 0) await db.update(testimonials).set(values).where(eq(testimonials.id, id)); else await db.insert(testimonials).values(values)
  await logActivity(user.id, id > 0 ? "updated" : "created", "testimonial", id > 0 ? String(id) : undefined, values.author)
  refreshPublic()
}

export async function archiveTestimonial(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await db.update(testimonials).set({ status: "archived", updatedAt: new Date() }).where(eq(testimonials.id, id))
  await logActivity(user.id, "archived", "testimonial", String(id)); refreshPublic()
}

const ALLOWED_SETTING_KEYS = new Set([
  "heroEyebrow", "heroTitle", "heroDescription", "heroCta", "tripsTitle", "tripsDescription",
  "customTripTitle", "packageTitle", "benefitsTitle", "galleryTitle", "galleryHomeLimit",
  "testimonialsTitle", "processTitle", "aboutTitle", "aboutText", "faqTitle", "contactTitle",
  "youtubeTitle", "youtubeUrl", "youtubeLimit", "youtubeEnabled",
])

export async function saveSettings(formData: FormData) {
  const user = await requireAdmin()
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("setting.")) continue
    const settingKey = key.slice(8)
    if (!ALLOWED_SETTING_KEYS.has(settingKey)) continue
    const settingValue = String(value).slice(0, 4000)
    await db.insert(siteSettings).values({ key: settingKey, value: settingValue, updatedAt: new Date() }).onConflictDoUpdate({ target: siteSettings.key, set: { value: settingValue, updatedAt: new Date() } })
  }
  await logActivity(user.id, "updated", "settings", undefined, "Treści strony")
  refreshPublic()
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const

/** Confirms the file's magic bytes match a claimed image type; rejects mislabeled or disguised uploads. */
function detectImageType(bytes: Uint8Array): (typeof ALLOWED_IMAGE_TYPES)[number] | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg"
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png"
  if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp"
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "image/avif"
  return null
}

export async function uploadMedia(formData: FormData) {
  const user = await requireAdmin(); const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) throw new Error("Wybierz plik")
  if (file.size > 8 * 1024 * 1024) throw new Error("Plik może mieć maksymalnie 8 MB")
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) throw new Error("Dozwolone formaty: JPEG, PNG, WebP i AVIF")
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const detectedType = detectImageType(header)
  if (!detectedType || detectedType !== file.type) throw new Error("Zawartość pliku nie zgadza się z jego typem")
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80)
  const blob = await put(`admin/${crypto.randomUUID()}-${safeName}`, file, { access: "private", addRandomSuffix: false })
  const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: file.type, size: file.size, alt: clean(formData.get("alt")), originalName: file.name, createdBy: user.id }).returning({ id: mediaAssets.id })
  await logActivity(user.id, "uploaded", "media", String(asset.id), file.name)
  revalidatePath("/admin")
}

export async function updateMedia(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await db.update(mediaAssets).set({ alt: clean(formData.get("alt")), updatedAt: new Date() }).where(eq(mediaAssets.id, id))
  await logActivity(user.id, "updated", "media", String(id)); refreshPublic()
}

export async function deleteMedia(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!asset) return
  const [globalUse, tripUse, coverUse] = await Promise.all([
    db.select({ id: galleryItems.id }).from(galleryItems).where(eq(galleryItems.mediaId, id)).limit(1),
    db.select({ id: tripGalleryItems.id }).from(tripGalleryItems).where(eq(tripGalleryItems.mediaId, id)).limit(1),
    db.select({ id: trips.id }).from(trips).where(eq(trips.image, `/api/media/${id}`)).limit(1),
  ])
  if (globalUse.length || tripUse.length || coverUse.length) throw new Error("To zdjęcie jest używane w galerii lub jako okładka wyjazdu")
  await del(asset.pathname); await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  await logActivity(user.id, "deleted", "media", String(id), asset.originalName); revalidatePath("/admin")
}

export async function addGalleryItem(formData: FormData) {
  const user = await requireAdmin(); const mediaId = Number(formData.get("mediaId")); const tripId = Number(formData.get("tripId"))
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
  if (!asset) throw new Error("Nie znaleziono zdjęcia")
  if (tripId > 0) await db.insert(tripGalleryItems).values({ tripId, mediaId, caption: clean(formData.get("caption")), alt: clean(formData.get("alt")) || asset.alt, sortOrder: Number(formData.get("sortOrder")) || 0 })
  else await db.insert(galleryItems).values({ title: clean(formData.get("caption")) || asset.originalName, city: clean(formData.get("city")), image: `/api/media/${mediaId}`, mediaId, alt: clean(formData.get("alt")) || asset.alt, sortOrder: Number(formData.get("sortOrder")) || 0 })
  await logActivity(user.id, "added", tripId > 0 ? "trip_gallery" : "gallery", String(mediaId)); refreshPublic()
}

export async function setTripCover(formData: FormData) {
  const user = await requireAdmin()
  const tripId = Number(formData.get("tripId"))
  const mediaId = Number(formData.get("mediaId"))
  if (!Number.isInteger(tripId) || !Number.isInteger(mediaId)) throw new Error("Wybierz wyjazd i zdjęcie")
  const [asset] = await db.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
  if (!asset) throw new Error("Nie znaleziono zdjęcia")
  await db.update(trips).set({ image: `/api/media/${mediaId}`, updatedAt: new Date() }).where(eq(trips.id, tripId))
  await logActivity(user.id, "updated_cover", "trip", String(tripId), `Media #${mediaId}`)
  refreshPublic()
}

export async function removeGalleryItem(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id")); const scope = clean(formData.get("scope"))
  if (scope === "trip") await db.delete(tripGalleryItems).where(eq(tripGalleryItems.id, id)); else await db.delete(galleryItems).where(eq(galleryItems.id, id))
  await logActivity(user.id, "removed", `${scope}_gallery`, String(id)); refreshPublic()
}
