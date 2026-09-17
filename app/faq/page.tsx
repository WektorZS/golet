import type { Metadata } from "next"
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
import { faqCategories, popularFaqs } from "@/lib/faq"
import { breadcrumbSchema } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "FAQ - pytania o wyjazdy na mecze",
  description:
    "Odpowiedzi na pytania o rezerwację, bilety, transport, noclegi, dokumenty i zmiany terminów meczów.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ wyjazdów na mecze",
    description:
      "Praktyczne odpowiedzi przed pierwszym i kolejnym wyjazdem na mecz.",
    url: "/faq",
  },
}

export default async function FaqPage() {
  const content: SiteContent = process.env.DATABASE_URL
    ? await getSiteContent().catch(() => ({} as SiteContent))
    : {}

  const allFaqs = faqCategories.flatMap(
    (category) => category.items
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

      <section className="relative overflow-hidden bg-foreground pt-20 text-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-48 top-20 size-105 rounded-full bg-primary/[0.035] blur-[130px]" />
        </div>

        <div
          className="absolute inset-y-0 right-0 hidden w-[36%] border-l border-white/10 lg:block"
          aria-hidden="true"
        >
          <div className="grid h-full grid-cols-4">
            {Array.from({ length: 20 }).map(
              (_, index) => (
                <span
                  key={index}
                  className="border-b border-r border-white/[0.07]"
                />
              )
            )}
          </div>
        </div>

        <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-14 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.42fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">
              Centrum pomocy
            </p>

            <h1 className="mt-6 max-w-225 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
              Dobra podróż zaczyna się od dobrych informacji
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-background/65 md:text-lg md:leading-8">
              Znajdź konkretną odpowiedź o rezerwacji,
              bilecie, transporcie, noclegu i przebiegu
              wyjazdu.
            </p>
          </div>

          <div className="relative hidden lg:flex lg:min-h-65 lg:items-center lg:pl-10">
            <div>
              <BookOpen
                className="size-16 text-primary"
                strokeWidth={1.3}
                aria-hidden="true"
              />

              <p className="mt-6 font-sans text-3xl font-black uppercase leading-none">
                {allFaqs.length} odpowiedzi
              </p>

              <p className="mt-3 max-w-55 text-sm leading-6 text-background/50">
                Pogrupowanych według etapu podróży.
              </p>
            </div>
          </div>
        </div>
      </section>

     <section className="border-b border-foreground/10 bg-secondary/60">
  <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
      Najczęściej sprawdzane
    </p>

    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible">
      {popularFaqs.map((item) => {
        const category = faqCategories.find((entry) =>
          entry.items.some(
            (faq) => faq.question === item.question
          )
        )

        return (
          <a
            key={item.question}
            href={category ? `#${category.id}` : "#faq"}
            className="min-h-11 shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-primary hover:bg-primary"
          >
            {item.question}
          </a>
        )
      })}
    </div>
  </div>
</section>

      <section
        id="faq"
        className="bg-section-light px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <FaqBrowser />
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
              Opisz swój wyjazd lub sytuację. Odpowiemy
              na podstawie konkretnej oferty i etapu
              rezerwacji.
            </p>
          </div>

          <Button
            size="lg"
            className="h-12 shrink-0 px-6"
            nativeButton={false}
            render={<Link href="/kontakt" />}
          >
            Przejdź do kontaktu
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <div className="border-b border-foreground/10 bg-secondary/50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-7xl text-sm leading-6 text-muted-foreground">
          Zasady dotyczące konkretnej rezerwacji wynikają
          z oferty, umowy i{" "}
          <Link
            href="/warunki-uczestnictwa"
            className="font-semibold text-foreground underline decoration-primary underline-offset-4"
          >
            warunków uczestnictwa
          </Link>
          .
        </div>
      </div>

      <SiteFooter content={content} />
    </main>
  )
}