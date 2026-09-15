"use client"

import { useMemo, useState } from "react"

import { TripCard } from "@/components/trip-card"
import type { Trip } from "@/lib/trips"

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

export function HomeTripCalendar({ trips }: { trips: Trip[] }) {
  const months = useMemo(
    () => Array.from(new Set(trips.map((trip) => monthKey(trip.startDate)))),
    [trips]
  )
  const featuredMonth = trips.find((trip) => trip.featured)?.startDate
  const [selectedMonth, setSelectedMonth] = useState(
    featuredMonth ? monthKey(featuredMonth) : months[0] || ""
  )
  const visibleTrips = trips.filter(
    (trip) => monthKey(trip.startDate) === selectedMonth
  )

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
        role="tablist"
        aria-label="Miesiąc wyjazdu"
        className="flex gap-2 overflow-x-auto border-b pb-3"
      >
        {months.map((month) => {
          const active = month === selectedMonth
          const count = trips.filter((trip) => monthKey(trip.startDate) === month).length

          return (
            <button
              key={month}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedMonth(month)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-xs font-black tracking-wide transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {monthLabel(month)}
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[10px] ${
                  active ? "bg-primary text-primary-foreground" : "bg-background"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {visibleTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}

