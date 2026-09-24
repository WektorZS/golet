import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/site"
import { localizedPath, openGraphLocales, type Locale } from "@/lib/i18n"

export function socialMetadata(
  title: string,
  description: string,
  path: string,
  locale: Locale = "pl",
  image = "/images/og-image.webp"
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Let’s Gol",
      locale: openGraphLocales[locale],
      alternateLocale: [openGraphLocales[locale === "pl" ? "en" : "pl"]],
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export function languageAlternates(polishPath: string) {
  return {
    "pl-PL": polishPath,
    "en-GB": localizedPath(polishPath, "en"),
    "x-default": polishPath,
  }
}

export function localizedAlternates(polishPath: string, locale: Locale) {
  return {
    canonical: locale === "en" ? localizedPath(polishPath, "en") : polishPath,
    languages: languageAlternates(polishPath),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(`${items[items.length - 1]?.path ?? "/"}#breadcrumb`),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

