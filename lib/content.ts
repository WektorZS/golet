import { asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { ensureTripColumns } from "@/lib/db/ensure-trip-columns"
import type { Locale } from "@/lib/i18n"
import {
  galleryItems,
  siteSettings,
  testimonials,
  youtubeVideos,
} from "@/lib/db/schema"

export type SiteContent = Record<string, string>

export type YouTubeVideo = {
  id: number
  videoId: string
  title: string
  published: string
  publishedAt: string
  thumbnail: string
  url: string
  featured: boolean
  sortOrder: number
}

export async function getSiteContent() {
  await ensureTripColumns()
  const rows = await db.select().from(siteSettings)

  return Object.fromEntries(
    rows.map((item) => [item.key, item.value])
  ) as SiteContent
}

export async function getPublishedGallery(locale: Locale = "pl") {
  await ensureTripColumns()
  const rows = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.status, "published"))
    .orderBy(asc(galleryItems.sortOrder))

  return rows.map((item, index) => locale === "en" ? {
    ...item,
    title: item.titleEn || `Match trip photo ${index + 1}`,
    city: item.cityEn || item.city,
    alt: item.altEn || `${item.cityEn || item.city || "Football match trip"} - photo ${index + 1}`,
  } : item)
}

export async function getPublishedTestimonials(locale: Locale = "pl") {
  await ensureTripColumns()
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(asc(testimonials.sortOrder))

  if (locale === "pl") return rows
  return rows
    .filter((item) => item.contentEn.trim())
    .map((item) => ({ ...item, tripName: item.tripNameEn || "Football match trip", content: item.contentEn }))
}

/**
 * Filmy wybrane ręcznie przez administratora do wyświetlenia
 * na stronie głównej.
 */
export async function getYouTubeVideos(
  content: SiteContent
): Promise<YouTubeVideo[]> {
  await ensureTripColumns()
  if (
    content.youtubeEnabled === "false" ||
    !content.youtubeUrl
  ) {
    return []
  }

  const rows = await db
    .select()
    .from(youtubeVideos)
    .where(eq(youtubeVideos.featured, true))
    .orderBy(
      asc(youtubeVideos.sortOrder),
      desc(youtubeVideos.publishedAt)
    )

  return rows.map((row) => ({
    id: row.id,
    videoId: row.videoId,
    title: row.title,
    published: row.publishedAt.toISOString(),
    publishedAt: row.publishedAt.toISOString(),
    thumbnail: row.thumbnailUrl,
    url: `https://www.youtube.com/watch?v=${row.videoId}`,
    featured: row.featured,
    sortOrder: row.sortOrder,
  }))
}

/**
 * Pełna biblioteka filmów dla panelu administratora.
 *
 * Zawiera zarówno filmy wybrane na stronę główną,
 * jak i pozostałe zsynchronizowane materiały.
 */
export async function getAdminYouTubeVideos(
  content: SiteContent
): Promise<YouTubeVideo[]> {
  if (
    content.youtubeEnabled === "false" ||
    !content.youtubeUrl
  ) {
    return []
  }

  const rows = await db
    .select()
    .from(youtubeVideos)
    .orderBy(desc(youtubeVideos.publishedAt))

  return rows.map((row) => ({
    id: row.id,
    videoId: row.videoId,
    title: row.title,
    published: row.publishedAt.toISOString(),
    publishedAt: row.publishedAt.toISOString(),
    thumbnail: row.thumbnailUrl,
    url: `https://www.youtube.com/watch?v=${row.videoId}`,
    featured: row.featured,
    sortOrder: row.sortOrder,
  }))
}
