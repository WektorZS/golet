"use server"

import { del, put } from "@vercel/blob"
import { and, asc, eq, ne, sql } from "drizzle-orm"
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
import { optimizeUploadedImage } from "@/lib/optimize-image"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"
import { syncYouTubeVideos } from "@/lib/youtube-sync"

const statuses = ["draft", "published", "archived"] as const
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim()
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

async function logActivity(userId: string, action: string, entityType: string, entityId?: string, details = "") {
  await db.transaction(async (tx) => {
    await tx.insert(adminActivity).values({ userId, action, entityType, entityId, details })
    await tx.execute(sql`
      DELETE FROM admin_activity
      WHERE id NOT IN (
        SELECT id FROM admin_activity ORDER BY created_at DESC, id DESC LIMIT 10
      )
    `)
  })
}

function refreshPublic() {
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/galeria")
  revalidatePath("/wyjazdy")
}

const tripSchema = z.object({
  title: z.string().min(3).max(120), city: z.string().min(2).max(100),
  country: z.string().min(2).max(100), startDate: z.string().date(), endDate: z.string().optional(),
  price: z.coerce.number().int().nonnegative().max(1_000_000), status: z.enum(statuses),
  description: z.string().max(12000).refine((value) => stripHtml(value).length <= 8000, "Opis jest za długi"),
})

export type SaveTripState = { success?: boolean; error?: string }

export async function saveTrip(_: SaveTripState, formData: FormData): Promise<SaveTripState> {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))
  // The description field carries HTML produced by the restricted rich-text editor
  // (bold/italic/lists/links only); sanitize before validation so stored content is
  // always the safe, allowlisted subset regardless of what the client actually sent.
  const description = sanitizeDescriptionHtml(clean(formData.get("description")))
  const parsed = tripSchema.safeParse({
    title: clean(formData.get("title")), city: clean(formData.get("city")),
    country: clean(formData.get("country")), startDate: clean(formData.get("startDate")), endDate: clean(formData.get("endDate")) || undefined,
    price: clean(formData.get("price")), status: clean(formData.get("status")), description,
  })
  if (!parsed.success) return { error: "Sprawdź wymagane pola wyjazdu." }
  const slug = slugify(clean(formData.get("slug")) || parsed.data.title)
  const duplicate = await db.select({ id: trips.id }).from(trips).where(id ? and(eq(trips.slug, slug), ne(trips.id, id)) : eq(trips.slug, slug)).limit(1)
  if (duplicate.length) return { error: "Ten adres URL jest już używany." }

  const isEditing = Number.isInteger(id) && id > 0
  let image = clean(formData.get("image"))
  if (isEditing && !image) {
    const [existingTrip] = await db.select({ image: trips.image }).from(trips).where(eq(trips.id, id)).limit(1)
    image = existingTrip?.image || ""
  }
  const coverFile = formData.get("coverFile")
  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      const optimized = await optimizeUploadedImage(coverFile)
      const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
      const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: optimized.contentType, size: optimized.size, width: optimized.width, height: optimized.height, alt: parsed.data.title, originalName: coverFile.name, createdBy: user.id }).returning({ id: mediaAssets.id })
      image = `/api/media/${asset.id}`
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zoptymalizować zdjęcia." }
    }
  }

  const values = {
    ...parsed.data, opponent: parsed.data.title, slug, endDate: parsed.data.endDate || null, image,
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
  return { success: true }
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

export async function deleteTrip(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) return

  const [trip] = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .limit(1)

  if (!trip) return

  // Pobierz wszystkie zdjęcia przypisane do tego wyjazdu
  const tripGallery = await db
    .select({ mediaId: tripGalleryItems.mediaId })
    .from(tripGalleryItems)
    .where(eq(tripGalleryItems.tripId, id))

  const mediaIds = new Set<number>()


const coverMatch = trip.image?.match(/^\/api\/media\/(\d+)$/)
  if (coverMatch) {
    mediaIds.add(Number(coverMatch[1]))
  }

 
  for (const item of tripGallery) {
    if (item.mediaId) {
      mediaIds.add(item.mediaId)
    }
  }

  await db
    .delete(tripGalleryItems)
    .where(eq(tripGalleryItems.tripId, id))

  await db
    .delete(trips)
    .where(eq(trips.id, id))


  for (const mediaId of mediaIds) {
    const [globalUse, tripUse, coverUse] = await Promise.all([
      db
        .select({ id: galleryItems.id })
        .from(galleryItems)
        .where(eq(galleryItems.mediaId, mediaId))
        .limit(1),

      db
        .select({ id: tripGalleryItems.id })
        .from(tripGalleryItems)
        .where(eq(tripGalleryItems.mediaId, mediaId))
        .limit(1),

      db
        .select({ id: trips.id })
        .from(trips)
        .where(eq(trips.image, `/api/media/${mediaId}`))
        .limit(1),
    ])

    if (globalUse.length || tripUse.length || coverUse.length) {
      continue
    }

    const [asset] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, mediaId))
      .limit(1)

    if (!asset) continue

    await del(asset.pathname)

    await db
      .delete(mediaAssets)
      .where(eq(mediaAssets.id, mediaId))
  }

  await logActivity(
    user.id,
    "deleted",
    "trip",
    String(id),
    trip.title
  )

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
  "seoTitle", "seoDescription",
  "heroEyebrow", "heroTitle", "heroDescription", "heroCta", "tripsTitle", "tripsDescription",
  "customTripTitle", "packageTitle", "benefitsTitle", "galleryTitle", "galleryHomeLimit",
  "testimonialsTitle", "processTitle", "aboutTitle", "aboutText", "faqTitle", "contactTitle",
  "contactEmail", "contactPhone", "footerText", "companyName", "companyAddress", "companyNip",
  "youtubeTitle", "youtubeUrl", "youtubeLimit", "youtubeEnabled",
])

