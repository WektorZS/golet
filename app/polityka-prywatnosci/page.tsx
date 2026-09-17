import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  Cookie,
  FileText,
  ShieldCheck,
} from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Polityka prywatności i cookies",
  description:
    "Polityka prywatności i cookies Let's Gol. Informacje o przetwarzaniu danych osobowych, prawach użytkowników oraz wykorzystywaniu plików cookies.",
  alternates: {
    canonical: "/polityka-prywatnosci",
  },
  openGraph: {
    title: "Polityka prywatności i cookies | Let's Gol",
    description:
      "Informacje o przetwarzaniu danych osobowych, prywatności i wykorzystywaniu plików cookies w serwisie Let's Gol.",
    url: "/polityka-prywatnosci",
  },
}

const companyName = "LB Coaching Łukasz Borger"
const companyAddress =
  "ul. Stefana Roweckiego 1/2, 72-010 Police"
const companyNip = "8512915273"
const email = "kontakt.letsgol@gmail.com"

const sectionLinks = [
  ["Administrator", "administrator"],
  ["Zakres danych", "dane"],
  ["Cele przetwarzania", "cele"],
  ["Odbiorcy danych", "odbiorcy"],
  ["Twoje prawa", "prawa"],
  ["Cookies", "cookies"],
] as const

