import { asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { galleryItems, siteSettings, testimonials, youtubeVideos } from "@/lib/db/schema"

export type SiteContent = Record<string, string>
export type YouTubeVideo = { id: string; title: string; published: string; thumbnail: string; url: string }

export async function getSiteContent() {
  const rows = await db.select().from(siteSettings)
  return Object.fromEntries(rows.map((item) => [item.key, item.value])) as SiteContent
}

export async function getPublishedGallery() {
  return db.select().from(galleryItems).where(eq(galleryItems.status, "published")).orderBy(asc(galleryItems.sortOrder))
}

export async function getPublishedTestimonials() {
  return db.select().from(testimonials).where(eq(testimonials.status, "published")).orderBy(asc(testimonials.sortOrder))
}

/**
 * Reads videos from the local `youtube_videos` cache table, which is refreshed once a
 * day by the Vercel Cron job at /api/cron/youtube (see lib/youtube-sync.ts). This never
 * calls out to YouTube directly, so page loads stay fast and don't depend on YouTube's
 * availability.
 */
export async function getYouTubeVideos(content: SiteContent): Promise<YouTubeVideo[]> {
  if (content.youtubeEnabled === "false" || !content.youtubeUrl) return []
  const limit = Math.min(12, Math.max(1, Number(content.youtubeLimit) || 6))
  const rows = await db.select().from(youtubeVideos).orderBy(desc(youtubeVideos.publishedAt)).limit(limit)
  return rows.map((row) => ({
    id: row.videoId,
    title: row.title,
    published: row.publishedAt.toISOString(),
    thumbnail: row.thumbnailUrl,
    url: `https://www.youtube.com/watch?v=${row.videoId}`,
  }))
}
