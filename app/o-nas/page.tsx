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

     <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-foreground pt-20 text-white lg:min-h-180 xl:min-h-200">
  <Image
    src="/images/o-nas/lukasz-mateusz-na-stadionie-mobile.webp"
    alt="Łukasz i Mateusz na trybunach stadionu w Barcelonie"
    fill
    priority
    className="object-cover object-[43%_35%] md:hidden"
    sizes="100vw"
  />

  <Image
    src="/images/o-nas/lukasz-mateusz-na-stadionie.webp"
    alt="Łukasz i Mateusz na trybunach stadionu w Barcelonie"
    fill
    priority
    className="hidden object-cover object-center md:block"
    sizes="100vw"
  />

  <div className="absolute inset-0 bg-black/35" />
  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black via-black/65 to-transparent" />

  <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 md:px-6 md:pb-20 lg:pb-24">
    <p className="eyebrow eyebrow-on-dark">Nasza historia</p>

    <h1 className="mt-5 max-w-5xl text-balance font-sans text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-8xl">
      Zaczęło się od przyjaźni i wspólnej pasji
    </h1>

    <div className="mt-6 flex max-w-3xl flex-col gap-6 border-l-4 border-primary pl-5 md:flex-row md:items-end md:justify-between md:pl-7">
      <p className="text-lg leading-8 text-white/85 md:text-xl">
        Dziś zabieramy Was na największe stadiony Europy.
      </p>

      <Link
        href="#nasza-historia"
        className="group inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"
      >
        Poznaj naszą historię

        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>
  </div>
</section>

      <section id="nasza-historia" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Blisko 20 lat razem</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Znamy się jak "łyse konie"
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7 lg:pt-3">
            <p>
              Łączy nas przyjaźń, piłka nożna i ciągła potrzeba
              przeżywania czegoś nowego. Przez lata odwiedziliśmy niejeden
              stadion w Europie, zaliczyliśmy mnóstwo meczów i piłkarskich
              podróży.
            </p>
            <p>
              Lubimy dobrą atmosferę, poznawanie nowych miejsc i ludzi.
              Nudy raczej nie tolerujemy.
            </p>
            <p className="font-sans text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              I właśnie z tego powstało Let&apos;s Gol.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-secondary/55 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-4xl">
            <p className="eyebrow">Ta sama historia, kolejny rozdział</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Jedna przyjaźń. Ta sama pasja.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Kiedyś jeździliśmy na mecze tylko dla siebie. Dziś zabieramy
              na stadiony również innych.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-6 md:grid-cols-12 md:gap-8">
            <figure className="md:col-span-5">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted shadow-xl">
                <Image
                  src="/images/o-nas/lukasz-mateusz-archiwum.webp"
                  alt="Łukasz i Mateusz jako młodzi kibice FC Barcelony"
                  fill
                  className="object-cover object-[60%_10%]"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-foreground/20 pt-3">
                <span className="font-sans text-2xl font-black uppercase">
                  Wtedy
                </span>
                <span className="text-right text-sm text-muted-foreground">
                 Wspólne zamiłowanie do piłki nożnej od dziecka
                </span>
              </figcaption>
            </figure>

           <figure className="md:col-span-7 md:mt-24">
  <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted shadow-xl md:aspect-video">
    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie-mobile.webp"
      alt="Łukasz i Mateusz współcześnie na stadionie FC Barcelony"
      fill
      className="scale-110 object-cover object-[43%_35%] md:hidden"
      sizes="100vw"
    />

    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie.webp"
      alt="Łukasz i Mateusz współcześnie na stadionie FC Barcelony"
      fill
      className="hidden scale-270 object-cover object-center md:block"
      sizes="(max-width: 1279px) 58vw, 720px"
    />
  </div>

  <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-foreground/20 pt-3">
    <span className="font-sans text-2xl font-black uppercase">
      Dzisiaj
    </span>

    <span className="text-right text-sm text-muted-foreground">
      Nadal razem, teraz jako ekipa Let&apos;s Gol
    </span>
  </figcaption>
</figure>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow">Po co powstało Let&apos;s Gol?</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Żebyście mogli przeżywać mecz, a nie organizację
            </h2>
          </div>

          <div className="space-y-7 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7">
            <p>
              Chcieliśmy stworzyć wyjazdy dla zwykłych kibiców, którzy marzą
              o zobaczeniu swojej drużyny na żywo, ale niekoniecznie chcą
              spędzać wieczory na szukaniu lotów, hoteli, biletów, transferów
              i zastanawianiu się, czy wszystko na pewno się zgadza.
            </p>
            <p className="font-sans text-3xl font-black uppercase text-foreground md:text-4xl">
              Od tego jesteśmy my.
            </p>
            <p>
              Zorganizujemy Wasz wyjazd od A do Z, zadbamy o szczegóły
              i będziemy z Wami przed podróżą oraz podczas niej.
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
            To najprostsza miara każdej decyzji - od wyboru lotu i hotelu po
            atmosferę na miejscu.
          </p>
        </div>
      </section>

      <section className="bg-secondary/35 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow="Poznajcie nas"
            title="Dwie twarze Let's Gol"
            intro="Dwa różne charaktery i dwa uzupełniające się spojrzenia na dobry wyjazd. Każdy z nas odpowiada za inną część całości, ale obaj jedziemy w tym samym kierunku."
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
                    Człowiek od zadań specjalnych i zdecydowanie ktoś,
                    z kim trudno się nudzić. Do tańca i do różańca - gdy coś
                    trzeba załatwić, znaleźć albo szybko ogarnąć, Mateusz
                    prawdopodobnie już to robi.
                  </p>
                  <p>
                    Jako główny koordynator dba przede wszystkim o Was na
                    miejscu - atmosferę, organizację, wspólne zwiedzanie
                    i komfort całej grupy.
                  </p>
                  <p>
                    Szczególne miejsce zajmuje u niego Barcelona. Zna jej
                    zakamarki jak mało kto, dlatego podczas naszych katalońskich
                    wyjazdów możecie liczyć nie tylko na mecz, ale również na
                    poznanie miasta od najlepszej strony.
                  </p>
                  <p className="font-bold text-foreground">
                    Jego zadanie? Żebyście Wy mogli cieszyć się wyjazdem,
                    a reszta była po naszej stronie.
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
                    Jeśli Mateusz jest człowiekiem od zadań specjalnych na
                    miejscu, Łukasz pilnuje, żeby cała układanka zagrała jeszcze
                    przed wylotem.
                  </p>
                  <p>
                    Odpowiada za logistyczne i organizacyjne zabezpieczenie
                    naszych wyjazdów - dobór lotów, sprawdzone noclegi, bilety
                    i miejsca na stadionie oraz wszystkie elementy, które trzeba
                    połączyć, żeby podróż przebiegła tak, jak powinna.
                  </p>
                  <p className="font-bold text-foreground">
                    Krótko mówiąc: ma być dopięte od A do Z.
                  </p>
                  <p>
                    Podczas wyjazdu również pozostaje do Waszej dyspozycji,
                    a walizka koordynatora nie jest mu obca - regularnie możecie
                    spotkać go razem z grupą na stadionach Europy.
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
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
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
