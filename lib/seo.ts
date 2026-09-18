import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/site"

export function socialMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/og-image.webp"
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Let’s Gol",
      locale: "pl_PL",
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

