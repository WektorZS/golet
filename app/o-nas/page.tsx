import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Compass,
  Headphones,
  MapPinned,
  Plane,
  TicketCheck,
  Users,
} from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  getPublishedGallery,
  getSiteContent,
  type SiteContent,
} from "@/lib/content"
import { breadcrumbSchema } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Poznaj ideę Let's Gol i ludzi, którzy łączą piłkę nożną z dobrze przygotowanymi podróżami na mecze.",
  alternates: {
    canonical: "/o-nas",
  },
  openGraph: {
    title: "O Let's Gol",
    description:
      "Piłka, podróże i organizacja, dzięki której możesz skupić się na emocjach.",
    url: "/o-nas",
  },
}

const processSteps = [
  [
    Compass,
    "Wybierasz kierunek",
    "Gotowy wyjazd z kalendarza albo mecz, którego jeszcze w nim nie ma.",
  ],
  [
    CalendarCheck,
    "Ustalamy zakres",
    "Dopasowujemy elementy podróży i potwierdzamy, co obejmuje oferta.",
  ],
  [
    TicketCheck,
    "Rezerwujesz",
    "Otrzymujesz warunki, dokumenty i informacje potrzebne do podjęcia decyzji.",
  ],
  [
    Plane,
    "Ruszamy",
    "Przed podróżą dostajesz plan i najważniejsze wskazówki organizacyjne.",
  ],
  [
    MapPinned,
    "Przeżywasz mecz",
    "Na miejscu możesz skupić się na stadionie, mieście i wspólnej atmosferze.",
  ],
] as const

const values = [
  [
    Check,
    "Jedna organizacja",
    "Elementy wskazane w wybranym pakiecie łączymy w czytelną całość.",
  ],
  [
    CalendarCheck,
    "Mniej szukania",
    "Nie musisz samodzielnie składać podróży z wielu osobnych rezerwacji.",
  ],
  [
    Headphones,
    "Informacje przed drogą",
    "Wiesz, gdzie znaleźć ustalenia dotyczące swojego wyjazdu.",
  ],
  [
    Users,
    "Wspólne emocje",
    "Podróżujesz z ludźmi, którzy także czekają na pierwszy gwizdek.",
  ],
] as const

