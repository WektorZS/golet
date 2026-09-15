"use client"

import Image from "next/image"
import { useState, type ComponentType } from "react"
import {
  BedDouble,
  Bus,
  CalendarClock,
  Check,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Images,
  Landmark,
  Luggage,
  MessageSquareQuote,
  Plane,
  Route,
  ShieldCheck,
  TicketCheck,
  TramFront,
  UserRoundCheck,
  UtensilsCrossed,
} from "lucide-react"

import type { PackageFeatureKey } from "@/lib/package-options"

type Icon = ComponentType<{ className?: string }>

const packageIcons: Record<PackageFeatureKey, Icon> = {
  ticket: TicketCheck,
  flight: Plane,
  hotel: BedDouble,
  transfers: Bus,
  baggage: Luggage,
  breakfast: UtensilsCrossed,
  insurance: ShieldCheck,
  coordinator: UserRoundCheck,
  sightseeing: Landmark,
  local_transport: TramFront,
}

type PackageItem = { key: string; label: string }
type GalleryItem = { id: number; mediaId: number; alt: string; caption: string }
type TestimonialItem = { id: number; author: string; tripName: string; content: string; rating: number }
type FaqItem = { question: string; answer: string }

type TripDetailsTabsProps = {
  descriptionHtml: string
  includedItems: PackageItem[]
  optionalItems: PackageItem[]
  excludedItems: PackageItem[]
  ticketCategory: string
  seatingInfo: string
  itinerary: string[]
  hotel?: { stars: number; info: string; board: string; roomType: string; optional: boolean }
  flight?: { info: string; airports: string; type: string; baggage: string; optional: boolean }
  gallery: GalleryItem[]
  testimonials: TestimonialItem[]
  faq: FaqItem[]
  tripTitle: string
}

function PackageIcon({ item, className }: { item: PackageItem; className?: string }) {
  const IconComponent = item.key.startsWith("custom-")
    ? Check
    : packageIcons[item.key as PackageFeatureKey] || Check
  return <IconComponent className={className} />
}

