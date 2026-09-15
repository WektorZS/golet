import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  ShieldCheck,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Warunki uczestnictwa",
  description:
    "Warunki uczestnictwa w wyjazdach organizowanych przez Let’s Gol na wydarzenia sportowe w Polsce i Europie.",
  alternates: { canonical: "/warunki-uczestnictwa" },
}

export default function WarunkiUczestnictwaPage() {
  const organizer = {
    name: "LB Coaching Łukasz Borger",
    address: "ul. Stefana Roweckiego 1/2, 72-010 Police",
    nip: "8512915273",
    regon: "520474445",
    registerNumber: "34/25",
    ewidencjaNumber: "42848",
    authority: "Marszałek Województwa Zachodniopomorskiego",

    email: "kontakt.letsgol@gmail.com",
    phone: "+48501465318",
  }

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [breadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Warunki uczestnictwa", path: "/warunki-uczestnictwa" },
        ])],
      }} />
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Button
            variant="ghost"
            className="text-background hover:bg-background/10 hover:text-background"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Strona główna
          </Button>

          <Link
            href="/"
            className="font-sans text-xl font-black uppercase"
          >
            Let&apos;s Gol{" "}
            <span className="text-primary">/ Warunki uczestnictwa</span>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Informacje dla podróżnych
            </p>

            <h1 className="font-sans text-4xl font-black uppercase tracking-tight md:text-5xl">
              Warunki uczestnictwa
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Niniejszy dokument określa zasady udziału w wyjazdach
              organizowanych przez Let&apos;s Gol, w szczególności wyjazdach
              na wydarzenia sportowe w Polsce i Europie.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="space-y-12">

          {/* INFO BOX */}
          <aside className="rounded-xl border border-primary bg-primary/10 p-6">
            <div className="flex gap-4">
              <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />

              <div>
                <h2 className="font-sans text-xl font-black uppercase">
                  Organizator turystyki
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Let&apos;s Gol jest marką prowadzoną przez przedsiębiorcę
                  wpisanego do rejestru organizatorów turystyki oraz
                  przedsiębiorców ułatwiających nabywanie powiązanych usług
                  turystycznych.
                </p>
              </div>
            </div>
          </aside>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              1. Postanowienia ogólne
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Niniejsze Warunki Uczestnictwa określają ogólne zasady udziału
                w wyjazdach organizowanych przez{" "}
                <strong className="text-foreground">
                  {organizer.name}
                </strong>
                , z adresem prowadzenia działalności:{" "}
                <strong className="text-foreground">
                  {organizer.address}
                </strong>
                , NIP:{" "}
                <strong className="text-foreground">
                  {organizer.nip}
                </strong>
                , zwanego dalej „Organizatorem”.
              </p>

              <p>
                Organizator prowadzi działalność jako Organizator Turystyki
                oraz Przedsiębiorca Ułatwiający Nabywanie Powiązanych Usług
                Turystycznych.
              </p>

              <p>
                Numer wpisu do rejestru:{" "}
                <strong className="text-foreground">
                  {organizer.registerNumber}
                </strong>
                . Numer ewidencyjny:{" "}
                <strong className="text-foreground">
                  {organizer.ewidencjaNumber}
                </strong>
                . Organ dokonujący wpisu:{" "}
                <strong className="text-foreground">
                  {organizer.authority}
                </strong>
                .
              </p>

              <p>
                Niniejsze Warunki Uczestnictwa mają zastosowanie do umów,
                w których Organizator występuje jako organizator turystyki,
                chyba że z dokumentów dotyczących konkretnej usługi wyraźnie
                wynika inny charakter prawny danej usługi.
              </p>

              <p>
                Szczegółowe informacje dotyczące konkretnego wyjazdu, w tym
                termin, miejsce, zakres świadczeń, transport, zakwaterowanie,
                wydarzenie sportowe, cena oraz warunki szczególne, są określone
                w ofercie oraz dokumentach przekazywanych podróżnemu przed
                zawarciem umowy.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              2. Definicje
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                <strong className="text-foreground">Podróżny</strong> - osoba,
                która zamierza zawrzeć umowę o udział w imprezie turystycznej
                albo jest uprawniona do podróżowania na podstawie zawartej umowy.
              </p>

              <p>
                <strong className="text-foreground">Uczestnik</strong> - osoba
                korzystająca ze świadczeń objętych konkretną umową lub ofertą.
              </p>

              <p>
                <strong className="text-foreground">Impreza turystyczna</strong>{" "}
                - połączenie co najmniej dwóch różnych rodzajów usług
                turystycznych na potrzeby tej samej podróży lub wakacji,
                jeżeli spełnione są warunki przewidziane w obowiązujących
                przepisach prawa.
              </p>

              <p>
                <strong className="text-foreground">Oferta</strong> - opis
                konkretnego wyjazdu lub usługi, zawierający istotne informacje
                dotyczące proponowanych świadczeń.
              </p>

              <p>
                <strong className="text-foreground">Umowa</strong> - umowa
                dotycząca udziału w konkretnej imprezie turystycznej lub innej
                usłudze świadczonej przez Organizatora.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              3. Charakter oferowanych wyjazdów
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator organizuje w szczególności wyjazdy na wydarzenia
                sportowe, w tym mecze piłkarskie, turnieje, zawody i inne
                wydarzenia odbywające się w Polsce i innych państwach Europy.
              </p>

              <p>
                W zależności od konkretnej oferty wyjazd może obejmować
                w szczególności transport, zakwaterowanie, bilety na wydarzenie,
                transfery, ubezpieczenie lub inne świadczenia wskazane w umowie
                albo ofercie.
              </p>

              <p>
                Każdorazowo charakter prawny konkretnej usługi wynika
                z jej rzeczywistego zakresu oraz sposobu sprzedaży, zgodnie
                z obowiązującymi przepisami prawa.
              </p>

              <p>
                Niniejsze Warunki Uczestnictwa nie zastępują obowiązkowych
                informacji przekazywanych podróżnemu przed zawarciem konkretnej
                umowy, w tym odpowiedniego standardowego formularza
                informacyjnego, jeżeli jest wymagany przez przepisy prawa.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              4. Zawarcie umowy i rezerwacja
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Przed zawarciem umowy Organizator przekazuje podróżnemu
                informacje wymagane obowiązującymi przepisami prawa, w zakresie
                właściwym dla rodzaju oferowanej usługi.
              </p>

              <p>
                Rezerwacja może być dokonywana w sposób wskazany przez
                Organizatora, w szczególności za pośrednictwem strony
                internetowej, poczty elektronicznej, telefonu lub innego
                udostępnionego kanału komunikacji.
              </p>

              <p>
                Umowa zostaje zawarta w sposób zgodny z obowiązującymi
                przepisami oraz procedurą przedstawioną podróżnemu podczas
                procesu rezerwacji.
              </p>

              <p>
                Po zawarciu umowy podróżny otrzymuje potwierdzenie jej zawarcia
                lub inny dokument potwierdzający treść uzgodnionych świadczeń.
              </p>

              <p>
                Osoba dokonująca rezerwacji dla innych uczestników powinna
                posiadać uprawnienie do przekazania danych oraz informacji
                dotyczących tych osób w zakresie niezbędnym do realizacji
                wyjazdu.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              5. Cena i płatności
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Cena konkretnego wyjazdu oraz zakres świadczeń objętych ceną
                są wskazywane w ofercie lub umowie.
              </p>

              <p>
                Informacje o wymaganych zaliczkach, płatnościach częściowych
                oraz terminie zapłaty pozostałej części ceny są przekazywane
                podróżnemu przed zawarciem umowy lub określane w umowie.
              </p>

              <p>
                Cena może zostać zmieniona wyłącznie w przypadkach
                dopuszczonych przez obowiązujące przepisy prawa oraz zgodnie
                z warunkami przewidzianymi w konkretnej umowie.
              </p>

              <p>
                Jeżeli umowa przewiduje możliwość podwyższenia ceny,
                podróżny posiada również prawo do odpowiedniego obniżenia ceny
                w przypadkach i na zasadach określonych przez obowiązujące
                przepisy.
              </p>

              <p>
                Jeżeli podwyżka ceny przekroczy próg określony w obowiązujących
                przepisach, podróżnemu przysługują uprawnienia przewidziane
                przez prawo, w tym możliwość rozwiązania umowy bez ponoszenia
                opłaty za odstąpienie, jeżeli spełnione są ustawowe przesłanki.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              6. Transport
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Rodzaj transportu, miejsce rozpoczęcia podróży, planowane
                godziny oraz inne istotne informacje są określane w ofercie,
                umowie lub dokumentach podróży.
              </p>

              <p>
                W przypadku transportu lotniczego uczestnika obowiązują
                również uzasadnione wymogi przewoźnika, w szczególności
                dotyczące dokumentów podróży, odprawy, bagażu oraz zasad
                bezpieczeństwa.
              </p>

              <p>
                Podróżny jest zobowiązany do posiadania dokumentów niezbędnych
                do realizacji podróży, jeżeli obowiązek ich posiadania wynika
                z przepisów lub warunków przewoźnika.
              </p>

              <p>
                Godziny lotów, numery rejsów, miejsce zbiórki oraz inne elementy
                organizacyjne mogą ulec zmianie z przyczyn niezależnych od
                Organizatora. W przypadku zmian Organizator informuje
                podróżnego zgodnie z obowiązującymi przepisami i charakterem
                danej zmiany.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              7. Zakwaterowanie
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Zakwaterowanie odbywa się w obiekcie wskazanym w ofercie,
                umowie lub dokumentach podróży.
              </p>

              <p>
                Standard obiektu, rodzaj pokoju, liczba osób w pokoju oraz
                inne istotne informacje są określane dla konkretnego wyjazdu.
              </p>

              <p>
                Uczestnik zobowiązany jest do przestrzegania uzasadnionych
                zasad obowiązujących w obiekcie zakwaterowania.
              </p>

              <p>
                Uczestnik ponosi odpowiedzialność za szkody wyrządzone przez
                siebie zgodnie z obowiązującymi przepisami prawa.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              8. Bilety na wydarzenia sportowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Jeżeli bilet na wydarzenie sportowe jest objęty zakresem
                konkretnej umowy, jego rodzaj, kategoria lub inne istotne
                cechy są określane w ofercie, umowie albo dokumentach
                przekazywanych podróżnemu.
              </p>

              <p>
                Sposób przekazania biletu może zależeć od zasad organizatora
                wydarzenia, operatora systemu biletowego lub innych podmiotów
                odpowiedzialnych za dystrybucję biletów.
              </p>

              <p>
                Uczestnik zobowiązany jest przestrzegać zasad wejścia na obiekt,
                zasad bezpieczeństwa oraz regulaminu obowiązującego podczas
                wydarzenia.
              </p>

              <p>
                Jeżeli określone miejsce na stadionie, hali lub innym obiekcie
                zostało wyraźnie zagwarantowane w umowie, Organizator realizuje
                świadczenie zgodnie z jej treścią.
              </p>

              <p>
                Organizator nie odpowiada za odmowę wstępu na wydarzenie
                wynikającą z zachowania uczestnika, braku wymaganych dokumentów,
                naruszenia regulaminu obiektu lub innych okoliczności
                leżących po stronie uczestnika.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              9. Zmiana terminu lub odwołanie wydarzenia sportowego
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Wydarzenia sportowe mogą zostać przełożone, odwołane,
                przeniesione do innej lokalizacji, odbyć się bez udziału
                publiczności lub ulec innym zmianom.
              </p>

              <p>
                Decyzje dotyczące terminu, miejsca lub sposobu przeprowadzenia
                wydarzenia podejmują właściwe podmioty, w szczególności
                organizator wydarzenia, federacja sportowa, liga lub właściwe
                organy publiczne.
              </p>

              <p>
                Sama zmiana terminu wydarzenia sportowego nie oznacza
                automatycznie, że Organizator może dowolnie zmienić warunki
                zawartej umowy. Każda zmiana dotycząca świadczeń objętych
                umową jest oceniana zgodnie z obowiązującymi przepisami oraz
                charakterem i znaczeniem tej zmiany dla konkretnego wyjazdu.
              </p>

              <p>
                Jeżeli zmiana istotnie wpływa na realizację imprezy turystycznej,
                podróżnemu przysługują uprawnienia przewidziane w obowiązujących
                przepisach, w tym - w odpowiednich przypadkach - możliwość
                zaakceptowania proponowanej zmiany, przyjęcia świadczenia
                zastępczego lub rozwiązania umowy bez opłaty za odstąpienie.
              </p>
            </div>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              10. Zmiany przed rozpoczęciem wyjazdu
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator może dokonać zmian w umowie przed rozpoczęciem
                wyjazdu wyłącznie na zasadach przewidzianych w obowiązujących
                przepisach oraz w umowie.
              </p>

              <p>
                W przypadku zmiany nieznacznej Organizator może poinformować
                podróżnego o zmianie na trwałym nośniku informacji.
              </p>

              <p>
                Jeżeli Organizator jest zmuszony istotnie zmienić główne
                właściwości usług turystycznych lub nie może spełnić
                szczególnych wymagań zaakceptowanych przez strony, podróżnemu
                przysługują uprawnienia określone przez obowiązujące przepisy.
              </p>

              <p>
                Informacja o zmianie powinna zawierać dane pozwalające
                podróżnemu na podjęcie decyzji w zakresie przysługujących mu
                uprawnień, w tym - jeżeli jest to wymagane - termin na
                udzielenie odpowiedzi.
              </p>
            </div>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              11. Przeniesienie umowy na inną osobę
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Podróżny może przenieść prawa i obowiązki wynikające z umowy
                na inną osobę spełniającą warunki udziału w wyjeździe, na
                zasadach określonych w obowiązujących przepisach.
              </p>

              <p>
                Informację o przeniesieniu umowy należy przekazać
                Organizatorowi odpowiednio wcześniej, na trwałym nośniku.
              </p>

              <p>
                Osoba przekazująca prawa i obowiązki oraz osoba przejmująca
                je mogą ponosić odpowiedzialność za zapłatę pozostałej części
                ceny oraz uzasadnionych kosztów wynikających z przeniesienia.
              </p>

              <p>
                Organizator może pobrać wyłącznie rzeczywiste i uzasadnione
                koszty bezpośrednio związane z przeniesieniem umowy, zgodnie
                z obowiązującymi przepisami.
              </p>
            </div>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              12. Rezygnacja i odstąpienie przez podróżnego
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Podróżny może przed rozpoczęciem imprezy turystycznej odstąpić
                od umowy na zasadach określonych w obowiązujących przepisach.
              </p>

              <p>
                Jeżeli odstąpienie następuje z przyczyn leżących po stronie
                podróżnego, Organizator może pobrać odpowiednią i uzasadnioną
                opłatę za odstąpienie, o ile możliwość taka wynika z umowy
                i obowiązujących przepisów.
              </p>

              <p>
                Wysokość ewentualnej opłaty za odstąpienie powinna uwzględniać
                w szczególności moment odstąpienia, oczekiwane oszczędności
                kosztów oraz możliwość wykorzystania świadczeń w inny sposób,
                zgodnie z obowiązującymi przepisami.
              </p>

              <p>
                Na żądanie podróżnego Organizator przedstawia uzasadnienie
                wysokości pobranej opłaty, jeżeli obowiązek taki wynika
                z przepisów prawa.
              </p>

              <p>
                Podróżny może odstąpić od umowy bez ponoszenia opłaty
                za odstąpienie, jeżeli w miejscu docelowym lub jego
                bezpośrednim sąsiedztwie wystąpią nieuniknione
                i nadzwyczajne okoliczności znacząco wpływające na realizację
                imprezy turystycznej lub przewóz podróżnych do miejsca
                docelowego - jeżeli spełnione są ustawowe przesłanki.
              </p>
            </div>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              13. Odwołanie wyjazdu przez Organizatora
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator może rozwiązać umowę przed rozpoczęciem wyjazdu
                w przypadkach przewidzianych przez obowiązujące przepisy prawa.
              </p>

              <p>
                Jeżeli umowa przewiduje minimalną liczbę uczestników
                niezbędną do realizacji wyjazdu, Organizator może odwołać
                wyjazd z powodu nieosiągnięcia tej liczby wyłącznie na zasadach
                i w terminach wynikających z obowiązujących przepisów oraz
                umowy.
              </p>

              <p>
                Organizator może również rozwiązać umowę, jeżeli realizację
                wyjazdu uniemożliwiają nieuniknione i nadzwyczajne okoliczności,
                zgodnie z obowiązującymi przepisami.
              </p>

              <p>
                W przypadku rozwiązania umowy przez Organizatora podróżnemu
                przysługują zwroty oraz inne uprawnienia wynikające
                z obowiązujących przepisów.
              </p>
            </div>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              14. Realizacja świadczeń i niezgodność
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator odpowiada za prawidłowe wykonanie usług objętych
                umową w zakresie wynikającym z obowiązujących przepisów,
                niezależnie od tego, czy dane świadczenie jest wykonywane
                bezpośrednio przez Organizatora czy przez innego usługodawcę.
              </p>

              <p>
                Jeżeli podczas wyjazdu podróżny stwierdzi niezgodność
                świadczenia z umową, powinien - w miarę możliwości -
                niezwłocznie poinformować Organizatora lub jego przedstawiciela,
                aby umożliwić podjęcie działań naprawczych.
              </p>

              <p>
                Organizator podejmuje działania w celu usunięcia stwierdzonej
                niezgodności, chyba że jest to niemożliwe albo wymagałoby
                niewspółmiernych kosztów, z uwzględnieniem charakteru
                niezgodności oraz wartości świadczeń.
              </p>

              <p>
                Jeżeli istotnej części usług nie można zrealizować zgodnie
                z umową, Organizator podejmuje działania przewidziane
                obowiązującymi przepisami, w tym - w odpowiednich przypadkach -
                proponuje odpowiednie świadczenia zastępcze.
              </p>
            </div>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              15. Obniżenie ceny i odszkodowanie
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Podróżnemu mogą przysługiwać uprawnienia do obniżenia ceny
                oraz naprawienia szkody wynikającej z niewykonania lub
                nienależytego wykonania usług, na zasadach określonych
                w obowiązujących przepisach.
              </p>

              <p>
                Odpowiedzialność Organizatora oraz zakres ewentualnego
                odszkodowania są oceniane zgodnie z przepisami prawa,
                w tym - jeżeli ma to zastosowanie - z odpowiednimi
                przepisami prawa Unii Europejskiej i konwencjami
                międzynarodowymi.
              </p>
            </div>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              16. Pomoc podróżnemu
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                W przypadku gdy podróżny znajdzie się w trudnej sytuacji
                podczas realizacji imprezy turystycznej, Organizator udziela
                odpowiedniej pomocy bez zbędnej zwłoki, na zasadach określonych
                w obowiązujących przepisach.
              </p>

              <p>
                Pomoc może obejmować w szczególności przekazanie informacji
                dotyczących lokalnych służb, placówek medycznych, władz
                publicznych lub pomocy konsularnej oraz pomoc w komunikacji
                na odległość lub znalezieniu alternatywnych rozwiązań.
              </p>

              <p>
                Jeżeli trudna sytuacja została spowodowana umyślnie przez
                podróżnego lub wskutek jego rażącego zaniedbania, Organizator
                może pobrać opłatę za faktycznie poniesione i uzasadnione
                koszty pomocy, jeżeli jest to dopuszczalne przez obowiązujące
                przepisy.
              </p>
            </div>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              17. Obowiązki uczestnika
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik zobowiązany jest do przestrzegania obowiązujących
                przepisów prawa, zasad bezpieczeństwa oraz uzasadnionych
                instrukcji przekazywanych przez Organizatora lub osoby
                odpowiedzialne za realizację wyjazdu.
              </p>

              <p>
                Uczestnik powinien posiadać dokumenty wymagane do odbycia
                podróży, przekroczenia granic lub skorzystania z określonych
                świadczeń.
              </p>

              <p>
                Uczestnik odpowiada za podanie prawidłowych danych osobowych
                oraz niezwłoczne poinformowanie Organizatora o zmianach,
                które mogą mieć znaczenie dla realizacji wyjazdu.
              </p>

              <p>
                Uczestnik zobowiązany jest szanować prawa innych uczestników,
                pracowników usługodawców oraz osób trzecich.
              </p>
            </div>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              18. Reklamacje i zgłoszenia
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Podróżny ma prawo zgłosić Organizatorowi niezgodność
                świadczenia z umową oraz złożyć reklamację dotyczącą realizacji
                usług.
              </p>

              <p>
                W przypadku problemu występującego podczas wyjazdu zaleca się
                niezwłoczne poinformowanie Organizatora lub jego przedstawiciela,
                aby umożliwić podjęcie działań naprawczych.
              </p>

              <p>
                Reklamację można przesłać na adres e-mail:
              </p>

              <p className="font-semibold text-foreground">
                {organizer.email}
              </p>

              <p>
                W reklamacji warto wskazać dane umożliwiające identyfikację
                sprawy, w szczególności imię i nazwisko, numer rezerwacji,
                opis problemu, datę i miejsce jego wystąpienia oraz oczekiwany
                sposób rozwiązania sprawy.
              </p>

              <p>
                Brak wskazania wszystkich powyższych informacji nie pozbawia
                podróżnego praw wynikających z obowiązujących przepisów,
                jeżeli zgłoszenie pozwala na identyfikację sprawy.
              </p>
            </div>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              19. Dokumenty podróży i kontakt podczas wyjazdu
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Przed rozpoczęciem wyjazdu uczestnik otrzymuje informacje
                organizacyjne niezbędne do realizacji świadczeń, w zakresie
                właściwym dla konkretnego wyjazdu.
              </p>

              <p>
                Informacje mogą obejmować w szczególności dane dotyczące
                transportu, miejsca zbiórki, zakwaterowania, biletów,
                transferów, programu oraz danych kontaktowych do Organizatora
                lub osoby odpowiedzialnej za obsługę wyjazdu.
              </p>

              <p>
                Uczestnik powinien zapewnić możliwość kontaktu pod wskazanym
                przez siebie numerem telefonu lub adresem e-mail oraz
                poinformować Organizatora o zmianie danych kontaktowych.
              </p>

              <div className="rounded-xl border bg-card p-5">
                <p className="font-semibold text-foreground">
                  Kontakt Organizatora:
                </p>

                <p className="mt-2">
                  E-mail: {organizer.email}
                </p>

                <p>
                  Telefon: {organizer.phone}
                </p>

                <p className="mt-3 text-xs">
                  W przypadku konkretnych wyjazdów dane do kontaktu podczas
                  podróży mogą zostać przekazane uczestnikom oddzielnie.
                </p>
              </div>
            </div>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              20. Ubezpieczenie i bezpieczeństwo
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Informacja o tym, czy ubezpieczenie jest objęte ceną konkretnego
                wyjazdu, jest każdorazowo wskazywana w ofercie lub umowie.
              </p>

              <p>
                Zakres ochrony ubezpieczeniowej wynika z warunków konkretnej
                umowy ubezpieczenia oraz dokumentów przekazywanych przez
                ubezpieczyciela.
              </p>

              <p>
                Uczestnik powinien zapoznać się z zakresem ubezpieczenia,
                w tym z wyłączeniami i ograniczeniami odpowiedzialności,
                przed rozpoczęciem podróży.
              </p>
            </div>
          </section>

          {/* 21 */}
