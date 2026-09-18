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
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

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

export function TripCalendar({ trips }: { trips: Trip[] }) {
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
        label: monthLabel(trip.startDate),
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
        <h2 className="mt-4 font-sans text-3xl font-black uppercase">Nowe terminy już wkrótce</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Napisz do nas, a przygotujemy wyjazd na wybrany przez Ciebie mecz.</p>
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
          aria-label="Miesiące wyjazdów"
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
                aria-label="Poprzednie miesiące"
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
                      {tripsCount(group.trips.length)}
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
                aria-label="Następne miesiące"
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
                Wybierz miesiąc
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="truncate font-sans text-lg font-black uppercase leading-none text-foreground">
                  {selectedMonth.label}
                </span>

                <span className="font-mono text-[10px] text-muted-foreground">
                  {tripsCount(
                    selectedMonth.trips.length
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
                          group.trips.length
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
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">Terminarz</p>
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/25" />
                                               <div className="absolute inset-0 flex items-center justify-center gap-3 pt-3">
                          <TeamLogo src={trip.homeLogo} name={homeTeam} />
                          <span className="font-sans text-lg font-black text-white/75">VS</span>
                          <TeamLogo src={trip.awayLogo} name={awayTeam} />
                        </div>
                        <p className="absolute inset-x-3 bottom-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-white/75">{trip.city}, {trip.country}</p>
                      </div>

                      <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
                        <div>
                          {(trip.leagueName || trip.leagueLogo) && <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">{trip.leagueLogo && <span className="relative size-7"><Image src={trip.leagueLogo} alt={`Logo ${trip.leagueName}`} fill className="object-contain" sizes="28px" /></span>}<span>{trip.leagueName}</span></div>}
                          <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-tight">{homeTeam} - {awayTeam}</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-md bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background">{packageSummary(trip.packageItems)}</span>
                            {packageOptions.flight === "excluded" && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Bez przelotu</span>}
                            {packageOptions.hotel === "excluded" && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Bez hotelu</span>}
                            {trip.hotelStars > 0 && packageOptions.hotel !== "excluded" && <span className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"><Star className="size-3 fill-primary text-primary" />Hotel {trip.hotelStars}*</span>}
                            {trip.ticketCategory && <span className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{trip.ticketCategory}</span>}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">{variants.map((variant, index) => <span key={variant.key} className="text-xs font-semibold">{index > 0 && <span className="mr-2 text-primary">/</span>}{variant.shortLabel}</span>)}</div>
                        </div>

                        <dl className="grid content-center gap-3 text-sm">
                          <div className="relative pl-7">
                            <dt className="text-xs text-muted-foreground"><CalendarDays aria-hidden="true" className="absolute left-0 top-0.5 size-4 text-primary" />Termin wyjazdu</dt>
                            <dd className="font-semibold">{formatDates(trip.startDate, trip.endDate)}</dd>
                          </div>
                          <div className="relative pl-7">
                            <dt className="text-xs text-muted-foreground"><MapPin aria-hidden="true" className="absolute left-0 top-0.5 size-4 text-primary" />Stadion</dt>
                            <dd className="font-semibold">{trip.stadium || "Stadion gospodarza"}</dd>
                          </div>
                          <div className="relative pl-7">
                            <dt className="text-xs text-muted-foreground"><Clock3 aria-hidden="true" className="absolute left-0 top-0.5 size-4 text-primary" />Pobyt</dt>
                            <dd className="font-semibold">{formatStay(stay.days, stay.nights)}</dd>
                          </div>
                        </dl>
                      </div>

                     <div className="grid gap-4 border-t bg-secondary/45 p-4 sm:grid-cols-[auto_1fr] sm:items-center lg:w-48 lg:grid-cols-1 lg:items-stretch lg:justify-center lg:gap-3 lg:border-l lg:border-t-0">
  <div className="flex items-center justify-between gap-4 sm:contents lg:block lg:text-center">
  <span
    className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wide lg:mx-auto ${status.className}`}
  >
    {status.label}
  </span>

  <div className="text-right sm:text-left lg:mt-3 lg:text-center">
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      Cena od / osoba
    </p>

    <p className="font-sans text-2xl font-black leading-none">
      {trip.price.toLocaleString("pl-PL")} zł
    </p>
  </div>
</div>

  <Button
    nativeButton={false}
    render={<Link href={`/wyjazdy/${trip.slug}`} />}
    className="h-11 w-full shrink-0 px-5 text-sm font-bold sm:col-span-2 lg:col-span-1"
  >
    Szczegóły
    <ArrowRight className="size-4.5" data-icon="inline-end" />
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
