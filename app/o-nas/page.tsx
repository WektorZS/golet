import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
import { breadcrumbSchema, socialMetadata } from "@/lib/seo"
import { AboutStorySlider } from "@/components/about-story-slider"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Poznaj historię Let's Gol, Łukasza i Mateusza oraz pasję, z której powstały nasze wyjazdy na największe stadiony Europy.",
  alternates: {
    canonical: "/o-nas",
  },
  ...socialMetadata(
    "O nas | Let's Gol",
    "Dwie dekady przyjaźni, piłka, podróże i wyjazdy organizowane tak, jak sami chcielibyśmy pojechać na mecz.",
    "/o-nas"
  ),
}

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
              description:
                "Historia Łukasza i Mateusza, których przyjaźń, piłka nożna i wspólne podróże dały początek Let's Gol.",
              mainEntity: {
                "@id": "https://letsgol.eu/#organization",
              },
            },
          ],
        }}
      />

      <SiteHeader />

     <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-foreground pt-20 text-white lg:min-h-[100svh]">
  <div className="absolute inset-x-0 bottom-0 top-20">
    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie-mobile.webp"
      alt="Łukasz i Mateusz na trybunach stadionu w Barcelonie"
      fill
      priority
      quality={90}
      className="object-cover object-[33%_35%] md:hidden"
      sizes="100vw"
    />

    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie.webp"
      alt="Łukasz i Mateusz na trybunach stadionu w Barcelonie"
      fill
      priority
      className="hidden object-cover object-[50%_100%] md:block"
      sizes="100vw"
    />

    <div className="absolute inset-0 bg-black/20" />

    

    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black via-black/65 to-transparent" />
  </div>

  <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 md:px-6 md:pb-20 lg:pb-24">
    <p className="eyebrow eyebrow-on-dark">
      Nasza historia
    </p>

    <h1 className="mt-5 max-w-5xl text-balance font-sans text-4xl font-black uppercase leading-[1.2] tracking-normal sm:text-6xl lg:text-6xl lg:leading-none">
      Zaczęło się od przyjaźni i wspólnej pasji
    </h1>

    <div className="mt-6 flex max-w-3xl flex-col gap-6 border-l-4 border-primary pl-5 md:flex-row md:items-end md:justify-between md:pl-7">
      <p className="text-lg leading-8 text-white/85 md:text-xl">
        Kiedyś jeździliśmy na mecze, spełniając własne marzenia. <br /> Dziś zabieramy Was, żebyście mogli spełniać swoje.
      </p>
    </div>
  </div>
</section>

      <section id="nasza-historia" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Blisko 20 lat razem</p>
           <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  Znamy się jak "łyse konie"
</h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7 lg:pt-3">
            <p>
             Łączy nas wieloletnia przyjaźń, piłka nożna i pasja do podróżowania. Przez lata odwiedziliśmy dziesiątki stadionów, przeżyliśmy setki piłkarskich emocji i przekonaliśmy się, że najlepsze wspomnienia powstają wtedy, kiedy dzieli się je z innymi.
            </p>
            <p>
              Lubimy dobrą atmosferę, poznawanie nowych miejsc i ludzi. Każdy wyjazd traktujemy jak kolejną historię, którą warto zapamiętać.
            </p>
            <p className="font-sans text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              I właśnie z tej pasji powstało Let&apos;s Gol.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-secondary/55 py-16 md:py-24">
  <div className="mx-auto max-w-7xl px-4 md:px-6">
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
      <div className="lg:col-span-7">
        <p className="eyebrow">Zaczęło się od marzenia</p>

        <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
          Dziś spełniamy je
          <br />
          Razem z wami
        </h2>
      </div>

      <div className="lg:col-span-5 lg:pb-1">
        <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          Piłka i wspólne wyjazdy były z nami na długo przed powstaniem
          Let&apos;s Gol. Zmieniło się jedno - dziś te emocje przeżywamy razem
          z Wami.
        </p>
      </div>
    </div>

    <div className="mt-10 md:mt-14">
      <AboutStorySlider />
    </div>

    <div className="mt-8 grid gap-6 border-t border-foreground/15 pt-7 md:grid-cols-2 md:gap-12">
      <div>
        <p className="font-sans text-xl font-black uppercase md:text-2xl">
          Zaczęło się dużo wcześniej
        </p>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
          Pierwsze mecze, stadiony i wspólne podróże. Bez planu na firmę,
          po prostu z zajawki, która została z nami na lata.
        </p>
      </div>

      <div className="md:text-right">
        <p className="font-sans text-xl font-black uppercase md:text-2xl">
          Dzisiaj robimy to dalej
        </p>

        <p className="mt-3 ml-auto max-w-lg text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
          Nadal jeździmy na stadiony. Tyle że dziś wykorzystujemy własne
          doświadczenie, żeby zabierać tam również innych kibiców.
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow">Po co powstało Let&apos;s Gol?</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  Żebyście mogli przeżywać mecz, a nie organizację
</h2>
          </div>

          <div className="space-y-7 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7">
            <p>
              Wiemy, ile emocji daje wyjazd na mecz ukochanej drużyny. <br />Wiemy też, ile czasu i nerwów potrafi kosztować jego organizacja.
