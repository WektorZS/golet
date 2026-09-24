import type { Metadata } from "next"

import { HomePage } from "@/components/home-page"

import {
  getPublishedGallery,
  getPublishedTestimonials,
  getSiteContent,
  getYouTubeVideos,
} from "@/lib/content"
import { getPublishedTrips } from "@/lib/trips"
import {
  localizedAlternates,
  socialMetadata,
} from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { localizedSetting } from "@/lib/i18n-content"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const [content, locale] = await Promise.all([
    getSiteContent(),
    getRequestLocale(),
  ])

  const seo = getSeoCopy(
    "home",
    locale
  )

  const configuredTitle = localizedSetting(
    content,
    "seoTitle",
    locale,
    ""
  ).trim()

  const configuredDescription = localizedSetting(
    content,
    "seoDescription",
    locale,
    ""
  ).trim()

  const title =
    configuredTitle ||
    seo.title

  const description =
    configuredDescription ||
    seo.description

  const path = routeFor(
    locale,
    "/"
  )

  return {
    title,
    description,

    alternates: localizedAlternates(
      "/",
      locale
    ),

    ...socialMetadata(
      title,
      description,
      path,
      locale
    ),
  }
}

export default async function Page() {
  const locale =
    await getRequestLocale()

  const [
    trips,
    content,
    gallery,
    testimonials,
  ] = await Promise.all([
    getPublishedTrips(locale),
    getSiteContent(),
    getPublishedGallery(locale),
    getPublishedTestimonials(locale),
  ])

  const videos =
    await getYouTubeVideos(
      content
    )

  return (
    <HomePage
      trips={trips}
      content={content}
      gallery={gallery}
      testimonials={testimonials}
      videos={videos}
      locale={locale}
    />
  )
}