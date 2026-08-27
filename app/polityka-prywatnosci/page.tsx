import type { Metadata } from "next"
import Link from "next/link"
import { Cookie, FileText, ShieldCheck } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Polityka prywatności i cookies | Let’s Gol",
  description:
    "Polityka prywatności i cookies Let’s Gol. Informacje o przetwarzaniu danych osobowych, prawach użytkowników oraz wykorzystywaniu plików cookies.",
}

export default function PrivacyPolicyPage() {
  const companyName = "LB Coaching Łukasz Borger"
  const companyAddress = "ul. Stefana Roweckiego 1/2, 72-010 Police"
  const companyNip = "8512915273"
  const email = "kontakt@letsgol.pl"

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="relative bg-foreground pb-16 pt-28 text-background">
        <SiteHeader />

        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Prywatność i bezpieczeństwo
          </p>

          <h1 className="mt-4 font-sans text-5xl font-black uppercase tracking-tight md:text-7xl">
            Polityka prywatności i cookies
          </h1>

          <p className="mt-5 max-w-2xl text-background/65">
            Informacje dotyczące przetwarzania danych osobowych, prywatności,
            plików cookies oraz zasad korzystania z serwisu Let&apos;s Gol.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 md:px-6">
        {/* INTRO */}
        <aside className="rounded-xl border border-primary bg-primary/10 p-6">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Twoja prywatność
              </h2>

              <p className="mt-3 leading-relaxed text-muted-foreground">
                W tej Polityce prywatności wyjaśniamy, jakie dane osobowe mogą
                być przetwarzane w związku z korzystaniem z serwisu Let&apos;s
                Gol oraz kontaktowaniem się z nami i korzystaniem z oferowanych
                usług.
              </p>
            </div>
          </div>
        </aside>

        {/* 1 */}
        <section id="administrator" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            1. Administrator danych osobowych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administratorem danych osobowych przetwarzanych za pośrednictwem
              serwisu internetowego Let&apos;s Gol jest:
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">Nazwa:</strong>{" "}
                {companyName}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">Adres:</strong>{" "}
                {companyAddress}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">NIP:</strong>{" "}
                {companyNip}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Kontakt w sprawach danych osobowych:
                </strong>{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-primary underline underline-offset-4"
                >
                  {email}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 2 */}
        <section id="dane" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            2. Jakie dane osobowe możemy przetwarzać
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W zależności od sposobu korzystania z serwisu oraz rodzaju
              kontaktu lub zamawianej usługi możemy przetwarzać w szczególności:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>imię i nazwisko,</li>
              <li>adres e-mail,</li>
              <li>numer telefonu,</li>
              <li>treść wiadomości lub zapytania,</li>
              <li>informacje dotyczące wybranego wydarzenia lub wyjazdu,</li>
              <li>preferowane miejsce rozpoczęcia podróży,</li>
              <li>liczbę osób objętych zapytaniem lub rezerwacją,</li>
              <li>
                dane niezbędne do przygotowania oferty, zawarcia umowy i
                realizacji usługi,
              </li>
              <li>
                dane wymagane przez przewoźników, hotele, ubezpieczycieli,
                organizatorów wydarzeń lub inne podmioty realizujące świadczenia,
              </li>
              <li>informacje przekazane dobrowolnie przez użytkownika,</li>
              <li>
                dane techniczne związane z korzystaniem z serwisu - w zakresie
                wynikającym z jego funkcjonowania.
              </li>
            </ul>

            <p>
              Zakres przetwarzanych danych ograniczamy do danych niezbędnych do
              realizacji konkretnego celu.
            </p>

            <p>
              Prosimy o nieprzekazywanie za pośrednictwem formularzy danych
              szczególnych kategorii, jeżeli ich przekazanie nie jest konieczne
              do realizacji konkretnej usługi.
            </p>
          </div>
        </section>

        {/* 3 */}
        <section id="cele" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            3. Cele i podstawy prawne przetwarzania
          </h2>

          <div className="mt-5 space-y-7 leading-relaxed text-muted-foreground">
            <div>
              <h3 className="font-bold text-foreground">
                Obsługa zapytań i kontakt z użytkownikiem
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu udzielenia odpowiedzi,
                przygotowania oferty oraz prowadzenia korespondencji.
              </p>

              <p className="mt-2">
                Podstawą prawną może być art. 6 ust. 1 lit. b RODO, jeżeli
                przetwarzanie jest niezbędne do podjęcia działań przed zawarciem
                umowy, lub art. 6 ust. 1 lit. f RODO - prawnie uzasadniony
                interes Administratora polegający na prowadzeniu komunikacji.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Zawarcie i realizacja umowy
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu zawarcia i wykonania umowy oraz
                organizacji usług objętych konkretną ofertą.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. b RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Wypełnianie obowiązków prawnych
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu realizacji obowiązków
                wynikających z przepisów prawa, w tym obowiązków podatkowych,
                rachunkowych oraz obowiązków związanych z prowadzoną działalnością.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. c RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Dochodzenie lub obrona przed roszczeniami
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu ustalenia, dochodzenia lub
                obrony przed roszczeniami.
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
                Jeżeli użytkownik wyrazi wymaganą zgodę, dane związane z
                korzystaniem z serwisu mogą być wykorzystywane w celach
                analitycznych i statystycznych.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. a RODO - zgoda
                użytkownika, jeżeli jest wymagana.
              </p>
            </div>
          </div>
        </section>

        {/* 4 */}
        <section id="zrodlo" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            4. Źródło danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe są co do zasady pozyskiwane bezpośrednio od osoby,
              której dotyczą, w szczególności poprzez formularz kontaktowy,
              wiadomość e-mail, kontakt telefoniczny lub proces rezerwacji.
            </p>

            <p>
              W przypadku kontaktu lub rezerwacji dotyczącej kilku osób dane
              innych uczestników mogą zostać przekazane przez osobę dokonującą
              kontaktu lub rezerwacji.
            </p>
          </div>
        </section>

        {/* 5 */}
        <section id="odbiorcy" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            5. Odbiorcy danych osobowych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane mogą być przekazywane podmiotom wspierającym Administratora
              w prowadzeniu działalności i realizacji konkretnych usług,
              wyłącznie w zakresie niezbędnym do realizacji danego celu.
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>przewoźnikom i liniom lotniczym,</li>
              <li>hotelom i obiektom zakwaterowania,</li>
              <li>organizatorom wydarzeń sportowych,</li>
              <li>ubezpieczycielom,</li>
              <li>operatorom płatności,</li>
              <li>firmom transportowym i transferowym,</li>
              <li>dostawcom usług informatycznych i hostingowych,</li>
              <li>dostawcom usług poczty elektronicznej,</li>
              <li>
                dostawcom narzędzi analitycznych - jeżeli wymagają tego zasady
                korzystania z danego narzędzia i została uzyskana wymagana zgoda,
              </li>
              <li>podmiotom świadczącym usługi księgowe, prawne i IT,</li>
              <li>organom publicznym, jeżeli wynika to z przepisów prawa.</li>
            </ul>
          </div>
        </section>

        {/* 6 */}
        <section id="transfery" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            6. Przekazywanie danych poza EOG
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W związku z korzystaniem z usług dostawców technologii,
              infrastruktury informatycznej, hostingu, komunikacji lub analityki
              dane osobowe mogą w określonych przypadkach być przekazywane poza
              Europejski Obszar Gospodarczy.
            </p>

            <p>
              Jeżeli takie przekazanie ma miejsce, odbywa się ono zgodnie z
              mechanizmami przewidzianymi w obowiązujących przepisach, w
              szczególności na podstawie decyzji Komisji Europejskiej
              stwierdzającej odpowiedni stopień ochrony lub przy zastosowaniu
              odpowiednich zabezpieczeń przewidzianych w RODO.
            </p>
          </div>
        </section>

        {/* 7 */}
        <section id="przechowywanie" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            7. Okres przechowywania danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe są przechowywane przez okres nie dłuższy, niż jest to
              niezbędne do realizacji celu, dla którego zostały zebrane, z
              uwzględnieniem obowiązków prawnych Administratora.
            </p>

            <ul className="list-disc space-y-3 pl-6">
              <li>
                dane związane z zapytaniem - przez okres niezbędny do obsługi
                zapytania i zakończenia komunikacji;
              </li>
              <li>
                dane związane z umową - przez okres realizacji umowy, a następnie
                przez okres wymagany przepisami prawa;
              </li>
              <li>
                dane niezbędne do ustalenia, dochodzenia lub obrony przed
                roszczeniami - do czasu upływu właściwych terminów przedawnienia;
              </li>
              <li>
                dane przetwarzane na podstawie zgody - do czasu jej wycofania,
                chyba że istnieje inna podstawa prawna dalszego przetwarzania.
              </li>
            </ul>
          </div>
        </section>

        {/* 8 */}
        <section id="prawa" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            8. Prawa osoby, której dane dotyczą
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W przypadkach określonych w przepisach RODO użytkownikowi
              przysługuje prawo do:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>dostępu do danych,</li>
              <li>sprostowania danych,</li>
              <li>usunięcia danych,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania,</li>
              <li>
                cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie odbywa
                się na podstawie zgody,
              </li>
              <li>wniesienia skargi do organu nadzorczego.</li>
            </ul>

            <p>
              Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania,
              którego dokonano przed jej wycofaniem.
            </p>
          </div>
        </section>

        {/* 9 */}
        <section id="skarga" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            9. Prawo wniesienia skargi
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Jeżeli użytkownik uzna, że przetwarzanie jego danych osobowych
              narusza przepisy RODO, ma prawo wnieść skargę do właściwego organu
              nadzorczego.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p className="font-semibold text-foreground">
                Prezes Urzędu Ochrony Danych Osobowych
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                ul. Stanisława Moniuszki 1A
                <br />
                00-014 Warszawa
              </p>
            </div>
          </div>
        </section>

        {/* 10 */}
        <section id="podanie-danych" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            10. Czy podanie danych jest obowiązkowe?
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Podanie danych osobowych jest co do zasady dobrowolne, jednak
              określone dane mogą być niezbędne do udzielenia odpowiedzi,
              przygotowania oferty, zawarcia umowy lub realizacji konkretnej
              usługi.
            </p>

            <p>
              Niepodanie danych wymaganych do wykonania określonej czynności może
              uniemożliwić jej realizację.
            </p>
          </div>
        </section>

        {/* 11 */}
        <section id="profilowanie" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            11. Profilowanie i automatyczne decyzje
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator nie wykorzystuje danych osobowych do podejmowania
              wobec użytkowników decyzji opartych wyłącznie na zautomatyzowanym
              przetwarzaniu, które wywoływałyby wobec nich skutki prawne lub w
              podobny sposób istotnie na nich wpływały.
            </p>
          </div>
        </section>

        {/* 12 */}
        <section id="cookies" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            12. Pliki cookies i podobne technologie
          </h2>

          <div className="mt-5 space-y-5 leading-relaxed text-muted-foreground">
            <div className="flex gap-4">
              <Cookie className="mt-1 size-6 shrink-0 text-primary" />

              <p>
                Serwis może wykorzystywać pliki cookies oraz podobne technologie
                zapisywane lub odczytywane na urządzeniu użytkownika.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Cookies niezbędne
              </h3>

              <p className="mt-2">
                Niezbędne pliki cookies mogą być wykorzystywane do zapewnienia
                prawidłowego działania serwisu oraz zapamiętania wyborów
                użytkownika dotyczących prywatności i ustawień cookies.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Cookies analityczne
              </h3>

              <p className="mt-2">
                Narzędzia analityczne mogą być wykorzystywane wyłącznie zgodnie z
                obowiązującymi przepisami, w tym po uzyskaniu wymaganej zgody,
                jeżeli jest ona konieczna.
              </p>
            </div>

            <p>
              Użytkownik może zmienić swoje ustawienia dotyczące cookies w
              dowolnym momencie za pomocą dostępnych w serwisie ustawień
              prywatności i cookies.
            </p>
          </div>
        </section>

        {/* 13 */}
        <section id="bezpieczenstwo" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            13. Bezpieczeństwo danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator stosuje odpowiednie środki techniczne i organizacyjne
              mające na celu ochronę danych osobowych przed przypadkowym lub
              niezgodnym z prawem zniszczeniem, utratą, zmianą, nieuprawnionym
              ujawnieniem lub dostępem.
            </p>
          </div>
        </section>

        {/* 14 */}
        <section id="iod" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            14. Inspektor ochrony danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator nie wyznaczył Inspektora Ochrony Danych, o ile
              obowiązek jego wyznaczenia nie wynika z obowiązujących przepisów.
            </p>

            <p>
              W sprawach dotyczących ochrony danych osobowych można kontaktować
              się z Administratorem pod adresem:
            </p>

            <a
              href={`mailto:${email}`}
              className="font-semibold text-primary underline underline-offset-4"
            >
              {email}
            </a>
          </div>
        </section>

        {/* 15 */}
        <section id="warunki-uczestnictwa" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            15. Warunki uczestnictwa
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Szczegółowe zasady dotyczące rezerwacji, zawarcia umowy, płatności,
              realizacji wyjazdu, transportu, zakwaterowania, biletów na
              wydarzenia, zmian, rezygnacji, reklamacji oraz praw i obowiązków
              podróżnych zostały określone w odrębnym dokumencie.
            </p>

            <Link
              href="/warunki-uczestnictwa"
              className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              <FileText className="size-4" />
              Przejdź do Warunków uczestnictwa
            </Link>
          </div>
        </section>

        {/* 16 */}
        <section id="zmiany" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            16. Zmiany Polityki prywatności
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Polityka prywatności może być aktualizowana w szczególności w
              związku ze zmianami przepisów prawa, zmianami organizacyjnymi,
              zmianami sposobu świadczenia usług lub zmianami technicznymi
              serwisu.
            </p>

            <p>
              Aktualna wersja dokumentu jest publikowana na tej stronie.
            </p>

            <p className="text-sm">
              Data ostatniej aktualizacji: 27 sierpnia 2026 r.
            </p>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}