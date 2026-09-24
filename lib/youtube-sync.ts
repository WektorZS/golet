import { db } from "@/lib/db"
import { siteSettings, youtubeVideos } from "@/lib/db/schema"

const MAX_CACHED_VIDEOS = 20

const YOUTUBE_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; LetsGolBot/1.0; +https://letsgol.eu)",
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

  if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
    return null
  }

  const direct = url.pathname.match(/^\/channel\/(UC[\w-]{20,})/)

  if (direct) return direct[1]

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: YOUTUBE_REQUEST_HEADERS,
    })

    if (!response.ok) return null

    const html = await response.text()

    return (
      html.match(/"externalId":"(UC[\w-]+)"/)?.[1] ??
      html.match(/channel_id=(UC[\w-]+)/)?.[1] ??
      null
    )
  } catch {
    return null
  }
}

async function recordSyncResult(status: string) {
  const now = new Date().toISOString()

  await db
    .insert(siteSettings)
    .values({
      key: "youtubeLastSyncedAt",
      value: now,
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: now,
        updatedAt: new Date(),
      },
    })

  await db
    .insert(siteSettings)
    .values({
      key: "youtubeLastSyncStatus",
      value: status,
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: status,
        updatedAt: new Date(),
      },
    })
}

/**
 * Fetches the latest videos from the configured YouTube channel's public RSS feed
 * and refreshes the local `youtube_videos` library.
 *
 * Important:
 * - synchronization updates only YouTube-owned metadata;
 * - `featured` is controlled manually by the admin;
 * - `sortOrder` is controlled manually by the admin;
 * - previously cached videos are not deleted automatically, so a featured video
 *   cannot disappear from the homepage just because it is no longer in the RSS feed.
 */
export async function syncYouTubeVideos() {
  const rows = await db.select().from(siteSettings)

  const settings = Object.fromEntries(
    rows.map((row) => [row.key, row.value])
  )

  if (settings.youtubeEnabled === "false" || !settings.youtubeUrl) {
    await recordSyncResult(
      "Pominięto: brak skonfigurowanego kanału YouTube"
    )

    return { synced: 0 }
  }

  const channelId = await resolveChannelId(settings.youtubeUrl)

  if (!channelId) {
    await recordSyncResult(
      "Błąd: nie udało się rozpoznać kanału YouTube"
    )

    throw new Error("Nie udało się rozpoznać kanału YouTube")
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
    channelId
  )}`

  let response: Response | null = null

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(feedUrl, {
      cache: "no-store",
      headers: YOUTUBE_REQUEST_HEADERS,
    })

    if (response.ok) break

    if (attempt < 3) {
      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 1000)
      )
    }
  }

  if (!response?.ok) {
    const status = response?.status ?? 0

    await recordSyncResult(
      `Błąd: YouTube odpowiedział kodem ${status} po 3 próbach`
    )

    throw new Error(
      `YouTube feed request failed with ${status} after 3 attempts`
    )
  }

  const xml = await response.text()

  const entries =
    xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []

  const videos = entries
    .map((entry) => {
      const read = (pattern: RegExp) =>
        entry
          .match(pattern)?.[1]
          ?.replace(/<!\[CDATA\[|\]\]>/g, "") ?? ""

      const videoId = read(
        /<yt:videoId>(.*?)<\/yt:videoId>/
      )

      return {
        videoId,
        title: read(
          /<title>([\s\S]*?)<\/title>/
        ),
        publishedAt: read(
          /<published>(.*?)<\/published>/
        ),
      }
    })
    .filter(
      (video) =>
        video.videoId &&
        video.publishedAt
    )
    .slice(0, MAX_CACHED_VIDEOS)

  for (const video of videos) {
    const thumbnailUrl =
      `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`

    const publishedAt = new Date(video.publishedAt)

    await db
      .insert(youtubeVideos)
      .values({
        videoId: video.videoId,
        title: video.title,
        thumbnailUrl,
        publishedAt,

        // Nowe filmy nie trafiają automatycznie na stronę główną.
        featured: false,

        // Kolejność zostanie ustawiona dopiero po ręcznym
        // dodaniu filmu na stronę.
        sortOrder: 0,
      })
      .onConflictDoUpdate({
        target: youtubeVideos.videoId,

        // Synchronizacja może aktualizować tylko dane pochodzące
        // z YouTube. Nie wolno tutaj zmieniać featured ani sortOrder.
        set: {
          title: video.title,
          thumbnailUrl,
          publishedAt,
        },
      })
  }

  await recordSyncResult(
    `Powodzenie: zsynchronizowano ${videos.length} filmów`
  )

  return {
    synced: videos.length,
  }
}