<section>
  <h2 className="text-2xl font-black uppercase">
    21. Ochrona na wypadek niewypłacalności
  </h2>

  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
    <p>
      Organizator posiada wymagane przepisami prawa zabezpieczenie finansowe
      na wypadek niewypłacalności.
    </p>

    <p>
      Informacje dotyczące aktualnego zabezpieczenia finansowego Organizatora
      oraz aktualnego wpisu są dostępne w Centralnej Ewidencji Organizatorów
      Turystyki i Przedsiębiorców Ułatwiających Nabywanie Powiązanych Usług
      Turystycznych.
    </p>

    <p>
      Numer ewidencyjny Organizatora:{" "}
      <strong className="text-foreground">
        {organizer.ewidencjaNumber}
      </strong>
      .
    </p>

    <p>
      Informacje dotyczące ochrony podróżnego w przypadku niewypłacalności
      Organizatora są przekazywane również w zakresie wymaganym przez
      obowiązujące przepisy przed zawarciem konkretnej umowy.
    </p>
  </div>
</section>

          {/* 22 */}
<section>
  <h2 className="text-2xl font-black uppercase">
    22. Nieuniknione i nadzwyczajne okoliczności
  </h2>

  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
    <p>
      Realizacja wyjazdu może zostać dotknięta przez nieuniknione
      i nadzwyczajne okoliczności pozostające poza kontrolą stron, których
      skutków nie można było uniknąć mimo podjęcia wszelkich rozsądnych działań.
    </p>

    <p>
      Mogą do nich należeć między innymi poważne zagrożenia bezpieczeństwa,
      konflikty zbrojne, katastrofy naturalne, poważne zakłócenia transportu
      lub inne zdarzenia znacząco wpływające na możliwość realizacji wyjazdu.
    </p>

    <p>
      Skutki takich okoliczności dla praw i obowiązków stron są oceniane
      zgodnie z obowiązującymi przepisami oraz okolicznościami konkretnej
      sprawy.
    </p>
  </div>
