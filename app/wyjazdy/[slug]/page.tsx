import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CalendarDays, BedDouble,
Check,
Plane, Clock3, MapPin, MessageCircle, TicketCheck } from "lucide-react"

import { InquiryForm } from "@/components/inquiry-form"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TripDetailsTabs } from "@/components/trip-details-tabs"
import { Button } from "@/components/ui/button"
import { getPublishedTestimonials, getSiteContent } from "@/lib/content"
import { getPackageFeatures, getPackageVariants, parsePackageItems } from "@/lib/package-options"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"
import { breadcrumbSchema, localizedAlternates } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips, getTripBySlug, getTripGallery } from "@/lib/trips"
import { getRequestLocale } from "@/lib/i18n-request"
import { formatPrice, localeTags, pluralizeDuration, routeFor } from "@/lib/i18n"
import { buildTripSeoDescription } from "@/lib/seo-copy"

export const dynamic = "force-dynamic"

const availability = {
  available: { label: "Dostępne miejsca", className: "bg-emerald-700 text-white", schema: "InStock" },
  last_places: { label: "Ostatnie miejsca", className: "bg-primary text-primary-foreground", schema: "LimitedAvailability" },
  sold_out: { label: "Wyprzedane", className: "bg-red-600 text-white", schema: "SoldOut" },
} as const

function asDate(value: string) {
  return new Date(`${value}T12:00:00`)
}

function getTeams(title: string, opponent: string, homeTeam: string, awayTeam: string) {
  const [titleHome, titleAway] = title.split(/\s+vs\.?\s+|\s+-\s+/i).map((item) => item.trim())
  return {
    home: homeTeam || titleHome || "Gospodarz",
    away: awayTeam || titleAway || opponent || "Gość",
  }
}

function TeamLogo({ src, name, locale }: { src: string; name: string; locale: "pl" | "en" }) {
  if (!src) return <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 font-sans text-lg font-black md:size-20">{name.slice(0, 2).toUpperCase()}</span>
  return <span className="relative block size-16 md:size-20"><Image src={src} alt={locale === "en" ? `${name} crest` : `Herb ${name}`} fill className="object-contain drop-shadow-xl" sizes="80px" /></span>
}

