import { and, asc, desc, eq, gte } from "drizzle-orm"

import { db } from "@/lib/db"

import { tripGalleryItems, trips } from "@/lib/db/schema"

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

export async function getTripGallery(tripId: number) {
  return db
    .select()
    .from(tripGalleryItems)
    .where(
      and(
        eq(tripGalleryItems.tripId, tripId),
        eq(tripGalleryItems.status, "published")
      )
    )
    .orderBy(asc(tripGalleryItems.sortOrder))
}