import { get } from "@vercel/blob"
import { and, eq, or } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth } from "@/lib/auth/server"
import { db } from "@/lib/db"
import { ensureTripColumns } from "@/lib/db/ensure-trip-columns"
import { galleryItems, leagues, mediaAssets, teamGalleryItems, teams, tripGalleryItems, trips } from "@/lib/db/schema"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: value } = await context.params
  const id = Number(value)

  if (!Number.isSafeInteger(id) || id < 1) {
    return new NextResponse("Not found", { status: 404 })
  }

  await ensureTripColumns()

  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1)

  if (!asset) {
    return new NextResponse("Not found", { status: 404 })
  }


  let isAdmin = false

  try {
    const { data } = await getAuth().getSession()
    isAdmin = Boolean(data?.user && isAdminEmail(data.user.email))
  } catch {
    isAdmin = false
  }

  const [globalReference, tripReference, teamGalleryReference, tripImageReference, teamLogoReference, leagueLogoReference] =
    await Promise.all([
        db
          .select({ id: galleryItems.id })
          .from(galleryItems)
          .where(
            and(
              eq(galleryItems.mediaId, id),
              eq(galleryItems.status, "published")
            )
          )
          .limit(1),

        db
          .select({ id: tripGalleryItems.id })
          .from(tripGalleryItems)
          .innerJoin(trips, eq(tripGalleryItems.tripId, trips.id))
          .where(
            and(
              eq(tripGalleryItems.mediaId, id),
              eq(tripGalleryItems.status, "published"),
              eq(trips.status, "published")
            )
          )
          .limit(1),

        db.select({ id: teamGalleryItems.id }).from(teamGalleryItems).where(and(eq(teamGalleryItems.mediaId, id), eq(teamGalleryItems.status, "published"))).limit(1),

        db
          .select({ id: trips.id })
          .from(trips)
          .where(
            and(
              or(
                eq(trips.coverMediaId, id),
                eq(trips.image, `/api/media/${id}`),
                eq(trips.homeLogo, `/api/media/${id}`),
                eq(trips.awayLogo, `/api/media/${id}`)
              ),
              eq(trips.status, "published")
            )
          )
          .limit(1),

        db
          .select({ id: teams.id })
          .from(teams)
          .where(
            or(
              eq(teams.logo, `/api/media/${id}`),
              eq(teams.tripImageMediaId, id)
            )
          )
          .limit(1),
        db.select({ id: leagues.id }).from(leagues).where(eq(leagues.logo, `/api/media/${id}`)).limit(1),
    ])

  const isPublic = Boolean(
    globalReference.length ||
      tripReference.length ||
      teamGalleryReference.length ||
      tripImageReference.length ||
      teamLogoReference.length ||
      leagueLogoReference.length
  )

  if (!isAdmin && !isPublic) {
    return new NextResponse("Not found", { status: 404 })
  }

  // Visibility can change when an admin unpublishes an item. Revalidate public
  // media on each request and never cache admin-only assets in a shared cache.
  const cacheControl = isPublic
    ? "public, max-age=0, must-revalidate"
    : "private, no-store"

  const result = await get(asset.pathname, {
    access: "private",
    ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
  })

  if (!result) {
    return new NextResponse("Not found", { status: 404 })
  }

  if (result.statusCode === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: result.blob.etag,
        "Cache-Control": cacheControl,
      },
    })
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "Cache-Control": cacheControl,
    },
  })
}
