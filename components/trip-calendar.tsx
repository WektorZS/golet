import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock3, MapPin, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
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
      <span className="flex size-12 items-center justify-center rounded-full border bg-secondary font-sans text-sm font-black">
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className="relative block size-12 shrink-0">
      <Image src={src} alt={`Herb ${name}`} fill className="object-contain" sizes="48px" />
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
      <nav aria-label="Miesiące wyjazdów" className="sticky top-0 z-20 -mx-4 overflow-x-auto border-y bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:rounded-xl md:border md:px-3">
        <div className="flex min-w-max gap-2">
          {groups.map((group, index) => (
            <a
              key={group.key}
              href={`#miesiac-${group.key}`}
              className={`rounded-lg px-5 py-3 font-sans text-sm font-black uppercase tracking-wide transition-colors hover:bg-primary hover:text-primary-foreground ${index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
            >
              {group.label}
              <span className="ml-2 font-mono text-[10px] opacity-60">{group.trips.length}</span>
            </a>
          ))}
        </div>
      </nav>

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

                return (
                  <article key={trip.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/60 hover:shadow-lg">
                    <div className="grid lg:grid-cols-[230px_1fr_auto]">
                      <div className="relative min-h-44 overflow-hidden lg:min-h-full">
                        <Image src={trip.image} alt={`Stadion ${trip.stadium || trip.city}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 230px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r" />
                        <span className={`absolute left-3 top-3 rounded-md px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider shadow ${status.className}`}>{status.label}</span>
                        <p className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-wider text-white lg:hidden">{trip.city}, {trip.country}</p>
                      </div>

                      <div className="grid gap-6 p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
                        <div>
                          <div className="flex items-center gap-3">
                            <TeamLogo src={trip.homeLogo} name={homeTeam} />
                            <span className="font-sans text-xl font-black text-muted-foreground">VS</span>
                            <TeamLogo src={trip.awayLogo} name={awayTeam} />
                          </div>
                          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{trip.city}, {trip.country}</p>
                          <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-tight md:text-3xl">{homeTeam} - {awayTeam}</h3>
                        </div>

                        <dl className="grid content-center gap-3 text-sm">
                          <div className="flex gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Termin wyjazdu</dt><dd className="font-semibold">{formatDates(trip.startDate, trip.endDate)}</dd></div></div>
                          <div className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Stadion</dt><dd className="font-semibold">{trip.stadium || "Stadion gospodarza"}</dd></div></div>
                          <div className="flex gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs text-muted-foreground">Pobyt</dt><dd className="font-semibold">{formatStay(stay.days, stay.nights)}</dd></div></div>
                        </dl>
                      </div>

                      <div className="flex items-center justify-between gap-5 border-t bg-secondary/45 p-5 lg:w-52 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0">
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

