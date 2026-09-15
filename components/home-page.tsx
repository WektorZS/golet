import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Compass,
  Headphones,
  MapPinned,
  Plane,
  ShieldCheck,
  Star,
  TicketCheck,
  Users,
} from "lucide-react"

import { HeroBackgroundSlider } from "@/components/hero-background-slider"
import { HomeTripCalendar } from "@/components/home-trip-calendar"
import { ImageLightbox } from "@/components/image-lightbox"
import { InquiryForm } from "@/components/inquiry-form"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SocialLinks } from "@/components/social-links"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { SiteContent, YouTubeVideo } from "@/lib/content"
import { popularFaqs } from "@/lib/faq"
import { getPackageVariants } from "@/lib/package-options"
import type { Trip } from "@/lib/trips"

const trustPoints = [
  [ShieldCheck, "Legalny organizator turystyki"],
  [TicketCheck, "Zakres potwierdzony przed rezerwacją"],
  [Headphones, "Wsparcie i informacje organizacyjne"],
  [Users, "Wyjazdy indywidualne i grupowe"],
] as const

const packageItems = [
  [Plane, "Przelot"],
  [TicketCheck, "Bilet na mecz"],
  [Building2, "Zakwaterowanie"],
  [MapPinned, "Transfery lokalne"],
  [Headphones, "Opieka koordynatora"],
  [ShieldCheck, "Ubezpieczenie"],
  [CalendarCheck, "Plan podróży"],
  [Compass, "Czas na poznanie miasta"],
] as const

const reasons = [
  [
    "01",
    "Jedna czytelna oferta",
    "Widzisz zakres wybranego wariantu i ustalenia ważne przed podjęciem decyzji.",
  ],
  [
    "02",
    "Podróż dopasowana do meczu",
    "Dobór transportu i noclegu uwzględnia termin wydarzenia oraz potrzeby uczestników.",
  ],
  [
    "03",
    "Informacje przed drogą",
    "Dostajesz plan oraz szczegóły organizacyjne dotyczące konkretnego wyjazdu.",
  ],
] as const

