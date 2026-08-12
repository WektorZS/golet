import { NextResponse } from "next/server"
import { syncYouTubeVideos } from "@/lib/youtube-sync"

export const dynamic = "force-dynamic"

/**
 * Invoked once a day by Vercel Cron (see vercel.json) to refresh the cached list of
 * the channel's YouTube videos. Vercel signs cron requests with an Authorization
 * header containing CRON_SECRET; any request without a matching header is rejected.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await syncYouTubeVideos()
    return NextResponse.json({ ok: true, ...result })
  } catch {
    return NextResponse.json({ ok: false, error: "Synchronizacja nie powiodła się" }, { status: 500 })
  }
}
