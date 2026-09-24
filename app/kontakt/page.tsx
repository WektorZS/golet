import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react"



import {
  getSiteContent,
  type SiteContent,
} from "@/lib/content"

import {
  getPublishedTrips,
  type Trip,
} from "@/lib/trips"

import { getPackageVariants } from "@/lib/package-options"

import { InquiryForm } from "@/components/inquiry-form"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { breadcrumbSchema, localizedAlternates, socialMetadata } from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-dynamic"
const socialProfiles = [
  {
    name: "Facebook",
    href: "https://facebook.com/profile.php?id=61573517165441",
    icon: "/icons/social/facebook.svg",
    description:
      "Aktualności, relacje i informacje o nowych wyjazdach.",
    descriptionEn: "News, trip reports and information about new dates.",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/letsgol_wyjazdynamecze",
    icon: "/icons/social/instagram.svg",
    description:
      "Zdjęcia ze stadionów, miast i wspólnych podróży.",
    descriptionEn: "Photos from stadiums, cities and shared journeys.",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@letsgol.wyjazdynamecze",
    icon: "/icons/social/tiktok.svg",
    description:
      "Krótkie materiały prosto z meczowych wyjazdów.",
    descriptionEn: "Short videos straight from our football trips.",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@LetsGolWyjazdynamecze",
    icon: "/icons/social/youtube.webp",
    description:
      "Dłuższe relacje i atmosfera piłkarskich podróży.",
    descriptionEn: "Longer match-day stories and football travel atmosphere.",
  },
] as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy("contact", locale)
  return { title, description, alternates: localizedAlternates("/kontakt", locale), ...socialMetadata(title, description, routeFor(locale, "/kontakt"), locale) }
}
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.009-.372-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.447 4.434-9.878 9.883-9.878 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.99c-.003 5.448-4.435 9.883-9.88 9.883m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
export default async function ContactPage() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const t = (pl: string, en: string) => isEn ? en : pl
  const content: SiteContent = process.env.DATABASE_URL
    ? await getSiteContent().catch(() => ({} as SiteContent))
    : {}

  const trips: Trip[] = process.env.DATABASE_URL
    ? await getPublishedTrips(locale).catch(() => [])
    : []

  const phone =
    content.contactPhone || "+48 501 465 318"

  const phoneDigits = phone.replace(/\D/g, "")

  const contact = {
    phone,
    phoneHref: `tel:${phone.replace(/[^+\d]/g, "")}`,
    whatsappHref: `https://wa.me/${phoneDigits}`,
    email:
      content.contactEmail ||
      "kontakt.letsgol@gmail.com",
  }
  
  const whatsappMessage = encodeURIComponent(
    t("Dzień dobry, mam pytanie dotyczące wyjazdu z Let's Gol.", "Hello, I have a question about a trip with Let's Gol.")
  )

  const channels = [
    {
      title: "WhatsApp",
      description: t("Najwygodniejszy do krótkiego pytania o termin, dostępność lub konkretny mecz.", "The easiest choice for a quick question about dates, availability or a specific match."),
      detail: contact.phone,
      href: `${contact.whatsappHref}?text=${whatsappMessage}`,
      label: t("Napisz na WhatsApp", "Message us on WhatsApp"),
      icon: <WhatsAppIcon className="size-6" />,
      external: true,
    },
    {
      title: t("Telefon", "Phone"),
      description: t("Dobry wybór, jeśli chcesz szybko omówić wariant podróży albo wyjazd dla grupy.", "A good choice if you want to discuss travel options or a group trip quickly."),
      detail: contact.phone,
      href: contact.phoneHref,
      label: t("Zadzwoń teraz", "Call now"),
      icon: <Phone className="size-6" />,
      external: false,
    },
    {
      title: "E-mail",
      description: t("Najlepszy kanał do współpracy, rozbudowanych pytań i wiadomości z większą liczbą szczegółów.", "Best for partnerships, detailed questions and messages containing more information."),
      detail: contact.email,
      href: `mailto:${contact.email}`,
      label: t("Napisz e-mail", "Send an email"),
      icon: <Mail className="size-6" />,
      external: false,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${absoluteUrl(routeFor(locale, "/kontakt"))}#webpage`,
              url: absoluteUrl(routeFor(locale, "/kontakt")),
              name: t("Kontakt z Let's Gol", "Contact Let's Gol"),
              description: getSeoCopy("contact", locale).description,
              inLanguage: isEn ? "en-GB" : "pl-PL",
              isPartOf: {
                "@id": absoluteUrl("/#website"),
              },
              breadcrumb: {
                "@id": `${absoluteUrl(routeFor(locale, "/kontakt"))}#breadcrumb`,
              },
              about: {
                "@id": absoluteUrl("/#organization"),
              },
            },
            breadcrumbSchema([
              {
                name: t("Strona główna", "Home"),
                path: routeFor(locale, "/"),
              },
              {
                name: t("Kontakt", "Contact"),
                path: routeFor(locale, "/kontakt"),
              },
            ]),
          ],
        }}
      />

      <SiteHeader />

     <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
  <Image
    src="/images/madrid-trip.webp"
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
              {t("Kontakt", "Contact")}
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              {t("Porozmawiajmy o Twoim następnym meczu", "Let us talk about your next match")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              {t("Masz wybrany mecz, dopiero szukasz pomysłu albo organizujesz wyjazd dla grupy? Wybierz wygodny kanał i opowiedz nam, czego potrzebujesz.", "Already have a match in mind, looking for inspiration or organising a group trip? Choose the channel that suits you and tell us what you need.")}
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <Clock3
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              {t("Szybkie pytanie?", "A quick question?")}
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              {t("Zacznij od WhatsAppa lub telefonu. Przy bardziej rozbudowanej sprawie skorzystaj z formularza.", "Start with WhatsApp or a phone call. For a detailed enquiry, use the form below.")}
            </p>
          </div>
        </div>
      </section>

     <section className="bg-background px-4 py-16 md:px-6 md:py-24">
  <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">
              {t("Wybierz kanał", "Choose a channel")}
            </p>

            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              {t("Skontaktuj się tak, jak Ci wygodnie", "Contact us in the way that suits you")}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {t("Każda droga prowadzi do tego samego zespołu. Opis podpowiada, który kanał najlepiej pasuje do Twojej sprawy.", "Every channel reaches the same team. The descriptions will help you choose the best one for your enquiry.")}
            </p>
          </div>

         <div className="mt-10 grid gap-4 lg:grid-cols-3">
  {channels.map((channel) => (
    <a
      key={channel.title}
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={
        channel.external
          ? "noopener noreferrer"
          : undefined
      }
      className="group flex min-h-72 flex-col rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl md:p-7"
    >
      <span className="flex size-12 items-center justify-center rounded-lg bg-foreground text-primary">
        {channel.icon}
      </span>

      <h3 className="mt-7 font-sans text-3xl font-black uppercase">
        {channel.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
        {channel.description}
      </p>

      <p className="mt-6 break-all text-sm font-bold">
        {channel.detail}
      </p>

      <span className="mt-3 inline-flex items-center gap-2 font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
        {channel.label}

        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </a>
  ))}
</div>
        </div>
      </section>


     <section className="bg-secondary/55 px-4 py-16 md:px-6 md:py-24">
  <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">
                Social media
              </p>

              <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                {t("Bądź bliżej wyjazdów", "Stay close to the action")}
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                {t("Obserwuj relacje, zobacz atmosferę i dowiedz się o nowych kierunkach.", "Follow our stories, see the atmosphere and hear about new destinations.")}
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href={routeFor(locale, "/galeria")} />}
            >
              {t("Zobacz galerię", "View gallery")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

     <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  {socialProfiles.map((profile) => (
    <a
      key={profile.name}
      href={profile.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-60 flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-neutral-700"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-0.5 w-12 bg-primary transition-all duration-500 group-hover:w-full"
      />

      <div className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-white/5">
        <Image
          src={profile.icon}
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
          unoptimized
        />
      </div>

      <h3 className="mt-6 font-sans text-xl font-black uppercase text-white">
        {profile.name}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-white/60">
        {isEn ? profile.descriptionEn : profile.description}
      </p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-white transition-colors duration-300 group-hover:text-primary">
          {t("Otwórz profil", "Open profile")}

          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  ))}
</div>
        </div>
      </section>
      <section
  id="formularz"
  className="scroll-mt-20 bg-foreground px-4 py-16 text-background md:px-6 md:py-20"
      >
        <div className="site-container grid gap-12 py-16 md:py-20 lg:grid-cols-[0.65fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">
              {t("Formularz", "Enquiry form")}
            </p>

            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              {t("Opisz swoją sprawę", "Tell us what you need")}
            </h2>

            <p className="mt-5 max-w-md leading-7 text-background/65">
              {t("Podaj kontekst i najważniejsze szczegóły. Dzięki temu pierwsza odpowiedź będzie bardziej konkretna.", "Share the context and key details so our first response can be as useful as possible.")}
            </p>

            <div className="mt-8 space-y-5 border-t border-background/15 pt-7">
              <div className="flex gap-3">
                <MessageCircle
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <p className="text-sm leading-6 text-background/60">
                  {t("Pytanie o wyjazd, rezerwację, grupę lub współpracę trafia przez ten sam bezpieczny formularz.", "Trip, booking, group and partnership enquiries all use the same secure form.")}
                </p>
              </div>

              <div className="flex gap-3">
                <Users
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <p className="text-sm leading-6 text-background/60">
                  {t("Przy zapytaniu grupowym wpisz orientacyjną liczbę osób i interesujący termin w wiadomości.", "For a group enquiry, include the approximate number of travellers and your preferred dates.")}
                </p>
              </div>
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
        trip.packageItems,
        locale
      ).map((variant) => variant.label),
    }))}
/>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
