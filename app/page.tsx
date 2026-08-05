import { HomePage } from "@/components/home-page"
import { getPublishedGallery, getPublishedTestimonials, getSiteContent, getYouTubeVideos } from "@/lib/content"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export default async function Page() {
  const [trips, content, gallery, testimonials] = await Promise.all([getPublishedTrips(), getSiteContent(), getPublishedGallery(), getPublishedTestimonials()])
  const videos = await getYouTubeVideos(content)
  return <HomePage trips={trips} content={content} gallery={gallery} testimonials={testimonials} videos={videos} />
}
