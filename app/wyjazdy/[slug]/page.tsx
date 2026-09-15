import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, MessageCircle, TicketCheck } from "lucide-react"

import { InquiryForm } from "@/components/inquiry-form"
import { SiteFooter } from "@/components/site-footer"
import { TripDetailsTabs } from "@/components/trip-details-tabs"
import { Button } from "@/components/ui/button"
import { getPublishedTestimonials, getSiteContent } from "@/lib/content"
import { packageFeatures, packageSummary, parsePackageItems } from "@/lib/package-options"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"
import { absoluteUrl } from "@/lib/site"
import { getTripBySlug, getTripGallery } from "@/lib/trips"

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

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) notFound()

  const [gallery, testimonials, content] = await Promise.all([getTripGallery(trip.id), getPublishedTestimonials(), getSiteContent()])
  const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" })
  const startDate = dateFormatter.format(asDate(trip.startDate))
  const date = trip.endDate && trip.endDate !== trip.startDate ? `${startDate} - ${dateFormatter.format(asDate(trip.endDate))}` : startDate
  const matchDate = trip.matchDate ? dateFormatter.format(asDate(trip.matchDate)) : startDate
  const status = availability[trip.availabilityStatus as keyof typeof availability] || availability.available
  const soldOut = trip.availabilityStatus === "sold_out"
  const teams = getTeams(trip.title, trip.opponent, trip.homeTeam, trip.awayTeam)
  const packageOptions = parsePackageItems(trip.packageItems)
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
  const faq = trip.faq.length > 0
    ? trip.faq.map((item) => { const [question, ...answer] = item.split("|"); return { question: question.trim(), answer: answer.join("|").trim() } }).filter((item) => item.question && item.answer)
    : [
        { question: "Czy bilet na mecz jest w cenie?", answer: "Tak, pakiet obejmuje bilet na mecz. Jego kategoria jest potwierdzana przed rezerwacją." },
        { question: "Kiedy otrzymam dokładne godziny lotów?", answer: "Szczegóły lotów przekazujemy po finalnym potwierdzeniu terminarza i wybranego wariantu podróży." },
        { question: "Czy mogę wyjechać z innego lotniska?", answer: "Tak, sprawdzamy połączenia z lotniska najwygodniejszego dla uczestnika." },
      ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": absoluteUrl(`/wyjazdy/${trip.slug}#trip`),
    url: absoluteUrl(`/wyjazdy/${trip.slug}`),
    name: `${homeTeam} - ${awayTeam}`,
    description: stripHtml(trip.description),
    image: absoluteUrl(trip.image),
    touristType: "Kibice piłkarscy",
    startDate: trip.startDate,
    ...(trip.endDate && { endDate: trip.endDate }),
    offers: { "@type": "Offer", url: absoluteUrl(`/wyjazdy/${trip.slug}`), price: trip.price, priceCurrency: "PLN", availability: `https://schema.org/${status.schema}`, seller: { "@id": absoluteUrl("/#organization") } },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative isolate min-h-[620px] overflow-hidden bg-foreground text-background">
        <Image src={trip.image} alt={`Stadion ${trip.stadium || trip.city}`} fill preload className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col px-4 py-6 md:px-6 md:py-8">
          <Button variant="ghost" className="w-fit text-background hover:bg-background/10 hover:text-background" nativeButton={false} render={<Link href="/wyjazdy" />}><ArrowLeft data-icon="inline-start" />Kalendarz wyjazdów</Button>

          <div className="mt-auto grid items-end gap-10 pb-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <span className={`inline-flex rounded-md px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider shadow ${status.className}`}>{status.label}</span>
              <div className="mt-6 flex items-center gap-4"><TeamLogo src={trip.homeLogo} name={homeTeam} /><span className="font-sans text-2xl font-black text-white/50">VS</span><TeamLogo src={trip.awayLogo} name={awayTeam} /></div>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{trip.city}, {trip.country}</p>
              <h1 className="mt-2 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl">{homeTeam} - {awayTeam}</h1>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{matchDate}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{trip.stadium || `Stadion w ${trip.city}`}</span>
                <span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />{formatStay(computedDays, computedNights)}</span>
              </div>
              <span className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 backdrop-blur">{packageSummary(trip.packageItems)}</span>
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
        <div className="mx-auto max-w-7xl space-y-10">
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

            <section id="rezerwacja" className="scroll-mt-24 overflow-hidden rounded-3xl bg-foreground text-background shadow-2xl">
              <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
                <div className="relative overflow-hidden border-b border-background/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                  <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/15 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3"><TicketCheck className="size-6 text-primary" /><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Rezerwacja</p></div>
                    <h2 className="mt-4 font-sans text-4xl font-black uppercase leading-none">Zarezerwuj miejsce</h2>
                    <p className="mt-4 text-sm leading-6 text-background/60">Wyślij zapytanie. Sprawdzimy aktualną dostępność i przygotujemy konkretny wariant wyjazdu.</p>
                    <div className="mt-7 flex items-center gap-3"><TeamLogo src={trip.homeLogo} name={homeTeam} /><span className="font-sans text-lg font-black text-background/35">VS</span><TeamLogo src={trip.awayLogo} name={awayTeam} /></div>
                    <h3 className="mt-5 font-sans text-2xl font-black uppercase">{homeTeam} - {awayTeam}</h3>
                    <div className="mt-5 space-y-2 text-sm text-background/65"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{date}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{trip.stadium || trip.city}</p></div>
                    <div className="mt-7 border-t border-background/10 pt-6"><p className="text-xs font-bold uppercase tracking-wider text-background/40">Cena od / osoba</p><p className="mt-1 font-sans text-4xl font-black text-primary">{trip.price.toLocaleString("pl-PL")} zł</p></div>
                    <Button variant="outline" size="lg" className="mt-6 w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" nativeButton={false} render={<a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" />}><MessageCircle data-icon="inline-start" />Napisz na WhatsApp</Button>
                  </div>
                </div>
                <div className="p-6 md:p-8 lg:p-10">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Formularz zapytania</p>
                  <h3 className="mt-2 font-sans text-3xl font-black uppercase">Podaj swoje dane</h3>
                  <p className="mb-7 mt-2 text-sm text-background/55">Oddzwonimy lub odpiszemy z potwierdzeniem dostępności.</p>
                  <InquiryForm matchName={`${homeTeam} - ${awayTeam}`} />
                </div>
              </div>
            </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
