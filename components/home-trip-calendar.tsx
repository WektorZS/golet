"use client"

import {
  useMemo,
  useRef,
  useState,
} from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { TripCard } from "@/components/trip-card"
import type { Trip } from "@/lib/trips"

const DESKTOP_MONTHS_VISIBLE = 6

const monthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "short",
  year: "numeric",
})

function monthKey(date: string) {
  return date.slice(0, 7)
}


function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number)

  return monthFormatter
    .format(new Date(year, month - 1, 1))
    .replace(".", "")
    .toUpperCase()
}

function tripsCount(count: number) {
  if (count === 1) {
    return "1 wyjazd"
  }

  if (count > 1 && count < 5) {
    return `${count} wyjazdy`
  }

  return `${count} wyjazdów`
}

export function HomeTripCalendar({
  trips,
}: {
  trips: Trip[]
}) {
  const months = useMemo(
    () =>
      Array.from(
        new Set(
          trips.map((trip) =>
            monthKey(trip.startDate)
          )
        )
      ),
    [trips]
  )

  const featuredMonth =
    trips.find((trip) => trip.featured)?.startDate

  const initialSelectedMonth = featuredMonth
    ? monthKey(featuredMonth)
    : months[0] || ""

  const initialSelectedIndex = Math.max(
    0,
    months.indexOf(initialSelectedMonth)
  )

  const initialDesktopStart = Math.min(
    Math.max(
      0,
      initialSelectedIndex -
        Math.floor(DESKTOP_MONTHS_VISIBLE / 2)
    ),
    Math.max(
      0,
      months.length - DESKTOP_MONTHS_VISIBLE
    )
  )

  const [selectedMonth, setSelectedMonth] =
    useState(initialSelectedMonth)

  const [mobileMonthsOpen, setMobileMonthsOpen] =
    useState(false)
const calendarAnchorRef =
  useRef<HTMLDivElement>(null)

  const handleMonthChange = (
  month: string
) => {
  setSelectedMonth(month)
  setMobileMonthsOpen(false)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const anchor =
        calendarAnchorRef.current

      if (!anchor) return

      const headerOffset = 80

      const top =
        window.scrollY +
        anchor.getBoundingClientRect().top -
        headerOffset

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      })
    })
  })
}
  const [desktopMonthStart, setDesktopMonthStart] =
    useState(initialDesktopStart)

  const monthCounts = useMemo(() => {
    const counts = new Map<string, number>()

    for (const trip of trips) {
      const key = monthKey(trip.startDate)

      counts.set(
        key,
        (counts.get(key) ?? 0) + 1
      )
    }

    return counts
  }, [trips])

  const visibleTrips = trips.filter(
    (trip) =>
      monthKey(trip.startDate) === selectedMonth
  )

  const visibleDesktopMonths = months.slice(
    desktopMonthStart,
    desktopMonthStart + DESKTOP_MONTHS_VISIBLE
  )

  const canGoPrevious =
    desktopMonthStart > 0

  const canGoNext =
    desktopMonthStart +
      DESKTOP_MONTHS_VISIBLE <
    months.length

  if (trips.length === 0) {
    return (
      <div className="mt-10 border-y py-12 text-center text-muted-foreground">
        Nowe terminy pojawią się wkrótce.
      </div>
    )
  }

  return (
    <div className="mt-10">
     

      <div
  ref={calendarAnchorRef}
  className="h-0"
/>

<div className="sticky top-20 z-40 -mx-4 border-y border-foreground/10 bg-section-light/95 backdrop-blur-md md:mx-0">
        <div
          role="tablist"
          aria-label="Miesiąc wyjazdu"
          className="hidden items-stretch justify-start gap-2 overflow-x-auto px-3 py-3 md:flex xl:justify-center"
        >
          {months.length >
          DESKTOP_MONTHS_VISIBLE ? (
            <button
              type="button"
              onClick={() =>
                setDesktopMonthStart(
                  (current) =>
                    Math.max(0, current - 1)
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

          <div className="flex min-w-0 items-stretch justify-start gap-2 xl:justify-center">
            {visibleDesktopMonths.map(
              (month) => {
                const active =
                  month === selectedMonth

                const count =
                  monthCounts.get(month) ?? 0

                return (
                  <button
                    key={month}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() =>
  handleMonthChange(month)
}
                    className={`w-40 shrink-0 rounded-lg px-2.5 py-2 text-center transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <span className="block truncate font-sans text-sm font-black uppercase tracking-wide">
                      {monthLabel(month)}
                    </span>

                    <span className="mt-1 block font-mono text-[11px] font-bold normal-case tracking-normal opacity-65">
                      {tripsCount(count)}
                    </span>
                  </button>
                )
              }
            )}
          </div>

          {months.length >
          DESKTOP_MONTHS_VISIBLE ? (
            <button
              type="button"
              onClick={() =>
                setDesktopMonthStart(
                  (current) =>
                    Math.min(
                      months.length -
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

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileMonthsOpen(
                (current) => !current
              )
            }
            aria-expanded={mobileMonthsOpen}
            aria-controls="home-mobile-months"
            className="flex min-h-17 w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                Wybierz miesiąc
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="truncate font-sans text-lg font-black uppercase leading-none text-foreground">
                  {monthLabel(selectedMonth)}
                </span>

                <span className="font-mono text-[10px] text-muted-foreground">
                  {tripsCount(
                    monthCounts.get(
                      selectedMonth
                    ) ?? 0
                  )}
                </span>
              </div>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background">
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  mobileMonthsOpen
                    ? "rotate-180"
                    : ""
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {mobileMonthsOpen ? (
            <div
              id="home-mobile-months"
              className="absolute inset-x-0 top-full z-50 border-t border-foreground/10 bg-section-light p-3 shadow-xl"
            >
              <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto">
                {months.map((month) => {
                  const active =
                    month === selectedMonth

                  const count =
                    monthCounts.get(month) ?? 0

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() =>
  handleMonthChange(month)
}
                      aria-pressed={active}
                      className={`flex min-h-16 flex-col justify-center rounded-lg border px-3 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/10 bg-background text-foreground"
                      }`}
                    >
                      <span className="font-sans text-sm font-black uppercase leading-tight">
                        {monthLabel(month)}
                      </span>

                      <span
                        className={`mt-1 font-mono text-[10px] font-bold ${
                          active
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {tripsCount(count)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        role="tabpanel"
        className="mt-6 space-y-3"
      >
        {visibleTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
          />
        ))}
      </div>
    </div>
  )
}