<br />Dlatego stworzyliśmy Let’s Gol - żebyście mogli skupić się na tym, co najważniejsze: emocjach, atmosferze stadionu i spełnianiu piłkarskich marzeń.
            </p>
            <p className="font-sans text-3xl font-black uppercase text-foreground md:text-4xl">
              Od tego jesteśmy my.
            </p>
            <p>
              Zadbamy o Wasz wyjazd od A do Z. Przelot, nocleg, bilety i wszystkie najważniejsze szczegóły. 
Od pierwszych przygotowań aż po ostatni gwizdek, ciągle jesteśmy z Wami.
Let’s Gol pilnuje szczegółów - Ty tylko przeżywasz mecz.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-foreground py-16 text-background md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="eyebrow eyebrow-on-dark">Nasza zasada</p>
          <blockquote className="mt-7 max-w-5xl text-balance font-sans text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            „Tak, jak sami chcielibyśmy pojechać na mecz.”
          </blockquote>
          <p className="mt-8 max-w-2xl text-base leading-7 text-background/65 md:text-lg">
            Nie proponujemy Wam niczego, czego sami byśmy nie wybrali. Prosta zasada, której trzymamy się przy każdym wyjeździe.
          </p>
        </div>
      </section>

      <section className="bg-secondary/35 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Poznajcie nas"
            title="Dwie twarze Let's Gol"
            intro="Dwie osoby, różne zadania, jednen wspólny cel - zabierać Was tam, gdzie piłkarskie emocje przeżywa się naprawdę. Każdy z nas odpowiada za inną część wyjazdu, a razem tworzymy Let’s Gol."
            align="left"
          />

          <div className="mt-12 border-y border-foreground/20">
            <article className="grid gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-16">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted lg:col-span-5">
                <Image
                  src="/images/o-nas/mateusz-wspolzalozyciel.webp"
                  alt="Mateusz, współzałożyciel i główny koordynator wyjazdów Let's Gol"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="flex flex-col justify-center lg:col-span-7">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Współzałożyciel Let&apos;s Gol
                </p>
                <h3 className="mt-2 font-sans text-5xl font-black uppercase leading-none md:text-7xl">
                  Mateusz
                </h3>
               <p className="mt-4 font-sans text-xl font-black uppercase leading-tight text-amber-800 md:text-2xl">
  Główny koordynator wyjazdów
</p>

<div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
  <p>
    Do tańca i do różańca. Gdy trzeba coś załatwić, znaleźć rozwiązanie
    albo szybko zareagować - Mateusz prawdopodobnie już to robi.
  </p>

  <p>
    Podczas wyjazdów odpowiada przede wszystkim za Was na miejscu,
    organizację, wspólne zwiedzanie, dobrą atmosferę i to, żebyście mogli
    skupić się na tym, po co przyjechaliście: emocjach i spełnianiu
    piłkarskich marzeń.
  </p>

  <p>
    Szczególne miejsce zajmuje u niego Barcelona. Po latach regularnych
    podróży zna ją od podszewki i chętnie pokaże Wam miejsca, których nie
    znajdziecie w pierwszym lepszym przewodniku.
  </p>

  <p className="font-bold text-foreground">
    Jego zadanie? Sprawić, żeby wyjazd, na który czekaliście miesiącami,
    stał się wspomnieniem, do którego będziecie wracać przez lata.
  </p>
