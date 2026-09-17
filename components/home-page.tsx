
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
  Ticket,
Hotel,
  Trophy,
  Users,
  CircleCheckBig,
  Landmark,
  User,
BriefcaseBusiness,
GraduationCap,
} from "lucide-react"

import { TestimonialsCarousel } from "@/components/testimonials-carousel"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SocialLinks } from "@/components/social-links"
import { HomeTripCalendar } from "@/components/home-trip-calendar"
import { SectionHeading } from "@/components/section-heading"
import { InquiryForm } from "@/components/inquiry-form"
import { ImageLightbox } from "@/components/image-lightbox"
import {
  HeroBackgroundSlider,
  HeroTypewriter,
} from "@/components/hero-background-slider"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import type { SiteContent, YouTubeVideo } from "@/lib/content"
import type { Trip } from "@/lib/trips"
import { getPackageVariants } from "@/lib/package-options"

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
    "1",
    "Wybierasz mecz",
    "Z gotowej oferty albo wskazujesz wydarzenie spoza kalendarza.",
  ],
  [
    "2",
    "Ustalamy szczegóły",
    "Wybieramy lotnisko, hotel, kategorię biletu i liczbę noclegów.",
  ],
   [
    "3",
    "Otrzymujesz ofertę",
    "Prezentujemy Ci kompleksową ofertę podróży dopasowaną do twoich potrzeb.",
  ],
  [
    "4",
    "Podpisujemy umowę online",
    "Dostajesz przejrzystą umowę, komplet dokumentów",
  ],
  [
    "5",
    "Wpłacasz zaliczkę",
    "Zaliczka pokrywa koszta biletów na mecz i podróży",
  ],
  [
    "6",
    "Lecimy na mecz",
    "Koordynator czuwa nad logistyką, a Ty skupiasz się na meczu.",
  ],
] as const

