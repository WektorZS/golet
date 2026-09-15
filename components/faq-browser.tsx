"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { faqCategories } from "@/lib/faq"

function normalize(value: string) {
  return value
    .toLocaleLowerCase("pl-PL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function FaqBrowser() {
  const [query, setQuery] = useState("")
  const normalizedQuery = normalize(query.trim())

  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return faqCategories

    return faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          normalize(`${item.question} ${item.answer}`).includes(normalizedQuery)
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [normalizedQuery])

  const resultCount = visibleCategories.reduce(
    (sum, category) => sum + category.items.length,
    0
  )

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="surface-card p-4">
          <p className="px-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
            Kategorie
          </p>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col" aria-label="Kategorie FAQ">
            {faqCategories.map((category, index) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:bg-secondary"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {category.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj, np. bilet, bagaż, zmiana terminu"
            aria-label="Szukaj w pytaniach i odpowiedziach"
            className="h-14 rounded-xl border-foreground/15 bg-background pl-12 pr-12 text-base shadow-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Wyczyść wyszukiwanie"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {normalizedQuery
            ? `${resultCount} ${resultCount === 1 ? "wynik" : "wyników"}`
            : `${resultCount} odpowiedzi w ${faqCategories.length} kategoriach`}
        </p>

        {visibleCategories.length ? (
          <div className="mt-10 space-y-14">
            {visibleCategories.map((category, categoryIndex) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-28"
                aria-labelledby={`${category.id}-title`}
              >
                <div className="flex items-start gap-4 border-b border-foreground/12 pb-5">
                  <span className="mt-1 font-mono text-xs font-black text-primary">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 id={`${category.id}-title`} className="text-balance font-sans text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
                      {category.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Accordion className="mt-2">
                  {category.items.map((item) => (
                    <AccordionItem key={item.question} className="border-b border-foreground/10">
                      <AccordionTrigger className="min-h-16 px-1 py-5 text-base font-bold leading-6 hover:no-underline hover:text-primary md:text-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="max-w-3xl px-1 pb-6 text-[15px] leading-7 text-muted-foreground">
                        <p>{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        ) : (
          <div className="surface-card mt-10 p-8 text-center md:p-12">
            <h2 className="font-sans text-2xl font-black uppercase">Nie znaleźliśmy takiej odpowiedzi</h2>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
              Spróbuj krótszego hasła albo skontaktuj się z nami. Pomożemy w sprawie konkretnego wyjazdu.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