</div>
              </div>
            </article>

            <article className="grid gap-8 border-t border-foreground/20 py-10 md:py-14 lg:grid-cols-12 lg:gap-16">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted lg:order-2 lg:col-span-5">
                <Image
                  src="/images/o-nas/lukasz-wspolzalozyciel.webp"
                  alt="Łukasz, współzałożyciel i dyrektor organizacyjny Let's Gol"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="flex flex-col justify-center lg:order-1 lg:col-span-7">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Współzałożyciel Let&apos;s Gol
                </p>
                <h3 className="mt-2 font-sans text-5xl font-black uppercase leading-none md:text-7xl">
                  Łukasz
                </h3>
                <p className="mt-4 font-sans text-xl font-black uppercase leading-tight text-amber-800 md:text-2xl">
                  Dyrektor organizacyjny
                </p>

                <div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
                <p>
  Jeśli Mateusz dba o to, żebyście przeżywali wyjazd, Łukasz dba o to,
  żeby wszystko, co do niego prowadzi, było dopięte na ostatni guzik.
</p>

<p>
  To on odpowiada za loty, sprawdzone noclegi, bilety, miejsca na stadionie
  i wszystkie szczegóły, które zamieniają plan wyjazdu w spełnione
  piłkarskie marzenie.
</p>

<p className="font-bold text-foreground">
  Krótko mówiąc: zanim Wy zaczniecie odliczać dni do wyjazdu, Łukasz już
  pilnuje, żeby wszystko było gotowe.
</p>

<p>
  A kiedy przychodzi dzień meczu, nie zostaje za biurkiem. Regularnie rusza
  z nami na stadiony Europy i razem z Mateuszem jest do Waszej dyspozycji
  również na miejscu.
</p>

<p className="font-bold text-foreground">
  Jego zadanie? Dopiąć każdy szczegół, żeby między Wami a wymarzonym meczem
  zostało już tylko odliczanie dni do wyjazdu.
</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-black uppercase tracking-widest">
              Łukasz + Mateusz = Let&apos;s Gol
            </p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  Dwa różne charaktery. Jedna wspólna zajawka.
</h2>
          </div>

          <div className="lg:col-span-7">
            <p className="font-sans text-3xl font-black uppercase leading-tight md:text-5xl">
              Piłka. Podróże. Ludzie. Emocje.
            </p>
            <div className="mt-8 space-y-5 text-base leading-8 md:text-lg">
              <p>
                Nie chcemy być firmą, która tylko sprzeda Ci wyjazd i powie
                „do zobaczenia”. Chcemy, żebyś po powrocie pomyślał:
              </p>
              <blockquote className="border-l-4 border-foreground pl-5 font-sans text-3xl font-black uppercase leading-tight md:text-4xl">
                „To było coś więcej niż mecz.”
              </blockquote>
              <p>Bo właśnie takie wyjazdy lubimy najbardziej.</p>
            </div>
          </div>
        </div>
      </section>

      {galleryImages.length ? (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Dalszy ciąg historii"
                title="Teraz przeżywamy to razem"
                intro="Stadiony, miasta i ludzie, z którymi dzielimy kolejne piłkarskie podróże."
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

            <div className="mt-10 grid gap-3 md:grid-cols-12">
              {galleryImages.map((item, index) => (
                <figure
                  key={item.id}
                  className={`relative min-h-72 overflow-hidden rounded-xl bg-muted ${
                    index === 0 ? "md:col-span-6" : "md:col-span-3"
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
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/75 to-transparent" />
                  {item.title || item.city ? (
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">
                      {[item.title, item.city].filter(Boolean).join(" · ")}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-foreground py-14 text-background md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-on-dark">
              Napiszmy kolejny rozdział razem
            </p>
            <h2 className="mt-4 text-balance font-sans text-4xl font-black uppercase leading-none md:text-6xl">
              Jaki mecz chodzi Ci po głowie?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-12 gap-3 bg-primary px-6 text-primary-foreground hover:bg-primary/85"
              nativeButton={false}
              render={<Link href="/wyjazdy" />}
            >
              Zobacz wyjazdy
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-background/30 bg-transparent px-6 text-background hover:bg-background hover:text-foreground"
              nativeButton={false}
              render={<button type="button" data-open-floating-contact />}
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
