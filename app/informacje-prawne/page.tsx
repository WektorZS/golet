import type { Metadata } from "next"
import { getSiteContent } from "@/lib/content"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Informacje prawne | Let’s Gol",
  description: "Polityka prywatności, informacje o cookies i warunki korzystania z serwisu Let’s Gol.",
}

export default async function LegalPage() {
  const settings = await getSiteContent()
  const companyName = settings.companyName || "[UZUPEŁNIJ NAZWĘ FIRMY]"
  const companyAddress = settings.companyAddress || "[UZUPEŁNIJ ADRES FIRMY]"
  const companyNip = settings.companyNip || "[UZUPEŁNIJ NIP]"
  const email = settings.contactEmail || "[UZUPEŁNIJ E-MAIL]"

  return (
    <main>
      <div className="relative bg-foreground pb-16 pt-28 text-background"><SiteHeader /><div className="mx-auto max-w-4xl px-4 md:px-6"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Dokumenty i bezpieczeństwo</p><h1 className="mt-4 font-sans text-5xl font-black uppercase tracking-tight md:text-7xl">Informacje prawne</h1><p className="mt-5 max-w-2xl text-background/65">Zasady przetwarzania danych, korzystania z cookies oraz informacje dla klientów.</p></div></div>
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 md:px-6">
        <aside className="rounded-xl border border-primary bg-primary/10 p-5"><h2 className="font-bold">Wymagane uzupełnienie danych firmy</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dane firmy nie zostały jeszcze potwierdzone.</p></aside>

        <section id="administrator" className="scroll-mt-24"><h2 className="font-sans text-3xl font-black uppercase">Administrator danych</h2><div className="mt-4 flex flex-col gap-2 leading-relaxed text-muted-foreground"><p>Administratorem danych osobowych jest <strong className="text-foreground">{companyName}</strong>.</p><p>Adres: {companyAddress}</p><p>NIP: {companyNip}</p><p>Kontakt w sprawach danych osobowych: <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">{email}</a></p></div></section>

        <section id="prywatnosc" className="scroll-mt-24"><h2 className="font-sans text-3xl font-black uppercase">Polityka prywatności i RODO</h2><div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground"><p>Dane podane w formularzu kontaktowym (imię i nazwisko, e-mail, telefon, preferencje dotyczące meczu, miejsce wylotu, liczba podróżnych i treść wiadomości) są przetwarzane w celu odpowiedzi na zapytanie i przygotowania oferty.</p><p>Podstawą przetwarzania jest zgoda osoby wysyłającej formularz oraz podjęcie działań na jej żądanie przed zawarciem umowy. Podanie danych jest dobrowolne, ale niezbędne do otrzymania odpowiedzi.</p><p>Dane powinny być przechowywane nie dłużej, niż jest to potrzebne do obsługi zapytania, a następnie przez okres wymagany do obrony przed ewentualnymi roszczeniami. Odbiorcami danych mogą być dostawcy hostingu, poczty i infrastruktury IT działający na podstawie odpowiednich umów.</p><p>Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, cofnięcia zgody oraz wniesienia sprzeciwu. Możesz również złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.</p></div></section>

        <section id="cookies" className="scroll-mt-24"><h2 className="font-sans text-3xl font-black uppercase">Pliki cookies</h2><div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground"><p>Serwis używa niezbędnych cookies do zapamiętania wyboru prywatności i obsługi bezpiecznej sesji. Nie wymagają one zgody, ponieważ są konieczne do działania serwisu.</p><p>Analityka jest uruchamiana dopiero po wybraniu opcji „Akceptuję analitykę”. Zgodę można w każdej chwili zmienić przyciskiem ciasteczka „Ustawienia cookies” widocznym na stronie w lewym dolnym rogu strony.</p></div></section>

        <section id="warunki" className="scroll-mt-24">
  <h2 className="font-sans text-3xl font-black uppercase">
    Warunki uczestnictwa
  </h2>

  <p className="mt-4 leading-relaxed text-muted-foreground">
    Przed dokonaniem rezerwacji prosimy o zapoznanie się z Warunkami
    Uczestnictwa, które określają najważniejsze zasady dotyczące organizacji
    wyjazdów, zakresu świadczeń, płatności, rezygnacji, reklamacji oraz
    odpowiedzialności Organizatora. Złożenie rezerwacji wiąże się z potwierdzeniem, że zapoznałeś się z warunkami uczestnictwa.
  </p>

  <Link
    href="/warunki-uczestnictwa"
    className="mt-5 inline-flex font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
  >
    Zapoznaj się z Warunkami Uczestnictwa →
  </Link>
</section>
      </div>
      <SiteFooter />
    </main>
  )
}
