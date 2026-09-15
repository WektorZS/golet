import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock3, MapPin, Plane, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getPackageVariants, packageSummary, parsePackageItems } from "@/lib/package-options"
import type { Trip } from "@/lib/trips"

const monthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
})

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const availability = {
  available: {
    label: "Dostępne miejsca",
    className: "bg-emerald-500 text-white",
  },
  last_places: {
    label: "Ostatnie miejsca",
    className: "bg-primary text-primary-foreground",
  },
  sold_out: {
    label: "Wyprzedane",
    className: "bg-red-600 text-white",
  },
} as const

function monthKey(date: string) {
  return date.slice(0, 7)
}

function asDate(date: string) {
  return new Date(`${date}T12:00:00`)
}

function monthLabel(date: string) {
  const label = monthFormatter.format(asDate(date))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatDates(start: string, end: string | null) {
  const startLabel = dateFormatter.format(asDate(start))
  if (!end || start === end) return startLabel
  return `${startLabel} - ${dateFormatter.format(asDate(end))}`
}

function formatStay(days: number, nights: number) {
  const dayLabel = days === 1 ? "dzień" : "dni"
  const nightLabel = nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noce" : "nocy"
  return `${days} ${dayLabel} / ${nights} ${nightLabel}`
}

function tripsCount(count: number) {
  if (count === 1) return "1 wyjazd"
  if (count > 1 && count < 5) return `${count} wyjazdy`
  return `${count} wyjazdów`
}

function getTeams(trip: Trip) {
  const [titleHome, titleAway] = trip.title.split(/\s+vs\.?\s+|\s+-\s+/i).map((item) => item.trim())
  return {
    homeTeam: trip.homeTeam || titleHome || "Gospodarz",
    awayTeam: trip.awayTeam || titleAway || trip.opponent || "Gość",
  }
}

function getStay(trip: Trip) {
  if (trip.endDate && trip.endDate !== trip.startDate && trip.durationDays === 1 && trip.durationNights === 0) {
    const nights = Math.max(1, Math.round((asDate(trip.endDate).getTime() - asDate(trip.startDate).getTime()) / 86_400_000))
    return { days: nights + 1, nights }
  }
  return { days: trip.durationDays, nights: trip.durationNights }
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  if (!src) {
    return (
      <span className="flex size-14 items-center justify-center rounded-full border border-white/25 bg-black/35 font-sans text-sm font-black text-white backdrop-blur-sm">
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className="relative block size-14 shrink-0 drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]">
      <Image src={src} alt={`Herb ${name}`} fill className="object-contain" sizes="56px" />
    </span>
  )
}

export function TripCalendar({ trips }: { trips: Trip[] }) {
  const groups = trips.reduce<Array<{ key: string; label: string; trips: Trip[] }>>((result, trip) => {
    const key = monthKey(trip.startDate)
    const group = result.find((item) => item.key === key)
    if (group) group.trips.push(trip)
    else result.push({ key, label: monthLabel(trip.startDate), trips: [trip] })
    return result
  }, [])

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
        <CalendarDays className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 font-sans text-3xl font-black uppercase">Nowe terminy już wkrótce</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Napisz do nas, a przygotujemy wyjazd na wybrany przez Ciebie mecz.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative -mx-4 md:mx-0">
      <nav aria-label="Miesiące wyjazdów" className="sticky top-0 z-20 overflow-x-auto border-y bg-background/95 px-4 py-3 pr-16 backdrop-blur [scrollbar-width:thin] md:static md:rounded-xl md:border md:px-3">
        <div className="flex min-w-max snap-x gap-2">
          {groups.map((group, index) => (
            <a
              key={group.key}
              href={`#miesiac-${group.key}`}
              className={`min-w-[160px] snap-start rounded-lg px-5 py-3 text-center font-sans text-sm font-black uppercase tracking-wide transition-colors hover:bg-primary hover:text-primary-foreground md:min-w-0 ${index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
            >
              {group.label}
              <span className="ml-2 font-mono text-[10px] opacity-60">{group.trips.length}</span>
            </a>
          ))}
        </div>
      </nav>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-14 items-center justify-end bg-gradient-to-l from-background via-background/90 to-transparent pr-2 md:hidden"><ArrowRight className="size-4 text-primary" /></div>
      </div>

      <div className="mt-8 space-y-12">
        {groups.map((group) => (
          <section key={group.key} id={`miesiac-${group.key}`} className="scroll-mt-24">
            <div className="mb-4 flex items-end justify-between border-b-2 border-foreground pb-3">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Terminarz</p>
                <h2 className="font-sans text-3xl font-black uppercase md:text-4xl">{group.label}</h2>
              </div>
              <p className="hidden text-sm text-muted-foreground sm:block">{tripsCount(group.trips.length)}</p>
            </div>

            <div className="space-y-3">
              {group.trips.map((trip) => {
                const status = availability[trip.availabilityStatus as keyof typeof availability] || availability.available
                const { homeTeam, awayTeam } = getTeams(trip)
                const stay = getStay(trip)
                const packageOptions = parsePackageItems(trip.packageItems)
                const variants = getPackageVariants(trip.packageVariants, trip.packageItems)

                return (
                  <article key={trip.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/60 hover:shadow-lg">
                    <div className="grid lg:grid-cols-[210px_1fr_auto]">
                      <div className="relative min-h-40 overflow-hidden bg-foreground lg:min-h-full">
                        <Image src={trip.image} alt={`Stadion ${trip.stadium || trip.city}`} fill className="scale-[1.04] object-cover blur-[1.5px] transition-all duration-500 group-hover:scale-[1.09] group-hover:blur-[0.5px]" sizes="(max-width: 1024px) 100vw, 210px" />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                        <span className={`absolute left-3 top-3 rounded-md px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider shadow ${status.className}`}>{status.label}</span>
                        <div className="absolute inset-0 flex items-center justify-center gap-3 pt-3">
                          <TeamLogo src={trip.homeLogo} name={homeTeam} />
                          <span className="font-sans text-lg font-black text-white/75">VS</span>
                          <TeamLogo src={trip.awayLogo} name={awayTeam} />
                        </div>
                        <p className="absolute inset-x-3 bottom-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-white/75">{trip.city}, {trip.country}</p>
                      </div>

                      <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
                        <div>
                          {(trip.leagueName || trip.leagueLogo) && <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{trip.leagueLogo && <span className="relative size-5"><Image src={trip.leagueLogo} alt={`Logo ${trip.leagueName}`} fill className="object-contain" sizes="20px" /></span>}<span>{trip.leagueName}</span></div>}
                          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{trip.city}, {trip.country}</p>
                          <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-tight">{homeTeam} - {awayTeam}</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-md bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background">{packageSummary(trip.packageItems)}</span>
                            {packageOptions.flight === "excluded" && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Bez przelotu</span>}
                            {packageOptions.hotel === "excluded" && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Bez hotelu</span>}
                            {trip.hotelStars > 0 && packageOptions.hotel !== "excluded" && <span className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"><Star className="size-3 fill-primary text-primary" />Hotel {trip.hotelStars}*</span>}
                            {trip.ticketCategory && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{trip.ticketCategory}</span>}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-[10px] font-bold uppercase text-muted-foreground">Dostępne warianty:</span>{variants.map((variant) => <Link key={variant.key} href={`/wyjazdy/${trip.slug}?pakiet=${variant.key}#rezerwacja`} className="border-b border-primary/50 text-xs font-semibold hover:text-primary">{variant.shortLabel}</Link>)}</div>
                        </div>

                        <dl className="grid content-center gap-3 text-sm">
                          <div className="flex gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Termin wyjazdu</dt><dd className="font-semibold">{formatDates(trip.startDate, trip.endDate)}</dd></div></div>
                          <div className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Stadion</dt><dd className="font-semibold">{trip.stadium || "Stadion gospodarza"}</dd></div></div>
                          <div className="flex gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Pobyt</dt><dd className="font-semibold">{formatStay(stay.days, stay.nights)}</dd></div></div>
                        </dl>
                      </div>

                      <div className="flex items-center justify-between gap-5 border-t bg-secondary/45 p-5 lg:w-48 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cena od / osoba</p>
                          <p className="font-sans text-3xl font-black">{trip.price.toLocaleString("pl-PL")} zł</p>
                        </div>
                        <Button nativeButton={false} render={<Link href={`/wyjazdy/${trip.slug}`} />} className="shrink-0">
                          Szczegóły
                          <ArrowRight data-icon="inline-end" />
                        </Button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
