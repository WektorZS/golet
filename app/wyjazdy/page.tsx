import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, CalendarDays, Search } from "lucide-react"
import { TripCalendar } from "@/components/trip-calendar"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { getPublishedTrips } from "@/lib/trips"
import { breadcrumbSchema, socialMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Wyjazdy na mecze",
  description: "Aktualne pakiety na największe mecze piłkarskie w Europie: bilet, lot, hotel i opieka koordynatora.",
  alternates: { canonical: "/wyjazdy" },
  ...socialMetadata(
    "Wyjazdy na mecze piłkarskie",
    "Sprawdź aktualne terminy i pakiety wyjazdów na największe mecze w Europie.",
    "/wyjazdy"
  ),
}

export default async function TripsPage() {
  const trips = await getPublishedTrips()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbSchema([
            { name: "Strona główna", path: "/" },
            { name: "Wyjazdy", path: "/wyjazdy" },
          ]),
          {
            "@type": "ItemList",
            name: "Aktualne wyjazdy na mecze",
            itemListElement: trips.map((trip, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://letsgol.eu/wyjazdy/${trip.slug}`,
              name: trip.title,
            })),
          },
        ],
      }} />
      <SiteHeader />
     <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
  <Image
    src="/images/oferta.webp"
    alt=""
    fill
    priority
    className="object-cover opacity-25"
    sizes="100vw"
  />

  <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />

  <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
    <div className="max-w-4xl">
      <p className="eyebrow eyebrow-on-dark">
        Kalendarz wyjazdów
      </p>

      <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
        Twój następny mecz zaczyna się tutaj
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
        Wybierz interesujący Cię mecz i sprawdź dostępne warianty
        wyjazdu. Wszystkie aktualne terminy znajdziesz w kalendarzu
        poniżej.
      </p>
    </div>

    <div className="border-l-2 border-primary pl-6">
      <CalendarDays
        className="size-6 text-primary"
        aria-hidden="true"
      />

      <p className="mt-4 font-sans text-2xl font-black uppercase">
        Wybierz mecz i termin
      </p>

      <p className="mt-2 text-sm leading-6 text-background/60">
        Sprawdź dostępne wyjazdy, zakres poszczególnych wariantów
        oraz szczegóły każdego meczu.
      </p>
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
              <Button
  className="h-12 w-full shrink-0 px-6 md:w-auto"
  size="lg"
  nativeButton={false}
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
>
  <span className="inline-flex items-center gap-2">
    Wyceń indywidualnie swój wyjazd
    <ArrowRight className="size-4 shrink-0" />
  </span>
</Button>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

