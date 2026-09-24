import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, SearchX } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return {
    title: locale === "en" ? "Page not found" : "Nie znaleziono strony",
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="px-4 pb-20 pt-36 md:px-6 md:pb-28 md:pt-44">
        <div className="mx-auto max-w-4xl border-l-2 border-primary pl-6 md:pl-10">
          <SearchX className="size-10 text-primary" aria-hidden="true" />
          <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.2em] text-amber-800">
            404
          </p>
          <h1 className="mt-3 max-w-3xl font-sans text-5xl font-black uppercase leading-none md:text-7xl">
            {isEn ? "We could not find this page" : "Nie znaleźliśmy tej strony"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {isEn
              ? "The address may have changed or the page may no longer be available. Return to the home page or browse our current football trips."
              : "Adres mógł się zmienić albo strona nie jest już dostępna. Wróć na stronę główną lub zobacz aktualne wyjazdy piłkarskie."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button nativeButton={false} render={<Link href={routeFor(locale, "/")} />}>
              {isEn ? "Home page" : "Strona główna"}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={routeFor(locale, "/wyjazdy")} />}
            >
              {isEn ? "Browse trips" : "Zobacz wyjazdy"}
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