const faqs = [
  [
    "Jak zarezerwować wyjazd?",
    "Wybierz wyjazd z kalendarza i wyślij formularz albo skontaktuj się z nami, jeśli interesuje Cię inne wydarzenie. Po sprawdzeniu dostępności otrzymasz ofertę z zakresem pakietu, ceną i kolejnymi krokami.",
  ],
  [
    "Kiedy rezerwacja jest potwierdzona?",
    "Rezerwacja jest potwierdzona zgodnie z warunkami wskazanymi w przekazanej ofercie i umowie. Samo wysłanie formularza nie oznacza jeszcze rezerwacji miejsca.",
  ],
  [
    "Czy bilet na mecz jest zawarty w cenie?",
    "Zależy to od wybranego wariantu. Zakres każdego pakietu jest pokazany na stronie konkretnego wyjazdu i potwierdzony w ofercie oraz umowie.",
  ],
  [
    "Skąd odbywa się wyjazd?",
    "Lotnisko lub miejsce zbiórki zależy od konkretnego wyjazdu i wybranego wariantu. Przy ofercie indywidualnej sprawdzamy rozwiązania dogodne dla miejsca zamieszkania uczestników.",
  ],
  [
    "Czy potrzebuję dowodu osobistego czy paszportu?",
    "Wymagany dokument zależy od kraju, obywatelstwa i aktualnych przepisów. Przed podróżą sprawdź oficjalne wymagania dla kierunku oraz upewnij się, że dokument jest ważny przez wymagany okres.",
  ],
  [
    "Czy godzina meczu może się zmienić?",
    "Tak. Organizator rozgrywek, nadawca lub klub może zmienić godzinę spotkania także po opublikowaniu wstępnego terminarza. Warto zachować elastyczność przy planowaniu dodatkowych aktywności.",
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

function HomeGallery({ gallery }: { gallery: GalleryItem[] }) {
  const items = gallery.slice(0, 8)

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const src = item.mediaId
          ? `/api/media/${item.mediaId}`
          : item.image

        return (
          <figure
            key={item.id}
            className="group relative aspect-4/3 overflow-hidden rounded-xl"
          >
            <ImageLightbox
              src={src}
              alt={item.alt || item.title}
              caption={[item.title, item.city]
                .filter(Boolean)
                .join(" · ")}
            >
              <Image
                src={src}
                alt={item.alt || item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-75" />
            </ImageLightbox>

            {(item.title || item.city) && (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.title && (
                  <p className="text-sm font-bold text-white">
                    {item.title}
                  </p>
                )}

                {item.city && (
                  <p className="mt-1 text-xs text-white/70">
                    {item.city}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
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
  const parsedFacebookReviewsCount = Number.parseInt(
    content.facebookReviewsCount ?? "",
    10
  )

  const facebookReviewsCount = Number.isFinite(parsedFacebookReviewsCount)
    ? Math.max(0, parsedFacebookReviewsCount)
    : 172
const parsedFacebookReviewsAverage = Number.parseFloat(
  content.facebookReviewsAverage ?? ""
)

const facebookReviewsAverage = Number.isFinite(parsedFacebookReviewsAverage)
  ? Math.min(5, Math.max(0, parsedFacebookReviewsAverage)).toFixed(1)
  : "5.0"
  return (
    <main>
      <SiteHeader />

      <section className="relative isolate flex flex-col overflow-hidden bg-section-dark text-background md:h-dvh md:min-h-175">
        <HeroBackgroundSlider />

        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/75 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-foreground to-transparent" />

        <div className="relative mx-auto flex min-h-svh w-full flex-1 items-center px-4 pb-14 pt-28 md:min-h-0 md:px-6 md:pb-8 md:pt-24 lg:max-w-7xl">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <HeroTypewriter eyebrow={content.heroEyebrow} />

            <h1 className="text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[88px]">
              {content.heroTitle ||
                "Leć z nami na największe mecze w Europie"}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-13 rounded-md px-6 font-bold uppercase"
                nativeButton={false}
                render={<Link href="/wyjazdy" />}
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
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
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

        <div className="absolute bottom-28 right-4 z-10 hidden md:block lg:right-8">
          <div className="border border-background/15 bg-foreground/85 px-5 py-4 text-background shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Star
                className="size-5 text-primary"
                fill="currentColor"
                aria-hidden="true"
              />

              <span className="text-lg font-black">
                100% poleca
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-background/60">
              {facebookReviewsCount} opinii na Facebooku
            </p>

            <div className="mt-3 border-t border-background/10 pt-3">
              <p className="text-lg font-black">
                5 000+
              </p>

              <p className="text-xs font-medium text-background/60">
                obserwujących na Facebooku
              </p>
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
  className="relative scroll-mt-20 bg-section-light px-4 py-16 md:px-6 md:py-20"
>
<div className="mx-auto max-w-7xl">
  <div className="flex flex-col items-center text-center">
    <SectionHeading
      eyebrow="Terminarz meczowych podróży"
      title="Kalendarz wyjazdów"
      intro={
        content.tripsDescription ||
        "Wybierz termin i sprawdź dokładny zakres dostępnego pakietu."
      }
      align="center"
    />
  </div>

  <HomeTripCalendar trips={trips} />

  <div className="mt-8 flex justify-center">
    <Button
      variant="outline"
      size="lg"
      nativeButton={false}
      render={<Link href="/wyjazdy" />}
    >
      <span className="inline-flex items-center gap-2">
        Wszystkie wyjazdy
        <ArrowRight className="size-4 shrink-0" />
      </span>
    </Button>
  </div>
</div>
</section>

<section
  id="twoj-wyjazd"
  className="scroll-mt-20 bg-secondary/60 px-4 py-16 md:px-6 md:py-20"
>
  <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
    <div className="relative min-h-105 overflow-hidden rounded-xl">
      <Image
        src="/images/about-us.webp"
        alt="Podróż kibiców na mecz"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 45vw"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />

      <div className="absolute bottom-5 left-5 right-5 text-white md:bottom-6 md:left-6 md:right-6">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
          Let&apos;s Gol
        </p>

        <p className="mt-1.5 max-w-md text-xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white md:text-2xl">
          Ty wybierasz mecz.
          <br />
          My organizujemy wyjazd.
        </p>
      </div>
    </div>

    <div>
      <p className="eyebrow">
        Wyjazd indywidualny
      </p>

      <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[0.96] tracking-tight md:text-6xl">
        Nie ma Twojego meczu w kalendarzu?
      </h2>

      <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
        Napisz, dokąd chcesz jechać i czego potrzebujesz. Sprawdzimy
        dostępność i przygotujemy zakres dopasowany do Twojego planu.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          "Dowolny klub i liga",
          "Dogodne miejsce startu",
          "Wybrany standard noclegu",
          "Zakres od biletu po pełny pakiet",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-sm font-semibold"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-primary">
              <Check
                className="size-3.5"
                strokeWidth={3}
                aria-hidden="true"
              />
            </span>

            {item}
          </div>
        ))}
      </div>

   <Button
  size="lg"
  className="mt-9 h-12 px-6"
  nativeButton={false}
  render={
    <button
      type="button"
      data-open-floating-contact
    />
  }
>
 <span className="inline-flex items-center gap-2">
  Opisz swój wyjazd
  <ArrowRight className="size-4 shrink-0" />
</span>
</Button>
    </div>
  </div>
</section>

<section className="relative overflow-hidden bg-section-dark">
  <div
    className="absolute inset-y-0 left-0 hidden w-1/2 lg:block"
    aria-hidden="true"
  >
    <Image
      src="/images/oferta.webp"
      alt=""
      fill
      className="object-cover"
      sizes="50vw"
    />

    <div className="absolute inset-0 bg-black/24" />

    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.24)_36%,rgba(0,0,0,0.28)_68%,rgba(0,0,0,0.72)_100%)]" />

    <div className="absolute inset-0 bg-linear-to-t from-black/58 via-transparent to-black/34" />

    <div className="absolute inset-y-0 left-0 w-[74%] bg-linear-to-r from-black/85 via-black/55 to-transparent" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 md:px-6">
    <div className="grid lg:grid-cols-2">
      <div className="relative flex min-h-105 items-center py-12 sm:py-14 lg:min-h-162.5 lg:py-14 lg:pr-16">
        <div className="relative z-10 max-w-xl lg:-translate-y-8">
          <p className="eyebrow eyebrow-on-dark">
            Wyjazd szyty na miarę
          </p>

          <h2 className="mt-5 text-balance font-sans text-[38px] font-black uppercase leading-[0.94] tracking-tight text-white md:text-[46px]">
            Powiedz nam,
            <br />
            czego potrzebujesz.
          </h2>

          <p className="mt-6 max-w-md text-base leading-7 text-white md:text-lg">
            Nie musisz wybierać gotowego wyjazdu z kalendarza.
            Możemy zorganizować pojedynczy element albo całą podróż
            od biletu aż po lot i hotel.
          </p>
        </div>
      </div>

      <div className="relative py-12 sm:py-14 lg:min-h-162.5 lg:py-16 lg:pl-16">
        <div
          className="absolute bottom-12 left-0 top-12 hidden w-px bg-white/10 lg:block"
          aria-hidden="true"
        />

        <div>
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            Czego potrzebujesz?
          </p>

          <h3 className="mt-3 font-sans text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-[28px]">
            Dopasuj zakres wyjazdu
          </h3>

          <p className="mt-3 max-w-xl text-base leading-7 text-white/55">
            Możesz zacząć od samego biletu albo powierzyć nam
            organizację całego wyjazdu.
          </p>

          <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {[
              [Ticket, "Tylko bilet", "Wejście na wybrany mecz."],
              [Plane, "Bilet + lot", "Bilet oraz przelot."],
              [Hotel, "Bilet + hotel", "Bilet oraz nocleg."],
              [
                CircleCheckBig,
                "Pełny pakiet",
                "Bilet, lot, hotel i zwiedzanie.",
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Ticket

              return (
                <div
                  key={title as string}
                  className="flex items-start gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center">
                    <I
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-sans text-base font-black tracking-tight text-white">
                      {title as string}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {description as string}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-9">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            Dla kogo?
          </p>

          <h3 className="mt-3 font-sans text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-[28px]">
            Od jednej osoby po całą grupę
          </h3>

          <p className="mt-3 max-w-xl text-base leading-7 text-white/55">
            Organizujemy wyjazdy zarówno indywidualne, jak i dla rodzin,
            firm oraz większych grup.
          </p>

          <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {[
              [
                User,
                "Indywidualnie",
                "Wyjazd przygotowany dokładnie pod Twoje potrzeby.",
              ],
              [
                Users,
                "Rodziny i grupy",
                "Wspólna podróż na wybrany mecz.",
              ],
              [
                BriefcaseBusiness,
                "Firmy",
                "Wyjazdy integracyjne i sportowe dla zespołów.",
              ],
              [
                GraduationCap,
                "Szkoły i kluby",
                "Kompleksowa obsługa zorganizowanych grup.",
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof User

              return (
                <div
                  key={title as string}
                  className="flex items-start gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center">
                    <I
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-sans text-base font-black tracking-tight text-white">
                      {title as string}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {description as string}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="bg-section-light px-4 py-16 md:px-6 md:py-20">
  <div className="mx-auto max-w-7xl">
    <SectionHeading
      eyebrow="Wszystko w jednym"
      title={
        content.packageTitle ||
        "Co zawiera pełny pakiet?"
      }
    />

    <div className="mt-14 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
      <div className="max-w-md">
        <p className="eyebrow">
          Pełny pakiet
        </p>

        <h3 className="mt-5 font-sans text-3xl font-black uppercase leading-[0.98] tracking-tight text-foreground md:text-4xl">
          Wszystkie najważniejsze elementy jednej podróży.
        </h3>

        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Zakres konkretnego wyjazdu może się różnić, ale pełny wariant
          łączy najważniejsze elementy organizacji w jednej ofercie.
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
        {[
          [Plane, "Przelot", "Transport dopasowany do terminu meczu."],
          [TicketCheck, "Bilet na mecz", "Miejsce na stadionie w wybranej kategorii."],
          [Building2, "Sprawdzony hotel", "Nocleg dopasowany do charakteru wyjazdu."],
          [Headphones, "Opieka koordynatora", "Wsparcie organizacyjne przed i w trakcie podróży."],
          [MapPinned, "Transfery lokalne", "Przejazdy pomiędzy kluczowymi punktami wyjazdu."],
          [ShieldCheck, "Ubezpieczenie", "Ochrona podróży zgodnie z zakresem oferty."],
          [CalendarCheck, "Plan podróży", "Najważniejsze informacje i ustalenia przed wyjazdem."],
          [Landmark, "Zwiedzanie miasta", "Czas na poznanie miasta poza stadionem."],
        ].map(([Icon, title, description]) => {
          const I = Icon as typeof Plane

          return (
            <div
              key={title as string}
              className="group flex gap-4 border-b border-foreground/10 py-6"
            >
              <div className="pt-1">
                <I
                  className="size-6 text-primary transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h4 className="font-sans text-base font-black uppercase text-foreground">
                  {title as string}
                </h4>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description as string}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
</section>
<section className="relative overflow-hidden bg-section-dark px-4 py-20 md:px-6 md:py-24">
  <div className="relative mx-auto max-w-7xl">
    <SectionHeading
      inverse
      eyebrow="Prosty plan"
      title={content.processTitle || "Jak wygląda rezerwacja?"}
      intro="Od wyboru meczu do miejsca na trybunach. Całą organizację bierzemy na siebie."
    />

    <div className="relative mt-12">
      <div className="relative hidden lg:block">
        <div
          aria-hidden="true"
          className="absolute left-[8.333%] right-[8.333%] top-6 h-px bg-white/10"
        >
          <div className="process-flow absolute top-1/2 h-0.75 w-24 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="relative grid grid-cols-6">
          {process.map(([number, title, copy], index) => (
            <article
              key={number}
              className="group relative min-w-0 px-4 xl:px-6"
            >
              <div
                className={`process-step process-step-${index + 1} relative z-10 mx-auto flex size-12 items-center justify-center rounded-full bg-section-dark`}
              >
                <span className="relative z-10 font-mono text-xs font-black text-white/90">
                  {number}
                </span>
              </div>

              <div className="mt-6 text-center">
          

                <h3 className="font-sans text-lg font-black uppercase leading-[1.1] tracking-tight text-white/90 xl:text-[19px]">
                  {title}
                </h3>

                <p className="mx-auto mt-3 max-w-48.75 text-sm leading-[1.75] text-white/50 xl:text-[15px]">
                  {copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {process.map(([number, title, copy]) => (
          <article
            key={number}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/4 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
            />

            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 group-hover:border-primary/70">
                <span className="font-mono text-xs font-black text-white/80 transition-colors duration-300 group-hover:text-primary">
                  {number}
                </span>
              </div>

              <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-primary/90">
                Krok {number}
              </span>
            </div>

            <h3 className="mt-5 font-sans text-xl font-black uppercase leading-tight tracking-tight text-white/90">
              {title}
            </h3>

            <p className="mt-3 text-[15px] leading-7 text-white/50">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>


<section className="bg-secondary px-4 py-16 md:px-6 md:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl">
    <SectionHeading
      eyebrow="Dlaczego my"
      title={
        content.benefitsTitle ||
        "Let’s Gol pilnuje szczegółów. Ty przeżywasz mecz."
      }
    />

    <div className="mt-12 grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
      {reasons.map(([Icon, title, copy]) => (
        <article
          key={title}
          className="group flex items-start gap-4"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15 sm:size-12">
            <Icon
              className="size-5 text-foreground sm:size-6"
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h3 className="font-sans text-base font-black uppercase leading-tight tracking-tight text-foreground">
              {title}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground md:text-[15px]">
              {copy}
            </p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
<section className="relative overflow-hidden bg-section-light px-4 py-20 md:px-6 md:py-24">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
  >
    <div className="absolute -right-40 -top-30 size-105 rounded-full bg-primary/5 blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <SectionHeading
        eyebrow="Z pierwszego rzędu"
        title={
          content.galleryTitle ||
          "Galeria z wyjazdów"
        }
        intro="Stadiony, miasta i emocje, których nie da się oddać samym opisem."
        align="left"
      />

      <Button
        className="hidden w-fit shrink-0 md:inline-flex"
        variant="outline"
        nativeButton={false}
        render={<Link href="/galeria" />}
      >
       <span className="inline-flex items-center gap-2">
  Zobacz całą galerię
  <ArrowRight className="size-4 shrink-0" />
</span>
      </Button>
    </div>

    <HomeGallery gallery={gallery} />

    <div className="mt-8 flex md:hidden">
      <Button
        className="w-full"
        variant="outline"
        nativeButton={false}
        render={<Link href="/galeria" />}
      >
       <span className="inline-flex items-center gap-2">
  Zobacz całą galerię
  <ArrowRight className="size-4 shrink-0" />
</span>
      </Button>
    </div>
  </div>
</section>
<section className="relative overflow-hidden bg-section-dark px-4 py-16 text-background md:px-6 md:py-24">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
  >
    <div className="absolute -left-40 top-1/2 size-105 -translate-y-1/2 rounded-full bg-primary/[0.035] blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-7xl">
    <SectionHeading
      eyebrow="Opinie klientów"
      title={
        content.testimonialsTitle ||
        "Emocje potwierdzone na trybunach"
      }
      intro="Najlepiej o naszych wyjazdach opowiadają osoby, które już poleciały z nami na mecz."
      inverse
    />

<TestimonialsCarousel testimonials={testimonials} />

    <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
      <div className="flex items-center gap-3">
        <Star
          className="size-5 text-primary"
          fill="currentColor"
          aria-hidden="true"
        />

        <div>
          <p className="text-sm font-bold text-background">
            {facebookReviewsAverage}/5 · {facebookReviewsCount} opinii
          </p>

          <p className="mt-0.5 text-xs text-background/45">
            100% poleca nas na Facebooku
          </p>
        </div>
      </div>

      <div className="hidden h-8 w-px bg-white/15 sm:block" />

      <Button
        variant="outline"
        className="border-white/20 bg-transparent text-background hover:border-primary hover:bg-primary hover:text-primary-foreground"
        nativeButton={false}
        render={
          <a
            href="https://www.facebook.com/profile.php?id=61573517165441&sk=reviews"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <span className="inline-flex items-center gap-2">
  Zobacz wszystkie opinie
  <ArrowRight className="size-4 shrink-0" />
</span>
      </Button>
    </div>
  </div>
</section>
{videos.length > 0 && (
 <section className="relative overflow-hidden bg-section-light px-4 py-20 md:px-6 md:py-24">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute left-1/2 -top-45 h-105 w-187.5 -translate-x-1/2 rounded-full bg-primary/7 blur-[120px]" />

      <div className="absolute -left-40 -bottom-45 h-105 w-105 rounded-full bg-white/60 blur-[110px]" />

      <div className="absolute -right-48 top-1/3 h-105 w-105 rounded-full bg-black/2.5 blur-[120px]" />
    </div>

    <div className="relative mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="Zobacz atmosferę"
        title={
          content.youtubeTitle ||
          "Zobacz, jak wyglądają nasze wyjazdy"
        }
        intro="Relacje, stadiony i emocje z naszych piłkarskich podróży."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="group relative block"
          >
            <article className="relative h-full overflow-hidden rounded-2xl border border-white/8 bg-foreground shadow-[0_16px_45px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-primary/40 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.22),0_0_0_1px_rgba(244,185,30,0.08)]">
              <div className="absolute left-0 top-0 z-20 h-0.5 w-10 bg-primary transition-all duration-500 group-hover:w-16" />

              <div className="relative aspect-video overflow-hidden bg-black">
                <Image
                  src={video.thumbnail}
                  alt={`Miniatura filmu: ${video.title}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-black/15 transition-opacity duration-500 group-hover:from-black/40" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex size-15.5 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-white/25 transition-all duration-500 group-hover:scale-[1.18] group-hover:border-primary/50" />

                    <div className="relative flex size-12.5 items-center justify-center rounded-full border border-white/8 bg-foreground/90 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="ml-0.5 size-4.5 fill-primary transition-colors duration-300 group-hover:fill-primary-foreground"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-32.5 items-start justify-between gap-5 bg-white/3.5 p-5 md:p-6">
                <div className="min-w-0">
                  <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                    Zobacz relację
                  </p>

                  <h3 className="line-clamp-2 text-base font-bold leading-[1.45] text-background transition-colors duration-300 group-hover:text-white">
                    {video.title}
                  </h3>
                </div>

                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-white/12 bg-white/3.5 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  <ArrowRight className="size-4 text-background transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>

      <div className="mt-9 flex items-center justify-center gap-3">
        <div className="h-px w-8 bg-black/15" />

        <span className="text-center font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">
          Poczuj atmosferę przed swoim wyjazdem
        </span>

        <div className="h-px w-8 bg-black/15" />
      </div>
    </div>
  </section>
)}

    <section
  id="o-nas"
  className="relative overflow-hidden bg-secondary px-4 py-20 md:px-6 md:py-24"
>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
  >
    <div className="absolute -right-40 -top-35 size-105 rounded-full bg-primary/6 blur-[120px]" />
  </div>

  <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
    <div>
      <p className="eyebrow">O Let&apos;s Gol</p>

      <h2 className="mt-5 max-w-2xl text-balance font-sans text-4xl font-black uppercase leading-[0.96] tracking-tight text-foreground md:text-6xl">
        Mecz to więcej niż 90 minut.
      </h2>

      <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
        Łączymy piłkę nożną z podróżowaniem i organizacją, która porządkuje
        drogę od pierwszego pomysłu aż do miejsca na trybunach.
      </p>

      <div className="mt-8 border-l-2 border-primary pl-5">
        <p className="max-w-lg font-sans text-xl font-black uppercase leading-tight text-foreground md:text-2xl">
          Ty wybierasz mecz.
          <br />
          My pomagamy poukładać drogę na stadion.
        </p>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          className="h-12 px-6"
          nativeButton={false}
          render={<Link href="/o-nas" />}
        >
          <span className="inline-flex items-center gap-2">
  Poznaj Let's Gol
  <ArrowRight className="size-4 shrink-0" />
</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-secondary bg-foreground text-sm font-black text-primary">
              Ł
            </div>

            <div className="flex size-10 items-center justify-center rounded-full border-2 border-secondary bg-primary text-sm font-black text-primary-foreground">
              M
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground">
              Łukasz & Mateusz
            </p>

            <p className="text-xs text-muted-foreground">
              współtwórcy Let&apos;s Gol
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="relative">
      <div className="relative min-h-110 overflow-hidden rounded-xl md:min-h-130">
        <Image
          src="/images/about-us.webp"
          alt="Atmosfera wspólnego wyjazdu na mecz"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            Piłka · podróże · emocje
          </p>

          <p className="mt-3 max-w-md font-sans text-2xl font-black uppercase leading-[1.05] md:text-3xl">
            Najlepsze mecze pamięta się razem z drogą na stadion.
          </p>
        </div>
      </div>

     
    </div>
  </div>
</section>
   <section
  id="faq"
  className="scroll-mt-20 bg-background px-4 py-20 md:px-6 md:py-24"
>
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-12 lg:grid-cols-[0.65fr_1fr] lg:gap-20">
      <div className="lg:pt-16">
  <SectionHeading
          eyebrow="FAQ"
          title={content.faqTitle || "Najczęstsze pytania"}
          intro="Krótko odpowiadamy na najważniejsze kwestie. Pełne centrum pomocy obejmuje wszystkie etapy wyjazdu."
          align="left"
        />

        <Button
          variant="outline"
          size="lg"
          className="mt-8"
          nativeButton={false}
          render={<Link href="/faq" />}
        >
          Zobacz całe FAQ
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="lg:pt-2">
        <Accordion className="border-t border-foreground/15">
          {faqs.map(([question, answer]) => (
            <AccordionItem
              key={question}
              className="border-b border-foreground/15"
            >
              <AccordionTrigger className="min-h-18 py-5 text-left text-base font-bold leading-6 hover:no-underline hover:text-primary">
                {question}
              </AccordionTrigger>

              <AccordionContent className="max-w-2xl pb-6 pr-8 text-[15px] leading-7 text-muted-foreground">
                <p>{answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
</section>
      <section
        id="kontakt"
        className="bg-section-dark px-4 py-20 text-background md:px-6 md:py-24"
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

          <InquiryForm
  trips={trips
    .filter(
      (trip) =>
        trip.availabilityStatus !== "sold_out"
    )
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      packageVariants: getPackageVariants(
        trip.packageVariants,
        trip.packageItems
      ).map((variant) => variant.label),
    }))}
/>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
