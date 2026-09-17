"use client"

import Image from "next/image"
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react"
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
  ArrowRight,
X,
} from "lucide-react"

import type { PackageFeatureKey } from "@/lib/package-options"

type Icon = ComponentType<{
  className?: string
}>

const packageIcons: Record<
  PackageFeatureKey,
  Icon
> = {
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

type PackageItem = {
  key: string
  label: string
}

type GalleryItem = {
  id: number | string
  mediaId: number
  alt: string
  caption: string
}

type TestimonialItem = {
  id: number
  author: string
  tripName: string
  content: string
  rating: number
}

type FaqItem = {
  question: string
  answer: string
}

type TripDetailsTabsProps = {
  descriptionHtml: string
  includedItems: PackageItem[]
  optionalItems: PackageItem[]
  excludedItems: PackageItem[]
  ticketCategory: string
  seatingInfo: string
  itinerary: string[]
  hotel?: {
    stars: number
    info: string
    board: string
    roomType: string
    optional: boolean
  }
  flight?: {
    info: string
    airports: string
    type: string
    baggage: string
    optional: boolean
  }
  gallery: GalleryItem[]
  testimonials: TestimonialItem[]
  faq: FaqItem[]
  tripTitle: string

  selectedPackageLabel?: string
  partialPackageSelected?: boolean
  hotelIncluded?: boolean
  flightIncluded?: boolean
  changePackageHref?: string
}

function PackageIcon({
  item,
  className,
}: {
  item: PackageItem
  className?: string
}) {
  const IconComponent =
    item.key.startsWith("custom-")
      ? Check
      : packageIcons[
          item.key as PackageFeatureKey
        ] || Check

  return (
    <IconComponent
      className={className}
    />
  )
}

function PackageItemsList({
  items,
  tone,
}: {
  items: PackageItem[]
  tone:
    | "included"
    | "optional"
    | "excluded"
}) {
  const iconClassName = {
    included: "text-emerald-600",
    optional: "text-primary",
    excluded: "text-muted-foreground",
  }[tone]

  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.key}
          className="flex min-w-0 items-center gap-3 text-sm font-semibold md:text-base"
        >
          <PackageIcon
            item={item}
            className={`size-5 shrink-0 ${iconClassName}`}
          />

          <span>
            {item.label}
            {item.key === "baggage"
              ? "*"
              : ""}
          </span>
        </li>
      ))}
    </ul>
  )
}

function isFlightRelated(
  item: PackageItem
) {
  if (
    item.key === "flight" ||
    item.key === "baggage"
  ) {
    return true
  }

  const label =
    item.label.toLocaleLowerCase(
      "pl-PL"
    )

  return [
    "przelot",
    "wylot",
    "lotnisko",
    "lotniska",
    "bagaż",
    "samolot",
  ].some((word) =>
    label.includes(word)
  )
}

function isHotelRelated(
  item: PackageItem
) {
  if (
    item.key === "hotel" ||
    item.key === "breakfast"
  ) {
    return true
  }

  const label =
    item.label.toLocaleLowerCase(
      "pl-PL"
    )

  return [
    "hotel",
    "nocleg",
    "zakwater",
    "śniadan",
  ].some((word) =>
    label.includes(word)
  )
}

function filterPackageItems(
  items: PackageItem[],
  hotelIncluded: boolean,
  flightIncluded: boolean
) {
  return items.filter((item) => {
    if (
      !flightIncluded &&
      isFlightRelated(item)
    ) {
      return false
    }

    if (
      !hotelIncluded &&
      isHotelRelated(item)
    ) {
      return false
    }

    return true
  })
}

