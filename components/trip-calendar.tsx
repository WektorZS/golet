"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDate, formatPrice, localeTags, pluralizeDuration, routeFor, type Locale } from "@/lib/i18n"
import type { Trip } from "@/lib/trips"

const availability = {
  available: {
    label: "Dostępne miejsca",
    className: "bg-emerald-700 text-white",
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

function monthLabel(date: string, locale: Locale) {
  const label = new Intl.DateTimeFormat(localeTags[locale], { month: "long", year: "numeric" }).format(asDate(date))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatDates(start: string, end: string | null, locale: Locale) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" } as const
  const startLabel = formatDate(start, locale, options)
  if (!end || start === end) return startLabel
  return `${startLabel} - ${formatDate(end, locale, options)}`
}

function formatStay(days: number, nights: number, locale: Locale) {
  return pluralizeDuration(days, nights, locale)
}

function tripsCount(count: number, locale: Locale) {
  if (locale === "en") return `${count} ${count === 1 ? "trip" : "trips"}`
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
      <span className="flex size-20 items-center justify-center rounded-full border border-white/25 bg-black/35 font-sans text-sm font-black text-white backdrop-blur-sm">
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className="relative block size-20 shrink-0 drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]">
      <Image src={src} alt={`Herb ${name}`} fill className="object-contain" sizes="80px" />
    </span>
  )
}

export function TripCalendar({ trips, locale = "pl" }: { trips: Trip[]; locale?: Locale }) {
  const groups = trips.reduce<
    Array<{
      key: string
      label: string
      trips: Trip[]
    }>
  >((result, trip) => {
    const key = monthKey(trip.startDate)
    const group = result.find(
      (item) => item.key === key
    )

    if (group) {
      group.trips.push(trip)
    } else {
      result.push({
        key,
        label: monthLabel(trip.startDate, locale),
        trips: [trip],
      })
    }

    return result
  }, [])

  const [mobileMonthsOpen, setMobileMonthsOpen] =
    useState(false)

  const [selectedMonthKey, setSelectedMonthKey] =
    useState(groups[0]?.key ?? "")
  const [desktopMonthStart, setDesktopMonthStart] =
    useState(0)

  const DESKTOP_MONTHS_VISIBLE = 6

  const visibleDesktopMonths = groups.slice(
    desktopMonthStart,
    desktopMonthStart + DESKTOP_MONTHS_VISIBLE
  )

  const canGoPrevious =
    desktopMonthStart > 0

  const canGoNext =
    desktopMonthStart + DESKTOP_MONTHS_VISIBLE <
    groups.length

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
        <CalendarDays className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 font-sans text-3xl font-black uppercase">{locale === "en" ? "New dates coming soon" : "Nowe terminy już wkrótce"}</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{locale === "en" ? "Contact us and we will prepare a trip to the match of your choice." : "Napisz do nas, a przygotujemy wyjazd na wybrany przez Ciebie mecz."}</p>
      </div>
    )
  }
  const selectedMonth =
    groups.find(
      (group) => group.key === selectedMonthKey
    ) ?? groups[0]
  return (
    <div>
      <div className="sticky top-20 z-40 -mx-4 border-y border-foreground/10 bg-background/95 backdrop-blur-md md:mx-0">
        <nav
          aria-label={locale === "en" ? "Trip months" : "Miesiące wyjazdów"}
          className="hidden overflow-x-auto md:block"
        >
          <div className="flex items-stretch gap-2 px-3 py-3">
            {groups.length > DESKTOP_MONTHS_VISIBLE ? (
              <button
                type="button"
                onClick={() =>
                  setDesktopMonthStart((current) =>
                    Math.max(
                      0,
                      current - 1
                    )
                  )
                }
                disabled={!canGoPrevious}
                aria-label={locale === "en" ? "Previous months" : "Poprzednie miesiące"}
                className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-background text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft
                  className="size-4"
                  aria-hidden="true"
                />
              </button>
            ) : null}

            <div className="flex min-w-0 flex-1 items-stretch justify-start gap-2 xl:justify-center">
              {visibleDesktopMonths.map((group) => {
                const active =
                  group.key === selectedMonthKey

                return (
                  <a
                    key={group.key}
                    href={`#miesiac-${group.key}`}
                    onClick={() =>
                      setSelectedMonthKey(group.key)
                    }
                    aria-current={
                      active ? "true" : undefined
                    }
                    className={`w-40 shrink-0 rounded-lg px-2.5 py-2 text-center font-sans text-sm font-black uppercase tracking-wide transition-colors ${active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    <span className="block truncate">
                      {group.label}
                    </span>

                    <span className="mt-1 block font-mono text-[11px] font-bold normal-case tracking-normal opacity-65">
                      {tripsCount(group.trips.length, locale)}
                    </span>
                  </a>
                )
              })}
            </div>

            {groups.length > DESKTOP_MONTHS_VISIBLE ? (
              <button
                type="button"
                onClick={() =>
                  setDesktopMonthStart((current) =>
                    Math.min(
                      groups.length -
                      DESKTOP_MONTHS_VISIBLE,
                      current + 1
                    )
                  )
                }
                disabled={!canGoNext}
                aria-label={locale === "en" ? "Next months" : "Następne miesiące"}
                className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-background text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronRight
                  className="size-4"
                  aria-hidden="true"
                />
              </button>
            ) : null}
          </div>
        </nav>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileMonthsOpen(
                (current) => !current
              )
            }
            aria-expanded={mobileMonthsOpen}
            aria-controls="mobile-months-menu"
            className="flex min-h-17 w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                {locale === "en" ? "Choose a month" : "Wybierz miesiąc"}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="truncate font-sans text-lg font-black uppercase leading-none text-foreground">
                  {selectedMonth.label}
                </span>

                <span className="font-mono text-[10px] text-muted-foreground">
                  {tripsCount(
                    selectedMonth.trips.length,
                    locale
                  )}
                </span>
              </div>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background">
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${mobileMonthsOpen
                  ? "rotate-180"
                  : ""
                  }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {mobileMonthsOpen ? (
            <div
              id="mobile-months-menu"
              className="absolute inset-x-0 top-full z-50 border-t border-foreground/10 bg-background p-3 shadow-xl"
            >
              <div className="grid max-h-96 grid-cols-2 gap-2 overflow-y-auto">
                {groups.map((group) => {
                  const active =
                    group.key === selectedMonthKey

                  return (
                    <a
                      key={group.key}
                      href={`#miesiac-${group.key}`}
                      onClick={() => {
                        setSelectedMonthKey(
                          group.key
                        )
                        setMobileMonthsOpen(false)
                      }}
                      aria-current={
                        active ? "true" : undefined
                      }
                      className={`flex min-h-16 flex-col justify-center rounded-lg border px-3 py-3 transition-colors ${active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-foreground/10 bg-secondary/50 text-foreground"
                        }`}
                    >
                      <span className="font-sans text-sm font-black uppercase leading-tight">
                        {group.label}
                      </span>

                      <span
                        className={`mt-1 font-mono text-[9px] font-bold ${active
                          ? "text-primary-foreground/65"
                          : "text-muted-foreground"
                          }`}
                      >
                        {tripsCount(
                          group.trips.length,
                          locale
                        )}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-8 space-y-12">
        {groups.map((group) => (
          <section key={group.key} id={`miesiac-${group.key}`} className="scroll-mt-40">
            <div className="mb-4 flex items-end justify-between border-b-2 border-foreground pb-3">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">{locale === "en" ? "Schedule" : "Terminarz"}</p>
                <h2 className="font-sans text-3xl font-black uppercase md:text-4xl">{group.label}</h2>
              </div>
              <p className="hidden text-sm text-muted-foreground sm:block">{tripsCount(group.trips.length, locale)}</p>
            </div>

            <div className="space-y-3">
              {group.trips.map((trip) => {
                const statusBase = availability[trip.availabilityStatus as keyof typeof availability] || availability.available
                const status = { ...statusBase, label: locale === "en" ? ({ available: "Places available", last_places: "Last places", sold_out: "Sold out" }[trip.availabilityStatus] || "Places available") : statusBase.label }
                const { homeTeam, awayTeam } = getTeams(trip)
                const stay = getStay(trip)
        
      

                return (
                  <article key={trip.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/60 hover:shadow-lg">
                    <div className="grid lg:grid-cols-[210px_1fr_auto]">
                      <div className="relative min-h-40 overflow-hidden bg-foreground lg:min-h-full">
                        <Image src={trip.thumbnailImage || trip.image} alt={`Stadion ${trip.stadium || trip.city}`} fill className="scale-[1.04] object-cover blur-[1.5px] transition-all duration-500 group-hover:scale-[1.09] group-hover:blur-[0.5px]" sizes="(max-width: 1024px) 100vw, 210px" />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/25" />
                                               <div className="absolute inset-0 flex items-center justify-center gap-3 pt-3">
                          <TeamLogo src={trip.homeLogo} name={homeTeam} />
                          <span className="font-sans text-lg font-black text-white/75">VS</span>
                          <TeamLogo src={trip.awayLogo} name={awayTeam} />
                        </div>
                        <p className="absolute inset-x-3 bottom-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-white/75">{trip.city}, {trip.country}</p>
                      </div>

                     <div className="flex min-w-0 flex-col justify-between p-5 md:px-6 md:py-5">
  <div>
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

    <h3 className="mt-3 max-w-3xl font-sans text-2xl font-black uppercase leading-[1.02] tracking-tight lg:text-[27px]">
      {homeTeam} - {awayTeam}
    </h3>
  </div>

  <div className="mt-6 grid gap-4 border-t border-foreground/10 pt-4 sm:grid-cols-3">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <CalendarDays
          className="size-4 text-foreground"
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          {locale === "en" ? "Dates" : "Termin"}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {formatDates(trip.startDate, trip.endDate, locale)}
        </p>
      </div>
    </div>

    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <MapPin
          className="size-4 text-foreground"
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          {locale === "en" ? "Stadium" : "Stadion"}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {trip.stadium || (locale === "en" ? "Home stadium" : "Stadion gospodarza")}
        </p>
      </div>
    </div>

    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Clock3
          className="size-4 text-foreground"
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          {locale === "en" ? "Stay" : "Pobyt"}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {formatStay(stay.days, stay.nights, locale)}
        </p>
      </div>
    </div>
  </div>
</div>

                     <div className="relative flex items-center justify-between gap-4 border-t bg-secondary/35 px-5 pb-5 pt-12 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-foreground/10 lg:border-t-0">
 <div
  className={`absolute inset-x-0 top-0 grid h-7 place-items-center border-b lg:border-r lg:border-t lg:rounded-tr-xl ${
     trip.availabilityStatus === "available"
      ? "border-emerald-700 bg-emerald-700 text-white"
      : trip.availabilityStatus === "last_places"
        ? "border-primary bg-primary text-primary-foreground"
        : "border-red-600 bg-red-600 text-white"
  }`}
>
  <span className="block translate-y-px font-mono text-[9px] font-black uppercase leading-none tracking-[0.14em]">
    {status.label}
  </span>
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
