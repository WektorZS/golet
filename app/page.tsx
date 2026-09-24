import type { Metadata } from "next"
import { HomePage } from "@/components/home-page"
import { getPublishedGallery, getPublishedTestimonials, getSiteContent, getYouTubeVideos } from "@/lib/content"
import { getPublishedTrips } from "@/lib/trips"
import { localizedAlternates, socialMetadata } from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { localizedSetting } from "@/lib/i18n-content"
import { routeFor } from "@/lib/i18n"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent()
  const locale = await getRequestLocale()
  const title = localizedSetting(content, "seoTitle", locale, locale === "en" ? "Let's Gol - football match trips" : "Let’s Gol - wyjazdy na mecze piłkarskie")
  const description = localizedSetting(content, "seoDescription", locale, locale === "en" ? "Complete trips to Europe's biggest football matches, including tickets, flights, hotels and coordinator support." : "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora.")
  const path = routeFor(locale, "/")
  return {
    title,
    description,
    alternates: localizedAlternates("/", locale),
    ...socialMetadata(title, description, path, locale),
  }
}

export default async function Page() {
  const locale = await getRequestLocale()
  const [trips, content, gallery, testimonials] = await Promise.all([getPublishedTrips(locale), getSiteContent(), getPublishedGallery(locale), getPublishedTestimonials(locale)])
  const videos = await getYouTubeVideos(content)
  return <HomePage trips={trips} content={content} gallery={gallery} testimonials={testimonials} videos={videos} locale={locale} />
}