export type SaveSettingsState = { error?: string; success?: boolean }

export async function saveSettings(_: SaveSettingsState, formData: FormData): Promise<SaveSettingsState> {
  const user = await requireAdmin()
  try {
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("setting.")) continue
      const settingKey = key.slice(8)
      if (!ALLOWED_SETTING_KEYS.has(settingKey)) continue
      let settingValue = String(value).slice(0, 4000)
      if (settingKey === "galleryHomeLimit") settingValue = String(Math.min(5, Math.max(1, Number(settingValue) || 5)))
      await db.insert(siteSettings).values({ key: settingKey, value: settingValue, updatedAt: new Date() }).onConflictDoUpdate({ target: siteSettings.key, set: { value: settingValue, updatedAt: new Date() } })
    }
    await logActivity(user.id, "updated", "settings", undefined, "Treści strony")
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się zapisać treści strony. Spróbuj ponownie." }
  }
}

export async function uploadMedia(formData: FormData) {
  const user = await requireAdmin(); const file = formData.get("file")
  if (!(file instanceof File)) throw new Error("Wybierz plik")
  const optimized = await optimizeUploadedImage(file)
  const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
  const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: optimized.contentType, size: optimized.size, width: optimized.width, height: optimized.height, alt: clean(formData.get("alt")), originalName: file.name, createdBy: user.id }).returning({ id: mediaAssets.id })
  await logActivity(user.id, "uploaded", "media", String(asset.id), file.name)
  revalidatePath("/admin")
}

export async function updateMedia(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await db.update(mediaAssets).set({ alt: clean(formData.get("alt")), updatedAt: new Date() }).where(eq(mediaAssets.id, id))
  await logActivity(user.id, "updated", "media", String(id)); refreshPublic()
}
export async function deleteMedia(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowe ID zdjęcia")
  }

  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1)

  if (!asset) {
    throw new Error("Nie znaleziono zdjęcia")
  }

  // Usuń plik z Vercel Blob
  await del(asset.pathname)

  // Usuń zdjęcie z biblioteki
  await db
    .delete(mediaAssets)
    .where(eq(mediaAssets.id, id))

  await logActivity(
    user.id,
    "deleted",
    "media",
    String(id),
    asset.originalName
  )

  refreshPublic()
}

export type AddGalleryItemState = { error?: string; success?: boolean; message?: string }

