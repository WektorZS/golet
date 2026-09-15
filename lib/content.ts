import { asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
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
  const rows = await db.select().from(siteSettings)

  return Object.fromEntries(
    rows.map((item) => [item.key, item.value])
  ) as SiteContent
}

export async function getPublishedGallery() {
  return db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.status, "published"))
    .orderBy(asc(galleryItems.sortOrder))
}

export async function getPublishedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(asc(testimonials.sortOrder))
}

/**
 * Filmy wybrane ręcznie przez administratora do wyświetlenia
 * na stronie głównej.
 */
export async function getYouTubeVideos(
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