function filterItinerary(
  itinerary: string[],
  hotelIncluded: boolean,
  flightIncluded: boolean
) {
  return itinerary.filter((item) => {
    const text =
      item.toLocaleLowerCase(
        "pl-PL"
      )

    if (
      !flightIncluded &&
      [
        "wylot",
        "przelot",
        "lotnisko",
        "samolot",
      ].some((word) =>
        text.includes(word)
      )
    ) {
      return false
    }

    if (
      !hotelIncluded &&
      [
        "hotel",
        "nocleg",
        "zakwater",
        "śniadan",
      ].some((word) =>
        text.includes(word)
      )
    ) {
      return false
    }

    return true
  })
}

function MissingPackageElement({
  icon: IconComponent,
  title,
  description,
  packageLabel,
  changePackageHref,
}: {
  icon: Icon
  title: string
  description: string
  packageLabel: string
  changePackageHref: string
}) {
  return (
    <div className="grid gap-5 py-6 md:grid-cols-[190px_1fr]">
      <div>
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <IconComponent className="size-5" />
        </span>

        <p className="mt-3 font-sans text-xl font-black uppercase text-muted-foreground">
          {title}
        </p>

        <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-primary">
          Poza wybranym wariantem
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold text-foreground">
          Wybrany pakiet:{" "}
          {packageLabel}
        </p>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>

        <a
          href={changePackageHref}
          className="mt-4 w-fit rounded-lg bg-primary px-4 py-2.5 font-sans text-xs font-black uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
        >
          Zmień wariant pakietu
        </a>
      </div>
    </div>
  )
}
function TestimonialCard({
  item,
  onOpen,
}: {
  item: TestimonialItem
  onOpen: () => void
}) {
  const textRef =
    useRef<HTMLParagraphElement>(null)

  const [isTruncated, setIsTruncated] =
    useState(false)

  useEffect(() => {
    const element = textRef.current

    if (!element) return

    const checkTruncation = () => {
      const visibleHeight = element.clientHeight
      const clone = element.cloneNode(true) as HTMLParagraphElement

      clone.classList.remove("line-clamp-4")
      clone.style.position = "absolute"
      clone.style.visibility = "hidden"
      clone.style.pointerEvents = "none"
      clone.style.height = "auto"
      clone.style.maxHeight = "none"
      clone.style.overflow = "visible"
      clone.style.display = "block"
      clone.style.width = `${element.clientWidth}px`
      clone.style.webkitLineClamp = "unset"
      clone.style.webkitBoxOrient = "unset"

      document.body.appendChild(clone)
      const fullHeight = clone.clientHeight
      document.body.removeChild(clone)

      setIsTruncated(fullHeight > visibleHeight + 1)
    }

    checkTruncation()

    const observer =
      new ResizeObserver(checkTruncation)

    observer.observe(element)

    window.addEventListener(
      "resize",
      checkTruncation
    )

    document.fonts?.ready.then(
      checkTruncation
    )

    return () => {
      observer.disconnect()

      window.removeEventListener(
        "resize",
        checkTruncation
      )
    }
  }, [item.content])

  return (
    <blockquote className="flex h-full flex-col border-l-2 border-primary pl-5">
      <div
        className="flex gap-1 text-primary"
        aria-label={`${item.rating} na 5 gwiazdek`}
      >
        {Array.from({
          length: item.rating,
        }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>

      <div className="mt-3">
        <p
          ref={textRef}
          className="line-clamp-4 text-sm leading-7 text-muted-foreground"
        >
          „{item.content}”
        </p>

        {isTruncated ? (
          <button
            type="button"
            onClick={onOpen}
            className="group mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
          >
            Zobacz więcej

            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        ) : null}
      </div>

      <footer className="mt-4 text-sm font-bold">
        {item.author}

        <span className="block text-xs font-normal text-muted-foreground">
          {item.tripName}
        </span>
      </footer>
    </blockquote>
  )
}
export function TripDetailsTabs(
  props: TripDetailsTabsProps
) {
  const [activeTab, setActiveTab] =
    useState("opis")

  const [mobileTabsOpen, setMobileTabsOpen] =
    useState(false)

  const mobileTabsAnchorRef =
    useRef<HTMLDivElement>(null)

  const [
    selectedTestimonial,
    setSelectedTestimonial,
  ] = useState<TestimonialItem | null>(null)
  const partialPackageSelected =
    props.partialPackageSelected ??
    false

  const hotelIncluded =
    props.hotelIncluded ??
    Boolean(props.hotel)

  const flightIncluded =
    props.flightIncluded ??
    Boolean(props.flight)

  const selectedPackageLabel =
    props.selectedPackageLabel ||
    "Wybrany wariant"

  const changePackageHref =
    props.changePackageHref ||
    "#wariant-pakietu"

  const hasLogistics = Boolean(
    props.hotel ||
      props.flight ||
      partialPackageSelected
  )

  const includedItems =
    filterPackageItems(
      props.includedItems,
      hotelIncluded,
      flightIncluded
    )

  const optionalItems =
    filterPackageItems(
      props.optionalItems,
      hotelIncluded,
      flightIncluded
    )

  const excludedItems =
    filterPackageItems(
      props.excludedItems,
      hotelIncluded,
      flightIncluded
    )

  const itinerary =
    partialPackageSelected
      ? filterItinerary(
          props.itinerary,
          hotelIncluded,
          flightIncluded
        )
      : props.itinerary
useEffect(() => {
  if (!selectedTestimonial) return

  const previousOverflow =
    document.body.style.overflow

  document.body.style.overflow = "hidden"

  const handleKeyDown = (
    event: KeyboardEvent
  ) => {
    if (event.key === "Escape") {
      setSelectedTestimonial(null)
    }
  }

  window.addEventListener(
    "keydown",
    handleKeyDown
  )

  return () => {
    document.body.style.overflow =
      previousOverflow

    window.removeEventListener(
      "keydown",
      handleKeyDown
    )
  }
}, [selectedTestimonial])

  const handleMobileTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setMobileTabsOpen(false)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const anchor = mobileTabsAnchorRef.current

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

  const tabs = [
    {
      id: "opis",
      label: "O wyjeździe",
      icon: CalendarClock,
    },
    {
      id: "pakiet",
      label: "Zakres pakietu",
      icon: TicketCheck,
    },
    {
      id: "plan",
      label: "Plan wyjazdu",
      icon: Route,
    },
    ...(hasLogistics
      ? [
          {
            id: "logistyka",
            label: "Hotel i podróż",
            icon: BedDouble,
          },
        ]
      : []),
    ...(props.gallery.length
      ? [
          {
            id: "zdjecia",
            label: "Zdjęcia",
            icon: Images,
          },
        ]
      : []),
    ...(props.testimonials.length
      ? [
          {
            id: "opinie",
            label: "Opinie",
            icon: MessageSquareQuote,
          },
        ]
      : []),
    {
      id: "faq",
      label: "FAQ",
      icon: CirclePlus,
    },
  ]

  useEffect(() => {
    if (
      !tabs.some(
        (tab) => tab.id === activeTab
      )
    ) {
      setActiveTab("opis")
    }
  }, [
    activeTab,
    hasLogistics,
    props.gallery.length,
    props.testimonials.length,
  ])

  return (
    <section
      aria-label="Szczegóły wyjazdu"
      className="scroll-mt-24"
    >
      <div className="border-b pb-6">
        <h2 className="mt-1 font-sans text-3xl font-black uppercase md:text-4xl">
          Szczegóły wyjazdu
        </h2>

        {partialPackageSelected ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-primary px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-primary-foreground">
              Wybrany wariant
            </span>

            <span className="text-sm font-semibold text-muted-foreground">
              {selectedPackageLabel}
            </span>
          </div>
        ) : null}
      </div>

      <div
        ref={mobileTabsAnchorRef}
        className="h-0 lg:hidden"
        aria-hidden="true"
      />

      <div className="sticky top-20 z-40 -mx-4 mt-5 border-y border-foreground/10 bg-background/95 backdrop-blur-md lg:hidden">
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setMobileTabsOpen((current) => !current)
            }
            aria-expanded={mobileTabsOpen}
            aria-controls="mobile-trip-tabs"
            className="flex min-h-17 w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                Szczegóły wyjazdu
              </p>

              <div className="mt-1 flex items-center gap-2">
                {(() => {
                  const currentTab =
                    tabs.find(
                      (tab) => tab.id === activeTab
                    ) ?? tabs[0]

                  const CurrentIcon =
                    currentTab.icon

                  return (
                    <>
                      <CurrentIcon
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span className="truncate font-sans text-lg font-black uppercase leading-none text-foreground">
                        {currentTab.label}
                      </span>
                    </>
                  )
                })()}
              </div>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background">
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  mobileTabsOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {mobileTabsOpen ? (
            <div
              id="mobile-trip-tabs"
              className="absolute inset-x-0 top-full z-50 border-t border-foreground/10 bg-background p-3 shadow-xl"
            >
              <div
                role="tablist"
                aria-label="Informacje o wyjeździe"
                className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto"
              >
                {tabs.map((tab) => {
                  const TabIcon = tab.icon
                  const selected =
                    activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`panel-${tab.id}`}
                      onClick={() =>
                        handleMobileTabChange(tab.id)
                      }
                      className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/10 bg-secondary/50 text-foreground"
                      }`}
                    >
                      <TabIcon
                        className={`size-4 shrink-0 ${
                          selected
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                        aria-hidden="true"
                      />

                      <span className="font-sans text-sm font-black uppercase leading-tight">
                        {tab.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="pt-7 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:pt-8">
        <div className="hidden min-w-0 lg:block">
          <div
            role="tablist"
            aria-label="Informacje o wyjeździe"
            className="flex flex-col border-r pr-6"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const selected =
                activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-3 border-l-2 px-3 py-3 text-left text-sm font-bold transition-colors ${
                    selected
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon
                    className={`size-4 shrink-0 ${
                      selected ? "text-primary" : ""
                    }`}
                    aria-hidden="true"
                  />

                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-h-107.5 lg:pt-0">
          <div
            id="panel-opis"
            role="tabpanel"
            hidden={
              activeTab !== "opis"
            }
          >
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              O wyjeździe
            </p>

            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
              Najważniejsze informacje
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Poznaj najważniejsze
              informacje o meczu, mieście
              i atmosferze całego
              wyjazdu. Zebraliśmy tu to,
              co warto wiedzieć przed
              podjęciem decyzji.
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  props.descriptionHtml,
              }}
              className="mt-6 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            />

            <div className="mt-7 flex max-w-4xl gap-3 border-l-2 border-primary py-2 pl-5">
              <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" />

              <p className="text-sm leading-6 text-muted-foreground">
                <strong className="block text-foreground">
                  Termin pod kontrolą
                </strong>
                Dokładna godzina meczu
                może zostać potwierdzona
                bliżej wyjazdu. Program
                dopasujemy do oficjalnego
                terminarza.
              </p>
            </div>
          </div>

          <div
            id="panel-pakiet"
            role="tabpanel"
            hidden={
              activeTab !== "pakiet"
            }
          >
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Zakres oferty
            </p>

            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
              {partialPackageSelected
                ? "Co obejmuje wybrany wariant"
                : "Co obejmuje cena"}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
  {partialPackageSelected
    ? `Zakres poniżej został dopasowany do wybranego wariantu: ${selectedPackageLabel}.`
    : "Tutaj dokładnie sprawdzisz, które elementy są już zawarte w cenie, które możesz dobrać dodatkowo i co pozostaje po Twojej stronie."}
</p>

            <div className="mt-6 divide-y border-y">
              {includedItems.length >
              0 ? (
                <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]">
                  <div>
                    <p className="font-sans text-lg font-black uppercase">
                      W pakiecie
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {partialPackageSelected
                        ? "Uwzględnione w wybranym wariancie"
                        : "Uwzględnione w podanej cenie"}
                    </p>
                  </div>

                  <PackageItemsList
                    items={
                      includedItems
                    }
                    tone="included"
                  />
                </div>
              ) : null}

              {optionalItems.length >
              0 ? (
                <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]">
                  <div>
                    <p className="font-sans text-lg font-black uppercase">
                      Opcjonalnie
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Możemy dodać do
                      oferty
                    </p>
                  </div>

                  <PackageItemsList
                    items={
                      optionalItems
                    }
                    tone="optional"
                  />
                </div>
              ) : null}

              {excludedItems.length >
              0 ? (
                <div className="grid gap-5 py-6 md:grid-cols-[180px_1fr]">
                  <div>
                    <p className="font-sans text-lg font-black uppercase">
                      We własnym zakresie
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Nie znajduje się w
                      pakiecie
                    </p>
                  </div>

                  <PackageItemsList
                    items={
                      excludedItems
                    }
                    tone="excluded"
                  />
                </div>
              ) : null}
            </div>

            {[
              ...includedItems,
              ...optionalItems,
            ].some(
              (item) =>
                item.key === "baggage"
            ) ? (
              <p className="mt-4 max-w-3xl text-xs leading-5 text-muted-foreground">
                <strong className="text-foreground">
                  * Bagaż:
                </strong>{" "}
                mały bagaż podręczny
                mieszczący się pod
                siedzeniem samolotu. Nie
                oznacza walizki kabinowej
                ani bagażu rejestrowanego,
                chyba że opis konkretnej
                oferty wyraźnie stanowi
                inaczej.
              </p>
            ) : null}

            {(props.ticketCategory ||
              props.seatingInfo) && (
              <div className="mt-6 flex items-start gap-3 border-l-2 border-primary py-2 pl-5">
                <TicketCheck className="mt-0.5 size-6 shrink-0 text-primary" />

                <div>
                  <p className="font-bold">
                    Bilet na mecz
                    {props.ticketCategory
                      ? ` ${props.ticketCategory}`
                      : ""}
                  </p>

                  {props.seatingInfo ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {
                        props.seatingInfo
                      }
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div
            id="panel-plan"
            role="tabpanel"
            hidden={
              activeTab !== "plan"
            }
          >
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Krok po kroku
            </p>

            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
              Plan wyjazdu
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {partialPackageSelected
                ? "Plan poniżej został dopasowany do wybranego wariantu pakietu."
                : "Od momentu wylotu aż po powrót masz jasny obraz tego, jak wygląda organizacja wyjazdu i najważniejsze punkty programu."}
            </p>

            <ol className="mt-7 grid gap-x-10 gap-y-0 md:grid-cols-2">
              {itinerary.map(
                (item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex gap-4 border-b py-4 first:pt-0"
                  >
                    <span className="w-7 shrink-0 font-sans text-2xl font-black leading-none text-primary">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p className="text-sm font-semibold leading-6 md:text-base">
                      {item}
                    </p>
                  </li>
                )
              )}
            </ol>
          </div>

          {hasLogistics ? (
            <div
              id="panel-logistyka"
              role="tabpanel"
              hidden={
                activeTab !==
                "logistyka"
              }
            >
              <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Organizacja podróży
              </p>

              <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
                Hotel i podróż
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                {partialPackageSelected
                  ? "Ta sekcja uwzględnia wybrany przez Ciebie wariant. Jeśli hotel lub przelot nie są jego częścią, możesz zmienić pakiet."
                  : "W jednym miejscu znajdziesz informacje o zakwaterowaniu, locie, lotniskach, bagażu i dodatkowych warunkach organizacyjnych."}
              </p>

              <div className="mt-7 divide-y border-y">
                {hotelIncluded &&
                props.hotel ? (
                  <div className="grid gap-5 py-6 md:grid-cols-[190px_1fr]">
                    <div>
                      <BedDouble className="size-6 text-primary" />

                      <p className="mt-3 font-sans text-xl font-black uppercase">
                        Hotel
                        {props.hotel
                          .stars
                          ? ` ${props.hotel.stars}*`
                          : ""}
                      </p>

                      <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
                        {props.hotel
                          .optional
                          ? "Opcjonalnie"
                          : "W pakiecie"}
                      </p>
                    </div>

                    <div>
                      <p className="whitespace-pre-line leading-7 text-muted-foreground">
                        {
                          props.hotel
                            .info
                        }
                      </p>

                      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                        {props.hotel
                          .board ? (
                          <div>
                            <dt className="text-xs uppercase text-muted-foreground">
                              Wyżywienie
                            </dt>

                            <dd className="mt-1 font-semibold">
                              {
                                props
                                  .hotel
                                  .board
                              }
                            </dd>
                          </div>
                        ) : null}

                        {props.hotel
                          .roomType ? (
                          <div>
                            <dt className="text-xs uppercase text-muted-foreground">
                              Pokój
                            </dt>

                            <dd className="mt-1 font-semibold">
                              {
                                props
                                  .hotel
                                  .roomType
                              }
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </div>
                ) : partialPackageSelected ? (
                  <MissingPackageElement
                    icon={BedDouble}
                    title="Hotel"
                    packageLabel={
                      selectedPackageLabel
                    }
                    changePackageHref={
                      changePackageHref
                    }
                    description="Wybrany wariant nie obejmuje noclegu. Jeśli chcesz, abyśmy zorganizowali hotel w ramach wyjazdu, wybierz pełny pakiet lub wariant zawierający nocleg."
                  />
                ) : null}

                {flightIncluded &&
                props.flight ? (
                  <div className="grid gap-5 py-6 md:grid-cols-[190px_1fr]">
                    <div>
                      <Plane className="size-6 text-primary" />

                      <p className="mt-3 font-sans text-xl font-black uppercase">
                        Przelot
                      </p>

                      <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
                        {props.flight
                          .optional
                          ? "Opcjonalnie"
                          : "W pakiecie"}
                      </p>
                    </div>

                    <div>
                      <p className="whitespace-pre-line leading-7 text-muted-foreground">
                        {
                          props.flight
                            .info
                        }
                      </p>

                      <dl className="mt-4 grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">
                        {props.flight
                          .airports ? (
                          <div>
                            <dt className="text-xs uppercase text-muted-foreground">
                              Lotniska
                            </dt>

                            <dd className="mt-1 font-semibold">
                              {
                                props
                                  .flight
                                  .airports
                              }
                            </dd>
                          </div>
                        ) : null}

                        {props.flight
                          .type ? (
                          <div>
                            <dt className="text-xs uppercase text-muted-foreground">
                              Połączenie
                            </dt>

                            <dd className="mt-1 font-semibold">
                              {
                                props
                                  .flight
                                  .type
                              }
                            </dd>
                          </div>
                        ) : null}

                        {props.flight
                          .baggage ? (
                          <div>
                            <dt className="text-xs uppercase text-muted-foreground">
                              Bagaż
                            </dt>

                            <dd className="mt-1 font-semibold">
                              {
                                props
                                  .flight
                                  .baggage
                              }
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </div>
                ) : partialPackageSelected ? (
                  <MissingPackageElement
                    icon={Plane}
                    title="Przelot"
                    packageLabel={
                      selectedPackageLabel
                    }
                    changePackageHref={
                      changePackageHref
                    }
                    description="Wybrany wariant nie obejmuje przelotu. Jeśli chcesz, abyśmy zorganizowali również lot, wybierz pełny pakiet lub wariant zawierający przelot."
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          {props.gallery.length >
          0 ? (
            <div
              id="panel-zdjecia"
              role="tabpanel"
              hidden={
                activeTab !==
                "zdjecia"
              }
            >
              <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Galeria wyjazdu
              </p>

              <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
                Zdjęcia
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Zobacz stadion, miasto i
                klimat wyjazdu na
                zdjęciach przygotowanych
                dla tej konkretnej
                oferty.
              </p>

              <div className="mt-7 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {props.gallery.map(
                  (item) => (
                    <figure
                      key={item.id}
                      className="group"
                    >
                      <div className="relative aspect-4/3 overflow-hidden">
                        <Image
                          src={`/api/media/${item.mediaId}`}
                          alt={
                            item.alt ||
                            item.caption ||
                            `Zdjęcie z wyjazdu ${props.tripTitle}`
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>

                      {item.caption ? (
                        <figcaption className="border-b py-3 text-xs text-muted-foreground">
                          {
                            item.caption
                          }
                        </figcaption>
                      ) : null}
                    </figure>
                  )
                )}
              </div>
            </div>
          ) : null}

          {props.testimonials.length > 0 ? (
            <div
              id="panel-opinie"
              role="tabpanel"
              hidden={activeTab !== "opinie"}
            >
              <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Sprawdzone emocje
              </p>

              <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
                Opinie kibiców
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Przeczytaj doświadczenia osób, które wybrały się z nami na piłkarską podróż.
              </p>

              <div className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-2">
                {props.testimonials.map((item) => (
                  <TestimonialCard
                    key={item.id}
                    item={item}
                    onOpen={() => setSelectedTestimonial(item)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div
            id="panel-faq"
            role="tabpanel"
            hidden={
              activeTab !== "faq"
            }
          >
            <p className="inline-block bg-black px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Warto wiedzieć
            </p>

            <h3 className="mt-2 font-sans text-3xl font-black uppercase md:text-4xl">
              Najczęstsze pytania
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Zebraliśmy odpowiedzi na
              pytania, które najczęściej
              pojawiają się przed
              rezerwacją i w trakcie
              przygotowań do wyjazdu.
            </p>

            <div className="mt-7 divide-y border-y">
              {props.faq.map(
                (item) => (
                  <details
                    key={
                      item.question
                    }
                    className="group py-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                      {
                        item.question
                      }

                      <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                    </summary>

                    <p className="max-w-3xl pt-3 text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTestimonial ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trip-testimonial-title"
          className="fixed inset-x-0 bottom-0 top-20 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTestimonial(null)
            }
          }}
        >
          <div className="relative max-h-[calc(100dvh-6rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-foreground p-6 text-background shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setSelectedTestimonial(null)}
              aria-label="Zamknij opinię"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-primary hover:bg-primary hover:text-black"
            >
              <X className="size-5" />
            </button>

            <div
              className="flex gap-1 text-primary"
              aria-label={`${selectedTestimonial.rating} na 5 gwiazdek`}
            >
              {Array.from({ length: selectedTestimonial.rating }).map((_, index) => (
                <span key={index} className="text-lg">
                  ★
                </span>
              ))}
            </div>

            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Opinia klienta
            </p>

            <h3
              id="trip-testimonial-title"
              className="mt-4 pr-12 font-sans text-3xl font-black uppercase"
            >
              {selectedTestimonial.author || "Klient Let's Gol"}
            </h3>

            {selectedTestimonial.tripName ? (
              <p className="mt-2 text-sm text-background/50">
                {selectedTestimonial.tripName}
              </p>
            ) : null}

            <div className="my-6 h-px bg-white/10" />

            <p className="whitespace-pre-line text-base leading-8 text-background/80">
              „{selectedTestimonial.content}”
            </p>

            <button
              type="button"
              onClick={() => setSelectedTestimonial(null)}
              className="mt-7 rounded-lg bg-primary px-5 py-2.5 font-sans text-sm font-black uppercase text-primary-foreground transition-opacity hover:opacity-85"
            >
              Zamknij
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}