import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { tripGalleryItems, trips } from "@/lib/db/schema"

export type Trip = typeof trips.$inferSelect

export async function getPublishedTrips() {
  return db
    .select()
    .from(trips)
    .where(eq(trips.status, "published"))
    .orderBy(asc(trips.startDate))
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
  return db.select().from(tripGalleryItems).where(and(eq(tripGalleryItems.tripId, tripId), eq(tripGalleryItems.status, "published"))).orderBy(asc(tripGalleryItems.sortOrder))
}
