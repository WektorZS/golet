import type { Metadata } from "next"
import Image from "next/image"
import { Check, Plane, TicketCheck } from "lucide-react"

import { InquiryForm } from "@/components/inquiry-form"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getSiteContent, type SiteContent } from "@/lib/content"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"
import { getPackageVariants } from "@/lib/package-options"
import { breadcrumbSchema, localizedAlternates, socialMetadata } from "@/lib/seo"
import { getPublishedTrips, type Trip } from "@/lib/trips"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const title = locale === "en" ? "Custom football trip" : "Indywidualny wyjazd na mecz"
  const description = locale === "en"
    ? "Tell us which match you want to attend. We will prepare a tailored ticket, flight and hotel proposal."
    : "Wskaż mecz, na który chcesz pojechać. Przygotujemy indywidualną propozycję biletu, przelotu i noclegu."
  return { title, description, alternates: localizedAlternates("/wycena-indywidualna", locale), ...socialMetadata(title, description, routeFor(locale, "/wycena-indywidualna"), locale) }
}

export default async function CustomTripPage() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const t = (pl: string, en: string) => isEn ? en : pl
  const [content, trips] = process.env.DATABASE_URL
    ? await Promise.all([
        getSiteContent().catch(() => ({} as SiteContent)),
        getPublishedTrips(locale).catch(() => [] as Trip[]),
      ])
    : ([{} as SiteContent, [] as Trip[]] as const)

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbSchema([
            { name: t("Strona główna", "Home"), path: routeFor(locale, "/") },
            { name: t("Twój wyjazd", "Custom trip"), path: routeFor(locale, "/wycena-indywidualna") },
          ]),
          { "@type": "Service", name: t("Indywidualny wyjazd na mecz", "Custom football match trip"), provider: { "@id": "https://letsgol.eu/#organization" }, areaServed: "Europe", inLanguage: isEn ? "en-GB" : "pl-PL" },
        ],
      }} />
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
        <Image src="/images/indywidualny.webp" alt="" fill priority className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />
        <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.55fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">{t("Twój wyjazd", "Your trip")}</p>
            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              {t("Ty wybierasz mecz. My organizujemy drogę.", "You choose the match. We organise the journey.")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              {t("Nie widzisz swojego meczu w kalendarzu? Podaj klub, termin i preferowany zakres pakietu. Sprawdzimy dostępność i przygotujemy konkretną ofertę.", "Cannot find your match in the calendar? Tell us the club, dates and preferred package. We will check availability and prepare a clear proposal.")}
            </p>
          </div>
          <div className="space-y-5 border-l-2 border-primary pl-6">
            {[t("Bilet z legalnego źródła", "Ticket from a legitimate source"), t("Lotnisko i hotel dopasowane do Ciebie", "Departure airport and hotel selected for you"), t("Wsparcie zespołu Let's Gol", "Support from the Let's Gol team")].map((item) => (
              <div className="flex items-center gap-3" key={item}><Check className="size-5 text-primary" aria-hidden="true" /><span className="font-semibold">{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-section-light px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.2fr] lg:gap-20">
          <div>
            <div className="flex gap-3"><TicketCheck className="size-6 text-primary" /><Plane className="size-6 text-primary" /></div>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none md:text-5xl">{t("Opowiedz nam o wymarzonym meczu", "Tell us about your dream match")}</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{t("Im więcej szczegółów podasz, tym dokładniejszą propozycję przygotujemy. Możesz wybrać sam bilet, bilet z lotem, bilet z hotelem albo pełny pakiet.", "The more detail you provide, the more precise our proposal will be. Choose a ticket only, ticket with flights, ticket with hotel or a full package.")}</p>
          </div>
          <InquiryForm trips={trips.filter((trip) => trip.availabilityStatus !== "sold_out").map((trip) => ({
            id: trip.id,
            title: trip.title,
            startDate: trip.startDate,
            endDate: trip.endDate,
            packageVariants: getPackageVariants(trip.packageVariants, trip.packageItems, locale).map((variant) => variant.label),
          }))} />
        </div>
      </section>
      <SiteFooter content={content} />
    </main>
  )
}
