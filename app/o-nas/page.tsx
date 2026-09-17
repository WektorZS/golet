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
    "Poznaj Let's Gol, Łukasza i Mateusza oraz sprawdź, jak organizujemy wyjazdy na mecze w Europie.",
  alternates: {
    canonical: "/o-nas",
  },
  openGraph: {
    title: "O nas | Let's Gol",
    description:
      "Jeździmy na mecze i organizujemy wyjazdy dla tych, którzy chcą zobaczyć największe stadiony Europy na żywo.",
    url: "/o-nas",
  },
}

const processSteps = [
  [
    Compass,
    "Wybierasz mecz",
    "Wybierasz jeden z dostępnych wyjazdów albo piszesz do nas z własnym pomysłem.",
  ],
  [
    CalendarCheck,
    "Ustalamy szczegóły",
    "Sprawdzamy dostępność i ustalamy termin, wariant wyjazdu oraz najważniejsze szczegóły.",
  ],
  [
    TicketCheck,
    "Dostajesz ofertę",
    "Przesyłamy konkretną ofertę z ceną i informacją, co dokładnie obejmuje.",
  ],
  [
    Plane,
    "Organizujemy wyjazd",
    "Po rezerwacji zajmujemy się ustalonym zakresem wyjazdu i przekazujemy potrzebne informacje.",
  ],
  [
    MapPinned,
    "Lecisz na mecz",
    "Na końcu zostaje już najważniejsze: wyjazd, stadion i mecz, dla którego to wszystko robimy.",
  ],
] as const

