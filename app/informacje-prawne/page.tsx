import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Informacje prawne | Let’s Gol",
  description: "Warunki uczestnictwa, polityka prywatności i informacje prawne Let’s Gol.",
}

const sections = [
  ["warunki", "Warunki uczestnictwa", "Niniejsza wersja demonstracyjna prezentuje docelową strukturę warunków imprezy turystycznej. Przed uruchomieniem sprzedaży organizator powinien uzupełnić pełne warunki umowy, zasady rezygnacji, reklamacji i płatności."],
  ["prywatnosc", "Polityka prywatności", "Dane z formularza są przetwarzane wyłącznie w celu przygotowania oferty i kontaktu w sprawie zapytania. Zakres, podstawa prawna, czas przechowywania oraz dane administratora wymagają uzupełnienia przed publikacją produkcyjną."],
  ["cookies", "Pliki cookies", "Serwis wykorzystuje wyłącznie mechanizmy niezbędne do działania strony i bezpiecznej sesji administratora. Dodatkowe narzędzia analityczne wymagają osobnej zgody użytkownika."],
] as const

export default function LegalPage() {
  return (
    <main>
      <div className="relative bg-foreground pb-16 pt-28 text-background"><SiteHeader /><div className="mx-auto max-w-4xl px-4 md:px-6"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Dokumenty i bezpieczeństwo</p><h1 className="mt-4 font-sans text-5xl font-black uppercase tracking-tight md:text-7xl">Informacje prawne</h1><p className="mt-5 max-w-2xl text-background/65">Treści poniżej są profesjonalnymi placeholderami i wymagają weryfikacji prawnej oraz uzupełnienia prawdziwych danych firmy.</p></div></div>
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 md:px-6">{sections.map(([id, title, content]) => <section id={id} key={id} className="scroll-mt-24"><h2 className="font-sans text-3xl font-black uppercase">{title}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{content}</p></section>)}</div>
      <SiteFooter />
    </main>
  )
}