</section>

          {/* 23 */}
<section>
  <h2 className="text-2xl font-black uppercase">
    23. Dane osobowe i prywatność
  </h2>

  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
    <p>
      Szczegółowe informacje dotyczące przetwarzania danych osobowych,
      w tym informacje o Administratorze, celach i podstawach przetwarzania,
      odbiorcach danych, okresach przechowywania danych, prawach osób,
      których dane dotyczą, oraz plikach cookies znajdują się w dokumencie
      „Polityka prywatności i cookies”.
    </p>

    <Link
      href="/polityka-prywatnosci"
      className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4"
    >
      <ShieldCheck className="size-4" />
      Przejdź do Polityki prywatności i cookies
    </Link>
  </div>
</section>

          {/* 24 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              24. Pozasądowe rozwiązywanie sporów
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Konsument może korzystać z pozasądowych sposobów rozwiązywania
                sporów konsumenckich na zasadach określonych w obowiązujących
                przepisach.
              </p>

              <p>
                Szczegółowe informacje dotyczące dostępnych form pomocy
                konsumenckiej można uzyskać w szczególności u właściwych
                instytucji publicznych oraz organizacji zajmujących się ochroną
                konsumentów.
              </p>
            </div>
          </section>

          {/* 25 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              25. Znaki towarowe i oznaczenia podmiotów trzecich
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Let&apos;s Gol jest niezależnym organizatorem turystyki oferującym
                wyjazdy na wydarzenia sportowe. O ile wyraźnie nie wskazano
                inaczej, Let&apos;s Gol nie jest oficjalnym partnerem, sponsorem ani
                przedstawicielem prezentowanych klubów, lig, federacji ani
                organizatorów wydarzeń.
              </p>

              <p>
                Nazwy, herby, logotypy oraz inne oznaczenia klubów, lig,
                federacji i wydarzeń prezentowane w Serwisie należą do ich
                odpowiednich właścicieli. Oznaczenia te są wykorzystywane w celu
                identyfikacji i przekazania informacji o wydarzeniach, których
                dotyczą prezentowane oferty. Ich wykorzystanie nie oznacza
                istnienia partnerstwa, sponsoringu, autoryzacji ani innego
                oficjalnego powiązania pomiędzy Let&apos;s Gol a właścicielami tych
                oznaczeń.
              </p>
            </div>
          </section>

          {/* 26 */}
          <section>
            <h2 className="text-2xl font-black uppercase">
              26. Postanowienia końcowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Niniejsze Warunki Uczestnictwa stanowią ogólne warunki
                obowiązujące w zakresie, w jakim mają zastosowanie do konkretnej
                umowy.
              </p>

              <p>
                W sprawach nieuregulowanych niniejszym dokumentem zastosowanie
                mają postanowienia konkretnej umowy oraz obowiązujące przepisy
                prawa, w szczególności przepisy dotyczące imprez turystycznych,
                ochrony konsumentów oraz prawa cywilnego.
              </p>

              <p>
                Postanowienia niniejszego dokumentu nie ograniczają praw
                podróżnego wynikających z bezwzględnie obowiązujących
                przepisów prawa.
              </p>

              <p>
                Zmiany niniejszych Warunków Uczestnictwa nie wpływają
                na prawa i obowiązki wynikające z umów zawartych przed wejściem
                zmian w życie, chyba że obowiązujące przepisy stanowią inaczej
                lub zmiana została skutecznie uzgodniona zgodnie z prawem.
              </p>
            </div>
          </section>

          {/* ORGANIZER */}
          <section className="rounded-xl border bg-card p-6 md:p-8">
            <div className="flex gap-4">
              <Scale className="mt-1 size-6 shrink-0 text-primary" />

              <div>
                <h2 className="text-xl font-black uppercase">
                  Organizator
                </h2>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {organizer.name}
                  </p>

                  <p>{organizer.address}</p>

                  <p>NIP: {organizer.nip}</p>
                  <p>REGON: 520474445</p>
                  <p>
                    Numer wpisu do rejestru:{" "}
                    {organizer.registerNumber}
                  </p>

                  <p>
                    Numer ewidencyjny:{" "}
                    {organizer.ewidencjaNumber}
                  </p>

                  <p>
                    Organ wpisujący:{" "}
                    {organizer.authority}
                  </p>

                  <p>E-mail: {organizer.email}</p>

                  <p>Telefon: {organizer.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
              <AlertTriangle className="size-5 shrink-0 text-primary" />

              <p>
                Szczegółowe warunki konkretnego wyjazdu, zakres świadczeń,
                cena, terminy płatności oraz informacje wymagane przepisami
                prawa są każdorazowo przekazywane podróżnemu w dokumentach
                dotyczących konkretnej rezerwacji.
              </p>
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              Ostatnia aktualizacja: 26 sierpnia 2026 r.
            </p>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
