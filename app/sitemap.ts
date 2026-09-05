import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trips = await getPublishedTrips()

  return [
    { url: absoluteUrl(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/wyjazdy"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/galeria"), changeFrequency: "weekly", priority: 0.7 },
    {
      url: absoluteUrl("/polityka-prywatnosci"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/warunki-uczestnictwa"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...trips.map((trip) => ({
      url: absoluteUrl(`/wyjazdy/${trip.slug}`),
      lastModified: trip.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
