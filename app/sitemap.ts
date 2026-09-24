import type { MetadataRoute } from "next"
import { languageAlternates } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips } from "@/lib/trips"

// Keep the sitemap cached at the edge instead of opening a database connection
// for every crawler request. Admin mutations also invalidate /sitemap.xml.
export const revalidate = 3600

const staticRoutePairs = [
  ["/", "/en"],
  ["/wyjazdy", "/en/trips"],
  ["/galeria", "/en/gallery"],
  ["/o-nas", "/en/about-us"],
  ["/faq", "/en/faq"],
  ["/kontakt", "/en/contact"],
  ["/wycena-indywidualna", "/en/custom-trip"],
  ["/polityka-prywatnosci", "/en/privacy-policy"],
  ["/warunki-uczestnictwa", "/en/terms-and-conditions"],
] as const

function sitemapAlternates(polishPath: string) {
  return {
    languages: Object.fromEntries(
      Object.entries(languageAlternates(polishPath)).map(([language, path]) => [language, absoluteUrl(path)])
    ),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = staticRoutePairs.flatMap(([polishPath, englishPath]) => [
    { url: absoluteUrl(polishPath), alternates: sitemapAlternates(polishPath) },
    { url: absoluteUrl(englishPath), alternates: sitemapAlternates(polishPath) },
  ])

  // Local builds without database credentials can still compile. When the
  // database is configured, a query failure must fail the build or request
  // instead of publishing a successful but incomplete production sitemap.
  if (!process.env.DATABASE_URL) return staticUrls

  const trips = await getPublishedTrips("pl")

  return [
    ...staticUrls,
    ...trips.flatMap((trip) => {
      const polishPath = `/wyjazdy/${trip.slug}`
      const englishPath = `/en/trips/${trip.slug}`
      const alternates = sitemapAlternates(polishPath)

      return [
        { url: absoluteUrl(polishPath), lastModified: trip.updatedAt, alternates },
        { url: absoluteUrl(englishPath), lastModified: trip.updatedAt, alternates },
      ]
    }),
  ]
}
