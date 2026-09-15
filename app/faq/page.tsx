import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react"

import { FaqBrowser } from "@/components/faq-browser"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getSiteContent } from "@/lib/content"
import { faqCategories, popularFaqs } from "@/lib/faq"
import { breadcrumbSchema } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "FAQ - pytania o wyjazdy na mecze",
  description: "Odpowiedzi na pytania o rezerwację, bilety, transport, noclegi, dokumenty i zmiany terminów meczów.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ wyjazdów na mecze",
    description: "Praktyczne odpowiedzi przed pierwszym i kolejnym wyjazdem na mecz.",
    url: "/faq",
  },
}

export default async function FaqPage() {
  const content = process.env.DATABASE_URL
    ? await getSiteContent().catch(() => ({}))
    : {}
  const allFaqs = faqCategories.flatMap((category) => category.items)

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Strona główna", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
            {
              "@type": "FAQPage",
              mainEntity: allFaqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="relative overflow-hidden bg-foreground pt-20 text-background">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/10 lg:block" aria-hidden="true">
          <div className="grid h-full grid-cols-4 opacity-10">
            {Array.from({ length: 20 }).map((_, index) => (
              <span key={index} className="border-b border-r border-white" />
            ))}
          </div>
        </div>
        <div className="site-container relative grid min-h-[480px] items-center gap-12 py-16 lg:grid-cols-[1fr_0.45fr] lg:py-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">Centrum pomocy</p>
            <h1 className="mt-6 max-w-5xl text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
              Dobra podróż zaczyna się od dobrych informacji
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/65">
              Znajdź konkretną odpowiedź o rezerwacji, bilecie, transporcie, noclegu i przebiegu wyjazdu.
            </p>
          </div>
          <div className="hidden lg:block">
            <BookOpen className="size-20 text-primary" strokeWidth={1.2} aria-hidden="true" />
            <p className="mt-6 font-sans text-3xl font-black uppercase">{allFaqs.length} odpowiedzi</p>
            <p className="mt-2 text-sm text-background/55">Pogrupowanych według etapu podróży.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-secondary/60 py-8">
        <div className="site-container">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">Najczęściej sprawdzane</p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
            {popularFaqs.map((item) => {
              const category = faqCategories.find((entry) => entry.items.includes(item))
              return (
                <a key={item.question} href={`#${category?.id}`} className="min-h-11 shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary">
                  {item.question}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <FaqBrowser />
        </div>
      </section>

      <section className="bg-foreground py-16 text-background md:py-20">
        <div className="site-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <MessageCircle className="size-7 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none md:text-5xl">Nie znalazłeś odpowiedzi?</h2>
            <p className="mt-4 leading-7 text-background/65">Opisz swój wyjazd lub sytuację. Odpowiemy na podstawie konkretnej oferty i etapu rezerwacji.</p>
          </div>
          <Button size="lg" className="h-12 px-6" nativeButton={false} render={<Link href="/kontakt" />}>
            Przejdź do kontaktu <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <div className="border-b border-foreground/10 bg-secondary/50 py-6">
        <div className="site-container text-sm leading-6 text-muted-foreground">
          Zasady dotyczące konkretnej rezerwacji wynikają z oferty, umowy i{" "}
          <Link href="/warunki-uczestnictwa" className="font-semibold text-foreground underline decoration-primary underline-offset-4">
            warunków uczestnictwa
          </Link>
          .
        </div>
      </div>

      <SiteFooter content={content} />
    </main>
  )
}