function normalizeSeoTitle(value: string) {
  return value
    .replace(/\s*[|–—-]\s*Let[’']s Gol\s*$/i, "")
    .trim()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const trip = await getTripBySlug(slug, locale)

  if (!trip) {
    return {
      title: isEn ? "Trip unavailable" : "Wyjazd niedostępny",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description = buildTripSeoDescription({
    title: trip.title,
    price: trip.price,
    locale,
    customDescription: trip.seoDescription,
  })

  const customTitle = normalizeSeoTitle(trip.seoTitle || "")
  const title =
    customTitle ||
    (isEn
      ? `Football trip to ${trip.title}`
      : `Wyjazd na mecz ${trip.title}`)

  const socialTitle = `${title} | Let’s Gol`
  const polishPath = `/wyjazdy/${trip.slug}`
  const canonical = `${routeFor(locale, "/wyjazdy")}/${trip.slug}`
  const imageAlt = isEn
    ? `Football match trip to ${trip.city}: ${trip.title}`
    : `Wyjazd na mecz ${trip.title} w ${trip.city}`

  return {
    title,
    description,
    alternates: localizedAlternates(polishPath, locale),

    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      url: absoluteUrl(canonical),
      siteName: "Let’s Gol",
      locale: isEn ? "en_GB" : "pl_PL",
      alternateLocale: [isEn ? "pl_PL" : "en_GB"],
      images: [
        {
          url: absoluteUrl(trip.image),
          alt: imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteUrl(trip.image)],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export default async function TripDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pakiet?: string }> }) {
  const { slug } = await params
  const { pakiet } = await searchParams
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const t = (pl: string, en: string) => isEn ? en : pl
  const trip = await getTripBySlug(slug, locale)
  if (!trip) notFound()

  const [gallery, testimonials, content, publishedTrips] = await Promise.all([
    getTripGallery(trip.id, trip.homeTeamId, trip.awayTeamId, locale),
    getPublishedTestimonials(locale),
    getSiteContent(),
    getPublishedTrips(locale),
  ])
  const dateFormatter = new Intl.DateTimeFormat(localeTags[locale], { day: "numeric", month: "long", year: "numeric" })
  const startDate = dateFormatter.format(asDate(trip.startDate))
  const date = trip.endDate && trip.endDate !== trip.startDate ? `${startDate} - ${dateFormatter.format(asDate(trip.endDate))}` : startDate
  const statusBase = availability[trip.availabilityStatus as keyof typeof availability] || availability.available
  const status = { ...statusBase, label: isEn ? ({ available: "Places available", last_places: "Last places", sold_out: "Sold out" }[trip.availabilityStatus] || "Places available") : statusBase.label }
  const soldOut = trip.availabilityStatus === "sold_out"
  const teams = getTeams(trip.title, trip.opponent, trip.homeTeam, trip.awayTeam)
  const packageOptions = parsePackageItems(trip.packageItems)
  const packageVariants = getPackageVariants(trip.packageVariants, trip.packageItems, locale)
  const variantOrder = [
  "ticket",
  "ticket_flight",
  "ticket_hotel",
  "full",
]

const orderedPackageVariants = [...packageVariants].sort(
  (a, b) =>
    variantOrder.indexOf(a.key) -
    variantOrder.indexOf(b.key)
)
 const selectedPackageVariant =
  packageVariants.find(
    (variant) => variant.key === pakiet
  ) ??
  packageVariants.find(
    (variant) => variant.key === "full"
  ) ??
  packageVariants[0]

if (!selectedPackageVariant) {
  notFound()
}

const fullPackageSelected =
  selectedPackageVariant.key === "full"

const selectedPackageKey =
  selectedPackageVariant.key

const partialPackageSelected =
  selectedPackageKey !== "full"

const selectedHasFlight =
  packageOptions.flight !== "excluded" &&
  (
    selectedPackageKey === "full" ||
    selectedPackageKey === "ticket_flight"
  )

const selectedHasHotel =
  packageOptions.hotel !== "excluded" &&
  (
    selectedPackageKey === "full" ||
    selectedPackageKey === "ticket_hotel"
  )
  const packageFeatures = getPackageFeatures(locale)
  const includedFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "included")
  const optionalFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "optional")
  const excludedFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "excluded")
const selectedIncludedFeatures =
  includedFeatures.filter((feature) => {
    if (feature.key === "flight") {
      return selectedHasFlight
    }

    if (feature.key === "baggage") {
      return selectedHasFlight
    }

    if (feature.key === "hotel") {
      return selectedHasHotel
    }

    if (feature.key === "breakfast") {
      return selectedHasHotel
    }

    return true
  })

const includedItems: {
  key: string
  label: string
}[] = [
  ...selectedIncludedFeatures.map((feature) => ({
    key: feature.key,
    label: feature.label,
  })),
  ...trip.includes.map((label, index) => ({
    key: `custom-${index}`,
    label,
  })),
].filter(
  (item, index, items) =>
    items.findIndex(
      (candidate) =>
        candidate.label === item.label
    ) === index
)
  const homeTeam = teams.home
  const awayTeam = teams.away
  const computedNights = trip.endDate && trip.endDate !== trip.startDate && trip.durationDays === 1 && trip.durationNights === 0
    ? Math.max(1, Math.round((asDate(trip.endDate).getTime() - asDate(trip.startDate).getTime()) / 86_400_000))
    : trip.durationNights
  const computedDays = computedNights !== trip.durationNights ? computedNights + 1 : trip.durationDays
  const whatsappNumber = (content.contactPhone || "+48501465318").replace(/\D/g, "")
  const whatsappText = encodeURIComponent(isEn ? `Hello, I am interested in the ${homeTeam} - ${awayTeam} trip on ${date}. Package: ${selectedPackageVariant.label}.` : `Dzień dobry, interesuje mnie wyjazd ${homeTeam} - ${awayTeam}, ${date}. Wariant: ${selectedPackageVariant.label}.`)
  const availableTripOptions = publishedTrips
  .filter(
    (item) =>
      item.id !== trip.id &&
      item.availabilityStatus !== "sold_out"
  )
  .map((item) => ({
    id: item.id,
    title: item.title,
    startDate: item.startDate,
    endDate: item.endDate,
    packageVariants: getPackageVariants(
      item.packageVariants,
      item.packageItems,
      locale
    ).map((variant) => variant.label),
  }))
  const faq = trip.faq.length > 0
    ? trip.faq.map((item) => { const [question, ...answer] = item.split("|"); return { question: question.trim(), answer: answer.join("|").trim() } }).filter((item) => item.question && item.answer)
    : [
        ...(isEn ? [
          { question: "Is the match ticket included?", answer: "Yes. The package includes a match ticket, and its category is confirmed before booking." },
          { question: "When will I receive the exact flight times?", answer: "We share flight details after the fixture and selected travel option are confirmed." },
          { question: "Can I depart from another airport?", answer: "Yes. We can check connections from the most convenient airport for you." },
        ] : [
          { question: "Czy bilet na mecz jest w cenie?", answer: "Tak, pakiet obejmuje bilet na mecz. Jego kategoria jest potwierdzana przed rezerwacją." },
          { question: "Kiedy otrzymam dokładne godziny lotów?", answer: "Szczegóły lotów przekazujemy po finalnym potwierdzeniu terminarza i wybranego wariantu podróży." },
          { question: "Czy mogę wyjechać z innego lotniska?", answer: "Tak, sprawdzamy połączenia z lotniska najwygodniejszego dla uczestnika." },
        ]),
      ]

  const tripPath = `${routeFor(locale, "/wyjazdy")}/${trip.slug}`
  const tripUrl = absoluteUrl(tripPath)
  const schemaDescription =
    stripHtml(trip.description).trim() ||
    buildTripSeoDescription({
      title: trip.title,
      price: trip.price,
      locale,
      customDescription: trip.seoDescription,
    })

  const offerSchema = {
    "@type": "Offer",
    "@id": `${tripUrl}#offer`,
    url: tripUrl,
    price: trip.price,
    priceCurrency: "PLN",
    availability: `https://schema.org/${status.schema}`,
    seller: { "@id": absoluteUrl("/#organization") },
  }

  const tripSchema = {
    "@type": "TouristTrip",
    "@id": `${tripUrl}#trip`,
    url: tripUrl,
    name: isEn
      ? `Football trip: ${homeTeam} - ${awayTeam}`
      : `Wyjazd na mecz ${homeTeam} - ${awayTeam}`,
    description: schemaDescription,
    image: absoluteUrl(trip.image),
    touristType: isEn ? "Football supporters" : "Kibice piłkarscy",
    inLanguage: isEn ? "en-GB" : "pl-PL",
    itinerary: {
      "@type": "Place",
      name: trip.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: trip.city,
        addressCountry: trip.country,
      },
    },
    mainEntityOfPage: { "@id": `${tripUrl}#webpage` },
    provider: { "@id": absoluteUrl("/#organization") },
    offers: { "@id": offerSchema["@id"] },
  }

  const webPageTitle =
    normalizeSeoTitle(trip.seoTitle || "") ||
    (isEn
      ? `Football trip to ${trip.title}`
      : `Wyjazd na mecz ${trip.title}`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${tripUrl}#webpage`,
        url: tripUrl,
        name: `${webPageTitle} | Let’s Gol`,
        description: schemaDescription,
        isPartOf: { "@id": absoluteUrl("/#website") },
        breadcrumb: { "@id": `${tripUrl}#breadcrumb` },
        mainEntity: { "@id": tripSchema["@id"] },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(trip.image),
        },
        inLanguage: isEn ? "en-GB" : "pl-PL",
      },
      tripSchema,
      offerSchema,
      breadcrumbSchema([
        { name: t("Strona główna", "Home"), path: routeFor(locale, "/") },
        { name: t("Wyjazdy", "Trips"), path: routeFor(locale, "/wyjazdy") },
        { name: `${homeTeam} - ${awayTeam}`, path: tripPath },
      ]),
    ],
  }
