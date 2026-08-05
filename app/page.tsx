import { HomePage } from "@/components/home-page"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export default async function Page() {
  const trips = await getPublishedTrips()
  return <HomePage trips={trips} />
}