const values = [
  [
    TicketCheck,
    "Bilety na mecz",
    "Organizujemy bilety zgodnie z kategorią i zakresem podanym w ofercie.",
  ],
  [
    Plane,
    "Lot i nocleg",
    "W zależności od wybranego pakietu organizujemy lot oraz nocleg dopasowane do terminu meczu.",
  ],
  [
    CalendarCheck,
    "Plan wyjazdu",
    "Przed podróżą dostajesz najważniejsze informacje dotyczące swojego wyjazdu w jednym miejscu.",
  ],
  [
    Headphones,
    "Kontakt z nami",
    "Jeżeli przed wyjazdem pojawi się pytanie, nie szukasz odpowiedzi po omacku. Kontaktujesz się bezpośrednio z nami.",
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

      <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
        <Image
          src="/images/about-us.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />

        <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">
              O nas
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              Jeździmy na mecze. Teraz zabieramy na nie Was.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Let&apos;s Gol powstało z połączenia dwóch rzeczy, które
              od lat są nam bliskie: piłki nożnej i podróży.
              Organizujemy wyjazdy na mecze w Europie i zajmujemy się
              tym, co potrzebne, żeby dostać się na trybuny.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <Compass
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              Zaczęło się od własnych wyjazdów
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              Najpierw sami planowaliśmy kolejne mecze i stadiony.
              Z czasem postanowiliśmy wykorzystać to doświadczenie
              i zacząć organizować takie wyjazdy dla innych.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 md:px-6 lg:grid-cols-[0.65fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">
              Skąd ten pomysł?
            </p>

            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Po prostu lubimy jeździć na mecze
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-muted-foreground">
            <p>
              Sami jesteśmy kibicami i dobrze wiemy, że wyjazd na mecz
              nie zaczyna się przy wejściu na stadion. Trzeba znaleźć
              bilety, lot, nocleg, sprawdzić dojazdy i poukładać
              wszystko tak, żeby terminy się zgadzały.
            </p>

            <p>
              Robiliśmy to wcześniej dla siebie. Dzisiaj robimy to
              dla osób, które chcą zobaczyć mecz na żywo, ale
              niekoniecznie chcą spędzić kilka wieczorów na
              porównywaniu lotów, hoteli i biletów.
            </p>

            <p className="border-l-4 border-primary pl-6 font-sans text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              Ty wybierasz mecz. My zajmujemy się organizacją.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Kto za tym stoi?"
            title="Łukasz i Mateusz"
            intro="Za Let's Gol stoimy my, Łukasz i Mateusz. Łączy nas piłka, podróże i pomysł, żeby organizować wyjazdy, na które sami chcielibyśmy pojechać."
            align="left"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="group grid min-h-96 overflow-hidden rounded-xl bg-foreground text-background sm:grid-cols-[0.8fr_1fr]">
              <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-primary text-primary-foreground">
                <span
                  className="font-sans text-[10rem] font-black leading-none opacity-90"
                  aria-hidden="true"
                >
                  Ł
                </span>

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
              </div>

              <div className="flex flex-col justify-end p-7 md:p-9">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  Współwłaściciel
                </p>

                <h3 className="mt-3 font-sans text-4xl font-black uppercase">
                  Łukasz
                </h3>

                <p className="mt-4 text-sm leading-7 text-background/60">
                  Na co dzień zajmuje się organizacją wyjazdów
                  i kontaktem z klientami. Prywatnie kibic, który
                  zdecydowanie częściej sprawdza terminarze meczów
                  niż oferty zwykłych wakacji.
                </p>

                <span className="mt-8 w-fit border-t border-background/20 pt-3 text-xs text-background/40">
                  Let&apos;s Gol
                </span>
              </div>
            </article>

            <article className="group grid min-h-96 overflow-hidden rounded-xl bg-foreground text-background sm:grid-cols-[0.8fr_1fr]">
              <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-primary text-primary-foreground">
                <span
                  className="font-sans text-[10rem] font-black leading-none opacity-90"
                  aria-hidden="true"
                >
                  M
                </span>

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
              </div>

              <div className="flex flex-col justify-end p-7 md:p-9">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  Współwłaściciel
                </p>

                <h3 className="mt-3 font-sans text-4xl font-black uppercase">
                  Mateusz
                </h3>

                <p className="mt-4 text-sm leading-7 text-background/60">
                  Zajmuje się przygotowaniem wyjazdów i rozwojem
                  Let&apos;s Gol. Tak samo jak Łukasz uważa, że dobry
                  weekend zaczyna się od sprawdzenia, gdzie grają.
                </p>

                <span className="mt-8 w-fit border-t border-background/20 pt-3 text-xs text-background/40">
                  Let&apos;s Gol
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Jak działamy"
            title="Jak wygląda wyjazd z Let's Gol?"
            intro="Bez komplikowania. Wybierasz mecz, ustalamy szczegóły i organizujemy wyjazd."
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
              Co bierzemy na siebie?
            </p>

            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Nie musisz organizować wszystkiego sam
            </h2>

            <p className="mt-5 max-w-md leading-7 text-background/60">
              Wyjazd na zagraniczny mecz to kilka osobnych rzeczy do
              ogarnięcia. W zależności od wybranego pakietu możemy
              zająć się nimi za Ciebie.
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
                eyebrow="Nasze wyjazdy"
                title="Kilka zdjęć"
                intro="Stadiony, miasta i ludzie, z którymi mieliśmy okazję przeżyć te mecze."
                align="left"
              />

              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/galeria" />}
              >
                Zobacz całą galerię
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
                        .join(" · ")}
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
              Masz już jakiś mecz na oku?
            </p>

            <h2 className="mt-3 font-sans text-4xl font-black uppercase leading-none md:text-5xl">
              To co, gdzie lecimy?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
         <Button
  size="lg"
  className="h-12 gap-3 bg-foreground pl-6 pr-5 text-background hover:bg-foreground/85"
  nativeButton={false}
  render={<Link href="/wyjazdy" />}
>
  Zobacz najbliższe wyjazdy
  <ArrowRight className="size-4 shrink-0" />
</Button>

     <Button
  size="lg"
  variant="outline"
  className="h-12 border-foreground/30 bg-transparent px-6 hover:bg-foreground hover:text-background"
  nativeButton={false}
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
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