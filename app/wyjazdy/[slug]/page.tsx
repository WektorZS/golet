import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, BedDouble, CalendarDays, Check, ChevronDown, Clock3, MapPin, MessageCircle, Plane, ShieldCheck, Star, TicketCheck } from "lucide-react"

import { DescriptionHtml } from "@/components/description-html"
import { InquiryForm } from "@/components/inquiry-form"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { getPublishedTestimonials, getSiteContent } from "@/lib/content"
import { packageFeatures, packageSummary, parsePackageItems } from "@/lib/package-options"
import { stripHtml } from "@/lib/sanitize-html"
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
  const includedItems = Array.from(new Set([...includedFeatures.map((feature) => feature.label), ...trip.includes]))
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
  const navItems = [["Opis", "opis"], ["Zakres pakietu", "w-cenie"], ["Plan wyjazdu", "plan"], ...(hasHotel ? [["Hotel", "hotel"]] : []), ...(hasFlight ? [["Loty", "loty"]] : []), ["Zdjęcia", "zdjecia"], ["Opinie", "opinie"], ["FAQ", "faq"]]

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

      <nav aria-label="Sekcje wyjazdu" className="sticky top-0 z-30 overflow-x-auto border-b bg-background/95 px-4 shadow-sm backdrop-blur md:px-6">
        <div className="mx-auto flex min-w-max max-w-7xl">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="border-b-2 border-transparent px-4 py-4 text-sm font-bold transition-colors hover:border-primary hover:text-foreground">{label}</a>)}</div>
      </nav>

      <section className="px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-16">
            <section id="opis" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">O wyjeździe</p>
              <h2 className="mt-2 font-sans text-4xl font-black uppercase md:text-5xl">Przeżyj ten mecz z bliska</h2>
              <DescriptionHtml html={trip.description} className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5" />
              <div className="mt-7 flex gap-3 rounded-xl border-l-4 border-primary bg-secondary/60 p-5"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Termin pod kontrolą.</strong> Dokładna godzina meczu może zostać potwierdzona bliżej wyjazdu. Program podróży dopasujemy do oficjalnego terminarza.</p></div>
            </section>

            <section id="w-cenie" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{packageSummary(trip.packageItems)}</p>
              <h2 className="mt-2 font-sans text-4xl font-black uppercase">Zakres pakietu</h2>
              <div className="mt-7 space-y-4">
                <div className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-4">
                    <h3 className="font-sans text-lg font-black uppercase">W cenie</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {includedItems.map((item) => <div key={item} className="flex items-center gap-2 rounded-full bg-secondary/65 py-2 pl-2 pr-3.5 text-sm font-semibold"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15"><Check className="size-3.5 text-emerald-600" /></span>{item}</div>)}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary/25 bg-primary/5 p-4"><h3 className="font-sans text-base font-black uppercase">Opcjonalnie</h3><div className="mt-2 flex flex-wrap gap-2">{optionalFeatures.length > 0 ? optionalFeatures.map((item) => <span key={item.key} className="rounded-full border border-primary/30 bg-background px-3 py-1.5 text-sm font-semibold">{item.label}</span>) : <p className="text-sm text-muted-foreground">Brak dodatkowych opcji.</p>}</div></div>
                  <div className="rounded-xl border bg-secondary/50 p-4"><h3 className="font-sans text-base font-black uppercase">We własnym zakresie</h3><div className="mt-2 flex flex-wrap gap-2">{excludedFeatures.length > 0 ? excludedFeatures.map((item) => <span key={item.key} className="rounded-full border bg-background/70 px-3 py-1.5 text-sm font-semibold text-muted-foreground">{item.label}</span>) : <p className="text-sm text-muted-foreground">Pakiet obejmuje wszystkie główne elementy.</p>}</div></div>
                </div>
              </div>
              {(trip.ticketCategory || trip.seatingInfo) && <div className="mt-5 rounded-2xl bg-foreground p-5 text-background"><div className="flex items-center gap-3"><TicketCheck className="size-6 text-primary" /><div><p className="font-bold">Bilet na mecz{trip.ticketCategory ? ` - ${trip.ticketCategory}` : ""}</p>{trip.seatingInfo && <p className="mt-1 text-sm text-background/65">{trip.seatingInfo}</p>}</div></div></div>}
            </section>

            <section id="plan" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Krok po kroku</p>
              <h2 className="mt-2 font-sans text-4xl font-black uppercase">Plan wyjazdu</h2>
              <div className="mt-7">{(trip.itinerary.length > 0 ? trip.itinerary : defaultPlan).map((item, index, items) => <div key={`${item}-${index}`} className="grid grid-cols-[44px_1fr] gap-4"><div className="flex flex-col items-center"><span className="flex size-10 items-center justify-center rounded-full bg-foreground font-sans font-black text-primary">{index + 1}</span>{index < items.length - 1 && <span className="min-h-10 w-px flex-1 bg-border" />}</div><p className="pb-7 pt-2 text-base leading-7 text-muted-foreground">{item}</p></div>)}</div>
            </section>

            {(hasHotel || hasFlight) && <div className={`grid gap-5 ${hasHotel && hasFlight ? "md:grid-cols-2" : ""}`}>
              {hasHotel && <section id="hotel" className="scroll-mt-24 rounded-2xl bg-foreground p-6 text-background md:p-7"><BedDouble className="size-7 text-primary" /><p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">{packageOptions.hotel === "optional" ? "Opcja dodatkowa" : "W pakiecie"}</p><h2 className="mt-2 font-sans text-3xl font-black uppercase">Hotel{trip.hotelStars > 0 ? ` ${trip.hotelStars}*` : ""}</h2><p className="mt-4 whitespace-pre-line leading-7 text-background/65">{trip.hotelInfo || "Dokładny obiekt potwierdzimy przed rezerwacją."}</p>{(trip.hotelBoard || trip.roomType) && <div className="mt-5 flex flex-wrap gap-2">{trip.hotelBoard && <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{trip.hotelBoard}</span>}{trip.roomType && <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{trip.roomType}</span>}</div>}</section>}
              {hasFlight && <section id="loty" className="scroll-mt-24 rounded-2xl bg-primary p-6 text-primary-foreground md:p-7"><Plane className="size-7" /><p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.2em] opacity-60">{packageOptions.flight === "optional" ? "Opcja dodatkowa" : "W pakiecie"}</p><h2 className="mt-2 font-sans text-3xl font-black uppercase">Loty</h2><p className="mt-4 whitespace-pre-line leading-7 opacity-75">{trip.flightInfo || "Godziny i połączenie potwierdzamy po ustaleniu wariantu."}</p>{(trip.departureAirports || trip.flightType || trip.baggageInfo) && <div className="mt-5 space-y-2 text-sm"><p>{trip.departureAirports && <><strong>Lotniska: </strong>{trip.departureAirports}</>}</p><p>{trip.flightType && <><strong>Rodzaj lotu: </strong>{trip.flightType}</>}</p><p>{trip.baggageInfo && <><strong>Bagaż: </strong>{trip.baggageInfo}</>}</p></div>}</section>}
            </div>}

            <section id="zdjecia" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Zobacz atmosferę</p><h2 className="mt-2 font-sans text-4xl font-black uppercase">Zdjęcia</h2>
              {gallery.length > 0 ? <div className="mt-7 grid gap-4 sm:grid-cols-2">{gallery.map((item, index) => <figure key={item.id} className={`group overflow-hidden rounded-xl bg-secondary ${index === 0 ? "sm:col-span-2" : ""}`}><div className={`relative ${index === 0 ? "aspect-[2/1]" : "aspect-[4/3]"}`}><Image src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || `Zdjęcie z wyjazdu ${trip.title}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"} /></div>{item.caption && <figcaption className="p-4 text-sm text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div> : <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">Zdjęcia z tego wyjazdu pojawią się tutaj po dodaniu ich w panelu administratora.</div>}
            </section>

            <section id="opinie" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Sprawdzone emocje</p><h2 className="mt-2 font-sans text-4xl font-black uppercase">Opinie kibiców</h2>
              {testimonials.length > 0 ? <div className="mt-7 grid gap-4 md:grid-cols-2">{testimonials.slice(0, 4).map((item) => <blockquote key={item.id} className="rounded-2xl border bg-card p-6"><div className="flex gap-1 text-primary" aria-label={`${item.rating} na 5 gwiazdek`}>{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div><p className="mt-4 leading-7 text-muted-foreground">„{item.content}”</p><footer className="mt-5 font-bold">{item.author}<span className="block text-xs font-normal text-muted-foreground">{item.tripName}</span></footer></blockquote>)}</div> : <p className="mt-5 text-muted-foreground">Pierwsze opinie z tego sezonu pojawią się wkrótce.</p>}
            </section>

            <section id="faq" className="scroll-mt-24">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Warto wiedzieć</p><h2 className="mt-2 font-sans text-4xl font-black uppercase">Najczęstsze pytania</h2>
              <div className="mt-7 divide-y rounded-2xl border bg-card px-5">{faq.map((item) => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{item.question}<ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
            </section>
          </div>

          <aside id="rezerwacja" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-xl">
              <div className="border-b border-background/10 px-6 py-6"><div className="flex items-center gap-3"><TicketCheck className="size-6 text-primary" /><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Rezerwacja</p></div><h2 className="mt-3 font-sans text-3xl font-black uppercase">Zarezerwuj swoje miejsce</h2><p className="mt-2 text-sm leading-6 text-background/60">Wyślij zapytanie. Sprawdzimy dostępność i wrócimy z konkretnym wariantem.</p><div className="mt-4 rounded-lg border border-background/10 bg-background/5 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-background/40">Wybrany mecz</p><p className="mt-1 text-sm font-semibold">{homeTeam} - {awayTeam}</p><p className="mt-1 text-xs text-background/50">{date}</p></div></div>
              <div className="px-6 py-6"><InquiryForm matchName={`${homeTeam} - ${awayTeam}`} /></div>
            </div>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border bg-card px-5 py-4 text-sm font-bold transition-colors hover:border-primary"><MessageCircle className="size-5 text-primary" />Wolisz WhatsApp? Napisz do nas</a>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
