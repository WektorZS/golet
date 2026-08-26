import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, ShieldCheck, FileText, Cookie, Scale } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Informacje prawne | Let’s Gol",
  description:
    "Informacje prawne Let’s Gol: dane przedsiębiorcy, wpis do rejestru organizatorów turystyki, zabezpieczenie finansowe, ochrona danych osobowych oraz pliki cookies.",
}

export default function LegalPage() {
  const companyName = "LB Coaching Łukasz Borger"
  const companyAddress = "ul. Stefana Roweckiego 1/2, 72-010 Police"
  const companyNip = "8512915273"

  // Zostaw jako dynamiczne dane, jeżeli pobierasz je z CMS.
  // Przed publikacją upewnij się, że adres jest aktualny.
  const email = "kontakt.letsgol@gmail.com"

  const ewidencjaNumber = "42848"
  const registerNumber = "34/25"
  const registerAuthority =
    "Marszałek Województwa Zachodniopomorskiego"

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="relative bg-foreground pb-16 pt-28 text-background">
        <SiteHeader />

        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Dokumenty i bezpieczeństwo
          </p>

          <h1 className="mt-4 font-sans text-5xl font-black uppercase tracking-tight md:text-7xl">
            Informacje prawne
          </h1>

          <p className="mt-5 max-w-2xl text-background/65">
            Informacje dotyczące przedsiębiorcy, organizacji wyjazdów,
            ochrony danych osobowych, plików cookies oraz zasad korzystania
            z serwisu Let’s Gol.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 md:px-6">

        {/* IMPORTANT COMPANY INFO */}
        <aside className="rounded-xl border border-primary bg-primary/10 p-6">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Legalnie działający organizator turystyki
              </h2>

              <p className="mt-3 leading-relaxed text-muted-foreground">
                Let’s Gol jest marką prowadzoną przez przedsiębiorcę wpisanego
                do rejestru organizatorów turystyki oraz przedsiębiorców
                ułatwiających nabywanie powiązanych usług turystycznych.
              </p>
            </div>
          </div>
        </aside>

        {/* 1. ENTREPRENEUR */}
        <section id="przedsiebiorca" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            1. Dane przedsiębiorcy
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Serwis internetowy Let’s Gol oraz działalność związana
              z organizacją oferowanych wyjazdów prowadzona jest przez:
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">Firma:</strong>{" "}
                {companyName}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Adres prowadzenia działalności:
                </strong>{" "}
                {companyAddress}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">NIP:</strong>{" "}
                {companyNip}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">E-mail:</strong>{" "}
                {email.includes("[") ? (
                  <span>{email}</span>
                ) : (
                  <a
                    href={`mailto:${email}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {email}
                  </a>
                )}
              </p>
            </div>

            <p>
              Przedsiębiorca prowadzi działalność jako organizator turystyki
              oraz przedsiębiorca ułatwiający nabywanie powiązanych usług
              turystycznych, w zakresie wynikającym z obowiązujących wpisów
              i zezwoleń.
            </p>
          </div>
        </section>

        {/* 2. REGISTER */}
        <section id="rejestr" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            2. Wpis do rejestru
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Przedsiębiorca jest wpisany do rejestru organizatorów turystyki
              oraz przedsiębiorców ułatwiających nabywanie powiązanych usług
              turystycznych.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">
                  Rodzaj działalności:
                </strong>{" "}
                Organizator Turystyki oraz Przedsiębiorca Ułatwiający
                Nabywanie Powiązanych Usług Turystycznych
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Numer wpisu do rejestru:
                </strong>{" "}
                {registerNumber}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Organ dokonujący wpisu:
                </strong>{" "}
                {registerAuthority}
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Numer ewidencyjny:
                </strong>{" "}
                {ewidencjaNumber}
              </p>
            </div>

            <p>
              Aktualne informacje dotyczące przedsiębiorców turystycznych
              można zweryfikować w Centralnej Ewidencji Organizatorów
              Turystyki i Przedsiębiorców Ułatwiających Nabywanie Powiązanych
              Usług Turystycznych.
            </p>

            <a
              href="https://ewidencja.ufg.pl/ewidencja/obywatel/wyszukiwanie/85008"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sprawdź wpis w Centralnej Ewidencji
              <ExternalLink className="size-4" />
            </a>
          </div>
        </section>

        {/* 3. FINANCIAL SECURITY */}
        <section id="zabezpieczenie" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            3. Zabezpieczenie finansowe
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Organizator posiada wymagane przepisami prawa zabezpieczenie
              finansowe na wypadek niewypłacalności.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">
                  Forma zabezpieczenia:
                </strong>{" "}
                gwarancja ubezpieczeniowa
              </p>

              <p className="mt-2">
                <strong className="text-foreground">
                  Podmiot udzielający zabezpieczenia:
                </strong>{" "}
                Compensa TU S.A. Vienna Insurance Group
              </p>
            </div>

            <p>
              Informacje dotyczące aktualnego zabezpieczenia finansowego
              przedsiębiorcy są dostępne w Centralnej Ewidencji Organizatorów
              Turystyki i Przedsiębiorców Ułatwiających Nabywanie Powiązanych
              Usług Turystycznych.
            </p>

            <p className="text-sm">
              Dane dotyczące okresu obowiązywania oraz wysokości zabezpieczenia
              mogą ulegać zmianie wraz z odnowieniem lub zmianą zabezpieczenia
              finansowego, dlatego aktualny status należy każdorazowo
              weryfikować w Centralnej Ewidencji.
            </p>
          </div>
        </section>

        {/* 4. TRAVEL DOCUMENTS */}
        <section id="dokumenty" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            4. Dokumenty dotyczące wyjazdów
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Szczegółowe warunki udziału w wyjazdach, zasady zawierania
              umowy, płatności, zmian, rezygnacji, reklamacji oraz
              odpowiedzialności stron określają odpowiednie dokumenty
              udostępniane podróżnemu.
            </p>

            <div className="rounded-xl border bg-card p-5">
              <ul className="list-disc space-y-3 pl-6">
                <li>Warunki Uczestnictwa,</li>
                <li>warunki konkretnej oferty lub umowy,</li>
                <li>
                  standardowy formularz informacyjny wymagany dla danego
                  rodzaju usługi turystycznej,
                </li>
                <li>
                  informacje przekazywane podróżnemu przed zawarciem umowy,
                </li>
                <li>
                  dokumenty podróży, vouchery, bilety lub inne dokumenty
                  niezbędne do realizacji wyjazdu.
                </li>
              </ul>
            </div>

            <p>
              Rodzaj dokumentów przekazywanych podróżnemu zależy od charakteru
              konkretnej oferty oraz sposobu zakwalifikowania świadczonych
              usług zgodnie z obowiązującymi przepisami.
            </p>

            <Link
              href="/warunki-uczestnictwa"
              className="inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              <FileText className="size-4" />
              Zapoznaj się z Warunkami Uczestnictwa
            </Link>
          </div>
        </section>

        {/* 5. ADMINISTRATOR */}
        <section id="administrator" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            5. Administrator danych osobowych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administratorem danych osobowych przetwarzanych za pośrednictwem
              serwisu Let’s Gol jest:
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
                {email.includes("[") ? (
                  <span>{email}</span>
                ) : (
                  <a
                    href={`mailto:${email}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {email}
                  </a>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 6. DATA */}
        <section id="dane" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            6. Jakie dane osobowe możemy przetwarzać
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W zależności od sposobu korzystania z serwisu oraz rodzaju
              zamawianej usługi możemy przetwarzać w szczególności:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>imię i nazwisko,</li>
              <li>adres e-mail,</li>
              <li>numer telefonu,</li>
              <li>treść wiadomości lub zapytania,</li>
              <li>informacje dotyczące wybranego wydarzenia lub wyjazdu,</li>
              <li>preferowane miejsce rozpoczęcia podróży,</li>
              <li>liczbę osób podróżujących,</li>
              <li>
                dane niezbędne do przygotowania oferty, zawarcia umowy
                i realizacji usługi,
              </li>
              <li>
                dane wymagane przez przewoźników, hotele, ubezpieczycieli,
                organizatorów wydarzeń lub inne podmioty realizujące
                poszczególne świadczenia,
              </li>
              <li>informacje przekazane dobrowolnie przez użytkownika,</li>
              <li>
                dane techniczne związane z korzystaniem z serwisu, w zakresie
                wynikającym z jego funkcjonowania.
              </li>
            </ul>

            <p>
              Zakres przetwarzanych danych jest ograniczany do danych
              niezbędnych do realizacji konkretnego celu.
            </p>

            <p>
              Prosimy o nieprzekazywanie za pośrednictwem formularzy danych
              szczególnych kategorii, jeżeli ich przekazanie nie jest
              konieczne do realizacji konkretnej usługi.
            </p>
          </div>
        </section>

        {/* 7. PURPOSES */}
        <section id="cele" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            7. Cele i podstawy prawne przetwarzania
          </h2>

          <div className="mt-5 space-y-7 leading-relaxed text-muted-foreground">

            <div>
              <h3 className="font-bold text-foreground">
                Obsługa zapytań i kontakt z użytkownikiem
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu udzielenia odpowiedzi,
                przygotowania oferty oraz prowadzenia korespondencji dotyczącej
                wyjazdu.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. b RODO, jeżeli
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
                Dane mogą być przetwarzane w celu zawarcia i wykonania umowy,
                organizacji usług objętych ofertą, zapewnienia transportu,
                zakwaterowania, biletów, ubezpieczenia lub innych świadczeń.
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
                rachunkowych oraz obowiązków wynikających z przepisów
                dotyczących działalności turystycznej.
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
                Dane mogą być przetwarzane w celu ustalenia, dochodzenia
                lub obrony przed roszczeniami.
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
                Jeżeli użytkownik wyrazi zgodę, dane związane z korzystaniem
                z serwisu mogą być wykorzystywane w celach analitycznych
                i statystycznych.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. a RODO - zgoda
                użytkownika.
              </p>
            </div>
          </div>
        </section>

        {/* 8. SOURCE */}
        <section id="zrodlo" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            8. Źródło danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe są co do zasady pozyskiwane bezpośrednio od osoby,
              której dotyczą, w szczególności poprzez formularz kontaktowy,
              wiadomość e-mail, kontakt telefoniczny lub proces rezerwacji.
            </p>

            <p>
              W przypadku rezerwacji dokonywanej dla kilku osób dane innych
              uczestników mogą zostać przekazane przez osobę dokonującą
              rezerwacji.
            </p>

            <p>
              Osoba przekazująca dane innych uczestników powinna posiadać
              podstawę do ich przekazania oraz poinformować ich o przekazaniu
              danych Administratorowi.
            </p>
          </div>
        </section>

        {/* 9. RECIPIENTS */}
        <section id="odbiorcy" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            9. Odbiorcy danych osobowych
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
                dostawcom narzędzi analitycznych - jeżeli użytkownik wyraził
                odpowiednią zgodę,
              </li>
              <li>podmiotom świadczącym usługi księgowe, prawne i IT,</li>
              <li>organom publicznym, jeżeli wynika to z przepisów prawa.</li>
            </ul>

            <p>
              W zależności od charakteru konkretnego wyjazdu lista odbiorców
              danych może się różnić.
            </p>
          </div>
        </section>

        {/* 10. TRANSFERS */}
        <section id="transfery" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            10. Przekazywanie danych poza EOG
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W związku z korzystaniem z usług dostawców technologii,
              infrastruktury informatycznej, hostingu, komunikacji lub
              analityki dane osobowe mogą w określonych przypadkach być
              przekazywane poza Europejski Obszar Gospodarczy.
            </p>

            <p>
              Jeżeli przekazanie danych poza EOG ma miejsce, odbywa się ono
              zgodnie z mechanizmami przewidzianymi w obowiązujących przepisach,
              w szczególności na podstawie decyzji Komisji Europejskiej
              stwierdzającej odpowiedni stopień ochrony lub przy zastosowaniu
              odpowiednich zabezpieczeń przewidzianych w RODO.
            </p>

            <p>
              Szczegółowy zakres ewentualnych transferów zależy od faktycznie
              wykorzystywanych przez Administratora usług i dostawców
              technologicznych.
            </p>
          </div>
        </section>

        {/* 11. RETENTION */}
        <section id="przechowywanie" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            11. Okres przechowywania danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe są przechowywane przez okres nie dłuższy, niż jest
              to niezbędne do realizacji celu, dla którego zostały zebrane,
              z uwzględnieniem obowiązków prawnych Administratora.
            </p>

            <ul className="list-disc space-y-3 pl-6">
              <li>
                dane związane z zapytaniem - przez okres niezbędny do obsługi
                zapytania i zakończenia komunikacji;
              </li>

              <li>
                dane związane z zawartą umową - przez okres realizacji umowy,
                a następnie przez okres wymagany obowiązującymi przepisami
                prawa;
              </li>

              <li>
                dane niezbędne do ustalenia, dochodzenia lub obrony przed
                roszczeniami - do czasu upływu właściwych terminów
                przedawnienia;
              </li>

              <li>
                dane przetwarzane na podstawie zgody - do czasu jej wycofania,
                chyba że istnieje inna podstawa prawna dalszego przetwarzania.
              </li>
            </ul>
          </div>
        </section>

        {/* 12. RIGHTS */}
        <section id="prawa" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            12. Prawa osoby, której dane dotyczą
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
                cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie
                odbywa się na podstawie zgody,
              </li>
              <li>wniesienia skargi do organu nadzorczego.</li>
            </ul>

            <p>
              Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania,
              którego dokonano przed jej wycofaniem.
            </p>
          </div>
        </section>

        {/* 13. UODO */}
        <section id="skarga" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            13. Prawo wniesienia skargi
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Jeżeli użytkownik uzna, że przetwarzanie jego danych osobowych
              narusza przepisy RODO, ma prawo wnieść skargę do właściwego
              organu nadzorczego.
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

        {/* 14. DATA REQUIREMENT */}
        <section id="podanie-danych" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            14. Czy podanie danych jest obowiązkowe?
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Podanie danych osobowych jest co do zasady dobrowolne, jednak
              określone dane mogą być niezbędne do udzielenia odpowiedzi,
              przygotowania oferty, zawarcia umowy lub realizacji konkretnej
              usługi turystycznej.
            </p>

            <p>
              Niepodanie danych wymaganych do wykonania określonej czynności
              może uniemożliwić jej realizację.
            </p>
          </div>
        </section>

        {/* 15. AUTOMATION */}
        <section id="profilowanie" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            15. Profilowanie i automatyczne decyzje
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator nie wykorzystuje danych osobowych do podejmowania
              wobec użytkowników decyzji opartych wyłącznie na zautomatyzowanym
              przetwarzaniu, które wywoływałyby wobec nich skutki prawne lub
              w podobny sposób istotnie na nich wpływały.
            </p>
          </div>
        </section>

        {/* 16. COOKIES */}
        <section id="cookies" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            16. Pliki cookies i podobne technologie
          </h2>

          <div className="mt-5 space-y-5 leading-relaxed text-muted-foreground">
            <div className="flex gap-4">
              <Cookie className="mt-1 size-6 shrink-0 text-primary" />

              <p>
                Serwis może wykorzystywać pliki cookies oraz podobne
                technologie zapisywane lub odczytywane na urządzeniu
                użytkownika.
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
                Narzędzia analityczne, jeżeli są wykorzystywane w serwisie,
                powinny być uruchamiane wyłącznie po uzyskaniu odpowiedniej
                zgody użytkownika, jeżeli taka zgoda jest wymagana.
              </p>
            </div>

            <p>
              Użytkownik może zmienić swoje ustawienia dotyczące cookies
              w dowolnym momencie za pomocą dostępnych w serwisie ustawień
              prywatności i cookies.
            </p>
          </div>
        </section>

        {/* 17. SECURITY */}
        <section id="bezpieczenstwo" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            17. Bezpieczeństwo danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator stosuje odpowiednie środki techniczne
              i organizacyjne mające na celu ochronę danych osobowych przed
              przypadkowym lub niezgodnym z prawem zniszczeniem, utratą,
              zmianą, nieuprawnionym ujawnieniem lub dostępem.
            </p>

            <p>
              Zakres zabezpieczeń jest dostosowywany do charakteru
              przetwarzania oraz ryzyka naruszenia praw i wolności osób,
              których dane dotyczą.
            </p>
          </div>
        </section>

        {/* 18. IOD */}
        <section id="iod" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            18. Inspektor ochrony danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Jeżeli Administrator wyznaczy Inspektora Ochrony Danych,
              informacje dotyczące jego danych kontaktowych zostaną
              udostępnione zgodnie z obowiązującymi przepisami.
            </p>

            <p>
              W sprawach dotyczących ochrony danych osobowych można kontaktować
              się z Administratorem pod adresem:
            </p>

            {email.includes("[") ? (
              <p className="font-semibold text-primary">{email}</p>
            ) : (
              <a
                href={`mailto:${email}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {email}
              </a>
            )}
          </div>
        </section>

        {/* 19. CHANGES */}
        <section id="zmiany" className="scroll-mt-24">
          <h2 className="font-sans text-3xl font-black uppercase">
            19. Zmiany informacji prawnych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Niniejsza strona może być aktualizowana w szczególności
              w związku ze zmianami przepisów prawa, zmianami organizacyjnymi,
              zmianami sposobu świadczenia usług lub zmianami technicznymi
              serwisu.
            </p>

            <p>
              Aktualna wersja dokumentu jest publikowana na tej stronie.
            </p>
          </div>
        </section>

        {/* COMPANY SUMMARY */}
        <section className="rounded-xl border bg-card p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Scale className="mt-1 size-6 shrink-0 text-primary" />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Dane organizatora
              </h2>

              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {companyName}
                </p>

                <p>{companyAddress}</p>

                <p>NIP: {companyNip}</p>

                <p>
                  Numer wpisu do rejestru: {registerNumber}
                </p>

                <p>
                  Numer ewidencyjny: {ewidencjaNumber}
                </p>

                <p>
                  Organ wpisujący: {registerAuthority}
                </p>

                <p className="pt-2">
                  Organizator Turystyki oraz Przedsiębiorca Ułatwiający
                  Nabywanie Powiązanych Usług Turystycznych.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Data ostatniej aktualizacji: 26 sierpnia 2026 r.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}