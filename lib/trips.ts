import { and, asc, desc, eq, gte } from "drizzle-orm"

import { db } from "@/lib/db"

import { teamGalleryItems, tripGalleryItems, trips } from "@/lib/db/schema"
import { ensureTripColumns } from "@/lib/db/ensure-trip-columns"

export type Trip = typeof trips.$inferSelect

function getTodayPoland() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export async function getPublishedTrips() {
  await ensureTripColumns()
  const today = getTodayPoland()

  return db
    .select()
    .from(trips)
    .where(
      and(
        eq(trips.status, "published"),
        gte(trips.startDate, today)
      )
    )
    .orderBy(
      desc(trips.featured),
      asc(trips.sortOrder),
      asc(trips.startDate)
    )
}

export async function getTripBySlug(slug: string) {
  await ensureTripColumns()
  const today = getTodayPoland()

  const [trip] = await db
    .select()
    .from(trips)
    .where(
      and(
        eq(trips.slug, slug),
        eq(trips.status, "published"),
        gte(trips.startDate, today)
      )
    )
    .limit(1)

  return trip ?? null
}

export async function getTripGallery(tripId: number, homeTeamId?: number | null, awayTeamId?: number | null) {
  await ensureTripColumns()
  const teamIds = [homeTeamId, awayTeamId].filter((id): id is number => Boolean(id))
  const [homeGallery, awayGallery, manualGallery] = await Promise.all([
    teamIds[0]
      ? db.select().from(teamGalleryItems).where(and(eq(teamGalleryItems.teamId, teamIds[0]), eq(teamGalleryItems.status, "published"))).orderBy(asc(teamGalleryItems.sortOrder), asc(teamGalleryItems.id))
      : [],
    teamIds[1] && teamIds[1] !== teamIds[0]
      ? db.select().from(teamGalleryItems).where(and(eq(teamGalleryItems.teamId, teamIds[1]), eq(teamGalleryItems.status, "published"))).orderBy(asc(teamGalleryItems.sortOrder), asc(teamGalleryItems.id))
      : [],
    db.select().from(tripGalleryItems).where(and(eq(tripGalleryItems.tripId, tripId), eq(tripGalleryItems.status, "published"))).orderBy(asc(tripGalleryItems.sortOrder), asc(tripGalleryItems.id)),
  ])

  const seen = new Set<number>()
  return [...homeGallery, ...awayGallery, ...manualGallery]
    .filter((item) => !seen.has(item.mediaId) && Boolean(seen.add(item.mediaId)))
    .map((item, index) => ({ ...item, id: `${"teamId" in item ? "team" : "trip"}-${item.id}-${index}` }))
}
