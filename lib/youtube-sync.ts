import { notInArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { siteSettings, youtubeVideos } from "@/lib/db/schema"

const MAX_CACHED_VIDEOS = 20
const YOUTUBE_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; LetsGolBot/1.0; +https://golet.vercel.app)",
  Accept: "application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
}

async function resolveChannelId(channelUrl: string) {
  if (!channelUrl) return null
  let url: URL
  try {
    url = new URL(channelUrl)
  } catch {
    return null
  }
  if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) return null
  const direct = url.pathname.match(/^\/channel\/(UC[\w-]{20,})/)
  if (direct) return direct[1]
  try {
    const response = await fetch(url.toString(), { cache: "no-store", headers: YOUTUBE_REQUEST_HEADERS })
    if (!response.ok) return null
    const html = await response.text()
    return html.match(/"externalId":"(UC[\w-]+)"/)?.[1] ?? html.match(/channel_id=(UC[\w-]+)/)?.[1] ?? null
  } catch {
    return null
  }
}

async function recordSyncResult(status: string) {
  const now = new Date().toISOString()
  await db
    .insert(siteSettings)
    .values({ key: "youtubeLastSyncedAt", value: now })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: now, updatedAt: new Date() } })
  await db
    .insert(siteSettings)
    .values({ key: "youtubeLastSyncStatus", value: status })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: status, updatedAt: new Date() } })
}

/**
 * Fetches the latest videos from the configured YouTube channel's public RSS feed
 * and refreshes the local `youtube_videos` cache table. Called once a day by the
 * Vercel Cron job at /api/cron/youtube, and optionally on-demand from the admin panel.
 */
export async function syncYouTubeVideos() {
  const rows = await db.select().from(siteSettings)
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]))

  if (settings.youtubeEnabled === "false" || !settings.youtubeUrl) {
    await recordSyncResult("Pominięto: brak skonfigurowanego kanału YouTube")
    return { synced: 0 }
  }

  const channelId = await resolveChannelId(settings.youtubeUrl)
  if (!channelId) {
    await recordSyncResult("Błąd: nie udało się rozpoznać kanału YouTube")
    throw new Error("Nie udało się rozpoznać kanału YouTube")
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  let response: Response | null = null
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(feedUrl, { cache: "no-store", headers: YOUTUBE_REQUEST_HEADERS })
    if (response.ok) break
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
  }

  if (!response?.ok) {
    const status = response?.status ?? 0
    await recordSyncResult(`Błąd: YouTube odpowiedział kodem ${status} po 3 próbach`)
    throw new Error(`YouTube feed request failed with ${status} after 3 attempts`)
  }

  const xml = await response.text()
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []
  const videos = entries
    .map((entry) => {
      const read = (pattern: RegExp) => entry.match(pattern)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") ?? ""
      const videoId = read(/<yt:videoId>(.*?)<\/yt:videoId>/)
      return {
        videoId,
        title: read(/<title>([\s\S]*?)<\/title>/),
        publishedAt: read(/<published>(.*?)<\/published>/),
      }
    })
    .filter((video) => video.videoId && video.publishedAt)
    .slice(0, MAX_CACHED_VIDEOS)

  for (const [index, video] of videos.entries()) {
    const thumbnailUrl = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
    const publishedAt = new Date(video.publishedAt)
    await db
      .insert(youtubeVideos)
      .values({ videoId: video.videoId, title: video.title, thumbnailUrl, publishedAt, sortOrder: index })
      .onConflictDoUpdate({
        target: youtubeVideos.videoId,
        set: { title: video.title, thumbnailUrl, publishedAt, sortOrder: index },
      })
  }

  const currentIds = videos.map((video) => video.videoId)
  if (currentIds.length > 0) {
    await db.delete(youtubeVideos).where(notInArray(youtubeVideos.videoId, currentIds))
  }

  await recordSyncResult(`Powodzenie: zapisano ${videos.length} filmów`)
  return { synced: videos.length }
}
