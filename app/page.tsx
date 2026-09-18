import type { Metadata } from "next"
import { HomePage } from "@/components/home-page"
import { getPublishedGallery, getPublishedTestimonials, getSiteContent, getYouTubeVideos } from "@/lib/content"
import { getPublishedTrips } from "@/lib/trips"
import { socialMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent()
  const title = content.seoTitle || "Let’s Gol - wyjazdy na mecze piłkarskie"
  const description = content.seoDescription || "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora."
  return {
    title,
    description,
    alternates: { canonical: "/" },
    ...socialMetadata(title, description, "/"),
  }
}

export default async function Page() {
  const [trips, content, gallery, testimonials] = await Promise.all([getPublishedTrips(), getSiteContent(), getPublishedGallery(), getPublishedTestimonials()])
  const videos = await getYouTubeVideos(content)
  return <HomePage trips={trips} content={content} gallery={gallery} testimonials={testimonials} videos={videos} />
}
