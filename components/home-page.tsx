import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Headphones,
  MapPinned,
  Plane,
  ShieldCheck,
  Star,
  TicketCheck,
  Trophy,
  Users,
  WalletCards,
} from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SocialLinks } from "@/components/social-links"
import { TripCard } from "@/components/trip-card"
import { SectionHeading } from "@/components/section-heading"
import { InquiryForm } from "@/components/inquiry-form"
import { ImageLightbox } from "@/components/image-lightbox"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import type { SiteContent, YouTubeVideo } from "@/lib/content"
import type { Trip } from "@/lib/trips"

const trust = [
  [Users, "Setki zadowolonych klientów"],
  [TicketCheck, "Gwarantowane bilety na mecz"],
  [Headphones, "Opieka koordynatora"],
  [ShieldCheck, "Legalny organizator turystyki"],
] as const

const reasons = [
  [
    Plane,
    "Kompleksowa organizacja",
    "Lot, hotel, bilet i transfery w jednej, sprawdzonej rezerwacji.",
  ],
  [
    TicketCheck,
    "Pewne bilety",
    "Miejsca z legalnego źródła i jasna kategoria biletu.",
  ],
  [
    Building2,
    "Sprawdzone hotele",
    "Dobre lokalizacje i standard dopasowany do charakteru wyjazdu.",
  ],
  [
    Headphones,
    "Koordynator na miejscu",
    "Polskojęzyczna pomoc od odprawy aż po powrót.",
  ],
  [
    Star,
    "Doświadczenie kibiców",
    "Program układamy tak, jak sami chcielibyśmy podróżować.",
  ],
  [
    ShieldCheck,
    "Bezpieczna podróż",
    "Umowa, ubezpieczenie i gwarancja turystyczna.",
  ],
] as const

const process = [
  [
    "01",
    "Wybierasz mecz",
    "Z gotowej oferty albo wskazujesz wydarzenie spoza kalendarza.",
  ],
  [
    "02",
    "Dopasowujemy pakiet",
    "Ustalamy lotnisko, hotel, kategorię biletu i liczbę noclegów.",
  ],
  [
    "03",
    "Potwierdzasz rezerwację",
    "Dostajesz przejrzystą umowę, harmonogram płatności i dokumenty.",
  ],
  [
    "04",
    "Lecisz po emocje",
    "Koordynator czuwa nad logistyką, a Ty skupiasz się na meczu.",
  ],
] as const

const faqs = [
  [
    "Czy bilet na mecz jest gwarantowany?",
    "Tak. Każda potwierdzona rezerwacja obejmuje bilet z legalnego źródła, a jego kategorię określamy w umowie.",
  ],
  [
    "Z jakich miast organizujecie wyloty?",
    "Najczęściej z Warszawy, Krakowa, Katowic, Gdańska, Poznania i Wrocławia. Przy wyjazdach indywidualnych szukamy najlepszego połączenia z Twojego regionu.",
  ],
  [
    "Czy mogę kupić sam bilet?",
    "Tak. Przy wybranych wydarzeniach przygotowujemy ofertę samych biletów, bez lotu i hotelu.",
  ],
  [
    "Czy organizujecie wyjazdy dla firm i grup?",
    "Tak. Obsługujemy grupy znajomych, firmy, szkółki piłkarskie i kluby kibica, także z programem szytym na miarę.",
  ],
  [
    "Co jeśli termin meczu zostanie zmieniony?",
    "Monitorujemy oficjalne komunikaty ligowe i dobieramy elastyczną logistykę. O każdej zmianie informujemy od razu i proponujemy najlepsze rozwiązanie.",
  ],
] as const

type GalleryItem = {
  id: number
  title: string
  city: string
  image: string
  mediaId: number | null
  alt: string
}

type Testimonial = {
  id: number
  author: string
  tripName: string
  content: string
  rating: number
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: -1,
    image: "/images/barcelona-trip.webp",
    mediaId: null,
    alt: "Stadion w Barcelonie",
    title: "Barcelona",
    city: "Barcelona",
  },
  {
    id: -2,
    image: "/images/milan-trip.webp",
    mediaId: null,
    alt: "Wieczór meczowy w Mediolanie",
    title: "Mediolan",
    city: "Mediolan",
  },
  {
    id: -3,
    image: "/images/madrid-trip.webp",
    mediaId: null,
    alt: "Stadion w Madrycie",
    title: "Madryt",
    city: "Madryt",
  },
]


