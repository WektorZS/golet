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
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 ${
        trip.featured
          ? "border-primary/50 shadow-lg shadow-primary/5 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/10"
          : "border-border shadow-sm hover:shadow-md"
      }`}
    >

      <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
        <Image
          src={trip.image}
          alt={`Stadion w mieście ${trip.city}`}
          fill
          className="scale-[1.04] object-cover blur-[1.5px] transition-all duration-500 group-hover:scale-[1.09] group-hover:blur-[0.5px]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        <Badge className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${status.className}`}>
          {status.label}
        </Badge>

        {trip.featured && (
          <Badge className="absolute right-3 top-3 gap-1.5 rounded-md border-0 bg-background/95 px-2.5 py-1 text-foreground shadow-sm backdrop-blur-sm">
            <Star
              className="size-3.5 fill-primary text-primary"
              aria-hidden="true"
            />
            <span>Polecany</span>
          </Badge>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-4 pt-3">
          <TeamLogo src={trip.homeLogo} name={teams.home} />
          <span className="font-sans text-xl font-black text-white/75">VS</span>
          <TeamLogo src={trip.awayLogo} name={teams.away} />
        </div>

        <div className="absolute inset-x-4 bottom-3 text-center text-background">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white/75">
            {trip.city} - {trip.country}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">{packageSummary(trip.packageItems)}</p>
          <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-none tracking-tight">
            {teams.home} - {teams.away}
          </h3>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" />
            {formatTripDates(trip.startDate, trip.endDate)}
          </span>

          <span className="flex items-center gap-2">
            <MapPin aria-hidden="true" />
            {trip.stadium || trip.city}
          </span>
          <span className="flex items-center gap-2">
            <Clock3 aria-hidden="true" />
            {trip.durationDays} dni / {trip.durationNights} nocy
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {packageOptions.hotel === "excluded" && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">Bez hotelu</span>}
            {packageOptions.flight === "excluded" && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">Bez przelotu</span>}
            {trip.hotelStars > 0 && packageOptions.hotel !== "excluded" && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">Hotel {trip.hotelStars}*</span>}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              od osoby
            </p>

            <p className="text-2xl font-black">
              {trip.price.toLocaleString("pl-PL")} zł
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href={`/wyjazdy/${trip.slug}`} />}
            aria-label={`Szczegóły wyjazdu ${trip.title}`}
          >
            Szczegóły
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </article>
  )
}

