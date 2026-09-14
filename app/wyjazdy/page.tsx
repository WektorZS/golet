import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarDays, Search } from "lucide-react"
import { TripCalendar } from "@/components/trip-calendar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { getPublishedTrips } from "@/lib/trips"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Wyjazdy na mecze",
  description: "Aktualne pakiety na największe mecze piłkarskie w Europie: bilet, lot, hotel i opieka koordynatora.",
  alternates: { canonical: "/wyjazdy" },
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
      <section className="relative overflow-hidden bg-foreground px-4 py-16 text-background md:px-6 md:py-20">
        <div className="absolute -right-24 -top-28 size-80 rounded-full border-[55px] border-primary/10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex max-w-4xl items-start gap-5">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:flex"><CalendarDays className="size-7" /></span>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">Kalendarz wyjazdów</p>
              <h1 className="mt-3 text-balance font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">Twój następny mecz zaczyna się tutaj</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-background/65 md:text-lg">Wybierz miesiąc i gotowy pakiet. My zajmiemy się biletem, lotem, hotelem oraz opieką na miejscu.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <TripCalendar trips={trips} />

          <div className="relative mt-14 overflow-hidden rounded-2xl bg-foreground p-7 text-background shadow-xl md:p-10">
            <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="flex max-w-2xl gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Search className="size-5" /></span>
                <div>
                  <h2 className="font-sans text-3xl font-black uppercase md:text-4xl">Nie widzisz meczu, na który chcesz jechać?</h2>
                  <p className="mt-2 leading-7 text-background/60">Napisz do nas. Przygotujemy indywidualny wyjazd i sprawdzimy dostępność biletów.</p>
                </div>
              </div>
              <Button className="h-12 w-full shrink-0 px-6 md:w-auto" size="lg" nativeButton={false} render={<Link href="/#kontakt" />}>Wyceń indywidualnie swój wyjazd <ArrowRight data-icon="inline-end" /></Button>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

