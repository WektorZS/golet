import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, CalendarDays, Search } from "lucide-react"

import { TripCalendar } from "@/components/trip-calendar"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

import { getPublishedTrips } from "@/lib/trips"
import {
  breadcrumbSchema,
  localizedAlternates,
  socialMetadata,
} from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy("trips", locale)
  const path = routeFor(locale, "/wyjazdy")

  return {
    title,
    description,

    alternates: localizedAlternates(
      "/wyjazdy",
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

export default async function TripsPage() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"

  const trips = await getPublishedTrips(locale)

  const path = routeFor(locale, "/wyjazdy")
  const pageUrl = absoluteUrl(path)

  const { title, description } = getSeoCopy(
    "trips",
    locale
  )

  const breadcrumb = breadcrumbSchema([
    {
      name: isEn ? "Home" : "Strona główna",
      path: routeFor(locale, "/"),
    },
    {
      name: isEn ? "Trips" : "Wyjazdy",
      path,
    },
  ])

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${pageUrl}#trips`,

    name: isEn
      ? "Current football match trips"
      : "Aktualne wyjazdy na mecze piłkarskie",

    numberOfItems: trips.length,

    itemListOrder:
      "https://schema.org/ItemListOrderAscending",

    itemListElement: trips.map(
      (trip, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(
          `${path}/${trip.slug}`
        ),
      })
    ),
  }

  const collectionPageSchema = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,

    url: pageUrl,
    name: title,
    description,

    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },

    breadcrumb: {
      "@id": `${pageUrl}#breadcrumb`,
    },

    mainEntity: {
      "@id": `${pageUrl}#trips`,
    },

    inLanguage: isEn
      ? "en-GB"
      : "pl-PL",
  }

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      collectionPageSchema,
      itemListSchema,
      breadcrumb,
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />

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
              {isEn
                ? "Trip calendar"
                : "Kalendarz wyjazdów"}
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              {isEn
                ? "Your next match starts here"
                : "Twój następny mecz zaczyna się tutaj"}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              {isEn
                ? "Choose the match you want to attend and compare the available travel options. All current dates are listed below."
                : "Wybierz interesujący Cię mecz i sprawdź dostępne warianty wyjazdu. Wszystkie aktualne terminy znajdziesz w kalendarzu poniżej."}
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <CalendarDays
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              {isEn
                ? "Choose a match and date"
                : "Wybierz mecz i termin"}
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              {isEn
                ? "See available trips, compare package options and review every match in detail."
                : "Sprawdź dostępne wyjazdy, zakres poszczególnych wariantów oraz szczegóły każdego meczu."}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <TripCalendar
            trips={trips}
            locale={locale}
          />

          <div className="relative mt-14 overflow-hidden rounded-2xl bg-foreground p-7 text-background shadow-xl md:p-10">
            <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="flex max-w-2xl gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Search
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-sans text-3xl font-black uppercase md:text-4xl">
                    {isEn
                      ? "Cannot find the match you want?"
                      : "Nie widzisz meczu, na który chcesz jechać?"}
                  </h2>

                  <p className="mt-2 leading-7 text-background/60">
                    {isEn
                      ? "Contact us. We will prepare a custom trip and check ticket availability."
                      : "Napisz do nas. Przygotujemy indywidualny wyjazd i sprawdzimy dostępność biletów."}
                  </p>
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
                  {isEn
                    ? "Request a custom quote"
                    : "Wyceń indywidualnie swój wyjazd"}

                  <ArrowRight
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
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