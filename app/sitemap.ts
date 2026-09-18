import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips } from "@/lib/trips"

// Keep the sitemap cached at the edge instead of opening a database connection
// for every crawler request. Admin mutations also invalidate /sitemap.xml.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: absoluteUrl() },
    { url: absoluteUrl("/wyjazdy") },
    { url: absoluteUrl("/galeria") },
    { url: absoluteUrl("/o-nas") },
    { url: absoluteUrl("/faq") },
    { url: absoluteUrl("/kontakt") },
    { url: absoluteUrl("/polityka-prywatnosci") },
    { url: absoluteUrl("/warunki-uczestnictwa") },
  ]

  // Local builds without database credentials can still compile. When the
  // database is configured, a query failure must fail the build or request
  // instead of publishing a successful but incomplete production sitemap.
  if (!process.env.DATABASE_URL) return staticUrls

  const trips = await getPublishedTrips()

  return [
    ...staticUrls,
    ...trips.map((trip) => ({
      url: absoluteUrl(`/wyjazdy/${trip.slug}`),
      lastModified: trip.updatedAt,
    })),
  ]
}
