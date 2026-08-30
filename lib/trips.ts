import { and, asc, desc, eq, gte } from "drizzle-orm"

import { db } from "@/lib/db"

import { tripGalleryItems, trips } from "@/lib/db/schema"

export type Trip = typeof trips.$inferSelect

export async function getPublishedTrips() {
  const today = new Date().toISOString().split("T")[0]

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
  const [trip] = await db
    .select()
    .from(trips)
    .where(eq(trips.slug, slug))
    .limit(1)

  return trip?.status === "published" ? trip : null
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