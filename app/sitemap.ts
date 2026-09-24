import type { MetadataRoute } from "next"

import { languageAlternates } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips } from "@/lib/trips"

export const revalidate = 3600

const staticRoutePairs = [
  ["/", "/en"],
  ["/wyjazdy", "/en/trips"],
  ["/galeria", "/en/gallery"],
  ["/o-nas", "/en/about-us"],
  ["/faq", "/en/faq"],
  ["/kontakt", "/en/contact"],
  [
    "/polityka-prywatnosci",
    "/en/privacy-policy",
  ],
  [
    "/warunki-uczestnictwa",
    "/en/terms-and-conditions",
  ],
] as const

function sitemapAlternates(
  polishPath: string
): NonNullable<
  MetadataRoute.Sitemap[number]["alternates"]
> {
  return {
    languages: Object.fromEntries(
      Object.entries(
        languageAlternates(polishPath)
      ).map(([language, path]) => [
        language,
        absoluteUrl(path),
      ])
    ),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap =
    staticRoutePairs.flatMap(
      ([polishPath, englishPath]) => {
        const alternates =
          sitemapAlternates(polishPath)

        return [
          {
            url: absoluteUrl(polishPath),
            alternates,
          },
          {
            url: absoluteUrl(englishPath),
            alternates,
          },
        ]
      }
    )

  if (!process.env.DATABASE_URL) {
    return staticUrls
  }

  const trips = await getPublishedTrips("pl")

  const tripUrls: MetadataRoute.Sitemap =
    trips.flatMap((trip) => {
      const polishPath =
        `/wyjazdy/${trip.slug}`

      const englishPath =
        `/en/trips/${trip.slug}`

      const alternates =
        sitemapAlternates(polishPath)

      return [
        {
          url: absoluteUrl(polishPath),
          lastModified: trip.updatedAt,
          alternates,
        },
        {
          url: absoluteUrl(englishPath),
          lastModified: trip.updatedAt,
          alternates,
        },
      ]
    })

  return [
    ...staticUrls,
    ...tripUrls,
  ]
}