export function TripDetailsTabs(props: TripDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("opis")
  const hasLogistics = Boolean(props.hotel || props.flight)
  const tabs = [
    { id: "opis", label: "O wyjeździe", icon: CalendarClock },
    { id: "pakiet", label: "Zakres pakietu", icon: TicketCheck },
    { id: "plan", label: "Plan wyjazdu", icon: Route },
    ...(hasLogistics ? [{ id: "logistyka", label: "Hotel i podróż", icon: BedDouble }] : []),
    ...(props.gallery.length ? [{ id: "zdjecia", label: "Zdjęcia", icon: Images }] : []),
    ...(props.testimonials.length ? [{ id: "opinie", label: "Opinie", icon: MessageSquareQuote }] : []),
    { id: "faq", label: "FAQ", icon: CirclePlus },
  ]

  return (
    <section aria-label="Szczegóły wyjazdu" className="scroll-mt-24">
      <div className="border-b pb-6">
        <p className="inline-block bg-black px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Wszystko w jednym miejscu</p>
        <h2 className="mt-1 font-sans text-3xl font-black uppercase md:text-4xl">Szczegóły wyjazdu</h2>
      </div>

      <div className="pt-5 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:pt-8">
        <div role="tablist" aria-label="Informacje o wyjeździe" className="flex gap-2 overflow-x-auto border-b pb-4 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${selected ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-background hover:text-foreground"}`}
              >
                <TabIcon className={`size-4 shrink-0 ${selected ? "text-primary" : ""}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="min-h-[430px] pt-7 lg:pt-0">
          <div id="panel-opis" role="tabpanel" hidden={activeTab !== "opis"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">O wyjeździe</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Najważniejsze informacje</h3>
            <div dangerouslySetInnerHTML={{ __html: props.descriptionHtml }} className="mt-6 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5" />
            <div className="mt-7 flex max-w-4xl gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground"><strong className="block text-foreground">Termin pod kontrolą</strong>Dokładna godzina meczu może zostać potwierdzona bliżej wyjazdu. Program dopasujemy do oficjalnego terminarza.</p>
            </div>
          </div>

          <div id="panel-pakiet" role="tabpanel" hidden={activeTab !== "pakiet"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Zakres oferty</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Co obejmuje cena</h3>
            <div className="mt-6 divide-y rounded-2xl border">
              <div className="grid gap-4 p-5 md:grid-cols-[180px_1fr]">
                <div><p className="font-sans text-lg font-black uppercase">W cenie</p><p className="mt-1 text-xs text-muted-foreground">Uwzględnione w podanej cenie</p></div>
                <div className="flex flex-wrap gap-2">{props.includedItems.map((item) => <span key={item.key} className="flex items-center gap-2 rounded-full bg-emerald-500/10 py-2 pl-2 pr-3.5 text-sm font-semibold"><span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15"><PackageIcon item={item} className="size-4 text-emerald-600" /></span>{item.label}</span>)}</div>
              </div>
              {props.optionalItems.length > 0 && <div className="grid gap-4 p-5 md:grid-cols-[180px_1fr]"><div><p className="font-sans text-lg font-black uppercase">Opcjonalnie</p><p className="mt-1 text-xs text-muted-foreground">Możemy dodać do oferty</p></div><div className="flex flex-wrap gap-2">{props.optionalItems.map((item) => <span key={item.key} className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold"><PackageIcon item={item} className="size-4 text-primary" />{item.label}</span>)}</div></div>}
              {props.excludedItems.length > 0 && <div className="grid gap-4 p-5 md:grid-cols-[180px_1fr]"><div><p className="font-sans text-lg font-black uppercase">We własnym zakresie</p><p className="mt-1 text-xs text-muted-foreground">Nie znajduje się w pakiecie</p></div><div className="flex flex-wrap gap-2">{props.excludedItems.map((item) => <span key={item.key} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-muted-foreground"><CircleMinus className="size-4" />{item.label}</span>)}</div></div>}
            </div>
            {(props.ticketCategory || props.seatingInfo) && <div className="mt-5 flex items-start gap-3 rounded-2xl bg-foreground p-5 text-background"><TicketCheck className="mt-0.5 size-6 shrink-0 text-primary" /><div><p className="font-bold">Bilet na mecz{props.ticketCategory ? ` - ${props.ticketCategory}` : ""}</p>{props.seatingInfo && <p className="mt-1 text-sm leading-6 text-background/65">{props.seatingInfo}</p>}</div></div>}
          </div>

          <div id="panel-plan" role="tabpanel" hidden={activeTab !== "plan"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Krok po kroku</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Plan wyjazdu</h3>
            <ol className="mt-7 grid gap-x-10 gap-y-0 md:grid-cols-2">{props.itinerary.map((item, index) => <li key={`${item}-${index}`} className="flex gap-4 border-b py-4 first:pt-0"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground font-sans font-black text-primary">{index + 1}</span><p className="pt-1 text-sm font-semibold leading-6 md:text-base">{item}</p></li>)}</ol>
          </div>

          {hasLogistics && <div id="panel-logistyka" role="tabpanel" hidden={activeTab !== "logistyka"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Organizacja podróży</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Hotel i transport</h3>
            <div className="mt-7 divide-y rounded-2xl border">
              {props.hotel && <div className="grid gap-5 p-5 md:grid-cols-[190px_1fr]"><div><BedDouble className="size-6 text-primary" /><p className="mt-3 font-sans text-xl font-black uppercase">Hotel{props.hotel.stars ? ` ${props.hotel.stars}*` : ""}</p><p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{props.hotel.optional ? "Opcjonalnie" : "W pakiecie"}</p></div><div><p className="whitespace-pre-line leading-7 text-muted-foreground">{props.hotel.info}</p><div className="mt-4 flex flex-wrap gap-2">{props.hotel.board && <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold">{props.hotel.board}</span>}{props.hotel.roomType && <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold">{props.hotel.roomType}</span>}</div></div></div>}
              {props.flight && <div className="grid gap-5 p-5 md:grid-cols-[190px_1fr]"><div><Plane className="size-6 text-primary" /><p className="mt-3 font-sans text-xl font-black uppercase">Przelot</p><p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{props.flight.optional ? "Opcjonalnie" : "W pakiecie"}</p></div><div><p className="whitespace-pre-line leading-7 text-muted-foreground">{props.flight.info}</p><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">{props.flight.airports && <div><dt className="text-xs uppercase text-muted-foreground">Lotniska</dt><dd className="mt-1 font-semibold">{props.flight.airports}</dd></div>}{props.flight.type && <div><dt className="text-xs uppercase text-muted-foreground">Połączenie</dt><dd className="mt-1 font-semibold">{props.flight.type}</dd></div>}{props.flight.baggage && <div><dt className="text-xs uppercase text-muted-foreground">Bagaż</dt><dd className="mt-1 font-semibold">{props.flight.baggage}</dd></div>}</dl></div></div>}
            </div>
          </div>}

          {props.gallery.length > 0 && <div id="panel-zdjecia" role="tabpanel" hidden={activeTab !== "zdjecia"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Galeria wyjazdu</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Zdjęcia</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{props.gallery.map((item) => <figure key={item.id} className="group overflow-hidden rounded-xl bg-secondary"><div className="relative aspect-[4/3]"><Image src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || `Zdjęcie z wyjazdu ${props.tripTitle}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" /></div>{item.caption && <figcaption className="p-3 text-xs text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div>
          </div>}

          {props.testimonials.length > 0 && <div id="panel-opinie" role="tabpanel" hidden={activeTab !== "opinie"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Sprawdzone emocje</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Opinie kibiców</h3>
            <div className="mt-7 grid gap-4 md:grid-cols-2">{props.testimonials.map((item) => <blockquote key={item.id} className="rounded-2xl border bg-secondary/35 p-5"><div className="flex gap-1 text-primary" aria-label={`${item.rating} na 5 gwiazdek`}>{Array.from({ length: item.rating }).map((_, index) => <span key={index}>★</span>)}</div><p className="mt-3 text-sm leading-7 text-muted-foreground">„{item.content}”</p><footer className="mt-4 text-sm font-bold">{item.author}<span className="block text-xs font-normal text-muted-foreground">{item.tripName}</span></footer></blockquote>)}</div>
          </div>}

          <div id="panel-faq" role="tabpanel" hidden={activeTab !== "faq"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Warto wiedzieć</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Najczęstsze pytania</h3>
            <div className="mt-7 divide-y rounded-2xl border px-5">{props.faq.map((item) => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{item.question}<ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><p className="max-w-3xl pt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

