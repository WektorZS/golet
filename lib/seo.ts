import type { Metadata } from "next"

import { absoluteUrl } from "@/lib/site"
import {
  localizedPath,
  openGraphLocales,
  type Locale,
} from "@/lib/i18n"

export const SITE_NAME = "Let’s Gol"

export function brandedTitle(
  title: string
) {
  const normalizedTitle =
    title.toLowerCase()

  if (
    normalizedTitle.includes(
      "let’s gol"
    ) ||
    normalizedTitle.includes(
      "let's gol"
    )
  ) {
    return title
  }

  return `${title} | ${SITE_NAME}`
}

export function socialMetadata(
  title: string,
  description: string,
  path: string,
  locale: Locale = "pl",
  image = "/images/og-image.webp"
): Pick<
  Metadata,
  "openGraph" | "twitter"
> {
  const fullTitle =
    brandedTitle(title)

  return {
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale:
        openGraphLocales[locale],
      alternateLocale: [
        openGraphLocales[
          locale === "pl"
            ? "en"
            : "pl"
        ],
      ],
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  }
}

export function languageAlternates(
  polishPath: string
) {
  return {
    pl: polishPath,
    en: localizedPath(
      polishPath,
      "en"
    ),
    "x-default":
      polishPath,
  }
}

export function localizedAlternates(
  polishPath: string,
  locale: Locale
) {
  const canonical =
    locale === "en"
      ? localizedPath(
          polishPath,
          "en"
        )
      : polishPath

  return {
    canonical,
    languages:
      languageAlternates(
        polishPath
      ),
  }
}

export function breadcrumbSchema(
  items: Array<{
    name: string
    path: string
  }>
) {
  const currentPath =
    items[
      items.length - 1
    ]?.path ?? "/"

  return {
    "@type":
      "BreadcrumbList",

    "@id": absoluteUrl(
      `${currentPath}#breadcrumb`
    ),

    itemListElement:
      items.map(
        (item, index) => ({
          "@type":
            "ListItem",
          position:
            index + 1,
          name:
            item.name,
          item:
            absoluteUrl(
              item.path
            ),
        })
      ),
  }
}