export default async function AboutPage() {
  const [content, gallery] = process.env.DATABASE_URL
    ? await Promise.all([
        getSiteContent().catch(() => ({} as SiteContent)),
        getPublishedGallery().catch(() => []),
      ])
    : ([{} as SiteContent, []] as const)

  const galleryImages = gallery.slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              {
                name: "Strona główna",
                path: "/",
              },
              {
                name: "O nas",
                path: "/o-nas",
              },
            ]),
            {
              "@type": "AboutPage",
              name: "O Let's Gol",
              url: "https://letsgol.eu/o-nas",
              mainEntity: {
                "@id": "https://letsgol.eu/#organization",
              },
            },
          ],
        }}
      />

      <SiteHeader />

      <section className="bg-foreground pt-20 text-background">
        <div className="mx-auto grid min-h-160 max-w-7xl items-stretch px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center py-16 lg:pr-16">
            <p className="eyebrow eyebrow-on-dark">
              O nas
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[68px]">
              Jedziemy po emocje, nie po odhaczony kierunek
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-background/65">
              Łączymy piłkę nożną z podróżowaniem i organizacją,
              która porządkuje drogę od pomysłu do miejsca na
              trybunach.
            </p>
          </div>

          <div className="relative min-h-105 overflow-hidden lg:min-h-full">
            <Image
              src="/images/about-us.webp"
              alt="Atmosfera wspólnego wyjazdu na mecz"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent lg:bg-linear-to-r lg:from-foreground lg:via-transparent lg:to-transparent" />

            <p className="absolute bottom-7 left-7 max-w-sm font-sans text-2xl font-black uppercase leading-tight text-white md:bottom-10 md:left-10 md:text-3xl">
              Najlepsze mecze pamięta się razem z drogą na stadion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 md:px-6 lg:grid-cols-[0.65fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">
              Idea Let's Gol
            </p>

            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Mecz to więcej niż 90 minut
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-muted-foreground">
            <p>
              Są stadiony, które zna się z transmisji, hymny
              słyszane setki razy i mecze odkładane na później.
              My pomagamy zamienić taki plan w realną podróż.
            </p>

            <p>
              W Let's Gol ważne są emocje, ale równie ważny jest
              porządek. Zakres pakietu, kolejne kroki i informacje
              organizacyjne mają być czytelne, żeby uczestnik
              wiedział, czego się spodziewać.
            </p>

            <p className="border-l-4 border-primary pl-6 font-sans text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              Ty wybierasz mecz. My pomagamy poukładać drogę na
              trybuny.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Ludzie za marką"
            title="Dwie osoby. Jeden kierunek."
            intro="Let's Gol współtworzą Łukasz i Mateusz. Razem rozwijają wyjazdy, w których liczą się emocje, czytelne zasady i dobre przygotowanie."
            align="left"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {[
              ["Ł", "Łukasz"],
              ["M", "Mateusz"],
            ].map(([initial, name]) => (
              <article
                key={name}
                className="group grid min-h-96 overflow-hidden rounded-xl bg-foreground text-background sm:grid-cols-[0.8fr_1fr]"
              >
                <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-primary text-primary-foreground">
                  <span
                    className="font-sans text-[10rem] font-black leading-none opacity-90"
                    aria-hidden="true"
                  >
                    {initial}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
                </div>

                <div className="flex flex-col justify-end p-7 md:p-9">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    Współwłaściciel
                  </p>

                  <h3 className="mt-3 font-sans text-4xl font-black uppercase">
                    {name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-background/60">
                    Współtworzy kierunek marki i doświadczenie
                    wyjazdu, od pierwszego kontaktu po informacje
                    potrzebne przed podróżą.
                  </p>

                  <span className="mt-8 w-fit border-t border-background/20 pt-3 text-xs text-background/40">
                    Let's Gol / zespół
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Jak działamy"
            title="Od pomysłu do trybun"
            intro="Każdy wyjazd jest inny, ale dobra organizacja zawsze prowadzi przez kilka czytelnych etapów."
          />

          <ol className="mt-12 grid gap-0 border-y border-foreground/15 lg:grid-cols-5">
            {processSteps.map(
              ([Icon, title, description], index) => (
                <li
                  key={title}
                  className="relative border-b border-foreground/15 p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <span className="font-mono text-[11px] font-black text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon
                    className="mt-8 size-7 text-primary"
                    aria-hidden="true"
                  />

                  <h3 className="mt-5 font-sans text-xl font-black uppercase">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </li>
              )
            )}
          </ol>
        </div>
      </section>

      <section className="bg-foreground py-16 text-background md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-[0.75fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">
              Dlaczego z nami
            </p>

            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Więcej miejsca na mecz
            </h2>

            <p className="mt-5 max-w-md leading-7 text-background/60">
              Nasza rola polega na uporządkowaniu wskazanych
              elementów podróży i przekazaniu informacji, które są
              ważne przed drogą.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl bg-background/12 sm:grid-cols-2">
            {values.map(([Icon, title, description]) => (
              <article
                key={title}
                className="bg-foreground p-6 md:p-8"
              >
                <Icon
                  className="size-6 text-primary"
                  aria-hidden="true"
                />

                <h3 className="mt-5 font-sans text-2xl font-black uppercase">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-background/60">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {galleryImages.length ? (
        <section className="bg-secondary/55 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Z drogi"
                title="To dzieje się naprawdę"
                intro="Kilka kadrów z miejsc, do których prowadzą piłkarskie podróże."
                align="left"
              />

              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/galeria" />}
              >
                Cała galeria
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-[1.25fr_0.75fr]">
              {galleryImages.map((item, index) => (
                <figure
                  key={item.id}
                  className={`relative overflow-hidden rounded-xl ${
                    index === 0
                      ? "min-h-108 md:row-span-2"
                      : "min-h-52"
                  }`}
                >
                  <Image
                    src={
                      item.mediaId
                        ? `/api/media/${item.mediaId}`
                        : item.image
                    }
                    alt={
                      item.alt ||
                      item.title ||
                      "Zdjęcie z wyjazdu Let's Gol"
                    }
                    fill
                    className="object-cover"
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 100vw, 65vw"
                        : "(max-width: 768px) 100vw, 35vw"
                    }
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />

                  {item.title || item.city ? (
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">
                      {[item.title, item.city]
                        .filter(Boolean)
                        .join(" - ")}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-primary py-14 text-primary-foreground md:py-18">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em]">
              Kolejny krok
            </p>

            <h2 className="mt-3 font-sans text-4xl font-black uppercase leading-none md:text-5xl">
              Wybierz swój mecz
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-12 bg-foreground px-6 text-background hover:bg-foreground/85"
              nativeButton={false}
              render={<Link href="/wyjazdy" />}
            >
              Zobacz wyjazdy
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 border-foreground/30 bg-transparent px-6 hover:bg-foreground hover:text-background"
              nativeButton={false}
              render={<Link href="/kontakt" />}
            >
              Skontaktuj się
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}