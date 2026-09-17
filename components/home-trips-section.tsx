"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Star,
} from "lucide-react"

import type { Trip } from "@/lib/trips"
import { getPackageVariants } from "@/lib/package-options"

type HomeTripsSectionProps = {
  trips: Trip[]
  description?: string
}

type MonthGroup = {
  key: string
  year: number
  month: number
  label: string
  shortLabel: string
  trips: Trip[]
}

const monthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
})

const shortMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "short",
})

const dayFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
})

const weekdayFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
})

function parseDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function getMonthKey(value: string | null | undefined) {
  const date = parseDate(value)
  if (!date) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function formatDateRange(startDate: string, endDate: string | null) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (!start) return "Termin do potwierdzenia"

  const short = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  if (!end || startDate === endDate) return short.format(start)
  return `${short.format(start)} – ${short.format(end)}`
}

function formatStay(days: number, nights: number) {
  const dayLabel = days === 1 ? "dzień" : "dni"
  const nightLabel = nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noce" : "nocy"
  return `${days} ${dayLabel} / ${nights} ${nightLabel}`
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pl-PL").format(price)
}

function getAvailability(trip: Trip) {
  if (trip.availabilityStatus === "sold_out") {
    return {
      label: "Wyprzedane",
      dot: "bg-foreground/30",
      text: "text-muted-foreground",
    }
  }

  if (trip.availabilityStatus === "last_places") {
    return {
      label: "Ostatnie miejsca",
      dot: "bg-primary",
      text: "text-foreground",
    }
  }

  return {
    label: "Dostępne",
    dot: "bg-primary",
    text: "text-foreground",
  }
}

function TeamLogo({ src, name }: { src: string | null | undefined; name: string }) {
  if (!src) {
    return (
      <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 font-sans text-xs font-black uppercase text-white backdrop-blur-sm sm:size-12">
        {name.slice(0, 2)}
      </span>
    )
  }

  return (
    <span className="relative block size-11 sm:size-12">
      <Image
        src={src}
        alt={`Herb ${name}`}
        fill
        className="object-contain drop-shadow-[0_5px_12px_rgba(0,0,0,0.35)]"
        sizes="48px"
      />
    </span>
  )
}

