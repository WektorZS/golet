import { get } from "@vercel/blob"
import { and, eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth } from "@/lib/auth/server"
import { db } from "@/lib/db"
import { galleryItems, mediaAssets, tripGalleryItems, trips } from "@/lib/db/schema"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: value } = await context.params
  const id = Number(value)
  if (!Number.isInteger(id)) return new NextResponse("Not found", { status: 404 })

  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!asset) return new NextResponse("Not found", { status: 404 })

  const { data } = await getAuth().getSession()
  const isAdmin = Boolean(data?.user && isAdminEmail(data.user.email))
  if (!isAdmin) {
    const [globalReference, tripReference, coverReference] = await Promise.all([
      db.select({ id: galleryItems.id }).from(galleryItems).where(and(eq(galleryItems.mediaId, id), eq(galleryItems.status, "published"))).limit(1),
      db.select({ id: tripGalleryItems.id }).from(tripGalleryItems).innerJoin(trips, eq(tripGalleryItems.tripId, trips.id)).where(and(eq(tripGalleryItems.mediaId, id), eq(tripGalleryItems.status, "published"), eq(trips.status, "published"))).limit(1),
      db.select({ id: trips.id }).from(trips).where(and(eq(trips.image, `/api/media/${id}`), eq(trips.status, "published"))).limit(1),
    ])
    if (!globalReference.length && !tripReference.length && !coverReference.length) return new NextResponse("Not found", { status: 404 })
  }

  const result = await get(asset.pathname, { access: "private", ifNoneMatch: request.headers.get("if-none-match") ?? undefined })
  if (!result) return new NextResponse("Not found", { status: 404 })
  if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, "Cache-Control": "public, max-age=0, must-revalidate" } })
  return new NextResponse(result.stream, { headers: { "Content-Type": result.blob.contentType, ETag: result.blob.etag, "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } })
}
