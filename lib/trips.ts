import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { trips } from "@/lib/db/schema"

export type Trip = typeof trips.$inferSelect

export async function getPublishedTrips() {
  return db
    .select()
    .from(trips)
    .where(eq(trips.status, "published"))
    .orderBy(asc(trips.startDate))
}