function PolicySection({
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
      className="scroll-mt-28"
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 font-mono text-xs font-black text-primary">
          {String(number).padStart(2, "0")}
        </span>

        <h2 className="font-sans text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>

      <div className="mt-5 space-y-4 pl-8 leading-7 text-muted-foreground md:pl-10">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
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
                name: "Polityka prywatności i cookies",
                path: "/polityka-prywatnosci",
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
              Prywatność
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              Polityka prywatności i cookies
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Informacje o tym, jakie dane możemy
              przetwarzać, dlaczego ich potrzebujemy
              oraz jakie prawa przysługują osobom
              korzystającym z Let&apos;s Gol.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <ShieldCheck
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              Twoje dane. Jasne zasady.
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              Dane wykorzystujemy wyłącznie w zakresie
              potrzebnym do kontaktu, przygotowania oferty
              oraz organizacji wyjazdu.
            </p>
          </div>
        </div>
      </section>

      <nav
  aria-label="Sekcje polityki prywatności"
  className="sticky top-20 z-40 border-b border-foreground/10 bg-secondary/95 backdrop-blur-md"
>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-5 md:px-6">
          {sectionLinks.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <div className="rounded-xl border border-primary/40 bg-primary/8 p-6 md:p-7">
          <div className="flex gap-4">
            <ShieldCheck
              className="mt-1 size-6 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Najważniejsze informacje
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Poniżej wyjaśniamy, jakie dane osobowe
                mogą być przetwarzane podczas korzystania
                z serwisu Let&apos;s Gol, kontaktu z nami
                oraz korzystania z naszych usług.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-16">
          <PolicySection
            id="administrator"
            number={1}
            title="Administrator danych osobowych"
          >
            <p>
              Administratorem danych osobowych
              przetwarzanych za pośrednictwem serwisu
              internetowego Let&apos;s Gol jest:
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">
                  Nazwa:
                </strong>{" "}
                {companyName}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Adres:
                </strong>{" "}
                {companyAddress}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  NIP:
                </strong>{" "}
                {companyNip}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Kontakt w sprawach danych osobowych:
                </strong>{" "}
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
                >
                  {email}
                </a>
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="dane"
            number={2}
            title="Jakie dane osobowe możemy przetwarzać"
          >
            <p>
              Zakres danych zależy od sposobu korzystania
              z serwisu oraz rodzaju kontaktu lub zamawianej
              usługi. Możemy przetwarzać w szczególności:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>imię i nazwisko,</li>
              <li>adres e-mail,</li>
              <li>numer telefonu,</li>
              <li>treść wiadomości lub zapytania,</li>
              <li>
                informacje dotyczące wybranego wydarzenia
                lub wyjazdu,
              </li>
              <li>
                preferowane miejsce rozpoczęcia podróży,
              </li>
              <li>
                liczbę osób objętych zapytaniem lub
                rezerwacją,
              </li>
              <li>
                dane niezbędne do przygotowania oferty,
                zawarcia umowy i realizacji usługi,
              </li>
              <li>
                dane wymagane przez przewoźników, hotele,
                ubezpieczycieli, organizatorów wydarzeń
                lub innych dostawców świadczeń,
              </li>
              <li>
                informacje przekazane dobrowolnie podczas
                kontaktu z nami,
              </li>
              <li>
                dane techniczne związane z korzystaniem
                z serwisu, w zakresie wynikającym z jego
                funkcjonowania.
              </li>
            </ul>

            <p>
              Zakres przetwarzanych danych ograniczamy do
              informacji potrzebnych do realizacji
              konkretnego celu.
            </p>

            <p>
              Prosimy o nieprzekazywanie przez formularze
              danych szczególnych kategorii, jeżeli nie są
              one niezbędne do realizacji konkretnej usługi.
            </p>
          </PolicySection>

          <PolicySection
            id="cele"
            number={3}
            title="Cele i podstawy prawne przetwarzania"
          >
            <div>
              <h3 className="font-bold text-foreground">
                Obsługa zapytań i przygotowanie oferty
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu
                odpowiedzi na wiadomość, przygotowania
                oferty oraz prowadzenia korespondencji.
              </p>

              <p className="mt-2">
                Podstawą może być art. 6 ust. 1 lit. b RODO,
                jeżeli przetwarzanie jest potrzebne do
                podjęcia działań przed zawarciem umowy,
                albo art. 6 ust. 1 lit. f RODO w zakresie
                prowadzenia komunikacji.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Zawarcie i realizacja umowy
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu zawarcia
                i wykonania umowy oraz organizacji świadczeń
                objętych konkretną ofertą.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. b RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Obowiązki prawne
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu realizacji
                obowiązków wynikających z przepisów prawa,
                w szczególności obowiązków podatkowych
                i rachunkowych.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. c RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Roszczenia
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu ustalenia,
                dochodzenia lub obrony przed roszczeniami.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. f RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Analityka serwisu
              </h3>

              <p className="mt-2">
                Jeżeli korzystamy z narzędzi wymagających
                zgody użytkownika, dane związane z
                korzystaniem z serwisu mogą być używane
                do celów analitycznych i statystycznych
                po uzyskaniu wymaganej zgody.
              </p>

              <p className="mt-2">
                W takim przypadku podstawą przetwarzania
                może być art. 6 ust. 1 lit. a RODO.
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="zrodlo"
            number={4}
            title="Źródło danych"
          >
            <p>
              Dane osobowe pozyskujemy przede wszystkim
              bezpośrednio od osoby, której dotyczą,
              między innymi przez formularz, wiadomość
              e-mail, kontakt telefoniczny lub proces
              rezerwacji.
            </p>

            <p>
              Jeżeli jedna osoba kontaktuje się z nami
              w sprawie kilku uczestników, dane pozostałych
              osób mogą zostać przekazane przez osobę
              dokonującą zgłoszenia lub rezerwacji.
            </p>
          </PolicySection>

          <PolicySection
            id="odbiorcy"
            number={5}
            title="Odbiorcy danych osobowych"
          >
            <p>
              Dane mogą być przekazywane podmiotom
              wspierającym Administratora w prowadzeniu
              działalności oraz realizacji konkretnego
              wyjazdu, wyłącznie w zakresie potrzebnym
              do realizacji danego celu.
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>przewoźnikom i liniom lotniczym,</li>
              <li>hotelom i obiektom zakwaterowania,</li>
              <li>
                organizatorom wydarzeń sportowych
                i operatorom biletowym,
              </li>
              <li>ubezpieczycielom,</li>
              <li>operatorom płatności,</li>
              <li>
                firmom świadczącym usługi transportowe
                i transferowe,
              </li>
              <li>
                dostawcom usług informatycznych,
                hostingowych i baz danych,
              </li>
              <li>
                dostawcom poczty elektronicznej
                i komunikacji,
              </li>
              <li>
                dostawcom narzędzi analitycznych,
                jeżeli są wykorzystywane zgodnie
                z wymaganiami dotyczącymi zgody,
              </li>
              <li>
                podmiotom świadczącym usługi księgowe,
                prawne i informatyczne,
              </li>
              <li>
                organom publicznym, jeżeli obowiązek
                przekazania danych wynika z przepisów prawa.
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id="transfery"
            number={6}
            title="Przekazywanie danych poza EOG"
          >
            <p>
              W związku z korzystaniem z usług dostawców
              technologii, hostingu, komunikacji lub
              analityki dane mogą w określonych przypadkach
              być przekazywane poza Europejski Obszar
              Gospodarczy.
            </p>

            <p>
              Jeżeli takie przekazanie ma miejsce, odbywa
              się ono z wykorzystaniem mechanizmów
              przewidzianych w obowiązujących przepisach,
              w szczególności decyzji stwierdzającej
              odpowiedni stopień ochrony lub innych
              zabezpieczeń przewidzianych w RODO.
            </p>
          </PolicySection>

          <PolicySection
            id="przechowywanie"
            number={7}
            title="Okres przechowywania danych"
          >
            <p>
              Dane przechowujemy nie dłużej, niż jest to
              potrzebne do realizacji celu, dla którego
              zostały zebrane, z uwzględnieniem obowiązków
              wynikających z przepisów prawa.
            </p>

            <ul className="list-disc space-y-3 pl-6">
              <li>
                dane związane z zapytaniem przez okres
                potrzebny do jego obsługi i zakończenia
                komunikacji,
              </li>

              <li>
                dane związane z umową przez okres realizacji
                umowy, a następnie przez okres wymagany
                przepisami prawa,
              </li>

              <li>
                dane potrzebne do ustalenia, dochodzenia
                lub obrony przed roszczeniami do czasu
                upływu odpowiednich terminów przedawnienia,
              </li>

              <li>
                dane przetwarzane na podstawie zgody do
                momentu jej wycofania, chyba że istnieje
                inna podstawa dalszego przetwarzania.
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id="prawa"
            number={8}
            title="Prawa osoby, której dane dotyczą"
          >
            <p>
              W przypadkach określonych w RODO osobie,
              której dane dotyczą, może przysługiwać prawo do:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>dostępu do danych,</li>
              <li>sprostowania danych,</li>
              <li>usunięcia danych,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>
                wniesienia sprzeciwu wobec przetwarzania,
              </li>
              <li>
                cofnięcia zgody w dowolnym momencie,
                jeżeli przetwarzanie odbywa się na jej
                podstawie,
              </li>
              <li>
                wniesienia skargi do organu nadzorczego.
              </li>
            </ul>

            <p>
              Cofnięcie zgody nie wpływa na zgodność
              z prawem przetwarzania dokonanego przed
              jej wycofaniem.
            </p>
          </PolicySection>

          <PolicySection
            id="skarga"
            number={9}
            title="Prawo wniesienia skargi"
          >
            <p>
              Jeżeli uznasz, że przetwarzanie Twoich danych
              osobowych narusza przepisy RODO, możesz
              wnieść skargę do właściwego organu nadzorczego.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p className="font-semibold text-foreground">
                Prezes Urzędu Ochrony Danych Osobowych
              </p>

              <p className="mt-2 text-sm">
                ul. Stanisława Moniuszki 1A
                <br />
                00-014 Warszawa
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="podanie-danych"
            number={10}
            title="Czy podanie danych jest obowiązkowe?"
          >
            <p>
              Podanie danych jest co do zasady dobrowolne.
              Niektóre informacje mogą być jednak konieczne
              do udzielenia odpowiedzi, przygotowania oferty,
              zawarcia umowy lub realizacji konkretnej usługi.
            </p>

            <p>
              Brak danych wymaganych do wykonania określonej
              czynności może uniemożliwić jej realizację.
            </p>
          </PolicySection>

          <PolicySection
            id="profilowanie"
            number={11}
            title="Profilowanie i automatyczne decyzje"
          >
            <p>
              Administrator nie wykorzystuje danych
              osobowych do podejmowania wobec użytkowników
              decyzji opartych wyłącznie na
              zautomatyzowanym przetwarzaniu, które
              wywoływałyby skutki prawne lub w podobny
              sposób istotnie na nich wpływały.
            </p>
          </PolicySection>

          <PolicySection
            id="cookies"
            number={12}
            title="Pliki cookies i podobne technologie"
          >
            <div className="flex gap-4">
              <Cookie
                className="mt-1 size-6 shrink-0 text-primary"
                aria-hidden="true"
              />

              <p>
                Serwis może wykorzystywać pliki cookies
                oraz podobne technologie zapisywane lub
                odczytywane na urządzeniu użytkownika.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Cookies niezbędne
              </h3>

              <p className="mt-2">
                Mogą być wykorzystywane do zapewnienia
                prawidłowego działania serwisu,
                bezpieczeństwa oraz zapamiętywania
                ustawień użytkownika.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Cookies analityczne
              </h3>

              <p className="mt-2">
                Jeżeli korzystamy z narzędzi analitycznych
                wymagających zgody, są one uruchamiane
                zgodnie z obowiązującymi wymaganiami
                dotyczącymi prywatności i zgody użytkownika.
              </p>
            </div>

            <p>
              Użytkownik może zarządzać ustawieniami
              cookies w swojej przeglądarce oraz,
              jeżeli serwis udostępnia odpowiedni panel,
              również za pomocą ustawień prywatności
              dostępnych na stronie.
            </p>
          </PolicySection>

          <PolicySection
            id="bezpieczenstwo"
            number={13}
            title="Bezpieczeństwo danych"
          >
            <p>
              Administrator stosuje odpowiednie środki
              techniczne i organizacyjne mające chronić
              dane osobowe przed przypadkowym lub
              niezgodnym z prawem zniszczeniem, utratą,
              zmianą, nieuprawnionym ujawnieniem
              lub dostępem.
            </p>
          </PolicySection>

          <PolicySection
            id="iod"
            number={14}
            title="Kontakt w sprawach ochrony danych"
          >
            <p>
              W sprawach związanych z ochroną danych
              osobowych możesz skontaktować się
              bezpośrednio z Administratorem:
            </p>

            <a
              href={`mailto:${email}`}
              className="font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
            >
              {email}
            </a>
          </PolicySection>

          <PolicySection
            id="zmiany"
            number={15}
            title="Zmiany Polityki prywatności"
          >
            <p>
              Polityka prywatności może być aktualizowana
              między innymi w związku ze zmianami
              przepisów, sposobu świadczenia usług,
              wykorzystywanych technologii lub organizacji
              serwisu.
            </p>

            <p>
              Aktualna wersja dokumentu jest zawsze
              publikowana na tej stronie.
            </p>

            <p className="text-sm">
              Data ostatniej aktualizacji:
              {" "}
              17 września 2026 r.
            </p>
          </PolicySection>
        </div>

        <div className="mt-16 border-t border-foreground/10 pt-10">
          <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
            <div className="max-w-2xl">
              <p className="font-sans text-xl font-black uppercase">
                Warunki uczestnictwa
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Szczegółowe zasady dotyczące rezerwacji,
                płatności, realizacji wyjazdu, zmian,
                rezygnacji i reklamacji znajdziesz
                w osobnym dokumencie.
              </p>
            </div>

            <Link
              href="/warunki-uczestnictwa"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
            >
              <FileText
                className="size-4"
                aria-hidden="true"
              />
              Warunki uczestnictwa
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}