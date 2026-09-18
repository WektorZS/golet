import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  ShieldCheck,
} from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { breadcrumbSchema, socialMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Warunki uczestnictwa",
  description:
    "Warunki uczestnictwa w wyjazdach organizowanych przez Let's Gol na wydarzenia sportowe w Polsce i Europie.",
  alternates: {
    canonical: "/warunki-uczestnictwa",
  },
  ...socialMetadata(
    "Warunki uczestnictwa | Let's Gol",
    "Zasady rezerwacji, płatności i udziału w wyjazdach organizowanych przez Let's Gol.",
    "/warunki-uczestnictwa"
  ),
}

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

const sectionLinks = [
  ["Informacje ogólne", "postanowienia-ogolne"],
  ["Rezerwacja", "rezerwacja"],
  ["Płatności", "platnosci"],
  ["Bilety", "bilety"],
  ["Zmiany meczu", "zmiana-wydarzenia"],
  ["Rezygnacja", "rezygnacja"],
  ["Reklamacje", "reklamacje"],
  ["Organizator", "organizator"],
] as const

function TermsSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-40"
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 font-mono text-xs font-black text-amber-800">
          {String(number).padStart(2, "0")}
        </span>

        <h2 className="font-sans text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>

      <div className="mt-5 space-y-4 pl-8 text-sm leading-7 text-muted-foreground md:pl-10 md:text-base">
        {children}
      </div>
    </section>
  )
}