function TripVisual({ trip }: { trip: Trip }) {
  return (
    <div className="relative h-full min-h-[168px] overflow-hidden bg-foreground sm:min-h-[190px] lg:min-h-[178px]">
      <Image
        src={trip.image}
        alt={`${trip.homeTeam} - ${trip.awayTeam}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        sizes="(max-width: 1024px) 100vw, 250px"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/38 to-black/12" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <TeamLogo src={trip.homeLogo} name={trip.homeTeam} />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
            vs
          </span>
          <TeamLogo src={trip.awayLogo} name={trip.awayTeam} />
        </div>

        <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
          {trip.city}{trip.country ? ` · ${trip.country}` : ""}
        </p>
      </div>
    </div>
  )
}

function TripRow({ trip }: { trip: Trip }) {
  const availability = getAvailability(trip)
  const matchDate = parseDate(trip.matchDate || trip.startDate)
  const variants = getPackageVariants(trip.packageVariants, trip.packageItems)
  const soldOut = trip.availabilityStatus === "sold_out"

  return (
    <article
      className={`group relative overflow-hidden border-y border-foreground/[0.10] bg-white/55 transition-colors duration-300 hover:bg-white ${
        soldOut ? "opacity-70" : ""
      }`}
    >
      <div className="hidden min-h-[178px] lg:grid lg:grid-cols-[92px_236px_minmax(0,1fr)_220px_170px]">
        <div className="flex flex-col justify-between border-r border-foreground/[0.08] px-5 py-5">
          <div>
            <p className="font-sans text-[34px] font-black leading-none tracking-tight text-foreground">
              {matchDate ? dayFormatter.format(matchDate) : "--"}
            </p>
            <p className="mt-1 font-mono text-[9px] font-black uppercase tracking-[0.17em] text-muted-foreground">
              {matchDate ? weekdayFormatter.format(matchDate).replace(".", "") : "mecz"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${availability.dot}`} />
            <span className={`font-mono text-[9px] font-black uppercase tracking-[0.13em] ${availability.text}`}>
              {availability.label}
            </span>
          </div>
        </div>

        <TripVisual trip={trip} />

        <div className="flex min-w-0 flex-col justify-center px-7 py-5 xl:px-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {trip.leagueLogo ? (
              <span className="relative block h-5 w-8 shrink-0">
                <Image
                  src={trip.leagueLogo}
                  alt={trip.leagueName || "Liga"}
                  fill
                  className="object-contain object-left"
                  sizes="32px"
                />
              </span>
            ) : null}

            <span className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              {trip.leagueName || "Mecz piłkarski"}
            </span>

            {trip.featured ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-primary">
                <Star className="size-3" fill="currentColor" />
                Polecany
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 truncate font-sans text-[25px] font-black uppercase leading-none tracking-[-0.025em] text-foreground xl:text-[28px]">
            {trip.homeTeam} – {trip.awayTeam}
          </h3>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {variants.map((variant) => (
              <span
                key={variant.key}
                className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {variant.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-l border-foreground/[0.08] px-6 py-5">
          <div className="flex items-center gap-3 text-sm text-foreground/75">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground/75">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{trip.stadium}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground/75">
            <Clock3 className="size-4 shrink-0 text-primary" />
            <span>{formatStay(trip.durationDays, trip.durationNights)}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center border-l border-foreground/[0.08] px-6 py-5">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            Cena od / osoba
          </p>

          <p className="mt-1 font-sans text-[30px] font-black leading-none tracking-tight text-foreground">
            {formatPrice(trip.price)} zł
          </p>

          <Link
            href={`/wyjazdy/${trip.slug}`}
            className="mt-5 inline-flex items-center justify-between border-t border-foreground/[0.12] pt-4 text-sm font-black text-foreground transition-colors group-hover:text-primary"
          >
            {soldOut ? "Zobacz wyjazd" : "Szczegóły"}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="grid sm:grid-cols-[230px_1fr]">
          <TripVisual trip={trip} />

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${availability.dot}`} />
                <span className={`font-mono text-[9px] font-black uppercase tracking-[0.13em] ${availability.text}`}>
                  {availability.label}
                </span>
              </div>

              {trip.featured ? (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-primary">
                  <Star className="size-3" fill="currentColor" />
                  Polecany
                </span>
              ) : null}
            </div>

            <p className="mt-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              {trip.leagueName || "Mecz piłkarski"}
            </p>

            <h3 className="mt-2 font-sans text-2xl font-black uppercase leading-[0.95] tracking-tight text-foreground">
              {trip.homeTeam} – {trip.awayTeam}
            </h3>

            <div className="mt-5 grid gap-2.5 text-sm text-foreground/70">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-primary" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-primary" />
                <span>{trip.stadium}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock3 className="size-4 text-primary" />
                <span>{formatStay(trip.durationDays, trip.durationNights)}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
              {variants.map((variant) => (
                <span
                  key={variant.key}
                  className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  {variant.label}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between gap-5 border-t border-foreground/[0.10] pt-5">
              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Cena od / osoba
                </p>
                <p className="mt-1 font-sans text-2xl font-black leading-none text-foreground">
                  {formatPrice(trip.price)} zł
                </p>
              </div>

              <Link
                href={`/wyjazdy/${trip.slug}`}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:scale-105"
                aria-label={`Zobacz szczegóły: ${trip.title}`}
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function HomeTripsSection({
  trips,
  description = "Wybierz termin i sprawdź dokładny zakres dostępnego pakietu.",
}: HomeTripsSectionProps) {
  const groups = useMemo<MonthGroup[]>(() => {
    const sorted = [...trips].sort((a, b) => {
      const aDate = parseDate(a.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER
      const bDate = parseDate(b.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER
      return aDate - bDate
    })

    const map = new Map<string, MonthGroup>()

    for (const trip of sorted) {
      const date = parseDate(trip.startDate)
      if (!date) continue

      const key = getMonthKey(trip.startDate)
      const existing = map.get(key)

      if (existing) {
        existing.trips.push(trip)
        continue
      }

      map.set(key, {
        key,
        year: date.getFullYear(),
        month: date.getMonth(),
        label: monthFormatter.format(date),
        shortLabel: shortMonthFormatter.format(date).replace(".", ""),
        trips: [trip],
      })
    }

    return Array.from(map.values())
  }, [trips])

  const [selectedMonth, setSelectedMonth] = useState(() => groups[0]?.key ?? "")
  const activeGroup = groups.find((group) => group.key === selectedMonth) ?? groups[0]

  if (!groups.length) {
    return (
      <section id="wyjazdy" className="bg-section-light px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl border-y border-foreground/[0.10] py-12">
          <p className="eyebrow">Terminarz meczowych podróży</p>
          <h2 className="mt-5 font-sans text-4xl font-black uppercase tracking-tight text-foreground md:text-6xl">
            Kalendarz wyjazdów
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Aktualnie przygotowujemy kolejne terminy. Napisz do nas, jeśli masz już konkretny mecz na oku.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="wyjazdy" className="scroll-mt-20 bg-section-light px-4 py-16 md:px-6 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-16">
          <div className="max-w-3xl">
            <p className="eyebrow">Terminarz meczowych podróży</p>

            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[0.94] tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
              Kalendarz wyjazdów
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>

          <div className="border-l-2 border-primary pl-5 lg:mb-1">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Szukasz innego meczu?
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Sprawdź pełny terminarz albo poproś nas o indywidualną wycenę.
            </p>
            <Link
              href="/wyjazdy"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-black text-foreground transition-colors hover:text-primary"
            >
              Wszystkie wyjazdy
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-y border-foreground/[0.10]">
          <div className="flex items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {groups.map((group) => {
              const active = group.key === activeGroup.key

              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setSelectedMonth(group.key)}
                  aria-pressed={active}
                  className={`relative min-w-[145px] flex-1 px-4 py-5 text-left transition-colors sm:min-w-[165px] sm:px-5 ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block font-sans text-lg font-black uppercase leading-none tracking-tight sm:text-xl">
                    {group.shortLabel}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] font-black tracking-[0.16em]">
                    {group.year}
                  </span>
                  <span className="mt-3 block font-mono text-[8px] font-bold uppercase tracking-[0.13em] opacity-70">
                    {group.trips.length} {group.trips.length === 1 ? "wyjazd" : "wyjazdy"}
                  </span>
                  <span
                    className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-primary transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-9 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              {activeGroup.label} {activeGroup.year}
            </p>
            <h3 className="mt-1 font-sans text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
              {activeGroup.trips.length === 1
                ? "1 dostępny wyjazd"
                : `${activeGroup.trips.length} dostępne wyjazdy`}
            </h3>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Oferta aktualizowana na bieżąco
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {activeGroup.trips.map((trip) => (
            <TripRow key={trip.id} trip={trip} />
          ))}
        </div>

        <div className="mt-12 grid gap-5 border-t border-foreground/[0.10] pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-sans text-xl font-black uppercase tracking-tight text-foreground">
              Nie ma meczu, którego szukasz?
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Możemy przygotować indywidualny wyjazd na spotkanie spoza aktualnego kalendarza.
            </p>
          </div>

          <Link
            href="/kontakt#formularz"
            className="group inline-flex h-11 items-center justify-between gap-5 border border-foreground/[0.16] px-5 text-sm font-black text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:justify-center"
          >
            Zapytaj o swój mecz
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