function HomeGallery({ gallery }: { gallery: GalleryItem[] }) {
  const items = (gallery.length ? gallery : FALLBACK_GALLERY).slice(0, 5)
  const featureFirst = items.length >= 3

  return (
    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, index) => {
        const isFeatured = featureFirst && index === 0

        return (
          <div
            key={item.id}
            className={`relative aspect-square overflow-hidden rounded-xl ${
              isFeatured
                ? "col-span-2 sm:col-span-2 sm:aspect-[2/1]"
                : ""
            }`}
          >
            <ImageLightbox
              src={item.mediaId ? `/api/media/${item.mediaId}` : item.image}
              alt={item.alt || item.title}
              caption={[item.title, item.city].filter(Boolean).join(" · ")}
            >
              <Image
                src={item.mediaId ? `/api/media/${item.mediaId}` : item.image}
                alt={item.alt || item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={isFeatured ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"}
              />
            </ImageLightbox>
          </div>
        )
      })}
    </div>
  )
}

export function HomePage({
  trips,
  content,
  gallery,
  testimonials,
  videos,
}: {
  trips: Trip[]
  content: SiteContent
  gallery: GalleryItem[]
  testimonials: Testimonial[]
  videos: YouTubeVideo[]
}) {
  return (
    <main>

      <SiteHeader />

  
      <section className="relative isolate flex flex-col overflow-hidden bg-foreground text-background md:h-dvh md:min-h-[700px]">
        <Image
  src="/images/hero-stadium.webp"
  alt="Kibice na trybunach podczas wieczornego meczu w Barcelonie"
  fill
  priority
  className="object-cover object-center"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
/>

        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/75 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-foreground to-transparent" />

        <div className="relative mx-auto flex min-h-svh w-full flex-1 items-center px-4 pb-14 pt-28 md:min-h-0 md:px-6 md:pb-8 md:pt-24 lg:max-w-7xl">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-primary">
              {content.heroEyebrow ||
                "Mecz zaczyna się dużo wcześniej niż pierwszy gwizdek"}
            </p>

            <h1 className="text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[88px]">
              {content.heroTitle ||
                "Leć z nami na największe mecze w Europie"}
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-background/75">
              {content.heroDescription || ""}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-13 rounded-md px-6 font-bold uppercase"
                nativeButton={false}
                render={<Link href="#wyjazdy" />}
              >
                <span className="inline-flex items-center gap-2">
                  {content.heroCta || "Zobacz wyjazdy"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-md border-background/35 bg-foreground/20 px-6 font-bold uppercase text-background hover:bg-background hover:text-foreground"
                nativeButton={false}
                render={<Link href="#kontakt" />}
              >
                Wyceń mój wyjazd
              </Button>
            </div>

            <div className="hidden items-center gap-4 border-t border-background/20 pt-5 md:flex">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-background/65">
                Obserwuj nas
              </p>

              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="relative border-t border-background/15 bg-foreground/75 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
            {trust.map(([Icon, text]) => (
              <div
                key={text}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left"
              >
                <Icon className="text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section
        id="wyjazdy"
        className="scroll-mt-8 bg-background px-4 py-20 md:px-6 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Kalendarz emocji"
            title={content.tripsTitle || "Najbliższe wyjazdy"}
            intro={
              content.tripsDescription ||
              "Wybierz gotowy pakiet i zajmij miejsce na trybunach największych stadionów Europy."
            }
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/wyjazdy" />}
            >
              Zobacz wszystkie wyjazdy
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

 
      <section className="bg-secondary px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative min-h-[430px] overflow-hidden rounded-xl">
            <Image
  src="/images/about-us.webp"
  alt="Trybuny stadionu Camp Nou Let's Gol"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
/>

            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />

            <p className="absolute bottom-6 left-6 max-w-sm font-sans text-3xl font-black uppercase text-background">
              Twój mecz. Twój termin. Nasza logistyka.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            <SectionHeading
              eyebrow="Zrób to po swojemu"
              title={
                content.customTripTitle ||
                "Nie ma meczu na liście? Zorganizujemy go dla Ciebie"
              }
              intro="Powiedz, gdzie chcesz lecieć. Przygotujemy indywidualny pakiet z lotem, hotelem, biletem i opieką."
              align="left"
            />

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Dowolny klub i liga",
                "Elastyczne lotniska",
                "Wybrany standard hotelu",
                "Bilety w kilku kategoriach",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <Check className="text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              className="w-fit"
              size="lg"
              nativeButton={false}
              render={<Link href="#kontakt" />}
            >
              Poproś o wycenę
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>


      <section
        id="bilety"
        className="bg-background px-4 py-20 md:px-6"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <article className="flex flex-col gap-5 rounded-xl border bg-card p-7 md:p-10">
            <TicketCheck className="text-primary" aria-hidden="true" />

            <h2 className="font-sans text-3xl font-black uppercase">
              Kup same bilety
            </h2>

            <p className="leading-relaxed text-muted-foreground">
              Masz już lot i hotel? Znajdziemy pewne miejsca na wybrany mecz
              i jasno określimy kategorię oraz sposób dostawy.
            </p>

            <Button
              variant="outline"
              className="mt-auto w-fit"
              nativeButton={false}
              render={<Link href="#kontakt" />}
            >
              Zapytaj o bilety
            </Button>
          </article>

          <article
            id="grupy"
            className="flex flex-col gap-5 rounded-xl bg-foreground p-7 text-background md:p-10"
          >
            <Users className="text-primary" aria-hidden="true" />

            <h2 className="font-sans text-3xl font-black uppercase">
              Wyjazdy dla grup i firm
            </h2>

            <p className="leading-relaxed text-background/65">
              Integracja, wyjazd klientów, szkółka piłkarska lub ekipa
              znajomych. Zapewniamy spójną logistykę, rezerwacje grupowe
              i dedykowanego opiekuna.
            </p>

            <Button
              className="mt-auto w-fit"
              nativeButton={false}
              render={<Link href="#kontakt" />}
            >
              Przygotuj wyjazd grupowy
            </Button>
          </article>
        </div>
      </section>

    
      <section className="bg-foreground px-4 py-20 text-background md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Wszystko w jednym"
            title={
              content.packageTitle ||
              "Co zawiera pełny pakiet?"
            }
            inverse
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Plane, "Przelot"],
              [TicketCheck, "Bilet na mecz"],
              [Building2, "Sprawdzony hotel"],
              [Headphones, "Opieka koordynatora"],
              [MapPinned, "Transfery lokalne"],
              [ShieldCheck, "Ubezpieczenie"],
              [CalendarCheck, "Plan podróży"],
              [WalletCards, "Przejrzyste płatności"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Plane

              return (
                <div
                  key={label as string}
                  className="flex items-center gap-3 rounded-lg border border-background/15 p-4"
                >
                  <I className="text-primary" aria-hidden="true" />
                  <span className="font-semibold">
                    {label as string}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      <section className="bg-background px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Dlaczego my"
            title={
              content.benefitsTitle ||
              "Let’s Gol pilnuje szczegółów. Ty przeżywasz mecz."
            }
          />

          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map(([Icon, title, copy]) => (
              <article key={title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" />
                </span>

                <div>
                  <h3 className="font-bold uppercase">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHeading
              eyebrow="Z pierwszego rzędu"
              title={
                content.galleryTitle ||
                "Galeria z wyjazdów"
              }
              align="left"
            />

            <HomeGallery gallery={gallery} />

            <Button
              className="mt-6"
              variant="outline"
              nativeButton={false}
              render={<Link href="/galeria" />}
            >
              Zobacz całą galerię
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="flex flex-col justify-center">
            <SectionHeading
              eyebrow="Opinie klientów"
              title={
                content.testimonialsTitle ||
                "Emocje potwierdzone na trybunach"
              }
              align="left"
            />

            {(
              testimonials.length
                ? testimonials.slice(0, 2)
                : [
                    {
                      id: -1,
                      author: "Kamil",
                      tripName: "Barcelona",
                      content:
                        "Pierwszy wyjazd z Let’s Gol i na pewno nie ostatni. Wszystko dopięte, świetny hotel i koordynator zawsze pod telefonem. Polecam!",
                      rating: 5,
                    },
                  ]
            ).map((item) => (
              <blockquote
                key={item.id}
                className="mt-4 rounded-xl bg-card p-7 shadow-sm"
              >
                <div className="flex gap-1 text-primary">
  <span className="sr-only">
    Ocena {item.rating} na 5
  </span>

  {Array.from({ length: item.rating }).map((_, i) => (
    <Star
      key={i}
      fill="currentColor"
      aria-hidden="true"
    />
  ))}
</div>

                <p className="mt-5 text-lg leading-relaxed">
                  „{item.content}”
                </p>

                <footer className="mt-5 font-semibold">
                  {item.author}
                  {item.tripName ? ` · ${item.tripName}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Prosty plan"
            title={
              content.processTitle ||
              "Jak wygląda rezerwacja?"
            }
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {process.map(([number, title, copy]) => (
              <article
                key={number}
                className="rounded-xl border p-6"
              >
                <span className="font-mono text-3xl font-black text-primary [-webkit-text-stroke:1px_rgba(0,0,0,0.5)]">
                  {number}
                </span>

                <h3 className="mt-8 font-bold uppercase">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="o-nas"
        className="bg-secondary px-4 py-20 md:px-6"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="O nas"
              title={
                content.aboutTitle ||
                "Kibice, którzy zawodowo ogarniają podróże"
              }
              intro={
                content.aboutText ||
                "Let’s Gol powstało z prostego przekonania: droga na stadion powinna budować emocje, a nie stres. Łączymy znajomość futbolu z doświadczeniem w turystyce i bierzemy odpowiedzialność za każdy etap wyjazdu."
              }
              align="left"
            />

            <div className="mt-7 flex flex-wrap gap-6">
              <div>
                <strong className="text-3xl font-black">
                  42
                </strong>
                <p className="text-sm text-muted-foreground">
                  stadiony w ofercie
                </p>
              </div>

              <div>
                <strong className="text-3xl font-black">
                  4.9/5
                </strong>
                <p className="text-sm text-muted-foreground">
                  średnia ocen
                </p>
              </div>

              <div>
                <strong className="text-3xl font-black">
                  24/7
                </strong>
                <p className="text-sm text-muted-foreground">
                  pomoc w podróży
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
  src="/images/hero-stadium.webp"
  alt="Kibice Let’s Gol na stadionie"
  fill
  className="object-cover"
  sizes="(max-width: 1024px) 100vw, 50vw"
/>
          </div>
        </div>
      </section>


      <section
        id="faq"
        className="bg-background px-4 py-20 md:px-6"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1fr]">
          <SectionHeading
            eyebrow="FAQ"
            title={
              content.faqTitle ||
              "Najczęstsze pytania"
            }
            intro="Jeśli nie ma tu odpowiedzi, napisz lub zadzwoń. Odpowiadamy konkretnie."
            align="left"
          />

          <Accordion className="rounded-xl border px-5">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q}>
                <AccordionTrigger className="py-5 text-base">
                  {q}
                </AccordionTrigger>

                <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {videos.length > 0 && (
        <section className="bg-secondary px-4 py-20 md:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Zobacz atmosferę"
              title={
                content.youtubeTitle ||
                "Najnowsze na YouTube"
              }
              intro="Relacje, stadiony i emocje z naszych piłkarskich podróży."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-xl border bg-card"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={`Miniatura filmu: ${video.title}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4">
                    <h3 className="font-bold leading-snug">
                      {video.title}
                    </h3>

                    <ArrowRight className="shrink-0 text-primary" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}


      <section
        id="kontakt"
        className="bg-foreground px-4 py-20 text-background md:px-6 md:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Twój następny mecz
            </p>

            <h2 className="text-balance font-sans text-4xl font-black uppercase leading-tight md:text-6xl">
              {content.contactTitle ||
                "Zapytaj o swój wyjazd"}
            </h2>

            <p className="max-w-md leading-relaxed text-background/65">
              Wypełnij formularz, a przygotujemy propozycję dopasowaną
              do meczu, budżetu i lotniska wylotu.
            </p>

            <div className="flex items-center gap-3">
              <Trophy
                className="text-primary"
                aria-hidden="true"
              />
              <span>
                Odpowiedź zwykle w ciągu 24 godzin
              </span>
            </div>
          </div>

          <InquiryForm />
        </div>
      </section>


      <SiteFooter content={content} />
    </main>
  )
}
