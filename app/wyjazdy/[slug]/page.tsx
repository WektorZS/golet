
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
      ? `${startDate} - ${dateFormatter.format(
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
    [TicketCheck, "Pewne bilety"],
    [Plane, "Dopasowany lot"],
    [Headphones, "Koordynator"],
    [ShieldCheck, "Ubezpieczenie"],
  ] as const

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative isolate min-h-[380px] overflow-hidden bg-foreground text-background md:min-h-[420px]">
        <Image
          src={trip.image}
          alt={`Wyjazd na mecz ${trip.title} w ${trip.city}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-foreground/20" />

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col px-4 py-7 md:min-h-[420px] md:px-6">
          <Button
            variant="ghost"
            className="w-fit text-background hover:bg-background/10 hover:text-background"
            nativeButton={false}
            render={<Link href="/wyjazdy" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Wszystkie wyjazdy
          </Button>

          <div className="mt-auto max-w-3xl pb-5 md:pb-7">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {trip.city} · {trip.country}
            </p>

            <h1 className="text-balance font-sans text-5xl font-black uppercase leading-[0.94] tracking-tight md:text-6xl lg:text-7xl">
              {trip.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                {date}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Wyloty z Polski
              </span>
            </div>

            <p className="mt-6 text-3xl font-black text-primary md:text-4xl">
              od {trip.price.toLocaleString("pl-PL")} zł
              <span className="ml-2 text-sm font-normal text-background/60">
                / osoba
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
          <div className="min-w-0">
            <div>
              <div className="inline-block bg-foreground px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
  Pełny pakiet
</div>

              <h2 className="mt-2 font-sans text-4xl font-black uppercase leading-tight">
                Wszystko przygotowane
              </h2>

              <DescriptionHtml
                html={trip.description}
                className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
              />
            </div>

            {trip.includes.length > 0 && (
              <div className="mt-9">
                <div className="inline-block bg-foreground px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
  W cenie
</div>
                <h3 className="mt-2 font-sans text-2xl font-black uppercase">
                  Co otrzymujesz?
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {trip.includes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border bg-card p-4 font-semibold"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-4 text-primary" />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {highlights.map(([Icon, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4"
                >
                  <Icon className="size-5 shrink-0 text-primary" />
                  <span className="font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-xl bg-secondary p-5 md:p-6">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <h3 className="font-bold uppercase">
                    Ważna informacja
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
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
            <div className="overflow-hidden rounded-xl bg-foreground text-background shadow-xl">
              <div className="border-b border-background/10 px-6 py-6 md:px-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Skontaktuj się z nami
                </p>

                <h2 className="mt-2 font-sans text-3xl font-black uppercase leading-tight">
                  Zapytaj o ten wyjazd
                </h2>

                <p className="mt-2 text-sm leading-6 text-background/60">
                  Wyślij zapytanie, a sprawdzimy dostępność i przygotujemy
                  dla Ciebie wariant wyjazdu.
                </p>

                <div className="mt-4 rounded-lg border border-background/10 bg-background/5 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-background/40">
                    Wybrany wyjazd
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {trip.title}
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 md:px-7">
                <InquiryForm matchName={trip.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-secondary px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Zobacz atmosferę
            </p>

            <h2 className="mt-2 font-sans text-4xl font-black uppercase leading-tight md:text-5xl">
              Galeria wyjazdu
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <figure
                  key={item.id}
                  className={`group overflow-hidden rounded-xl bg-card ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
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
