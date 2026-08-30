import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Headphones,
  MapPin,
  Plane,
  ShieldCheck,
  TicketCheck,
  Sparkles,
} from "lucide-react"
import { DescriptionHtml } from "@/components/description-html"
import { InquiryForm } from "@/components/inquiry-form"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { stripHtml } from "@/lib/sanitize-html"
import { getTripBySlug, getTripGallery } from "@/lib/trips"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripBySlug(slug)

  if (!trip) {
    return {
      title: "Wyjazd niedostępny",
    }
  }

  const description =
    trip.seoDescription ||
    `${stripHtml(trip.description)} Pakiet od ${trip.price.toLocaleString(
      "pl-PL"
    )} zł.`

  return {
    title: trip.seoTitle || trip.title,
    description: description.slice(0, 160),
  }
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)

  if (!trip) {
    notFound()
  }

  const gallery = await getTripGallery(trip.id)

  const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const startDate = dateFormatter.format(
    new Date(`${trip.startDate}T12:00:00`)
  )

  const date =
    trip.endDate && trip.endDate !== trip.startDate
      ? `${startDate} – ${dateFormatter.format(
          new Date(`${trip.endDate}T12:00:00`)
        )}`
      : startDate

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: stripHtml(trip.description),
    touristType: "Kibice piłkarscy",
    offers: {
      "@type": "Offer",
      price: trip.price,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
    },
  }

  const highlights = [
    {
      icon: TicketCheck,
      title: "Pewny bilet",
      description: "Bezpieczny udział w meczu",
    },
    {
      icon: Plane,
      title: "Dopasowany lot",
      description: "Logistyka dopasowana do wyjazdu",
    },
    {
      icon: Headphones,
      title: "Koordynator",
      description: "Wsparcie podczas całego wyjazdu",
    },
    {
      icon: ShieldCheck,
      title: "Ubezpieczenie",
      description: "Dodatkowe bezpieczeństwo podróży",
    },
  ]

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate min-h-[680px] overflow-hidden bg-foreground text-background md:min-h-[720px]">
        <Image
          src={trip.image}
          alt={`Wyjazd na mecz ${trip.title} w ${trip.city}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-foreground/20" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-4 py-6 md:min-h-[720px] md:px-6 md:py-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="w-fit text-background hover:bg-background/10 hover:text-background"
              nativeButton={false}
              render={<Link href="/wyjazdy" />}
            >
              <ArrowLeft data-icon="inline-start" />
              Wszystkie wyjazdy
            </Button>

            <div className="hidden items-center gap-2 rounded-full border border-background/15 bg-background/10 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md sm:flex">
              <Sparkles className="size-3.5 text-primary" />
              Let&apos;s Gol
            </div>
          </div>

          <div className="mt-auto max-w-4xl pb-8 md:pb-12">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                {trip.city} · {trip.country}
              </span>

              <span className="rounded-full border border-background/15 bg-background/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-background/80 backdrop-blur-md">
                Wyjazd na mecz
              </span>
            </div>

            <h1 className="max-w-4xl text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              {trip.title}
            </h1>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-background/10 bg-background/10 px-4 py-3 text-sm font-semibold backdrop-blur-md">
                <CalendarDays className="size-4 text-primary" />
                <span>{date}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-background/10 bg-background/10 px-4 py-3 text-sm font-semibold backdrop-blur-md">
                <MapPin className="size-4 text-primary" />
                <span>Wyloty z Polski</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-background/50">
                  Cena pakietu
                </p>

                <p className="font-sans text-4xl font-black tracking-tight text-primary md:text-5xl">
                  od {trip.price.toLocaleString("pl-PL")} zł
                </p>
              </div>

              <span className="pb-1 text-sm text-background/60">
                / osoba
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <div className="min-w-0">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Pełny pakiet
              </p>

              <h2 className="mt-3 max-w-3xl font-sans text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                Wszystko przygotowane
              </h2>

              <DescriptionHtml
                html={trip.description}
                className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-semibold [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
              />
            </div>

            {trip.includes.length > 0 && (
              <div className="mt-12">
                <div className="mb-5">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    W cenie
                  </p>

                  <h3 className="mt-2 font-sans text-2xl font-black uppercase">
                    Co otrzymujesz?
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {trip.includes.map((item) => (
                    <div
                      key={item}
                      className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-4 text-primary" />
                      </span>

                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {highlights.map(
                ({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-xl border bg-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </span>

                      <div>
                        <h3 className="font-bold">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-8 rounded-2xl border bg-secondary p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="size-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-bold uppercase">
                    Ważna informacja
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Dokładna godzina meczu może zostać potwierdzona przez
                    ligę bliżej terminu. Program podróży dopasujemy do
                    oficjalnego terminarza.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside
            id="rezerwacja"
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-2xl">
              <div className="border-b border-background/10 px-6 py-6 md:px-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/15">
                    <MessageCircleIcon />
                  </span>

                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                    Bez zobowiązań
                  </span>
                </div>

                <h2 className="font-sans text-3xl font-black uppercase leading-tight md:text-4xl">
                  Zapytaj o ten wyjazd
                </h2>

                <p className="mt-3 text-sm leading-6 text-background/60">
                  Wyślij zapytanie, a sprawdzimy dostępność i przygotujemy
                  dla Ciebie wariant wyjazdu.
                </p>

                <div className="mt-5 rounded-xl border border-background/10 bg-background/5 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-background/45">
                    Wybrany wyjazd
                  </p>

                  <p className="mt-1 font-semibold text-background">
                    {trip.title}
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 md:px-8 md:py-8">
                <InquiryForm matchName={trip.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-secondary px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Zobacz atmosferę
              </p>

              <h2 className="mt-3 font-sans text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                Galeria wyjazdu
              </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <figure
                  key={item.id}
                  className={`group overflow-hidden rounded-2xl bg-card ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      index === 0
                        ? "aspect-[2/1]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={`/api/media/${item.mediaId}`}
                      alt={
                        item.alt ||
                        item.caption ||
                        `Zdjęcie z wyjazdu ${trip.title}`
                      }
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 100vw, 66vw"
                          : "(max-width: 1024px) 50vw, 33vw"
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {item.caption && (
                    <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}

function MessageCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-primary"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  )
}