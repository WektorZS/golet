import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Wyjazdy na mecze",
  description: "Aktualne pakiety na największe mecze piłkarskie w Europie: bilet, lot, hotel i opieka koordynatora.",
}

export default async function TripsPage() {
  const trips = await getPublishedTrips()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Button variant="ghost" className="text-background hover:bg-background/10 hover:text-background" nativeButton={false} render={<Link href="/" />}><ArrowLeft data-icon="inline-start" />Strona główna</Button>
          <Link href="/" className="font-sans text-xl font-black uppercase">Let&apos;s Gol <span className="text-primary">/ Wyjazdy</span></Link>
        </div>
      </header>
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Kalendarz 2026" title="Wybierz swój następny stadion" intro="Gotowe pakiety z pewnym biletem, wygodną logistyką i polskojęzyczną opieką." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
          <div className="mt-14 rounded-xl bg-secondary p-7 text-center md:p-10">
            <h2 className="font-sans text-3xl font-black uppercase">Nie widzisz swojego meczu?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Przygotujemy indywidualny wyjazd na dowolny stadion i z wybranego lotniska.</p>
            <Button className="mt-6" size="lg" nativeButton={false} render={<Link href="/#kontakt" />}>Poproś o wycenę</Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
