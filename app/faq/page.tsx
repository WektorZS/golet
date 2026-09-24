import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
} from "lucide-react"

import { FaqBrowser } from "@/components/faq-browser"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

import {
  getSiteContent,
  type SiteContent,
} from "@/lib/content"
import { getFaqCategories } from "@/lib/faq"
import {
  breadcrumbSchema,
  localizedAlternates,
  socialMetadata,
} from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"
import { absoluteUrl } from "@/lib/site"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy(
    "faq",
    locale
  )

  const path = routeFor(locale, "/faq")

  return {
    title,
    description,

    alternates: localizedAlternates(
      "/faq",
      locale
    ),

    ...socialMetadata(
      title,
      description,
      path,
      locale
    ),
  }
}

export default async function FaqPage() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"

  const faqCategories = getFaqCategories(locale)

  const content: SiteContent =
    process.env.DATABASE_URL
      ? await getSiteContent().catch(
          () => ({} as SiteContent)
        )
      : {}

  const allFaqs = faqCategories.flatMap(
    (category) => category.items
  )

  const path = routeFor(locale, "/faq")
  const pageUrl = absoluteUrl(path)

  const { title, description } = getSeoCopy(
    "faq",
    locale
  )

  const breadcrumb = breadcrumbSchema([
    {
      name: isEn
        ? "Home"
        : "Strona główna",
      path: routeFor(locale, "/"),
    },
    {
      name: "FAQ",
      path,
    },
  ])

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,

    url: pageUrl,
    name: title,
    description,

    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },

    breadcrumb: {
      "@id": `${pageUrl}#breadcrumb`,
    },

    about: {
      "@id": absoluteUrl("/#organization"),
    },

    inLanguage: isEn
      ? "en-GB"
      : "pl-PL",
  }

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      webPageSchema,
      breadcrumb,
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />

      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
        <Image
          src="/images/hero-stadium.webp"
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
              FAQ
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              {isEn
                ? "Everything worth knowing before you travel"
                : "Wszystko, co warto wiedzieć przed wyjazdem"}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              {isEn
                ? "Booking, packages, tickets, transport, accommodation and trip planning. Here are clear answers to the questions travellers ask most often."
                : "Rezerwacja, pakiety, bilety, transport, noclegi i organizacja wyjazdu. Zebraliśmy odpowiedzi na pytania, które najczęściej pojawiają się przed podróżą."}
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <BookOpen
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              {allFaqs.length}{" "}
              {isEn
                ? "questions and answers"
                : "pytań i odpowiedzi"}
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              {isEn
                ? "From your first enquiry and package choice to the journey and match day."
                : "Od pierwszego zapytania i wyboru pakietu aż po podróż i dzień meczu."}
            </p>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-20 bg-section-light px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <FaqBrowser />
        </div>

        <div className="mx-auto mt-16 w-full max-w-7xl md:mt-20">
          <div className="border-t border-foreground/10 pt-8">
            <p className="mx-auto max-w-3xl text-center text-sm leading-6 text-muted-foreground">
              {isEn
                ? "The detailed rules for your booking are set out in the offer, contract and "
                : "Szczegółowe zasady dotyczące konkretnej rezerwacji znajdziesz w ofercie, umowie oraz "}

              <Link
                href={routeFor(
                  locale,
                  "/warunki-uczestnictwa"
                )}
                className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
              >
                {isEn
                  ? "terms and conditions"
                  : "warunkach uczestnictwa"}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="bg-foreground px-4 py-16 text-background md:px-6 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <MessageCircle
              className="size-7 text-primary"
              aria-hidden="true"
            />

            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-[0.97] tracking-tight md:text-5xl">
              {isEn
                ? "Still have a question?"
                : "Nie znalazłeś odpowiedzi?"}
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-background/65">
              {isEn
                ? "Tell us what you need to know. We will check the details of your situation and reply."
                : "Napisz do nas i opisz, czego dotyczy pytanie. Sprawdzimy konkretną sytuację i odpowiemy."}
            </p>
          </div>

          <Button
            size="lg"
            className="h-12 shrink-0 px-6"
            nativeButton={false}
            render={
              <button
                type="button"
                data-open-floating-contact
              />
            }
          >
            <span className="inline-flex items-center gap-2">
              {isEn
                ? "Contact us"
                : "Napisz do nas"}

              <ArrowRight
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </span>
          </Button>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}