const defaultPlan = [
  selectedHasFlight
    ? t("Wylot z wybranego lotniska i przejazd do miasta", "Departure from the selected airport and transfer to the city")
    : t("Dojazd do miasta we własnym zakresie", "Make your own way to the city"),

  ...(selectedHasHotel
    ? [t("Zakwaterowanie w hotelu i czas wolny", "Hotel check-in and free time")]
    : []),

  t("Dzień meczowy i wejście na stadion", "Match day and stadium entry"),
  t("Czas na poznanie miasta", "Time to explore the city"),

  selectedHasFlight
    ? t("Lot powrotny do Polski", "Return flight")
    : t("Powrót we własnym zakresie", "Make your own return arrangements"),
]

  return (
    <main className="bg-background">
      <JsonLd data={jsonLd} />

      <SiteHeader />

    <section className="relative isolate overflow-hidden bg-foreground pt-20 text-white">
  <Image
    src={trip.image}
    alt={t(`Stadion ${trip.stadium || trip.city}`, `Stadium ${trip.stadium || trip.city}`)}
    fill
    preload
    className="object-cover object-[center_35%] brightness-75 md:object-center md:brightness-100"
    sizes="100vw"
  />

  {/* MOBILE */}
  <div className="absolute inset-0 bg-black/40 md:hidden" />

  <div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/45 to-black/90 md:hidden" />

  <div className="absolute inset-x-0 bottom-0 h-[72%] bg-linear-to-t from-black/95 via-black/70 to-transparent md:hidden" />

  {/* DESKTOP */}
  <div className="absolute inset-0 hidden bg-black/15 md:block" />

  <div className="absolute inset-0 hidden bg-linear-to-r from-black/85 via-black/35 to-black/25 md:block" />

  <div className="absolute inset-x-0 bottom-0 hidden h-[72%] bg-linear-to-t from-black/90 via-black/45 to-transparent md:block" />

  <div className="absolute inset-x-0 top-0 hidden h-32 bg-linear-to-b from-black/45 to-transparent md:block" />

  <div className="relative mx-auto flex min-h-150 max-w-7xl items-end px-4 pb-8 pt-10 md:px-6 md:pb-14 md:pt-16 lg:min-h-145 lg:pb-16">
    <div className="grid w-full items-end gap-7 md:gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex min-h-7 items-center rounded-md px-3 font-mono text-[9px] font-black uppercase leading-none tracking-[0.16em] ${status.className}`}
          >
            {status.label}
          </span>

          {(trip.leagueName || trip.leagueLogo) && (
            <div className="flex items-center gap-2.5">
              {trip.leagueLogo && (
                <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-white shadow-sm">
                  <Image
                    src={trip.leagueLogo}
                    alt={`Logo ${trip.leagueName}`}
                    fill
                    className="object-contain p-1"
                    sizes="28px"
                  />
                </span>
              )}

              {trip.leagueName && (
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/90 md:text-white/75">
                  {trip.leagueName}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-4 md:mt-7">
          <TeamLogo
            src={trip.homeLogo}
            name={homeTeam}
            locale={locale}
          />

          <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-white/60 md:text-white/40">
            VS
          </span>

          <TeamLogo
            src={trip.awayLogo}
            name={awayTeam}
            locale={locale}
          />
        </div>

        <div className="mt-5 md:mt-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            {trip.city}, {trip.country}
          </p>

          {/* MOBILE */}
<h1 className="mt-4 md:hidden">
  <span className="block font-sans text-[38px] font-black uppercase leading-[0.88] tracking-[-0.045em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.65)]">
    {homeTeam}
  </span>

  <span className="my-2 flex items-center gap-3">
    <span className="h-px w-6 bg-primary/70" />

    <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-primary">
      VS.
    </span>

    <span className="h-px w-6 bg-primary/70" />
  </span>

  <span className="block font-sans text-[38px] font-black uppercase leading-[0.88] tracking-[-0.045em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.65)]">
    {awayTeam}
  </span>
</h1>

{/* TABLET / DESKTOP */}
<h1 className="mt-3 hidden max-w-5xl font-sans font-black uppercase tracking-[-0.045em] text-white md:block md:text-6xl md:leading-[0.88] lg:text-[clamp(54px,4.3vw,72px)] xl:whitespace-nowrap">
  {homeTeam} - {awayTeam}
</h1>
        </div>

        {/* MOBILE */}
        <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-white/20 pt-5 md:hidden">
          <div className="col-span-2 flex items-start gap-2.5">
            <CalendarDays
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/60">
                {t("Termin wyjazdu", "Trip dates")}
              </p>

              <p className="mt-1 text-sm font-semibold leading-5 text-white">
                {date}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5">
            <MapPin
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/60">
                {t("Stadion", "Stadium")}
              </p>

              <p className="mt-1 text-sm font-semibold leading-5 text-white">
                {trip.stadium || t(`Stadion w ${trip.city}`, `Stadium in ${trip.city}`)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5">
            <Clock3
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/60">
                {t("Pobyt", "Stay")}
              </p>

              <p className="mt-1 text-sm font-semibold leading-5 text-white">
                {pluralizeDuration(computedDays, computedNights, locale)}
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="mt-8 hidden flex-wrap gap-x-6 gap-y-4 border-t border-white/15 pt-5 md:flex">
          <div className="flex items-center gap-2.5">
            <CalendarDays
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                 {t("Termin wyjazdu", "Trip dates")}
              </p>

              <p className="mt-0.5 text-base font-semibold text-white/90">
                {date}
              </p>
            </div>
          </div>

          <div className="hidden h-9 w-px bg-white/15 sm:block" />

          <div className="flex items-center gap-2.5">
            <MapPin
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                 {t("Stadion", "Stadium")}
              </p>

              <p className="mt-0.5 text-base font-semibold text-white/90">
                 {trip.stadium || t(`Stadion w ${trip.city}`, `Stadium in ${trip.city}`)}
              </p>
            </div>
          </div>

          <div className="hidden h-9 w-px bg-white/15 sm:block" />

          <div className="flex items-center gap-2.5">
            <Clock3
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                 {t("Pobyt", "Stay")}
              </p>

              <p className="mt-0.5 text-base font-semibold text-white/90">
                 {pluralizeDuration(computedDays, computedNights, locale)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CENA */}
      <div className="w-full lg:justify-self-end">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/60 p-5 shadow-2xl backdrop-blur-xl md:bg-black/55 md:p-7">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent" />

          <div className="relative">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.17em] text-white/80">
              {fullPackageSelected
                ? t("Cena od / osoba", "Price from / person")
                : t("Cena wybranego wariantu", "Selected package price")}
            </p>

            {fullPackageSelected ? (
  <div className="mt-2 flex items-end gap-1.5">
    <p className="font-sans text-4xl font-black leading-none tracking-[-0.04em] text-primary md:text-5xl">
      {formatPrice(trip.price, locale)}
    </p>

    <span className="pb-0.5 font-sans text-lg font-black text-primary md:text-2xl">
      {t("zł", "PLN")}
    </span>
  </div>
) : (
  <p className="mt-3 font-sans text-xl font-black uppercase leading-[0.95] tracking-tight text-primary md:text-3xl">
    {t("Ustalana", "Quoted")}
    <br />
    {t("indywidualnie", "individually")}
  </p>
)}

            {partialPackageSelected && (
              <p className="mt-3 text-[11px] leading-5 text-white/50 md:mt-4 md:text-xs">
                {t(
                  "Cena zależy od wybranego zakresu i zazwyczaj jest niższa niż cena pełnego pakietu.",
                  "The price depends on the selected services and is usually lower than the full package price."
                )}
              </p>
            )}

            <div className="mt-5 grid gap-3 md:mt-7">
              {soldOut ? (
                <Button
                  disabled
                  size="lg"
                  className="h-11 w-full rounded-xl md:h-12"
                >
                  {t("Wyprzedane", "Sold out")}
                </Button>
              ) : (
                <Button
  size="lg"
  nativeButton={false}
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
  className="h-11 w-full rounded-xl font-semibold md:h-12"
>
  {t("Rezerwuj miejsce", "Book your place")}
  <ArrowRight data-icon="inline-end" />
</Button>
              )}

              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                className="h-11 w-full rounded-xl border-white/20 bg-white/5 font-semibold text-white hover:border-white/30 hover:bg-white/10 hover:text-white md:h-12"
              >
                <MessageCircle data-icon="inline-start" />
                {t("Napisz na WhatsApp", "Message us on WhatsApp")}
              </Button>
            </div>

            {!soldOut && (
              <p className="mt-3 text-center text-[11px] leading-4 text-white/45 md:mt-4 md:text-xs">
                {t("Wyślij zapytanie - skontaktujemy się z Tobą", "Send an enquiry - we will get back to you")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <section aria-labelledby="wariant-pakietu" className="border-b bg-secondary px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">{t("Dopasuj ofertę", "Tailor your trip")}</p><h2 id="wariant-pakietu" className="mt-1 font-sans text-2xl font-black uppercase md:text-3xl">{t("Wybierz wariant pakietu", "Choose your package")}</h2></div><p className="max-w-xl text-sm leading-6 text-muted-foreground">{t("Niepełne pakiety wyceniamy indywidualnie według Twoich potrzeb.", "Partial packages are quoted individually to match your needs.")}</p></div>
         <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
  {orderedPackageVariants.map((variant) => {
    const VariantIcon =
      variant.key === "ticket"
        ? TicketCheck
        : variant.key === "ticket_flight"
          ? Plane
          : variant.key === "ticket_hotel"
            ? BedDouble
            : Check

    const selected =
      variant.key === selectedPackageVariant.key

    return (
      <Link
        key={variant.key}
        href={`?pakiet=${variant.key}#wariant-pakietu`}
        aria-current={selected ? "true" : undefined}
        className={`group flex min-h-20 items-center gap-4 border-l-2 px-4 py-3 transition-colors ${
          selected
            ? "border-primary bg-background text-foreground"
            : "border-border bg-transparent text-muted-foreground hover:border-primary/60 hover:bg-background/60 hover:text-foreground"
        }`}
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground group-hover:text-primary"
          }`}
        >
          <VariantIcon className="size-5" />
        </span>

        <span>
          <strong className="block text-sm uppercase">
            {variant.shortLabel}
          </strong>

          <span className="mt-1 block text-xs">
            {variant.key === "full"
              ? `${t("od", "from")} ${formatPrice(trip.price, locale)} ${t("zł", "PLN")}`
              : t("Wycena indywidualna", "Individual quote")}
          </span>
        </span>
      </Link>
    )
  })}
</div>

        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl">
          <TripDetailsTabs
            locale={locale}
            descriptionHtml={sanitizeDescriptionHtml(trip.description)}
            includedItems={includedItems}
            optionalItems={optionalFeatures.map(({ key, label }) => ({ key, label }))}
            excludedItems={excludedFeatures.map(({ key, label }) => ({ key, label }))}
            ticketCategory={trip.ticketCategory}
            seatingInfo={trip.seatingInfo}
            itinerary={trip.itinerary.length > 0 ? trip.itinerary : defaultPlan}
            hotel={selectedHasHotel ? {
              stars: trip.hotelStars,
              info: trip.hotelInfo || t("Dokładny obiekt potwierdzimy przed rezerwacją.", "We will confirm the exact hotel before booking."),
              board: trip.hotelBoard,
              roomType: trip.roomType,
              optional: packageOptions.hotel === "optional",
            } : undefined}
            flight={selectedHasFlight ? {
              info: trip.flightInfo || t("Godziny i połączenie potwierdzamy po ustaleniu wariantu.", "We will confirm the flight times and route once your package is agreed."),
              airports: trip.departureAirports,
              type: trip.flightType,
              baggage: trip.baggageInfo,
              optional: packageOptions.flight === "optional",
            } : undefined}
            gallery={gallery.map(({ id, mediaId, alt, caption }) => ({ id, mediaId, alt, caption }))}
            testimonials={testimonials.slice(0, 4).map(({ id, author, tripName, content: testimonialContent, rating }) => ({ id, author, tripName, content: testimonialContent, rating }))}
            faq={faq}
            tripTitle={trip.title}
              selectedPackageLabel={
    selectedPackageVariant.label
  }
  partialPackageSelected={
    partialPackageSelected
  }
  hotelIncluded={
    selectedHasHotel
  }
  flightIncluded={
    selectedHasFlight
  }
  changePackageHref="#wariant-pakietu"
          />
        </div>
      </section>

      <section
  id="rezerwacja"
  className="scroll-mt-24 border-y border-white/10 bg-foreground px-4 text-background md:px-6"
>
  <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.8fr_1.2fr]">
    <div className="relative overflow-hidden border-b border-background/10 py-10 md:py-14 lg:border-b-0 lg:border-r lg:pr-12">
      <div
        className={`absolute -right-20 -top-20 size-72 rounded-full blur-3xl ${
          soldOut ? "bg-red-500/10" : "bg-primary/15"
        }`}
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <TicketCheck
            className={`size-6 ${
              soldOut ? "text-red-400" : "text-primary"
            }`}
          />

          <p
            className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${
              soldOut ? "text-red-400" : "text-primary"
            }`}
          >
            {soldOut ? t("Brak miejsc", "No places available") : t("Rezerwacja", "Booking")}
          </p>
        </div>

        <h2 className="mt-4 max-w-lg font-sans text-4xl font-black uppercase leading-none md:text-5xl">
          {soldOut
            ? t("Ten wyjazd jest już wyprzedany", "This trip is sold out")
            : t("Zarezerwuj miejsce", "Book your place")}
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-6 text-background/60">
          {soldOut
            ? t("Na ten wyjazd nie przyjmujemy już rezerwacji. Wybierz inny dostępny mecz lub opisz wydarzenie, które mamy dla Ciebie wycenić.", "We are no longer taking bookings for this trip. Choose another available match or tell us which event you would like us to quote.")
            : t("Wyślij zapytanie. Sprawdzimy aktualną dostępność i przygotujemy konkretny wariant wyjazdu.", "Send an enquiry. We will check current availability and prepare a suitable trip option for you.")}
        </p>

        <div className="mt-7 flex items-center gap-3 opacity-90">
          <TeamLogo
            src={trip.homeLogo}
            name={homeTeam}
            locale={locale}
          />

          <span className="font-sans text-lg font-black text-background/60">
            VS
          </span>

          <TeamLogo
            src={trip.awayLogo}
            name={awayTeam}
            locale={locale}
          />
        </div>

       <h3 className="mt-5 font-sans text-2xl font-black uppercase">
  {homeTeam} - {awayTeam}
</h3>

<div className="relative mt-8">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.17em] text-white/80">
              {fullPackageSelected
                ? t("Cena od / osoba", "Price from / person")
                : t("Cena wybranego wariantu", "Selected package price")}
            </p>

            {fullPackageSelected ? (
  <div className="mt-2 flex items-end gap-1.5">
    <p className="font-sans text-4xl font-black leading-none tracking-[-0.04em] text-primary md:text-5xl">
      {formatPrice(trip.price, locale)}
    </p>

    <span className="pb-0.5 font-sans text-lg font-black text-primary md:text-2xl">
      {t("zł", "PLN")}
    </span>
  </div>
) : (
  <p className="mt-3 font-sans text-xl font-black uppercase leading-[0.95] tracking-tight text-primary md:text-3xl">
    {t("Ustalana", "Quoted")}
    <br />
    {t("indywidualnie", "individually")}
  </p>
)}

            {partialPackageSelected && (
              <p className="mt-3 text-[11px] leading-5 text-white/50 md:mt-4 md:text-xs">
                {t(
                  "Cena zależy od wybranego zakresu i zazwyczaj jest niższa niż cena pełnego pakietu.",
                  "The price depends on the selected services and is usually lower than the full package price."
                )}
              </p>
            )}

            <div className="mt-5 grid gap-3 md:mt-7">
              {soldOut ? (
                <Button
                  disabled
                  size="lg"
                  className="h-11 w-full rounded-xl md:h-12"
                >
                  {t("Wyprzedane", "Sold out")}
                </Button>
              ) : (
                <Button
  size="lg"
  nativeButton={false}
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
  className="h-11 w-full rounded-xl font-semibold md:h-12"
>
  {t("Rezerwuj miejsce", "Book your place")}
  <ArrowRight data-icon="inline-end" />
</Button>
              )}

              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                className="h-11 w-full rounded-xl border-white/20 bg-white/5 font-semibold text-white hover:border-white/30 hover:bg-white/10 hover:text-white md:h-12"
              >
                <MessageCircle data-icon="inline-start" />
                {t("Napisz na WhatsApp", "Message us on WhatsApp")}
              </Button>
            </div>

            {!soldOut && (
              <p className="mt-3 text-center text-[11px] leading-4 text-white/45 md:mt-4 md:text-xs">
                {t("Wyślij zapytanie - skontaktujemy się z Tobą", "Send an enquiry - we will get back to you")}
              </p>
            )}
          </div>
      </div>
    </div>

          <div className="py-10 md:py-14 lg:pl-12">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("Formularz zapytania", "Enquiry form")}</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase">
              {soldOut ? t("Wybierz inny mecz", "Choose another match") : t("Podaj swoje dane", "Tell us about yourself")}
            </h3>
            <p className="mb-7 mt-2 text-sm text-background/55">
              {soldOut
                ? t("Pokażemy dostępne wyjazdy, a jeśli nie ma Twojego meczu, przygotujemy ofertę indywidualną.", "We will show you the available trips. If your match is not listed, we can prepare a custom offer.")
                : t("Oddzwonimy lub odpiszemy z potwierdzeniem dostępności.", "We will call or email you to confirm availability.")}
            </p>
           {soldOut ? (
  <InquiryForm
    trips={availableTripOptions}
  />
) : (
  <InquiryForm
    matchName={`${homeTeam} - ${awayTeam}`}
    tripStartDate={trip.startDate}
    tripEndDate={trip.endDate}
    packageVariants={packageVariants.map(
      (variant) => variant.label
    )}
    defaultPackageVariant={
      selectedPackageVariant.label
    }
  />
)}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
