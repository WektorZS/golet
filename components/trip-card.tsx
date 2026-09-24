import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDate, formatPrice, pluralizeDuration, routeFor, type Locale } from "@/lib/i18n"
import type { Trip } from "@/lib/trips"

function formatTripDates(
  startDate: string,
  endDate: string | null,
  locale: Locale
) {
  const start = formatDate(startDate, locale, { day: "2-digit", month: "2-digit", year: "numeric" })

  if (!endDate || endDate === startDate) {
    return start
  }

  const end = formatDate(endDate, locale, { day: "2-digit", month: "2-digit", year: "numeric" })

  return `${start} - ${end}`
}

function formatStay(trip: Trip, locale: Locale) {
  let days = trip.durationDays
  let nights = trip.durationNights

  if (
    trip.endDate &&
    trip.endDate !== trip.startDate &&
    days === 1 &&
    nights === 0
  ) {
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

  return pluralizeDuration(days, nights, locale)
}

const availability = {
  available: {
    label: "Dostępne miejsca",
    className: "bg-emerald-700 text-white",
  },
  last_places: {
    label: "Ostatnie miejsca",
    className: "bg-orange-500 text-white",
  },
  sold_out: {
    label: "Wyprzedane",
    className: "bg-red-600 text-white",
  },
} as const

function getTeams(trip: Trip) {
  const [titleHome, titleAway] = trip.title
    .split(/\s+vs\.?\s+|\s+-\s+/i)
    .map((item) => item.trim())

  return {
    home:
      trip.homeTeam ||
      titleHome ||
      "Gospodarz",
    away:
      trip.awayTeam ||
      titleAway ||
      trip.opponent ||
      "Gość",
  }
}

function TeamLogo({
  src,
  name,
}: {
  src: string
  name: string
}) {
  if (!src) {
    return (
      <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-black/30 font-sans text-sm font-black text-white backdrop-blur-sm sm:size-18">
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className="relative flex size-16 shrink-0 items-center justify-center sm:size-18">
      <Image
        src={src}
        alt={`Herb ${name}`}
        fill
        className="object-contain object-center drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
        sizes="72px"
      />
    </span>
  )
}

function TripFact({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
  <Icon
    className="size-4 text-foreground"
    aria-hidden="true"
  />
</span>

      <div className="min-w-0">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {children}
        </p>
      </div>
    </div>
  )
}

export function TripCard({
  trip,
  locale = "pl",
}: {
  trip: Trip
  locale?: Locale
}) {
  const teams = getTeams(trip)

  const statusBase = availability[
      trip.availabilityStatus as keyof typeof availability
    ] || availability.available
  const status = {
    ...statusBase,
    label: locale === "en" ? {
      available: "Places available",
      last_places: "Last places",
      sold_out: "Sold out",
    }[trip.availabilityStatus] || "Places available" : statusBase.label,
  }

  return (
    <article
      className={`group relative overflow-visible rounded-xl border bg-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        trip.featured
          ? "border-primary/70 shadow-sm shadow-primary/10"
          : "border-border shadow-sm hover:border-foreground/20"
      }`}
    >
      {trip.featured && (
        <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/50 bg-card px-4 py-1.5 shadow-sm">
            <Star
              className="size-3.5 fill-primary text-primary"
              aria-hidden="true"
            />

            <span className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
              {locale === "en" ? "Recommended" : "Polecany"}
            </span>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-[inherit]">
        <div className="grid md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_190px]">
          <div className="relative min-h-48 overflow-hidden bg-foreground md:min-h-full">
            <Image
              src={trip.image}
              alt={locale === "en" ? `Stadium in ${trip.city}` : `Stadion w mieście ${trip.city}`}
              fill
              className="scale-[1.02] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, 260px"
            />

            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-black/25" />

            <div className="absolute inset-0 flex items-center justify-center gap-4">
              <TeamLogo
                src={trip.homeLogo}
                name={teams.home}
              />

              <span className="font-sans text-base font-black tracking-tight text-white/70">
                VS
              </span>

              <TeamLogo
                src={trip.awayLogo}
                name={teams.away}
              />
            </div>

            
          </div>

          <div className="flex min-w-0 flex-col justify-between px-5 py-5 sm:px-6 md:px-7 md:py-6">
            <div>
              <div className="flex items-center justify-between gap-4">
  {(trip.leagueName || trip.leagueLogo) && (
    <div className="flex min-w-0 items-center gap-2.5">
      {trip.leagueLogo && (
        <span className="relative size-7 shrink-0">
          <Image
            src={trip.leagueLogo}
            alt={`Logo ${trip.leagueName}`}
            fill
            className="object-contain"
            sizes="28px"
          />
        </span>
      )}

      <span className="truncate font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {trip.leagueName}
      </span>
    </div>
  )}


</div>

              <h3 className="mt-3 max-w-3xl text-balance font-sans text-2xl font-black uppercase leading-[1.02] tracking-tight lg:text-[27px]">
                {teams.home} - {teams.away}
              </h3>
            </div>

            <div className="mt-6 grid gap-4 border-t border-foreground/10 pt-4 sm:grid-cols-3">
              <TripFact
                icon={CalendarDays}
                label={locale === "en" ? "Dates" : "Termin"}
              >
                {formatTripDates(
                  trip.startDate,
                  trip.endDate,
                  locale
                )}
              </TripFact>

              <TripFact
                icon={MapPin}
                label={locale === "en" ? "Location" : "Miejsce"}
              >
                {trip.city}, {trip.country}
              </TripFact>

              <TripFact
                icon={Clock3}
                label={locale === "en" ? "Stay" : "Pobyt"}
              >
                {formatStay(trip, locale)}
              </TripFact>
            </div>
          </div>

        <div className="relative flex items-center justify-between gap-4 border-t bg-secondary/35 px-5 pb-5 pt-12 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-foreground/10 lg:border-t-0">
<div
  className={`absolute inset-x-0 top-0 flex h-7 items-center justify-center border-b pt-px font-mono text-[9px] font-black uppercase leading-none tracking-[0.14em] lg:border-r lg:border-t lg:rounded-tr-xl ${
    trip.availabilityStatus === "available"
      ? "border-emerald-700 bg-emerald-700 text-white"
      : trip.availabilityStatus === "last_places"
        ? "border-primary bg-primary text-primary-foreground"
        : "border-red-600 bg-red-600 text-white"
  }`}
>
  {status.label}
</div>

  <div>
    <p className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
      {locale === "en" ? "Price from / person" : "Cena od / osoba"}
    </p>

    <p className="mt-1 font-sans text-3xl font-black leading-none tracking-tight text-foreground">
      {formatPrice(trip.price, locale)} {locale === "en" ? "PLN" : "zł"}
    </p>
  </div>

  <Button
    nativeButton={false}
    render={<Link href={`${routeFor(locale, "/wyjazdy")}/${trip.slug}`} />}
    aria-label={locale === "en" ? `Trip details: ${trip.title}` : `Szczegóły wyjazdu ${trip.title}`}
    className="h-10 shrink-0 px-5"
  >
    {locale === "en" ? "Details" : "Szczegóły"}
    <ArrowRight data-icon="inline-end" />
  </Button>
</div>
        </div>
      </div>
    </article>
  )
}
