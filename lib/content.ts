import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { galleryItems, siteSettings, testimonials } from "@/lib/db/schema"

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

async function resolveChannelId(channelUrl: string) {
  if (!channelUrl) return null
  let url: URL
  try { url = new URL(channelUrl) } catch { return null }
  if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) return null
  const direct = url.pathname.match(/^\/channel\/(UC[\w-]{20,})/)
  if (direct) return direct[1]
  try {
    const response = await fetch(url.toString(), { next: { revalidate: 86400 }, headers: { "User-Agent": "Mozilla/5.0" } })
    if (!response.ok) return null
    const html = await response.text()
    return html.match(/"externalId":"(UC[\w-]+)"/)?.[1] ?? html.match(/channel_id=(UC[\w-]+)/)?.[1] ?? null
  } catch { return null }
}

export async function getYouTubeVideos(content: SiteContent): Promise<YouTubeVideo[]> {
  if (content.youtubeEnabled === "false" || !content.youtubeUrl) return []
  const channelId = await resolveChannelId(content.youtubeUrl)
  if (!channelId) return []
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 1800 } })
    if (!response.ok) return []
    const xml = await response.text()
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []
    const limit = Math.min(12, Math.max(1, Number(content.youtubeLimit) || 6))
    return entries.slice(0, limit).map((entry) => {
      const read = (pattern: RegExp) => entry.match(pattern)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") ?? ""
      const id = read(/<yt:videoId>(.*?)<\/yt:videoId>/)
      return { id, title: read(/<title>([\s\S]*?)<\/title>/), published: read(/<published>(.*?)<\/published>/), thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${id}` }
    }).filter((video) => video.id)
  } catch { return [] }
}
