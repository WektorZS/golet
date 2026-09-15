import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, MessageCircle, TicketCheck } from "lucide-react"

import { InquiryForm } from "@/components/inquiry-form"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
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
  available: { label: "Dostępne miejsca", className: "bg-emerald-500 text-white", schema: "InStock" },
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
  const selectedPackageVariant = packageVariants.find((variant) => variant.key === pakiet) || packageVariants[0]
  const includedFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "included")
  const optionalFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "optional")
  const excludedFeatures = packageFeatures.filter((feature) => packageOptions[feature.key] === "excluded")
  const includedItems: { key: string; label: string }[] = [
    ...includedFeatures.map((feature) => ({ key: feature.key, label: feature.label })),
    ...trip.includes.map((label, index) => ({ key: `custom-${index}`, label })),
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.label === item.label) === index)
  const hasHotel = packageOptions.hotel !== "excluded"
  const hasFlight = packageOptions.flight !== "excluded"
  const homeTeam = teams.home
  const awayTeam = teams.away
  const computedNights = trip.endDate && trip.endDate !== trip.startDate && trip.durationDays === 1 && trip.durationNights === 0
    ? Math.max(1, Math.round((asDate(trip.endDate).getTime() - asDate(trip.startDate).getTime()) / 86_400_000))
    : trip.durationNights
  const computedDays = computedNights !== trip.durationNights ? computedNights + 1 : trip.durationDays
  const whatsappNumber = (content.contactPhone || "+48501465318").replace(/\D/g, "")
  const whatsappText = encodeURIComponent(`Dzień dobry, interesuje mnie wyjazd ${homeTeam} - ${awayTeam}, ${date}.`)
  const availableTripOptions = publishedTrips
    .filter((item) => item.id !== trip.id && item.availabilityStatus !== "sold_out")
    .map((item) => ({
      id: item.id,
      title: item.title,
      date: item.matchDate || item.startDate,
    }))
  const faq = trip.faq.length > 0
    ? trip.faq.map((item) => { const [question, ...answer] = item.split("|"); return { question: question.trim(), answer: answer.join("|").trim() } }).filter((item) => item.question && item.answer)
    : [
        { question: "Czy bilet na mecz jest w cenie?", answer: "Tak, pakiet obejmuje bilet na mecz. Jego kategoria jest potwierdzana przed rezerwacją." },
        { question: "Kiedy otrzymam dokładne godziny lotów?", answer: "Szczegóły lotów przekazujemy po finalnym potwierdzeniu terminarza i wybranego wariantu podróży." },
        { question: "Czy mogę wyjechać z innego lotniska?", answer: "Tak, sprawdzamy połączenia z lotniska najwygodniejszego dla uczestnika." },
      ]

  const offerSchema = {
    "@type": "Offer",
    url: absoluteUrl(`/wyjazdy/${trip.slug}`),
    price: trip.price,
    priceCurrency: "PLN",
    availability: `https://schema.org/${status.schema}`,
    seller: { "@id": absoluteUrl("/#organization") },
  }
  const tripSchema = {
    "@type": "TouristTrip",
    "@id": absoluteUrl(`/wyjazdy/${trip.slug}#trip`),
    url: absoluteUrl(`/wyjazdy/${trip.slug}`),
    name: `${homeTeam} - ${awayTeam}`,
    description: stripHtml(trip.description),
    image: absoluteUrl(trip.image),
    touristType: "Kibice piłkarscy",
    startDate: trip.startDate,
    ...(trip.endDate && { endDate: trip.endDate }),
    provider: { "@id": absoluteUrl("/#organization") },
    offers: offerSchema,
  }
  const productSchema = {
    "@type": "Product",
    "@id": absoluteUrl(`/wyjazdy/${trip.slug}#package`),
    name: `Wyjazd na mecz ${homeTeam} - ${awayTeam}`,
    description: stripHtml(trip.description),
    image: absoluteUrl(trip.image),
    category: "Pakiet turystyczny na mecz piłkarski",
    brand: { "@type": "Brand", name: "Let’s Gol" },
    offers: offerSchema,
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      tripSchema,
      productSchema,
      breadcrumbSchema([
        { name: "Strona główna", path: "/" },
        { name: "Wyjazdy", path: "/wyjazdy" },
        { name: `${homeTeam} - ${awayTeam}`, path: `/wyjazdy/${trip.slug}` },
      ]),
    ],
  }

  const defaultPlan = [
    hasFlight ? "Wylot z wybranego lotniska i przejazd do miasta" : "Dojazd do miasta we własnym zakresie",
    ...(hasHotel ? ["Zakwaterowanie w hotelu i czas wolny"] : []),
    "Dzień meczowy i wejście na stadion",
    "Czas na poznanie miasta",
    hasFlight ? "Lot powrotny do Polski" : "Powrót we własnym zakresie",
  ]
  return (
    <main className="bg-background">
      <JsonLd data={jsonLd} />

      <section className="relative isolate min-h-[620px] overflow-hidden bg-foreground text-background lg:min-h-[540px]">
        <Image src={trip.image} alt={`Stadion ${trip.stadium || trip.city}`} fill preload className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col px-4 py-6 md:px-6 md:py-8 lg:min-h-[540px]">
          <Button variant="ghost" className="w-fit text-background hover:bg-background/10 hover:text-background" nativeButton={false} render={<Link href="/wyjazdy" />}><ArrowLeft data-icon="inline-start" />Kalendarz wyjazdów</Button>

          <div className="mt-auto grid items-end gap-10 pb-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <span className={`inline-flex rounded-md px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider shadow ${status.className}`}>{status.label}</span>
              {(trip.leagueName || trip.leagueLogo) && <div className="mt-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white/90">{trip.leagueLogo && <span className="relative size-8 shrink-0 overflow-hidden rounded-md border border-white/80 bg-white p-1 shadow-[0_5px_18px_rgba(0,0,0,0.35)]"><Image src={trip.leagueLogo} alt={`Logo ${trip.leagueName}`} fill className="object-contain p-1" sizes="32px" /></span>}<span>{trip.leagueName}</span></div>}
              <div className="mt-6 flex items-center gap-4"><TeamLogo src={trip.homeLogo} name={homeTeam} /><span className="font-sans text-2xl font-black text-white/50">VS</span><TeamLogo src={trip.awayLogo} name={awayTeam} /></div>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{trip.city}, {trip.country}</p>
              <h1 className="mt-2 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl">{homeTeam} - {awayTeam}</h1>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{matchDate}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{trip.stadium || `Stadion w ${trip.city}`}</span>
                <span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />{formatStay(computedDays, computedNights)}</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-white/55">Dostępne warianty</span>{packageVariants.map((variant) => <Link key={variant.key} href={`?pakiet=${variant.key}#rezerwacja`} className={`border-b px-1 py-1 text-xs font-bold transition-colors ${selectedPackageVariant.key === variant.key ? "border-primary text-primary" : "border-white/30 text-white/85 hover:border-primary hover:text-primary"}`}>{variant.shortLabel}</Link>)}</div>
            </div>

            <div className="w-full rounded-2xl border border-white/15 bg-black/55 p-5 shadow-2xl backdrop-blur-md lg:w-80">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Cena od / osoba</p>
              <p className="mt-1 font-sans text-4xl font-black text-primary">{trip.price.toLocaleString("pl-PL")} zł</p>
              <div className="mt-5 grid gap-3">
                {soldOut ? <Button disabled size="lg">Wyprzedane</Button> : <Button size="lg" nativeButton={false} render={<a href="#rezerwacja" />}>Rezerwuj miejsce<ArrowRight data-icon="inline-end" /></Button>}
                <Button variant="outline" size="lg" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white" nativeButton={false} render={<a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" />}><MessageCircle data-icon="inline-start" />Napisz na WhatsApp</Button>
              </div>
            </div>
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
            hotel={hasHotel ? {
              stars: trip.hotelStars,
              info: trip.hotelInfo || "Dokładny obiekt potwierdzimy przed rezerwacją.",
              board: trip.hotelBoard,
              roomType: trip.roomType,
              optional: packageOptions.hotel === "optional",
            } : undefined}
            flight={hasFlight ? {
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
          />
        </div>
      </section>

      <section id="rezerwacja" className="scroll-mt-24 border-y border-white/10 bg-foreground px-4 text-background md:px-6">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative overflow-hidden border-b border-background/10 py-10 md:py-14 lg:border-b-0 lg:border-r lg:pr-12">
            <div className={`absolute -right-20 -top-20 size-72 rounded-full blur-3xl ${soldOut ? "bg-red-500/10" : "bg-primary/15"}`} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <TicketCheck className={`size-6 ${soldOut ? "text-red-400" : "text-primary"}`} />
                <p className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${soldOut ? "text-red-400" : "text-primary"}`}>
                  {soldOut ? "Brak miejsc" : "Rezerwacja"}
                </p>
              </div>
              <h2 className="mt-4 max-w-lg font-sans text-4xl font-black uppercase leading-none md:text-5xl">
                {soldOut ? "Ten wyjazd jest już wyprzedany" : "Zarezerwuj miejsce"}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-background/60">
                {soldOut
                  ? "Na ten wyjazd nie przyjmujemy już rezerwacji. Wybierz inny dostępny mecz lub opisz wydarzenie, które mamy dla Ciebie wycenić."
                  : "Wyślij zapytanie. Sprawdzimy aktualną dostępność i przygotujemy konkretny wariant wyjazdu."}
              </p>
              <div className="mt-7 flex items-center gap-3 opacity-90"><TeamLogo src={trip.homeLogo} name={homeTeam} /><span className="font-sans text-lg font-black text-background/35">VS</span><TeamLogo src={trip.awayLogo} name={awayTeam} /></div>
              <h3 className="mt-5 font-sans text-2xl font-black uppercase">{homeTeam} - {awayTeam}</h3>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-background/65"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{date}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{trip.stadium || trip.city}</p></div>
              {!soldOut && <div className="mt-7 border-t border-background/10 pt-6"><p className="text-xs font-bold uppercase tracking-wider text-background/40">Cena od / osoba</p><p className="mt-1 font-sans text-4xl font-black text-primary">{trip.price.toLocaleString("pl-PL")} zł</p></div>}
              <Button variant="outline" size="lg" className="mt-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" nativeButton={false} render={<a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" />}><MessageCircle data-icon="inline-start" />Napisz na WhatsApp</Button>
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
              <InquiryForm trips={availableTripOptions} />
            ) : (
              <InquiryForm matchName={`${homeTeam} - ${awayTeam}`} packageVariants={packageVariants.map((variant) => variant.label)} defaultPackageVariant={selectedPackageVariant.label} />
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
