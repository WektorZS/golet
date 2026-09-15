import type { Metadata } from "next"
import { HomePage } from "@/components/home-page"
import { getPublishedGallery, getPublishedTestimonials, getSiteContent, getYouTubeVideos } from "@/lib/content"
import type { SiteContent } from "@/lib/content"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = process.env.DATABASE_URL
    ? await getSiteContent().catch(() => ({} as SiteContent))
    : ({} as SiteContent)
  return {
    title: content.seoTitle || "Let’s Gol - wyjazdy na mecze piłkarskie",
    description: content.seoDescription || "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora.",
    alternates: { canonical: "/" },
  }
}

export default async function Page() {
  if (!process.env.DATABASE_URL) {
    return <HomePage trips={[]} content={{}} gallery={[]} testimonials={[]} videos={[]} />
  }

  const [trips, content, gallery, testimonials] = await Promise.all([
    getPublishedTrips().catch((error) => {
      console.error("Strona główna: nie udało się pobrać wyjazdów", error)
      return []
    }),
    getSiteContent().catch((error) => {
      console.error("Strona główna: nie udało się pobrać treści", error)
      return {}
    }),
    getPublishedGallery().catch((error) => {
      console.error("Strona główna: nie udało się pobrać galerii", error)
      return []
    }),
    getPublishedTestimonials().catch((error) => {
      console.error("Strona główna: nie udało się pobrać opinii", error)
      return []
    }),
  ])
  const videos = await getYouTubeVideos(content)
  return <HomePage trips={trips} content={content} gallery={gallery} testimonials={testimonials} videos={videos} />
}
