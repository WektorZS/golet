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
import { getPackageVariants, packageFeatures, parsePackageItems } from "@/lib/package-options"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"
import { breadcrumbSchema } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { getPublishedTrips, getTripBySlug, getTripGallery } from "@/lib/trips"

export const dynamic = "force-dynamic"

const availability = {
  available: { label: "Dostępne miejsca", className: "bg-emerald-700 text-white", schema: "InStock" },
  last_places: { label: "Ostatnie miejsca", className: "bg-primary text-primary-foreground", schema: "LimitedAvailability" },
  sold_out: { label: "Wyprzedane", className: "bg-red-600 text-white", schema: "SoldOut" },
} as const

function asDate(value: string) {
  return new Date(`${value}T12:00:00`)
}

function formatStay(days: number, nights: number) {
  const dayLabel = days === 1 ? "dzień" : "dni"
  const nightLabel = nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noce" : "nocy"
  return `${days} ${dayLabel} / ${nights} ${nightLabel}`
}

function getTeams(title: string, opponent: string, homeTeam: string, awayTeam: string) {
  const [titleHome, titleAway] = title.split(/\s+vs\.?\s+|\s+-\s+/i).map((item) => item.trim())
  return {
    home: homeTeam || titleHome || "Gospodarz",
    away: awayTeam || titleAway || opponent || "Gość",
  }
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  if (!src) return <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 font-sans text-lg font-black md:size-20">{name.slice(0, 2).toUpperCase()}</span>
  return <span className="relative block size-16 md:size-20"><Image src={src} alt={`Herb ${name}`} fill className="object-contain drop-shadow-xl" sizes="80px" /></span>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) return { title: "Wyjazd niedostępny" }

  const description = trip.seoDescription || `${stripHtml(trip.description)} Pakiet od ${trip.price.toLocaleString("pl-PL")} zł.`
  const title = trip.seoTitle || trip.title
  const summary = description.slice(0, 160)
  const canonical = `/wyjazdy/${trip.slug}`
  return {
    title,
    description: summary,
    alternates: { canonical },
    openGraph: { title, description: summary, type: "website", url: canonical, images: [{ url: trip.image, alt: `Wyjazd na mecz ${trip.title} w ${trip.city}` }] },
    twitter: { card: "summary_large_image", title, description: summary, images: [trip.image] },
  }
}

export default async function TripDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pakiet?: string }> }) {
  const { slug } = await params
  const { pakiet } = await searchParams
  const trip = await getTripBySlug(slug)
  if (!trip) notFound()

  const [gallery, testimonials, content, publishedTrips] = await Promise.all([
    getTripGallery(trip.id, trip.homeTeamId, trip.awayTeamId),
    getPublishedTestimonials(),
    getSiteContent(),
    getPublishedTrips(),
  ])
  const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" })
  const startDate = dateFormatter.format(asDate(trip.startDate))
  const date = trip.endDate && trip.endDate !== trip.startDate ? `${startDate} - ${dateFormatter.format(asDate(trip.endDate))}` : startDate
  const matchDate = trip.matchDate ? dateFormatter.format(asDate(trip.matchDate)) : startDate
  const status = availability[trip.availabilityStatus as keyof typeof availability] || availability.available
  const soldOut = trip.availabilityStatus === "sold_out"
  const teams = getTeams(trip.title, trip.opponent, trip.homeTeam, trip.awayTeam)
  const packageOptions = parsePackageItems(trip.packageItems)
  const packageVariants = getPackageVariants(trip.packageVariants, trip.packageItems)
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
  const whatsappText = encodeURIComponent(`Dzień dobry, interesuje mnie wyjazd ${homeTeam} - ${awayTeam}, ${date}. Wariant: ${selectedPackageVariant.label}.`)
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
      item.packageItems
    ).map((variant) => variant.label),
  }))
  const faq = trip.faq.length > 0
    ? trip.faq.map((item) => { const [question, ...answer] = item.split("|"); return { question: question.trim(), answer: answer.join("|").trim() } }).filter((item) => item.question && item.answer)
    : [
        { question: "Czy bilet na mecz jest w cenie?", answer: "Tak, pakiet obejmuje bilet na mecz. Jego kategoria jest potwierdzana przed rezerwacją." },
        { question: "Kiedy otrzymam dokładne godziny lotów?", answer: "Szczegóły lotów przekazujemy po finalnym potwierdzeniu terminarza i wybranego wariantu podróży." },
        { question: "Czy mogę wyjechać z innego lotniska?", answer: "Tak, sprawdzamy połączenia z lotniska najwygodniejszego dla uczestnika." },
      ]

  const tripUrl = absoluteUrl(`/wyjazdy/${trip.slug}`)
  const schemaDescription = stripHtml(trip.description).trim()
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
    name: `${homeTeam} - ${awayTeam}`,
    ...(schemaDescription && { description: schemaDescription }),
    image: absoluteUrl(trip.image),
    touristType: "Kibice piłkarscy",
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
  const productSchema = {
    "@type": "Product",
    "@id": `${tripUrl}#package`,
    name: `Wyjazd na mecz ${homeTeam} - ${awayTeam}`,
    ...(schemaDescription && { description: schemaDescription }),
    image: absoluteUrl(trip.image),
    category: "Pakiet turystyczny na mecz piłkarski",
    brand: { "@type": "Brand", name: "Let’s Gol" },
    isRelatedTo: { "@id": tripSchema["@id"] },
    offers: { "@id": offerSchema["@id"] },
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${tripUrl}#webpage`,
        url: tripUrl,
        name: trip.seoTitle || trip.title,
        ...(schemaDescription && { description: schemaDescription }),
        isPartOf: { "@id": absoluteUrl("/#website") },
        breadcrumb: { "@id": `${tripUrl}#breadcrumb` },
        mainEntity: { "@id": tripSchema["@id"] },
      },
      tripSchema,
      productSchema,
      offerSchema,
      breadcrumbSchema([
        { name: "Strona główna", path: "/" },
        { name: "Wyjazdy", path: "/wyjazdy" },
        { name: `${homeTeam} - ${awayTeam}`, path: `/wyjazdy/${trip.slug}` },
      ]),
    ],
  }
