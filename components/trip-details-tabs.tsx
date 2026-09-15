"use client"

import Image from "next/image"
import { useState, type ComponentType } from "react"
import {
  BedDouble,
  Bus,
  CalendarClock,
  Check,
  ChevronDown,
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
type GalleryItem = { id: number | string; mediaId: number; alt: string; caption: string }
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

function PackageItemsList({
  items,
  tone,
}: {
  items: PackageItem[]
  tone: "included" | "optional" | "excluded"
}) {
  const iconClassName = {
    included: "text-emerald-600",
    optional: "text-primary",
    excluded: "text-muted-foreground",
  }[tone]

  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.key} className="flex min-w-0 items-center gap-3 text-sm font-semibold md:text-base">
          <PackageIcon item={item} className={`size-5 shrink-0 ${iconClassName}`} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
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
              <h2 className="mt-1 font-sans text-3xl font-black uppercase md:text-4xl">Szczegóły wyjazdu</h2>
      </div>

      <div className="pt-5 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:pt-8">
        <div className="relative min-w-0">
        <div role="tablist" aria-label="Informacje o wyjeździe" className="flex snap-x gap-2 overflow-x-auto border-b pb-4 pr-12 [scrollbar-width:thin] lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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
                className={`flex shrink-0 snap-start items-center gap-3 border-b-2 px-3 py-3 text-left text-sm font-bold transition-colors lg:border-b-0 lg:border-l-2 ${selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                <TabIcon className={`size-4 shrink-0 ${selected ? "text-primary" : ""}`} />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background via-background/90 to-transparent lg:hidden" />
        </div>

        <div className="min-h-[430px] pt-7 lg:pt-0">
          <div id="panel-opis" role="tabpanel" hidden={activeTab !== "opis"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">O wyjeździe</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Najważniejsze informacje</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Poznaj najważniejsze informacje o meczu, mieście i atmosferze całego wyjazdu. Zebraliśmy tu to, co warto wiedzieć przed podjęciem decyzji.</p>
            <div dangerouslySetInnerHTML={{ __html: props.descriptionHtml }} className="mt-6 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5" />
            <div className="mt-7 flex max-w-4xl gap-3 border-l-2 border-primary py-2 pl-5">
              <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground"><strong className="block text-foreground">Termin pod kontrolą</strong>Dokładna godzina meczu może zostać potwierdzona bliżej wyjazdu. Program dopasujemy do oficjalnego terminarza.</p>
            </div>
          </div>

          <div id="panel-pakiet" role="tabpanel" hidden={activeTab !== "pakiet"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Zakres oferty</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Co obejmuje cena</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Tutaj dokładnie sprawdzisz, które elementy są już zawarte w cenie, które możesz dobrać dodatkowo i co pozostaje po Twojej stronie.</p>
            <div className="mt-6 divide-y border-y">
              <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]">
                <div><p className="font-sans text-lg font-black uppercase">W cenie</p><p className="mt-1 text-xs text-muted-foreground">Uwzględnione w podanej cenie</p></div>
                <PackageItemsList items={props.includedItems} tone="included" />
              </div>
              {props.optionalItems.length > 0 && <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]"><div><p className="font-sans text-lg font-black uppercase">Opcjonalnie</p><p className="mt-1 text-xs text-muted-foreground">Możemy dodać do oferty</p></div><PackageItemsList items={props.optionalItems} tone="optional" /></div>}
              {props.excludedItems.length > 0 && <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]"><div><p className="font-sans text-lg font-black uppercase">We własnym zakresie</p><p className="mt-1 text-xs text-muted-foreground">Nie znajduje się w pakiecie</p></div><PackageItemsList items={props.excludedItems} tone="excluded" /></div>}
            </div>
            {(props.ticketCategory || props.seatingInfo) && <div className="mt-6 flex items-start gap-3 border-l-2 border-primary py-2 pl-5"><TicketCheck className="mt-0.5 size-6 shrink-0 text-primary" /><div><p className="font-bold">Bilet na mecz{props.ticketCategory ? ` - ${props.ticketCategory}` : ""}</p>{props.seatingInfo && <p className="mt-1 text-sm leading-6 text-muted-foreground">{props.seatingInfo}</p>}</div></div>}
          </div>

          <div id="panel-plan" role="tabpanel" hidden={activeTab !== "plan"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Krok po kroku</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Plan wyjazdu</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Od momentu wylotu aż po powrót masz jasny obraz tego, jak wygląda organizacja wyjazdu i najważniejsze punkty programu.</p>
            <ol className="mt-7 grid gap-x-10 gap-y-0 md:grid-cols-2">{props.itinerary.map((item, index) => <li key={`${item}-${index}`} className="flex gap-4 border-b py-4 first:pt-0"><span className="w-7 shrink-0 font-sans text-2xl font-black leading-none text-primary">{String(index + 1).padStart(2, "0")}</span><p className="text-sm font-semibold leading-6 md:text-base">{item}</p></li>)}</ol>
          </div>

          {hasLogistics && <div id="panel-logistyka" role="tabpanel" hidden={activeTab !== "logistyka"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Organizacja podróży</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Hotel i transport</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">W jednym miejscu znajdziesz informacje o zakwaterowaniu, locie, lotniskach, bagażu i dodatkowych warunkach organizacyjnych.</p>
            <div className="mt-7 divide-y border-y">
              {props.hotel && <div className="grid gap-5 py-6 md:grid-cols-[190px_1fr]"><div><BedDouble className="size-6 text-primary" /><p className="mt-3 font-sans text-xl font-black uppercase">Hotel{props.hotel.stars ? ` ${props.hotel.stars}*` : ""}</p><p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{props.hotel.optional ? "Opcjonalnie" : "W pakiecie"}</p></div><div><p className="whitespace-pre-line leading-7 text-muted-foreground">{props.hotel.info}</p><dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">{props.hotel.board && <div><dt className="text-xs uppercase text-muted-foreground">Wyżywienie</dt><dd className="mt-1 font-semibold">{props.hotel.board}</dd></div>}{props.hotel.roomType && <div><dt className="text-xs uppercase text-muted-foreground">Pokój</dt><dd className="mt-1 font-semibold">{props.hotel.roomType}</dd></div>}</dl></div></div>}
              {props.flight && <div className="grid gap-5 py-6 md:grid-cols-[190px_1fr]"><div><Plane className="size-6 text-primary" /><p className="mt-3 font-sans text-xl font-black uppercase">Przelot</p><p className="mt-1 text-xs font-bold uppercase text-muted-foreground">{props.flight.optional ? "Opcjonalnie" : "W pakiecie"}</p></div><div><p className="whitespace-pre-line leading-7 text-muted-foreground">{props.flight.info}</p><dl className="mt-4 grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">{props.flight.airports && <div><dt className="text-xs uppercase text-muted-foreground">Lotniska</dt><dd className="mt-1 font-semibold">{props.flight.airports}</dd></div>}{props.flight.type && <div><dt className="text-xs uppercase text-muted-foreground">Połączenie</dt><dd className="mt-1 font-semibold">{props.flight.type}</dd></div>}{props.flight.baggage && <div><dt className="text-xs uppercase text-muted-foreground">Bagaż</dt><dd className="mt-1 font-semibold">{props.flight.baggage}</dd></div>}</dl></div></div>}
            </div>
          </div>}

          {props.gallery.length > 0 && <div id="panel-zdjecia" role="tabpanel" hidden={activeTab !== "zdjecia"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Galeria wyjazdu</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Zdjęcia</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Zobacz stadion, miasto i klimat wyjazdu na zdjęciach przygotowanych dla tej konkretnej oferty.</p>
            <div className="mt-7 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">{props.gallery.map((item) => <figure key={item.id} className="group"><div className="relative aspect-[4/3] overflow-hidden"><Image src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || `Zdjęcie z wyjazdu ${props.tripTitle}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" /></div>{item.caption && <figcaption className="border-b py-3 text-xs text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div>
          </div>}

          {props.testimonials.length > 0 && <div id="panel-opinie" role="tabpanel" hidden={activeTab !== "opinie"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Sprawdzone emocje</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Opinie kibiców</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Przeczytaj doświadczenia osób, które wybrały się z nami na piłkarską podróż.</p>
            <div className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-2">{props.testimonials.map((item) => <blockquote key={item.id} className="border-l-2 border-primary pl-5"><div className="flex gap-1 text-primary" aria-label={`${item.rating} na 5 gwiazdek`}>{Array.from({ length: item.rating }).map((_, index) => <span key={index}>★</span>)}</div><p className="mt-3 text-sm leading-7 text-muted-foreground">„{item.content}”</p><footer className="mt-4 text-sm font-bold">{item.author}<span className="block text-xs font-normal text-muted-foreground">{item.tripName}</span></footer></blockquote>)}</div>
          </div>}

          <div id="panel-faq" role="tabpanel" hidden={activeTab !== "faq"}>
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Warto wiedzieć</p>
            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">Najczęstsze pytania</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Zebraliśmy odpowiedzi na pytania, które najczęściej pojawiają się przed rezerwacją i w trakcie przygotowań do wyjazdu.</p>
            <div className="mt-7 divide-y border-y">{props.faq.map((item) => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{item.question}<ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><p className="max-w-3xl pt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
