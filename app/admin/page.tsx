import { asc, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AdminDashboard, type AdminData } from "@/components/admin-dashboard"
import { db } from "@/lib/db"
import { adminActivity, galleryItems, inquiries, mediaAssets, siteSettings, testimonials, tripGalleryItems, trips } from "@/lib/db/schema"
import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth, isAuthConfigured } from "@/lib/auth/server"
import { getYouTubeVideos } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!isAuthConfigured()) return <SetupRequired />
  const { data: session } = await getAuth().getSession()
  if (!session?.user) redirect("/auth/sign-in")
  if (!isAdminEmail(session.user.email)) redirect("/auth/sign-in?error=unauthorized")

  const [allTrips, allInquiries, allTestimonials, media, gallery, tripGallery, rawSettings, activity] = await Promise.all([
    db.select().from(trips).orderBy(asc(trips.sortOrder), desc(trips.startDate)),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100),
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder)),
    db.select().from(tripGalleryItems).orderBy(asc(tripGalleryItems.sortOrder)),
    db.select().from(siteSettings),
    db.select().from(adminActivity).orderBy(desc(adminActivity.createdAt)).limit(10),
  ])
  const settings = Object.fromEntries(rawSettings.map((item) => [item.key, item.value]))
  const videos = await getYouTubeVideos(settings)
  const serializable = JSON.parse(JSON.stringify({ trips: allTrips, inquiries: allInquiries, testimonials: allTestimonials, media, gallery, tripGallery, settings, activity, videos, email: session.user.email })) as AdminData
  return <AdminDashboard data={serializable} />
}

function SetupRequired() {
  return <main className="flex min-h-screen items-center justify-center bg-muted px-4"><div className="w-full max-w-xl"><Alert><AlertTitle>Panel oczekuje na aktywację logowania</AlertTitle><AlertDescription>Dodaj NEON_AUTH_COOKIE_SECRET o długości co najmniej 32 losowych znaków, a następnie utwórz administratora w Neon Auth.</AlertDescription></Alert><Button className="mt-5" nativeButton={false} render={<a href="/" />}>Wróć na stronę</Button></div></main>
}
