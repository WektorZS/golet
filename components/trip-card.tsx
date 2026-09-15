import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Clock3,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { packageSummary, parsePackageItems } from "@/lib/package-options"
import type { Trip } from "@/lib/trips"

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function formatTripDates(startDate: string, endDate: string | null) {
  const start = dateFormatter.format(
    new Date(`${startDate}T12:00:00`)
  )

  if (!endDate || endDate === startDate) return start

  return `${start} - ${dateFormatter.format(
    new Date(`${endDate}T12:00:00`)
  )}`
}

function formatStay(trip: Trip) {
  let days = trip.durationDays
  let nights = trip.durationNights

  if (trip.endDate && trip.endDate !== trip.startDate && days === 1 && nights === 0) {
    nights = Math.max(
      1,
      Math.round(
        (new Date(`${trip.endDate}T12:00:00`).getTime() -
          new Date(`${trip.startDate}T12:00:00`).getTime()) /
          86_400_000
      )
    )
    days = nights + 1
  }

  const dayLabel = days === 1 ? "dzień" : "dni"
  const nightLabel = nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noce" : "nocy"
  return `${days} ${dayLabel} / ${nights} ${nightLabel}`
}

const availability = {
  available: { label: "Dostępne miejsca", className: "bg-emerald-500 text-white" },
  last_places: { label: "Ostatnie miejsca", className: "bg-primary text-primary-foreground" },
  sold_out: { label: "Wyprzedane", className: "bg-red-600 text-white" },
} as const

function getTeams(trip: Trip) {
  const [titleHome, titleAway] = trip.title
    .split(/\s+vs\.?\s+|\s+-\s+/i)
    .map((item) => item.trim())

  return {
    home: trip.homeTeam || titleHome || "Gospodarz",
    away: trip.awayTeam || titleAway || trip.opponent || "Gość",
  }
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  if (!src) {
    return (
      <span className="flex size-16 items-center justify-center rounded-full border border-white/25 bg-black/35 font-sans text-sm font-black text-white backdrop-blur-sm">
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className="relative block size-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] sm:size-20">
      <Image src={src} alt={`Herb ${name}`} fill className="object-contain" sizes="80px" />
    </span>
  )
}

export function TripCard({ trip }: { trip: Trip }) {
  const packageOptions = parsePackageItems(trip.packageItems)
  const teams = getTeams(trip)
  const status = availability[trip.availabilityStatus as keyof typeof availability] || availability.available

  return (
    <article
  className={`group relative rounded-xl border bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-lg ${
    trip.featured
      ? "border-primary/60 shadow-md shadow-primary/5"
      : "border-border shadow-sm"
  }`}
>
  {trip.featured && (
    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/50 bg-card px-4 py-1.5 shadow-sm">
        <Star
          className="size-3.5 fill-primary text-primary"
          aria-hidden="true"
        />

        <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-foreground">
          Polecany
        </span>
      </div>
    </div>
  )}

  <div className="overflow-hidden rounded-[inherit]">
      <div className="grid md:grid-cols-[230px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)_190px]">
        <div className="relative min-h-44 overflow-hidden bg-foreground md:min-h-full">
          <Image
            src={trip.image}
            alt={`Stadion w mieście ${trip.city}`}
            fill
            className="scale-[1.04] object-cover blur-[1.5px] transition-all duration-500 group-hover:scale-[1.09] group-hover:blur-[0.5px]"
            sizes="(max-width: 768px) 100vw, 230px"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
          <Badge className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${status.className}`}>
            {status.label}
          </Badge>
          
          <div className="absolute inset-0 flex items-center justify-center gap-3 pt-3">
            <TeamLogo src={trip.homeLogo} name={teams.home} />
            <span className="font-sans text-lg font-black text-white/75">VS</span>
            <TeamLogo src={trip.awayLogo} name={teams.away} />
          </div>
          <p className="absolute inset-x-3 bottom-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-white/75">
            {trip.city} - {trip.country}
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{packageSummary(trip.packageItems)}</p>
            <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-tight tracking-tight">
              {teams.home} - {teams.away}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {packageOptions.hotel === "excluded" && <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-semibold">Bez hotelu</span>}
              {packageOptions.flight === "excluded" && <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-semibold">Bez przelotu</span>}
              {trip.hotelStars > 0 && packageOptions.hotel !== "excluded" && <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-semibold">Hotel {trip.hotelStars}*</span>}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />{formatTripDates(trip.startDate, trip.endDate)}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />{trip.stadium || trip.city}</span>
            <span className="flex items-center gap-2"><Clock3 className="size-4 shrink-0 text-primary" aria-hidden="true" />{formatStay(trip)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t bg-secondary/45 p-5 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cena od / osoba</p>
            <p className="font-sans text-3xl font-black">{trip.price.toLocaleString("pl-PL")} zł</p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href={`/wyjazdy/${trip.slug}`} />}
            aria-label={`Szczegóły wyjazdu ${trip.title}`}
            className="shrink-0"
          >
            Szczegóły
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
         </div>
    </div>
  </article>
  )
}


