import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Trip } from "@/lib/trips"

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })

function formatTripDates(startDate: string, endDate: string | null) {
  const start = dateFormatter.format(new Date(`${startDate}T12:00:00`))
  if (!endDate || endDate === startDate) return start
  return `${start} – ${dateFormatter.format(new Date(`${endDate}T12:00:00`))}`
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={trip.image} alt={`Stadion w mieście ${trip.city}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/10 to-transparent" />
        <Badge className="absolute left-4 top-4 rounded-md bg-primary text-primary-foreground">Pełny pakiet</Badge>
        <div className="absolute inset-x-4 bottom-4 text-background">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest">{trip.city} · {trip.country}</p>
          <h3 className="mt-1 font-sans text-2xl font-black uppercase leading-none tracking-tight">{trip.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" />{formatTripDates(trip.startDate, trip.endDate)}</span>
          <span className="flex items-center gap-2"><MapPin aria-hidden="true" />Wyloty z Polski</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <div><p className="text-xs uppercase text-muted-foreground">od osoby</p><p className="text-2xl font-black">{trip.price.toLocaleString("pl-PL")} zł</p></div>
          <Button nativeButton={false} render={<Link href={`/wyjazdy/${trip.slug}`} />} aria-label={`Szczegóły wyjazdu ${trip.title}`}>
            Szczegóły <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </article>
  )
}