export async function addGalleryItem(_: AddGalleryItemState, formData: FormData): Promise<AddGalleryItemState> {
  try {
    const user = await requireAdmin(); const mediaId = Number(formData.get("mediaId")); const tripId = Number(formData.get("tripId"))
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
    if (!asset) return { error: "Nie znaleziono zdjęcia" }
    if (tripId > 0) await db.insert(tripGalleryItems).values({ tripId, mediaId, caption: clean(formData.get("caption")), alt: clean(formData.get("alt")) || asset.alt, sortOrder: Number(formData.get("sortOrder")) || 0 })
    else await db.insert(galleryItems).values({ title: clean(formData.get("caption")) || asset.originalName, city: clean(formData.get("city")), image: `/api/media/${mediaId}`, mediaId, alt: clean(formData.get("alt")) || asset.alt, sortOrder: Number(formData.get("sortOrder")) || 0 })
    await logActivity(user.id, "added", tripId > 0 ? "trip_gallery" : "gallery", String(mediaId)); refreshPublic()
    return { success: true, message: tripId > 0 ? "Zdjęcie dodano do galerii wyjazdu." : "Zdjęcie dodano do galerii głównej." }
  } catch {
    return { error: "Nie udało się dodać zdjęcia do galerii." }
  }
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

export type UpdateGalleryItemState = { error?: string; success?: boolean }

export async function updateGalleryItem(_: UpdateGalleryItemState, formData: FormData): Promise<UpdateGalleryItemState> {
  try {
    const user = await requireAdmin()
    const id = Number(formData.get("id"))
    if (!Number.isInteger(id) || id <= 0) return { error: "Nieprawidłowe zdjęcie galerii." }
    await db.update(galleryItems).set({
      title: clean(formData.get("title")),
      city: clean(formData.get("city")),
    }).where(eq(galleryItems.id, id))
    await logActivity(user.id, "updated", "gallery", String(id))
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się zapisać zmian zdjęcia." }
  }
}

export async function updateTripGalleryItem(_: UpdateGalleryItemState, formData: FormData): Promise<UpdateGalleryItemState> {
  try {
    const user = await requireAdmin()
    const id = Number(formData.get("id"))
    if (!Number.isInteger(id) || id <= 0) return { error: "Nieprawidłowe zdjęcie galerii." }
    await db.update(tripGalleryItems).set({
      caption: clean(formData.get("caption")).slice(0, 160),
      alt: clean(formData.get("alt")).slice(0, 240),
      updatedAt: new Date(),
    }).where(eq(tripGalleryItems.id, id))
    await logActivity(user.id, "updated", "trip_gallery", String(id))
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się zapisać zmian zdjęcia." }
  }
}

export async function removeGalleryItem(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id")); const scope = clean(formData.get("scope"))
  if (scope === "trip") await db.delete(tripGalleryItems).where(eq(tripGalleryItems.id, id)); else await db.delete(galleryItems).where(eq(galleryItems.id, id))
  await logActivity(user.id, "removed", `${scope}_gallery`, String(id)); refreshPublic()
}

export type SyncYouTubeState = { error?: string; success?: boolean }

/** Lets an admin trigger the daily YouTube cache refresh on demand instead of waiting for the nightly cron job. */
export async function syncYouTubeNow(_: SyncYouTubeState, _formData: FormData): Promise<SyncYouTubeState> {
  const user = await requireAdmin()
  try {
    await syncYouTubeVideos()
    await logActivity(user.id, "synced", "youtube", undefined, "Ręczne odświeżenie listy filmów")
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się odświeżyć listy filmów. Sprawdź adres kanału YouTube w ustawieniach." }
    
  }
}

export async function reorderGalleryItems(formData: FormData) {
  const user = await requireAdmin()

  const scope = clean(formData.get("scope"))
  const items = JSON.parse(String(formData.get("items") || "[]")) as {
    id: number
    sortOrder: number
  }[]

  if (!Array.isArray(items)) return

  if (scope === "trip") {
    for (const item of items) {
      await db
        .update(tripGalleryItems)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(eq(tripGalleryItems.id, item.id))
    }
  } else {
    for (const item of items) {
      await db
        .update(galleryItems)
        .set({ sortOrder: item.sortOrder })
        .where(eq(galleryItems.id, item.id))
    }
  }

  await logActivity(
    user.id,
    "reordered",
    scope === "trip" ? "trip_gallery" : "gallery"
  )

  refreshPublic()
}
