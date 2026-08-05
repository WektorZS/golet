import type { MetadataRoute } from "next"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trips = await getPublishedTrips()
  const base = "https://letsgol.pl"
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/wyjazdy`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/informacje-prawne`, changeFrequency: "yearly", priority: 0.2 },
    ...trips.map((trip) => ({ url: `${base}/wyjazdy/${trip.slug}`, lastModified: trip.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ]
}
