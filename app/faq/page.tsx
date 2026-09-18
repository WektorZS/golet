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
import { faqCategories } from "@/lib/faq"
import { breadcrumbSchema, socialMetadata } from "@/lib/seo"

export const revalidate = 300

export const metadata: Metadata = {
  title: "FAQ o wyjazdach na mecze",
  description:
    "Odpowiedzi na najczęstsze pytania o rezerwację, pakiety, bilety, transport, noclegi, dokumenty i organizację wyjazdów na mecze.",
  alternates: {
    canonical: "/faq",
  },
  ...socialMetadata(
    "FAQ o wyjazdach na mecze | Let's Gol",
    "Sprawdź najważniejsze informacje o rezerwacji, pakietach, biletach, transporcie i organizacji wyjazdów na mecze.",
    "/faq"
  ),
}

export default async function FaqPage() {
  const content: SiteContent = process.env.DATABASE_URL
    ? await getSiteContent().catch(
        () => ({} as SiteContent)
      )
    : {}

  const allFaqs = faqCategories.flatMap(
    (category) => category.items
  )

  const popularFaqLinks = faqCategories.flatMap(
    (category) =>
      category.items
        .filter((item) => item.popular)
        .map((item) => ({
          ...item,
          categoryId: category.id,
        }))
  )

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
                name: "FAQ",
                path: "/faq",
              },
            ]),
            {
              "@type": "FAQPage",
              mainEntity: allFaqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ],
        }}
      />

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
              Wszystko, co warto wiedzieć przed wyjazdem
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Rezerwacja, pakiety, bilety, transport,
              noclegi i organizacja wyjazdu. Zebraliśmy
              odpowiedzi na pytania, które najczęściej
              pojawiają się przed podróżą.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <BookOpen
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              {allFaqs.length} pytań i odpowiedzi
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              Od pierwszego zapytania i wyboru pakietu
              aż po podróż i dzień meczu.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Najczęściej sprawdzane
          </p>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible">
            {popularFaqLinks.map((item) => (
              <a
                key={`${item.categoryId}-${item.question}`}
                href={`#${item.categoryId}`}
                className="min-h-11 shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.question}
              </a>
            ))}
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
              Szczegółowe zasady dotyczące konkretnej rezerwacji
              znajdziesz w ofercie, umowie oraz{" "}
              <Link
                href="/warunki-uczestnictwa"
                className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
              >
                warunkach uczestnictwa
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
              Nie znalazłeś odpowiedzi?
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-background/65">
              Napisz do nas i opisz, czego dotyczy
              pytanie. Sprawdzimy konkretną sytuację
              i odpowiemy.
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
              Napisz do nas
              <ArrowRight className="size-4 shrink-0" />
            </span>
          </Button>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