export default function WarunkiUczestnictwaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
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
                name: "Warunki uczestnictwa",
                path: "/warunki-uczestnictwa",
              },
            ]),
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
          className="object-cover opacity-20"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />

        <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">
              Informacje dla podróżnych
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              Warunki uczestnictwa
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Zasady rezerwacji, płatności, organizacji oraz udziału
              w wyjazdach organizowanych przez Let&apos;s Gol.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <Scale
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              Zasady Twojego wyjazdu
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              Szczegóły konkretnego wyjazdu, zakres świadczeń
              i warunki płatności otrzymujesz przed zawarciem umowy.
            </p>
          </div>
        </div>
      </section>

      <nav
        aria-label="Sekcje Warunków uczestnictwa"
        className="sticky top-20 z-40 border-b border-foreground/10 bg-secondary/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 md:px-6">
          {sectionLinks.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <aside className="rounded-xl border border-primary/40 bg-primary/8 p-6 md:p-7">
          <div className="flex gap-4">
            <ShieldCheck
              className="mt-1 size-6 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Organizator turystyki
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Let&apos;s Gol jest marką prowadzoną przez przedsiębiorcę
                wpisanego do rejestru organizatorów turystyki oraz
                przedsiębiorców ułatwiających nabywanie powiązanych
                usług turystycznych.
              </p>
            </div>
          </div>
        </aside>

        <div className="mt-16 space-y-16">
          <TermsSection
            id="postanowienia-ogolne"
            number={1}
            title="Postanowienia ogólne"
          >
            <p>
              Niniejsze Warunki Uczestnictwa określają ogólne zasady
              udziału w wyjazdach organizowanych przez{" "}
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
              Organizator prowadzi działalność jako Organizator
              Turystyki oraz Przedsiębiorca Ułatwiający Nabywanie
              Powiązanych Usług Turystycznych.
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
              Niniejsze Warunki Uczestnictwa mają zastosowanie do
              umów, w których Organizator występuje jako organizator
              turystyki, chyba że z dokumentów dotyczących konkretnej
              usługi wyraźnie wynika inny charakter prawny danej
              usługi.
            </p>

            <p>
              Szczegółowe informacje dotyczące konkretnego wyjazdu,
              w tym termin, miejsce, zakres świadczeń, transport,
              zakwaterowanie, wydarzenie sportowe, cena oraz warunki
              szczególne, są określone w ofercie oraz dokumentach
              przekazywanych podróżnemu przed zawarciem umowy.
            </p>
          </TermsSection>

          <TermsSection
            id="definicje"
            number={2}
            title="Definicje"
          >
            <p>
              <strong className="text-foreground">
                Podróżny
              </strong>{" "}
              oznacza osobę, która zamierza zawrzeć umowę o udział
              w imprezie turystycznej albo jest uprawniona do
              podróżowania na podstawie zawartej umowy.
            </p>

            <p>
              <strong className="text-foreground">
                Uczestnik
              </strong>{" "}
              oznacza osobę korzystającą ze świadczeń objętych
              konkretną umową lub ofertą.
            </p>

            <p>
              <strong className="text-foreground">
                Impreza turystyczna
              </strong>{" "}
              oznacza połączenie co najmniej dwóch różnych rodzajów
              usług turystycznych na potrzeby tej samej podróży lub
              wakacji, jeżeli spełnione są warunki przewidziane
              w obowiązujących przepisach prawa.
            </p>

            <p>
              <strong className="text-foreground">
                Oferta
              </strong>{" "}
              oznacza opis konkretnego wyjazdu lub usługi,
              zawierający istotne informacje dotyczące proponowanych
              świadczeń.
            </p>

            <p>
              <strong className="text-foreground">
                Umowa
              </strong>{" "}
              oznacza umowę dotyczącą udziału w konkretnej imprezie
              turystycznej lub innej usłudze świadczonej przez
              Organizatora.
            </p>
          </TermsSection>

          <TermsSection
            id="charakter-wyjazdow"
            number={3}
            title="Charakter oferowanych wyjazdów"
          >
            <p>
              Organizator organizuje w szczególności wyjazdy na
              wydarzenia sportowe, w tym mecze piłkarskie, turnieje,
              zawody i inne wydarzenia odbywające się w Polsce
              i innych państwach Europy.
            </p>

            <p>
              W zależności od konkretnej oferty wyjazd może obejmować
              w szczególności transport, zakwaterowanie, bilety na
              wydarzenie, transfery, ubezpieczenie lub inne świadczenia
              wskazane w umowie albo ofercie.
            </p>

            <p>
              Każdorazowo charakter prawny konkretnej usługi wynika
              z jej rzeczywistego zakresu oraz sposobu sprzedaży,
              zgodnie z obowiązującymi przepisami prawa.
            </p>

            <p>
              Niniejsze Warunki Uczestnictwa nie zastępują
              obowiązkowych informacji przekazywanych podróżnemu
              przed zawarciem konkretnej umowy, w tym odpowiedniego
              standardowego formularza informacyjnego, jeżeli jest
              wymagany przez przepisy prawa.
            </p>
          </TermsSection>

          <TermsSection
            id="rezerwacja"
            number={4}
            title="Zawarcie umowy i rezerwacja"
          >
            <p>
              Przed zawarciem umowy Organizator przekazuje podróżnemu
              informacje wymagane obowiązującymi przepisami prawa,
              w zakresie właściwym dla rodzaju oferowanej usługi.
            </p>

            <p>
              Rezerwacja może być dokonywana w sposób wskazany przez
              Organizatora, w szczególności za pośrednictwem strony
              internetowej, poczty elektronicznej, telefonu lub innego
              udostępnionego kanału komunikacji.
            </p>

            <p>
              Umowa zostaje zawarta w sposób zgodny z obowiązującymi
              przepisami oraz procedurą przedstawioną podróżnemu
              podczas procesu rezerwacji.
            </p>

            <p>
              Po zawarciu umowy podróżny otrzymuje potwierdzenie jej
              zawarcia lub inny dokument potwierdzający treść
              uzgodnionych świadczeń.
            </p>

            <p>
              Osoba dokonująca rezerwacji dla innych uczestników
              powinna posiadać uprawnienie do przekazania danych oraz
              informacji dotyczących tych osób w zakresie niezbędnym
              do realizacji wyjazdu.
            </p>
          </TermsSection>

          <TermsSection
            id="platnosci"
            number={5}
            title="Cena i płatności"
          >
            <p>
              Cena konkretnego wyjazdu oraz zakres świadczeń objętych
              ceną są wskazywane w ofercie lub umowie.
            </p>

            <p>
              Informacje o wymaganych zaliczkach, płatnościach
              częściowych oraz terminie zapłaty pozostałej części
              ceny są przekazywane podróżnemu przed zawarciem umowy
              lub określane w umowie.
            </p>

            <p>
              Cena może zostać zmieniona wyłącznie w przypadkach
              dopuszczonych przez obowiązujące przepisy prawa oraz
              zgodnie z warunkami przewidzianymi w konkretnej umowie.
            </p>

            <p>
              Jeżeli umowa przewiduje możliwość podwyższenia ceny,
              podróżny posiada również prawo do odpowiedniego
              obniżenia ceny w przypadkach i na zasadach określonych
              przez obowiązujące przepisy.
            </p>

            <p>
              Jeżeli podwyżka ceny przekroczy próg określony
              w obowiązujących przepisach, podróżnemu przysługują
              uprawnienia przewidziane przez prawo, w tym możliwość
              rozwiązania umowy bez ponoszenia opłaty za odstąpienie,
              jeżeli spełnione są ustawowe przesłanki.
            </p>
          </TermsSection>

          <TermsSection
            id="transport"
            number={6}
            title="Transport"
          >
            <p>
              Rodzaj transportu, miejsce rozpoczęcia podróży,
              planowane godziny oraz inne istotne informacje są
              określane w ofercie, umowie lub dokumentach podróży.
            </p>

            <p>
              W przypadku transportu lotniczego uczestnika obowiązują
              również uzasadnione wymogi przewoźnika, w szczególności
              dotyczące dokumentów podróży, odprawy, bagażu oraz
              zasad bezpieczeństwa.
            </p>

            <p>
              Podróżny jest zobowiązany do posiadania dokumentów
              niezbędnych do realizacji podróży, jeżeli obowiązek ich
              posiadania wynika z przepisów lub warunków przewoźnika.
            </p>

            <p>
              Godziny lotów, numery rejsów, miejsce zbiórki oraz inne
              elementy organizacyjne mogą ulec zmianie z przyczyn
              niezależnych od Organizatora. W przypadku zmian
              Organizator informuje podróżnego zgodnie
              z obowiązującymi przepisami i charakterem danej zmiany.
            </p>
          </TermsSection>

          <TermsSection
            id="zakwaterowanie"
            number={7}
            title="Zakwaterowanie"
          >
            <p>
              Zakwaterowanie odbywa się w obiekcie wskazanym
              w ofercie, umowie lub dokumentach podróży.
            </p>

            <p>
              Standard obiektu, rodzaj pokoju, liczba osób w pokoju
              oraz inne istotne informacje są określane dla
              konkretnego wyjazdu.
            </p>

            <p>
              Uczestnik zobowiązany jest do przestrzegania
              uzasadnionych zasad obowiązujących w obiekcie
              zakwaterowania.
            </p>

            <p>
              Uczestnik ponosi odpowiedzialność za szkody wyrządzone
              przez siebie zgodnie z obowiązującymi przepisami prawa.
            </p>
          </TermsSection>

          <TermsSection
            id="bilety"
            number={8}
            title="Bilety na wydarzenia sportowe"
          >
            <p>
              Jeżeli bilet na wydarzenie sportowe jest objęty
              zakresem konkretnej umowy, jego rodzaj, kategoria lub
              inne istotne cechy są określane w ofercie, umowie albo
              dokumentach przekazywanych podróżnemu.
            </p>

            <p>
              Sposób przekazania biletu może zależeć od zasad
              organizatora wydarzenia, operatora systemu biletowego
              lub innych podmiotów odpowiedzialnych za dystrybucję
              biletów.
            </p>

            <p>
              Uczestnik zobowiązany jest przestrzegać zasad wejścia
              na obiekt, zasad bezpieczeństwa oraz regulaminu
              obowiązującego podczas wydarzenia.
            </p>

            <p>
              Jeżeli określone miejsce na stadionie, hali lub innym
              obiekcie zostało wyraźnie zagwarantowane w umowie,
              Organizator realizuje świadczenie zgodnie z jej treścią.
            </p>

            <p>
              Organizator nie odpowiada za odmowę wstępu na
              wydarzenie wynikającą z zachowania uczestnika, braku
              wymaganych dokumentów, naruszenia regulaminu obiektu
              lub innych okoliczności leżących po stronie uczestnika.
            </p>
          </TermsSection>

          <TermsSection
            id="zmiana-wydarzenia"
            number={9}
            title="Zmiana terminu lub odwołanie wydarzenia sportowego"
          >
            <p>
              Wydarzenia sportowe mogą zostać przełożone, odwołane,
              przeniesione do innej lokalizacji, odbyć się bez udziału
              publiczności lub ulec innym zmianom.
            </p>

            <p>
              Decyzje dotyczące terminu, miejsca lub sposobu
              przeprowadzenia wydarzenia podejmują właściwe podmioty,
              w szczególności organizator wydarzenia, federacja
              sportowa, liga lub właściwe organy publiczne.
            </p>

            <p>
              Sama zmiana terminu wydarzenia sportowego nie oznacza
              automatycznie, że Organizator może dowolnie zmienić
              warunki zawartej umowy. Każda zmiana dotycząca
              świadczeń objętych umową jest oceniana zgodnie
              z obowiązującymi przepisami oraz charakterem
              i znaczeniem tej zmiany dla konkretnego wyjazdu.
            </p>

            <p>
              Jeżeli zmiana istotnie wpływa na realizację imprezy
              turystycznej, podróżnemu przysługują uprawnienia
              przewidziane w obowiązujących przepisach, w tym
              w odpowiednich przypadkach możliwość zaakceptowania
              proponowanej zmiany, przyjęcia świadczenia zastępczego
              lub rozwiązania umowy bez opłaty za odstąpienie.
            </p>
          </TermsSection>

          <TermsSection
            id="zmiany-przed-wyjazdem"
            number={10}
            title="Zmiany przed rozpoczęciem wyjazdu"
          >
            <p>
              Organizator może dokonać zmian w umowie przed
              rozpoczęciem wyjazdu wyłącznie na zasadach
              przewidzianych w obowiązujących przepisach oraz
              w umowie.
            </p>

            <p>
              W przypadku zmiany nieznacznej Organizator może
              poinformować podróżnego o zmianie na trwałym nośniku
              informacji.
            </p>

            <p>
              Jeżeli Organizator jest zmuszony istotnie zmienić
              główne właściwości usług turystycznych lub nie może
              spełnić szczególnych wymagań zaakceptowanych przez
              strony, podróżnemu przysługują uprawnienia określone
              przez obowiązujące przepisy.
            </p>

            <p>
              Informacja o zmianie powinna zawierać dane pozwalające
              podróżnemu na podjęcie decyzji w zakresie
              przysługujących mu uprawnień, w tym jeżeli jest to
              wymagane termin na udzielenie odpowiedzi.
            </p>
          </TermsSection>

          <TermsSection
            id="przeniesienie-umowy"
            number={11}
            title="Przeniesienie umowy na inną osobę"
          >
            <p>
              Podróżny może przenieść prawa i obowiązki wynikające
              z umowy na inną osobę spełniającą warunki udziału
              w wyjeździe, na zasadach określonych w obowiązujących
              przepisach.
            </p>

            <p>
              Informację o przeniesieniu umowy należy przekazać
              Organizatorowi odpowiednio wcześniej, na trwałym
              nośniku.
            </p>

            <p>
              Osoba przekazująca prawa i obowiązki oraz osoba
              przejmująca je mogą ponosić odpowiedzialność za zapłatę
              pozostałej części ceny oraz uzasadnionych kosztów
              wynikających z przeniesienia.
            </p>

            <p>
              Organizator może pobrać wyłącznie rzeczywiste
              i uzasadnione koszty bezpośrednio związane
              z przeniesieniem umowy, zgodnie z obowiązującymi
              przepisami.
            </p>
          </TermsSection>

          <TermsSection
            id="rezygnacja"
            number={12}
            title="Rezygnacja i odstąpienie przez podróżnego"
          >
            <p>
              Podróżny może przed rozpoczęciem imprezy turystycznej
              odstąpić od umowy na zasadach określonych
              w obowiązujących przepisach.
            </p>

            <p>
              Jeżeli odstąpienie następuje z przyczyn leżących po
              stronie podróżnego, Organizator może pobrać odpowiednią
              i uzasadnioną opłatę za odstąpienie, o ile możliwość
              taka wynika z umowy i obowiązujących przepisów.
            </p>

            <p>
              Wysokość ewentualnej opłaty za odstąpienie powinna
              uwzględniać w szczególności moment odstąpienia,
              oczekiwane oszczędności kosztów oraz możliwość
              wykorzystania świadczeń w inny sposób, zgodnie
              z obowiązującymi przepisami.
            </p>

            <p>
              Na żądanie podróżnego Organizator przedstawia
              uzasadnienie wysokości pobranej opłaty, jeżeli
              obowiązek taki wynika z przepisów prawa.
            </p>

            <p>
              Podróżny może odstąpić od umowy bez ponoszenia opłaty
              za odstąpienie, jeżeli w miejscu docelowym lub jego
              bezpośrednim sąsiedztwie wystąpią nieuniknione
              i nadzwyczajne okoliczności znacząco wpływające na
              realizację imprezy turystycznej lub przewóz podróżnych
              do miejsca docelowego, jeżeli spełnione są ustawowe
              przesłanki.
            </p>
          </TermsSection>

          <TermsSection
            id="odwolanie-przez-organizatora"
            number={13}
            title="Odwołanie wyjazdu przez Organizatora"
          >
            <p>
              Organizator może rozwiązać umowę przed rozpoczęciem
              wyjazdu w przypadkach przewidzianych przez
              obowiązujące przepisy prawa.
            </p>

            <p>
              Jeżeli umowa przewiduje minimalną liczbę uczestników
              niezbędną do realizacji wyjazdu, Organizator może
              odwołać wyjazd z powodu nieosiągnięcia tej liczby
              wyłącznie na zasadach i w terminach wynikających
              z obowiązujących przepisów oraz umowy.
            </p>

            <p>
              Organizator może również rozwiązać umowę, jeżeli
              realizację wyjazdu uniemożliwiają nieuniknione
              i nadzwyczajne okoliczności, zgodnie z obowiązującymi
              przepisami.
            </p>

            <p>
              W przypadku rozwiązania umowy przez Organizatora
              podróżnemu przysługują zwroty oraz inne uprawnienia
              wynikające z obowiązujących przepisów.
            </p>
          </TermsSection>

          <TermsSection
            id="niezgodnosc"
            number={14}
            title="Realizacja świadczeń i niezgodność"
          >
            <p>
              Organizator odpowiada za prawidłowe wykonanie usług
              objętych umową w zakresie wynikającym z obowiązujących
              przepisów, niezależnie od tego, czy dane świadczenie
              jest wykonywane bezpośrednio przez Organizatora,
              czy przez innego usługodawcę.
            </p>

            <p>
              Jeżeli podczas wyjazdu podróżny stwierdzi niezgodność
              świadczenia z umową, powinien w miarę możliwości
              niezwłocznie poinformować Organizatora lub jego
              przedstawiciela, aby umożliwić podjęcie działań
              naprawczych.
            </p>

            <p>
              Organizator podejmuje działania w celu usunięcia
              stwierdzonej niezgodności, chyba że jest to niemożliwe
              albo wymagałoby niewspółmiernych kosztów,
              z uwzględnieniem charakteru niezgodności oraz wartości
              świadczeń.
            </p>

            <p>
              Jeżeli istotnej części usług nie można zrealizować
              zgodnie z umową, Organizator podejmuje działania
              przewidziane obowiązującymi przepisami, w tym
              w odpowiednich przypadkach proponuje odpowiednie
              świadczenia zastępcze.
            </p>
          </TermsSection>

          <TermsSection
            id="odszkodowanie"
            number={15}
            title="Obniżenie ceny i odszkodowanie"
          >
            <p>
              Podróżnemu mogą przysługiwać uprawnienia do obniżenia
              ceny oraz naprawienia szkody wynikającej z niewykonania
              lub nienależytego wykonania usług, na zasadach
              określonych w obowiązujących przepisach.
            </p>

            <p>
              Odpowiedzialność Organizatora oraz zakres ewentualnego
              odszkodowania są oceniane zgodnie z przepisami prawa,
              w tym jeżeli ma to zastosowanie z odpowiednimi
              przepisami prawa Unii Europejskiej i konwencjami
              międzynarodowymi.
            </p>
          </TermsSection>

          <TermsSection
            id="pomoc"
            number={16}
            title="Pomoc podróżnemu"
          >
            <p>
              W przypadku gdy podróżny znajdzie się w trudnej
              sytuacji podczas realizacji imprezy turystycznej,
              Organizator udziela odpowiedniej pomocy bez zbędnej
              zwłoki, na zasadach określonych w obowiązujących
              przepisach.
            </p>

            <p>
              Pomoc może obejmować w szczególności przekazanie
              informacji dotyczących lokalnych służb, placówek
              medycznych, władz publicznych lub pomocy konsularnej
              oraz pomoc w komunikacji na odległość lub znalezieniu
              alternatywnych rozwiązań.
            </p>

            <p>
              Jeżeli trudna sytuacja została spowodowana umyślnie
              przez podróżnego lub wskutek jego rażącego zaniedbania,
              Organizator może pobrać opłatę za faktycznie poniesione
              i uzasadnione koszty pomocy, jeżeli jest to
              dopuszczalne przez obowiązujące przepisy.
            </p>
          </TermsSection>

          <TermsSection
            id="obowiazki"
            number={17}
            title="Obowiązki uczestnika"
          >
            <p>
              Uczestnik zobowiązany jest do przestrzegania
              obowiązujących przepisów prawa, zasad bezpieczeństwa
              oraz uzasadnionych instrukcji przekazywanych przez
              Organizatora lub osoby odpowiedzialne za realizację
              wyjazdu.
            </p>

            <p>
              Uczestnik powinien posiadać dokumenty wymagane do
              odbycia podróży, przekroczenia granic lub skorzystania
              z określonych świadczeń.
            </p>

            <p>
              Uczestnik odpowiada za podanie prawidłowych danych
              osobowych oraz niezwłoczne poinformowanie Organizatora
              o zmianach, które mogą mieć znaczenie dla realizacji
              wyjazdu.
            </p>

            <p>
              Uczestnik zobowiązany jest szanować prawa innych
              uczestników, pracowników usługodawców oraz osób
              trzecich.
            </p>
          </TermsSection>

          <TermsSection
            id="reklamacje"
            number={18}
            title="Reklamacje i zgłoszenia"
          >
            <p>
              Podróżny ma prawo zgłosić Organizatorowi niezgodność
              świadczenia z umową oraz złożyć reklamację dotyczącą
              realizacji usług.
            </p>

            <p>
              W przypadku problemu występującego podczas wyjazdu
              zaleca się niezwłoczne poinformowanie Organizatora lub
              jego przedstawiciela, aby umożliwić podjęcie działań
              naprawczych.
            </p>

            <p>
              Reklamację można przesłać na adres e mail:
            </p>

            <a
              href={`mailto:${organizer.email}`}
              className="inline-flex font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
            >
              {organizer.email}
            </a>

            <p>
              W reklamacji warto wskazać dane umożliwiające
              identyfikację sprawy, w szczególności imię i nazwisko,
              numer rezerwacji, opis problemu, datę i miejsce jego
              wystąpienia oraz oczekiwany sposób rozwiązania sprawy.
            </p>

            <p>
              Brak wskazania wszystkich powyższych informacji nie
              pozbawia podróżnego praw wynikających z obowiązujących
              przepisów, jeżeli zgłoszenie pozwala na identyfikację
              sprawy.
            </p>
          </TermsSection>

          <TermsSection
            id="dokumenty-podrozy"
            number={19}
            title="Dokumenty podróży i kontakt podczas wyjazdu"
          >
            <p>
              Przed rozpoczęciem wyjazdu uczestnik otrzymuje
              informacje organizacyjne niezbędne do realizacji
              świadczeń, w zakresie właściwym dla konkretnego
              wyjazdu.
            </p>

            <p>
              Informacje mogą obejmować w szczególności dane
              dotyczące transportu, miejsca zbiórki, zakwaterowania,
              biletów, transferów, programu oraz danych kontaktowych
              do Organizatora lub osoby odpowiedzialnej za obsługę
              wyjazdu.
            </p>

            <p>
              Uczestnik powinien zapewnić możliwość kontaktu pod
              wskazanym przez siebie numerem telefonu lub adresem
              e mail oraz poinformować Organizatora o zmianie danych
              kontaktowych.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p className="font-semibold text-foreground">
                Kontakt Organizatora
              </p>

              <p className="mt-3">
                E mail:{" "}
                <a
                  href={`mailto:${organizer.email}`}
                  className="font-semibold text-foreground underline decoration-primary underline-offset-4"
                >
                  {organizer.email}
                </a>
              </p>

              <p>
                Telefon:{" "}
                <a
                  href={`tel:${organizer.phone}`}
                  className="font-semibold text-foreground underline decoration-primary underline-offset-4"
                >
                  {organizer.phone}
                </a>
              </p>

              <p className="mt-3 text-xs">
                W przypadku konkretnych wyjazdów dane do kontaktu
                podczas podróży mogą zostać przekazane uczestnikom
                oddzielnie.
              </p>
            </div>
          </TermsSection>

          <TermsSection
            id="ubezpieczenie"
            number={20}
            title="Ubezpieczenie i bezpieczeństwo"
          >
            <p>
              Informacja o tym, czy ubezpieczenie jest objęte ceną
              konkretnego wyjazdu, jest każdorazowo wskazywana
              w ofercie lub umowie.
            </p>

            <p>
              Zakres ochrony ubezpieczeniowej wynika z warunków
              konkretnej umowy ubezpieczenia oraz dokumentów
              przekazywanych przez ubezpieczyciela.
            </p>

            <p>
              Uczestnik powinien zapoznać się z zakresem
              ubezpieczenia, w tym z wyłączeniami i ograniczeniami
              odpowiedzialności, przed rozpoczęciem podróży.
            </p>
          </TermsSection>

          <TermsSection
            id="niewyplacalnosc"
            number={21}
            title="Ochrona na wypadek niewypłacalności"
          >
            <p>
              Organizator posiada wymagane przepisami prawa
              zabezpieczenie finansowe na wypadek niewypłacalności.
            </p>

            <p>
              Informacje dotyczące aktualnego zabezpieczenia
              finansowego Organizatora oraz aktualnego wpisu są
              dostępne w Centralnej Ewidencji Organizatorów Turystyki
              i Przedsiębiorców Ułatwiających Nabywanie Powiązanych
              Usług Turystycznych.
            </p>

            <p>
              Numer ewidencyjny Organizatora:{" "}
              <strong className="text-foreground">
                {organizer.ewidencjaNumber}
              </strong>
              .
            </p>

            <p>
              Informacje dotyczące ochrony podróżnego w przypadku
              niewypłacalności Organizatora są przekazywane również
              w zakresie wymaganym przez obowiązujące przepisy przed
              zawarciem konkretnej umowy.
            </p>
          </TermsSection>

          <TermsSection
            id="nadzwyczajne-okolicznosci"
            number={22}
            title="Nieuniknione i nadzwyczajne okoliczności"
          >
            <p>
              Realizacja wyjazdu może zostać dotknięta przez
              nieuniknione i nadzwyczajne okoliczności pozostające
              poza kontrolą stron, których skutków nie można było
              uniknąć mimo podjęcia wszelkich rozsądnych działań.
            </p>

            <p>
              Mogą do nich należeć między innymi poważne zagrożenia
              bezpieczeństwa, konflikty zbrojne, katastrofy
              naturalne, poważne zakłócenia transportu lub inne
              zdarzenia znacząco wpływające na możliwość realizacji
              wyjazdu.
            </p>

            <p>
              Skutki takich okoliczności dla praw i obowiązków stron
              są oceniane zgodnie z obowiązującymi przepisami oraz
              okolicznościami konkretnej sprawy.
            </p>
          </TermsSection>

          <TermsSection
            id="prywatnosc"
            number={23}
            title="Dane osobowe i prywatność"
          >
            <p>
              Szczegółowe informacje dotyczące przetwarzania danych
              osobowych, w tym informacje o Administratorze, celach
              i podstawach przetwarzania, odbiorcach danych, okresach
              przechowywania danych, prawach osób, których dane
              dotyczą, oraz plikach cookies znajdują się w dokumencie
              „Polityka prywatności i cookies”.
            </p>

            <Link
              href="/polityka-prywatnosci"
              className="inline-flex items-center gap-2 font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
            >
              <ShieldCheck
                className="size-4"
                aria-hidden="true"
              />
              Polityka prywatności i cookies
            </Link>
          </TermsSection>

          <TermsSection
            id="spory"
            number={24}
            title="Pozasądowe rozwiązywanie sporów"
          >
            <p>
              Konsument może korzystać z pozasądowych sposobów
              rozwiązywania sporów konsumenckich na zasadach
              określonych w obowiązujących przepisach.
            </p>

            <p>
              Szczegółowe informacje dotyczące dostępnych form
              pomocy konsumenckiej można uzyskać w szczególności
              u właściwych instytucji publicznych oraz organizacji
              zajmujących się ochroną konsumentów.
            </p>
          </TermsSection>

          <TermsSection
            id="znaki-towarowe"
            number={25}
            title="Znaki towarowe i oznaczenia podmiotów trzecich"
          >
            <p>
              Let&apos;s Gol jest niezależnym organizatorem turystyki
              oferującym wyjazdy na wydarzenia sportowe. O ile
              wyraźnie nie wskazano inaczej, Let&apos;s Gol nie jest
              oficjalnym partnerem, sponsorem ani przedstawicielem
              prezentowanych klubów, lig, federacji ani organizatorów
              wydarzeń.
            </p>

            <p>
              Nazwy, herby, logotypy oraz inne oznaczenia klubów,
              lig, federacji i wydarzeń prezentowane w Serwisie
              należą do ich odpowiednich właścicieli. Oznaczenia te
              są wykorzystywane w celu identyfikacji i przekazania
              informacji o wydarzeniach, których dotyczą prezentowane
              oferty. Ich wykorzystanie nie oznacza istnienia
              partnerstwa, sponsoringu, autoryzacji ani innego
              oficjalnego powiązania pomiędzy Let&apos;s Gol
              a właścicielami tych oznaczeń.
            </p>
          </TermsSection>

          <TermsSection
            id="postanowienia-koncowe"
            number={26}
            title="Postanowienia końcowe"
          >
            <p>
              Niniejsze Warunki Uczestnictwa stanowią ogólne warunki
              obowiązujące w zakresie, w jakim mają zastosowanie do
              konkretnej umowy.
            </p>

            <p>
              W sprawach nieuregulowanych niniejszym dokumentem
              zastosowanie mają postanowienia konkretnej umowy oraz
              obowiązujące przepisy prawa, w szczególności przepisy
              dotyczące imprez turystycznych, ochrony konsumentów
              oraz prawa cywilnego.
            </p>

            <p>
              Postanowienia niniejszego dokumentu nie ograniczają
              praw podróżnego wynikających z bezwzględnie
              obowiązujących przepisów prawa.
            </p>

            <p>
              Zmiany niniejszych Warunków Uczestnictwa nie wpływają
              na prawa i obowiązki wynikające z umów zawartych przed
              wejściem zmian w życie, chyba że obowiązujące przepisy
              stanowią inaczej lub zmiana została skutecznie
              uzgodniona zgodnie z prawem.
            </p>
          </TermsSection>
        </div>

        <section
          id="organizator"
          className="mt-16 scroll-mt-40 rounded-xl border bg-card p-6 md:p-8"
        >
          <div className="flex gap-4">
            <Scale
              className="mt-1 size-6 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Organizator
              </h2>

              <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {organizer.name}
                </p>

                <p>{organizer.address}</p>

                <p>
                  NIP: {organizer.nip}
                </p>

                <p>
                  REGON: {organizer.regon}
                </p>

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

                <p>
                  E mail:{" "}
                  <a
                    href={`mailto:${organizer.email}`}
                    className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
                  >
                    {organizer.email}
                  </a>
                </p>

                <p>
                  Telefon:{" "}
                  <a
                    href={`tel:${organizer.phone}`}
                    className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
                  >
                    {organizer.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-3 rounded-lg bg-muted p-4 text-xs leading-5 text-muted-foreground">
            <AlertTriangle
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />

            <p>
              Szczegółowe warunki konkretnego wyjazdu, zakres
              świadczeń, cena, terminy płatności oraz informacje
              wymagane przepisami prawa są każdorazowo przekazywane
              podróżnemu w dokumentach dotyczących konkretnej
              rezerwacji.
            </p>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2
              className="size-4 text-primary"
              aria-hidden="true"
            />
            Ostatnia aktualizacja: 17 września 2026 r.
          </p>
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            href="/polityka-prywatnosci"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText
              className="size-4"
              aria-hidden="true"
            />
            Zobacz także Politykę prywatności
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