const process = [
  ["01", "Wybierasz mecz", "Korzystasz z kalendarza albo wskazujesz inne wydarzenie."],
  ["02", "Mówisz, czego potrzebujesz", "Ustalamy liczbę osób, punkt startu i zakres pakietu."],
  ["03", "Otrzymujesz ofertę", "Sprawdzasz cenę, świadczenia oraz warunki rezerwacji."],
  ["04", "Potwierdzasz wyjazd", "Po akceptacji otrzymujesz dokumenty i kolejne informacje."],
  ["05", "Ruszamy na mecz", "Przed podróżą znasz plan i najważniejsze ustalenia organizacyjne."],
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
  const items = gallery.slice(0, 7)

  return (
    <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] lg:grid-cols-4">
      {items.map((item, index) => {
        const src = item.mediaId ? `/api/media/${item.mediaId}` : item.image
        const featured = index === 0

        return (
          <figure
            key={item.id}
            className={`group relative overflow-hidden rounded-xl ${featured ? "col-span-2 row-span-2" : ""}`}
          >
            <ImageLightbox
              src={src}
              alt={item.alt || item.title || "Zdjęcie z wyjazdu Let's Gol"}
              caption={[item.title, item.city].filter(Boolean).join(" - ")}
            >
              <Image
                src={src}
                alt={item.alt || item.title || "Zdjęcie z wyjazdu Let's Gol"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </ImageLightbox>
            {(item.title || item.city) ? (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-xs font-bold text-white md:p-5 md:text-sm">
                {[item.title, item.city].filter(Boolean).join(" - ")}
              </figcaption>
            ) : null}
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
  const parsedReviewsCount = Number.parseInt(content.facebookReviewsCount || "0", 10)
  const reviewsCount = Number.isFinite(parsedReviewsCount) ? Math.max(0, parsedReviewsCount) : 0
  const parsedReviewsAverage = Number.parseFloat(content.facebookReviewsAverage || "0")
  const reviewsAverage = Number.isFinite(parsedReviewsAverage)
    ? Math.min(5, Math.max(0, parsedReviewsAverage)).toFixed(1)
    : "0.0"
  const availableTrips = trips
    .filter((trip) => trip.availabilityStatus !== "sold_out")
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      date: trip.matchDate || trip.startDate,
      packageVariants: getPackageVariants(trip.packageVariants, trip.packageItems).map((variant) => variant.label),
    }))

  return (
    <main>
      <SiteHeader />

      <section className="relative isolate flex min-h-[720px] flex-col overflow-hidden bg-foreground pt-20 text-background md:min-h-[760px]">
        <HeroBackgroundSlider />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/82 to-foreground/20" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-foreground to-transparent" />

        <div className="site-container relative flex flex-1 items-center py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">
              {content.heroEyebrow || "Piłkarskie podróże bez organizacyjnego chaosu"}
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-sans text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-[88px]">
              {content.heroTitle || "Leć z nami na największe mecze w Europie"}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-background/70 md:text-lg">
              Wybierasz mecz i zakres podróży. My przygotowujemy ofertę, porządkujemy ustalenia i prowadzimy Cię do miejsca na trybunach.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 font-bold uppercase" nativeButton={false} render={<Link href="/wyjazdy" />}>
                {content.heroCta || "Zobacz wyjazdy"}
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-background/35 bg-foreground/25 px-6 font-bold uppercase text-background hover:bg-background hover:text-foreground"
                nativeButton={false}
                render={<Link href="/kontakt#formularz" />}
              >
                Zapytaj o własny wyjazd
              </Button>
            </div>

            <div className="mt-9 hidden items-center gap-4 border-t border-background/15 pt-5 md:flex">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-background/50">Obserwuj nas</span>
              <SocialLinks />
            </div>
          </div>

          {reviewsCount > 0 ? (
            <a
              href="https://www.facebook.com/profile.php?id=61573517165441&sk=reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-8 right-0 hidden border-l-2 border-primary bg-foreground/80 px-5 py-4 backdrop-blur-md lg:block"
            >
              <span className="flex items-center gap-2 font-black">
                <Star className="size-5 fill-primary text-primary" aria-hidden="true" />
                {reviewsAverage}/5
              </span>
              <span className="mt-1 block text-xs text-background/55">{reviewsCount} opinii na Facebooku</span>
            </a>
          ) : null}
        </div>

        <div className="relative border-t border-background/15 bg-foreground/82 backdrop-blur-sm">
          <div className="site-container grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(([Icon, text]) => (
              <div key={text} className="flex min-h-20 items-center gap-3 border-b border-background/10 py-4 sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold leading-5">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wyjazdy" className="section-space scroll-mt-20 bg-background">
        <div className="site-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Terminarz meczowych podróży"
              title="Kalendarz wyjazdów"
              intro={content.tripsDescription || "Wybierz termin i sprawdź dokładny zakres dostępnego pakietu."}
              align="left"
            />
            <Button variant="outline" size="lg" className="w-fit" nativeButton={false} render={<Link href="/wyjazdy" />}>
              Wszystkie wyjazdy <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <HomeTripCalendar trips={trips} />
        </div>
      </section>

      <section id="twoj-wyjazd" className="section-space scroll-mt-20 bg-secondary/60">
        <div className="site-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[420px] overflow-hidden rounded-xl">
            <Image src="/images/about-us.webp" alt="Podróż kibiców na mecz" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-primary">Poza kalendarzem</p>
              <p className="mt-3 max-w-md font-sans text-3xl font-black uppercase leading-none md:text-4xl">Twój mecz. Twój punkt startu. Twój zakres.</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Wyjazd indywidualny</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[0.96] tracking-tight md:text-6xl">
              Nie ma Twojego meczu w kalendarzu?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Napisz, dokąd chcesz jechać i czego potrzebujesz. Sprawdzimy dostępność i przygotujemy zakres dopasowany do Twojego planu.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Dowolny klub i liga", "Dogodne miejsce startu", "Wybrany standard noclegu", "Zakres od biletu po pełny pakiet"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-primary">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-9 h-12 px-6" nativeButton={false} render={<Link href="/kontakt#formularz" />}>
              Opisz swój wyjazd <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      <section className="section-space bg-foreground text-background">
        <div className="site-container">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.7fr]">
            <SectionHeading
              eyebrow="Wszystko w jednym"
              title={content.packageTitle || "Zakres pełnego pakietu"}
              intro="Dokładny zakres zawsze sprawdzisz w ofercie konkretnego wyjazdu. Pełny wariant może łączyć najważniejsze elementy podróży w jednej rezerwacji."
              inverse
              align="left"
            />
            <p className="border-l-2 border-primary pl-5 text-sm leading-7 text-background/55">
              Wolisz sam bilet albo pakiet bez jednego z elementów? Przy wybranych wydarzeniach przygotowujemy również węższe warianty.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-background/12 sm:grid-cols-2 lg:grid-cols-4">
            {packageItems.map(([Icon, label]) => (
              <div key={label} className="flex min-h-24 items-center gap-4 bg-foreground p-5">
                <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-background/15 pt-10 md:grid-cols-3">
            {reasons.map(([number, title, copy]) => (
              <article key={number}>
                <span className="font-mono text-xs font-black text-primary">{number}</span>
                <h3 className="mt-5 font-sans text-2xl font-black uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-background/55">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-background">
        <div className="site-container">
          <SectionHeading
            eyebrow="Prosty plan"
            title={content.processTitle || "Jak wygląda rezerwacja?"}
            intro="Pięć czytelnych etapów, od pomysłu do informacji potrzebnych przed wyjazdem."
          />
          <ol className="mt-12 grid gap-3 md:grid-cols-5">
            {process.map(([number, title, copy], index) => (
              <li key={number} className="surface-card relative p-5 md:min-h-64">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-primary">{number}</span>
                  {index < process.length - 1 ? <ArrowRight className="hidden size-4 text-foreground/25 md:block" aria-hidden="true" /> : null}
                </div>
                <h3 className="mt-10 font-sans text-xl font-black uppercase leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {gallery.length ? (
        <section className="section-space bg-secondary/60">
          <div className="site-container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Z pierwszego rzędu"
                title={content.galleryTitle || "Galeria z wyjazdów"}
                intro="Stadiony, miasta i momenty, które najlepiej pokazują charakter wspólnej podróży."
                align="left"
              />
              <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/galeria" />}>
                Cała galeria <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
            <HomeGallery gallery={gallery} />
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="section-space bg-foreground text-background">
          <div className="site-container">
            <SectionHeading
              eyebrow="Opinie uczestników"
              title={content.testimonialsTitle || "Jak wspominają wyjazd?"}
              intro="Głos oddajemy osobom, które oglądały mecze razem z Let's Gol."
              inverse
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((item) => (
                <blockquote key={item.id} className="flex min-h-64 flex-col rounded-xl border border-background/12 bg-background/[0.04] p-6 md:p-7">
                  <div className="flex gap-1 text-primary">
                    <span className="sr-only">Ocena {item.rating} na 5</span>
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={index} className="size-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-6 flex-1 text-[15px] leading-7 text-background/75">„{item.content}”</p>
                  <footer className="mt-7 border-t border-background/10 pt-5">
                    {item.author ? <p className="font-bold">{item.author}</p> : null}
                    {item.tripName ? <p className="mt-1 text-xs text-background/45">{item.tripName}</p> : null}
                  </footer>
                </blockquote>
              ))}
            </div>
            {reviewsCount > 0 ? (
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <p className="flex items-center gap-2 text-sm font-bold"><Star className="size-5 fill-primary text-primary" aria-hidden="true" />{reviewsAverage}/5 na podstawie {reviewsCount} opinii</p>
                <Button variant="outline" className="border-background/20 bg-transparent text-background hover:bg-primary hover:text-primary-foreground" nativeButton={false} render={<a href="https://www.facebook.com/profile.php?id=61573517165441&sk=reviews" target="_blank" rel="noopener noreferrer" />}>
                  Opinie na Facebooku <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section id="o-nas" className="section-space scroll-mt-20 bg-background">
        <div className="site-container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="O nas"
              title={content.aboutTitle || "Za każdym wyjazdem stoją ludzie"}
              intro={content.aboutText || "Let's Gol łączy pasję do futbolu z przygotowaniem podróży. Chcemy, by droga na stadion budowała emocje, a nie listę organizacyjnych problemów."}
              align="left"
            />
            <Button variant="outline" size="lg" className="mt-8" nativeButton={false} render={<Link href="/o-nas" />}>
              Poznaj Let's Gol <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-xl">
            <Image src="/images/hero-stadium.webp" alt="Trybuny stadionu podczas meczu" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-6 font-sans text-2xl font-black uppercase leading-tight text-white md:p-8 md:text-3xl">Piłka. Podróż. Wspólne emocje.</p>
          </div>
        </div>
      </section>

      {videos.length ? (
        <section className="section-space bg-secondary/60">
          <div className="site-container">
            <SectionHeading
              eyebrow="Zobacz atmosferę"
              title={content.youtubeTitle || "Relacje z naszych wyjazdów"}
              intro="Materiały ze stadionów i miast, które odwiedzamy razem z uczestnikami."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="surface-card interactive-card group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-foreground">
                    <Image src={video.thumbnail} alt={`Miniatura filmu: ${video.title}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl" aria-hidden="true">
                        <span className="ml-0.5 text-lg">▶</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex min-h-28 items-start justify-between gap-4 p-5">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-primary">Zobacz relację</p>
                      <h3 className="mt-2 line-clamp-2 font-bold leading-6">{video.title}</h3>
                    </div>
                    <ArrowRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="faq" className="section-space scroll-mt-20 bg-background">
        <div className="site-container grid gap-12 lg:grid-cols-[0.6fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title={content.faqTitle || "Najczęstsze pytania"}
              intro="Krótko odpowiadamy na najważniejsze kwestie. Pełne centrum pomocy obejmuje wszystkie etapy wyjazdu."
              align="left"
            />
            <Button variant="outline" size="lg" className="mt-8" nativeButton={false} render={<Link href="/faq" />}>
              Zobacz całe FAQ <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <Accordion className="border-t border-foreground/15">
            {popularFaqs.map((item) => (
              <AccordionItem key={item.question} className="border-b border-foreground/15">
                <AccordionTrigger className="min-h-16 py-5 text-base font-bold leading-6 hover:no-underline hover:text-primary">{item.question}</AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 text-[15px] leading-7 text-muted-foreground"><p>{item.answer}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="kontakt" className="scroll-mt-20 bg-foreground text-background">
        <div className="site-container grid gap-12 py-16 md:py-20 lg:grid-cols-[0.65fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">Twój następny mecz</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              {content.contactTitle || "Zapytaj o swój wyjazd"}
            </h2>
            <p className="mt-5 max-w-md leading-7 text-background/60">
              Wybierz mecz lub wpisz własny pomysł. Podaj miejsce startu i liczbę osób, abyśmy mogli przygotować konkretną odpowiedź.
            </p>
            <Link href="/kontakt" className="mt-7 inline-flex items-center gap-2 font-bold text-primary hover:text-background">
              Inne formy kontaktu <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <InquiryForm trips={availableTrips} />
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