const defaultPlan = [
  selectedHasFlight
    ? "Wylot z wybranego lotniska i przejazd do miasta"
    : "Dojazd do miasta we własnym zakresie",

  ...(selectedHasHotel
    ? ["Zakwaterowanie w hotelu i czas wolny"]
    : []),

  "Dzień meczowy i wejście na stadion",
  "Czas na poznanie miasta",

  selectedHasFlight
    ? "Lot powrotny do Polski"
    : "Powrót we własnym zakresie",
]

  return (
    <main className="bg-background">
      <JsonLd data={jsonLd} />

      <SiteHeader />

    <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
  <Image
    src={trip.image}
    alt={`Stadion ${trip.stadium || trip.city}`}
    fill
    preload
    className="object-cover"
    sizes="100vw"
  />

  <div className="absolute inset-0 bg-black/15" />

  <div className="absolute inset-y-0 left-0 w-[62%] bg-linear-to-r from-black/95 via-black/70 to-transparent" />

  <div className="absolute inset-y-0 right-0 w-[42%] bg-linear-to-l from-black/80 via-black/45 to-transparent" />

  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-black/75 via-black/25 to-transparent" />

  <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex rounded-md px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] shadow-sm ${status.className}`}
        >
          {status.label}
        </span>

        {(trip.leagueName || trip.leagueLogo) && (
          <div className="flex items-center gap-2.5">
            {trip.leagueLogo && (
              <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-white p-1 shadow-sm">
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
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                {trip.leagueName}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <TeamLogo
          src={trip.homeLogo}
          name={homeTeam}
        />

        <span className="font-sans text-xl font-black text-white/50">
          VS
        </span>

        <TeamLogo
          src={trip.awayLogo}
          name={awayTeam}
        />
      </div>

      <p className="mt-6 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-primary">
        {trip.city}, {trip.country}
      </p>

      <h1 className="mt-3 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-white sm:text-6xl lg:text-[72px]">
        {homeTeam} - {awayTeam}
      </h1>

      <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/90">
        <span className="flex items-center gap-2">
          <CalendarDays
            className="size-4 text-primary"
            aria-hidden="true"
          />

          {matchDate}
        </span>

        <span className="flex items-center gap-2">
          <MapPin
            className="size-4 text-primary"
            aria-hidden="true"
          />

          {trip.stadium || `Stadion w ${trip.city}`}
        </span>

        <span className="flex items-center gap-2">
          <Clock3
            className="size-4 text-primary"
            aria-hidden="true"
          />

          {formatStay(
            computedDays,
            computedNights
          )}
        </span>
      </div>
    </div>

    <div className="border-l-2 border-primary bg-black/20 px-6 py-6 backdrop-blur-[2px] md:px-8">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
        {fullPackageSelected
          ? "Cena od / osoba"
          : "Cena wybranego wariantu"}
      </p>

      {fullPackageSelected ? (
        <p className="mt-3 font-sans text-5xl font-black leading-none tracking-tight text-primary">
          {trip.price.toLocaleString("pl-PL")} zł
        </p>
      ) : (
        <p className="mt-3 max-w-sm font-sans text-3xl font-black uppercase leading-none tracking-tight text-primary">
          Ustalana indywidualnie
        </p>
      )}

      {partialPackageSelected && (
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
          Cena zależy od wybranego zakresu i zazwyczaj
          jest niższa niż cena pełnego pakietu.
        </p>
      )}

      <div className="mt-7 grid gap-3 sm:max-w-80">
        {soldOut ? (
          <Button
            disabled
            size="lg"
            className="w-full"
          >
            Wyprzedane
          </Button>
        ) : (
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#rezerwacja" />}
            className="w-full"
          >
            Rezerwuj miejsce

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
          className="w-full border-white/20 bg-black/25 text-white hover:bg-black/40 hover:text-white"
        >
          <MessageCircle data-icon="inline-start" />

          Napisz na WhatsApp
        </Button>
      </div>
    </div>
  </div>
</section>

      <section aria-labelledby="wariant-pakietu" className="border-b bg-secondary px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">Dopasuj ofertę</p><h2 id="wariant-pakietu" className="mt-1 font-sans text-2xl font-black uppercase md:text-3xl">Wybierz wariant pakietu</h2></div><p className="max-w-xl text-sm leading-6 text-muted-foreground">Niepełne pakiety wyceniamy indywidualnie według Twoich potrzeb.</p></div>
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
              ? `od ${trip.price.toLocaleString("pl-PL")} zł`
              : "Wycena indywidualna"}
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
            descriptionHtml={sanitizeDescriptionHtml(trip.description)}
            includedItems={includedItems}
            optionalItems={optionalFeatures.map(({ key, label }) => ({ key, label }))}
            excludedItems={excludedFeatures.map(({ key, label }) => ({ key, label }))}
            ticketCategory={trip.ticketCategory}
            seatingInfo={trip.seatingInfo}
            itinerary={trip.itinerary.length > 0 ? trip.itinerary : defaultPlan}
            hotel={selectedHasHotel ? {
              stars: trip.hotelStars,
              info: trip.hotelInfo || "Dokładny obiekt potwierdzimy przed rezerwacją.",
              board: trip.hotelBoard,
              roomType: trip.roomType,
              optional: packageOptions.hotel === "optional",
            } : undefined}
            flight={selectedHasFlight ? {
              info: trip.flightInfo || "Godziny i połączenie potwierdzamy po ustaleniu wariantu.",
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
            {soldOut ? "Brak miejsc" : "Rezerwacja"}
          </p>
        </div>

        <h2 className="mt-4 max-w-lg font-sans text-4xl font-black uppercase leading-none md:text-5xl">
          {soldOut
            ? "Ten wyjazd jest już wyprzedany"
            : "Zarezerwuj miejsce"}
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-6 text-background/60">
          {soldOut
            ? "Na ten wyjazd nie przyjmujemy już rezerwacji. Wybierz inny dostępny mecz lub opisz wydarzenie, które mamy dla Ciebie wycenić."
            : "Wyślij zapytanie. Sprawdzimy aktualną dostępność i przygotujemy konkretny wariant wyjazdu."}
        </p>

        <div className="mt-7 flex items-center gap-3 opacity-90">
          <TeamLogo
            src={trip.homeLogo}
            name={homeTeam}
          />

          <span className="font-sans text-lg font-black text-background/60">
            VS
          </span>

          <TeamLogo
            src={trip.awayLogo}
            name={awayTeam}
          />
        </div>

        <h3 className="mt-5 font-sans text-2xl font-black uppercase">
          {homeTeam} - {awayTeam}
        </h3>

          <div className="w-full rounded-2xl border border-white/15 bg-black/55 p-5 shadow-2xl backdrop-blur-md lg:w-80">
  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
    {fullPackageSelected
      ? "Cena od / osoba"
      : "Cena wybranego wariantu"}
  </p>

  {fullPackageSelected ? (
    <p className="mt-1 font-sans text-4xl font-black text-primary">
      {trip.price.toLocaleString("pl-PL")} zł
    </p>
  ) : (
    <p className="mt-2 font-sans text-2xl font-black uppercase leading-tight text-primary">
      Ustalana indywidualnie
    </p>
  )}

  <div className="mt-5 grid gap-3">
    {soldOut ? (
      <Button disabled size="lg">
        Wyprzedane
      </Button>
    ) : (
      <Button
        size="lg"
        nativeButton={false}
        render={<a href="#rezerwacja" />}
      >
        Rezerwuj miejsce
        <ArrowRight data-icon="inline-end" />
      </Button>
    )}

    <Button
      variant="outline"
      size="lg"
      className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
      nativeButton={false}
      render={
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
        />
      }
    >
      <MessageCircle data-icon="inline-start" />
      Napisz na WhatsApp
    </Button>
  </div>
</div>
      </div>
    </div>

          <div className="py-10 md:py-14 lg:pl-12">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Formularz zapytania</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase">
              {soldOut ? "Wybierz inny mecz" : "Podaj swoje dane"}
            </h3>
            <p className="mb-7 mt-2 text-sm text-background/55">
              {soldOut
                ? "Pokażemy dostępne wyjazdy, a jeśli nie ma Twojego meczu, przygotujemy ofertę indywidualną."
                : "Oddzwonimy lub odpiszemy z potwierdzeniem dostępności."}
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
