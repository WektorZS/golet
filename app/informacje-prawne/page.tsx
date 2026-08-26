import type { Metadata } from "next"
import Link from "next/link"
import { getSiteContent } from "@/lib/content"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Informacje prawne | Let’s Gol",
  description:
    "Informacje o przetwarzaniu danych osobowych, prywatności, plikach cookies oraz zasadach korzystania z serwisu Let’s Gol.",
}

export default async function LegalPage() {
  const settings = await getSiteContent()

  const companyName =
    settings.companyName || "[UZUPEŁNIJ NAZWĘ FIRMY]"

  const companyAddress =
    settings.companyAddress || "[UZUPEŁNIJ ADRES FIRMY]"

  const companyNip =
    settings.companyNip || "[UZUPEŁNIJ NIP]"

  const email =
    settings.contactEmail || "[UZUPEŁNIJ E-MAIL]"

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
            Informacje dotyczące przetwarzania danych osobowych, plików
            cookies, korzystania z serwisu oraz zasad udziału w organizowanych
            wyjazdach.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 md:px-6">

        {/* WARNING / COMPANY DATA */}
        {(companyName.includes("[") ||
          companyAddress.includes("[") ||
          companyNip.includes("[") ||
          email.includes("[")) && (
          <aside className="rounded-xl border border-primary bg-primary/10 p-5">
            <h2 className="font-bold">
              Wymagane uzupełnienie danych firmy
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Przed publikacją dokumentu należy uzupełnić dane administratora
              oraz zweryfikować ich poprawność.
            </p>
          </aside>
        )}

        {/* 1. ADMINISTRATOR */}
        <section
          id="administrator"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            1. Administrator danych osobowych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administratorem danych osobowych przetwarzanych za pośrednictwem
              serwisu internetowego Let’s Gol jest{" "}
              <strong className="text-foreground">
                {companyName}
              </strong>
              .
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p>
                <strong className="text-foreground">Nazwa:</strong>{" "}
                {companyName}
              </p>

              <p>
                <strong className="text-foreground">Adres:</strong>{" "}
                {companyAddress}
              </p>

              <p>
                <strong className="text-foreground">NIP:</strong>{" "}
                {companyNip}
              </p>

              <p>
                <strong className="text-foreground">
                  Kontakt w sprawach dotyczących danych osobowych:
                </strong>{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-primary underline underline-offset-4"
                >
                  {email}
                </a>
              </p>
            </div>

            <p>
              Kontakt z Administratorem w sprawach związanych z przetwarzaniem
              danych osobowych oraz realizacją praw wynikających z RODO można
              nawiązać za pośrednictwem wskazanego powyżej adresu e-mail.
            </p>
          </div>
        </section>

        {/* 2. ZAKRES DANYCH */}
        <section
          id="dane"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            2. Jakie dane osobowe przetwarzamy
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W zależności od sposobu korzystania z serwisu możemy przetwarzać
              w szczególności:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>imię i nazwisko,</li>
              <li>adres e-mail,</li>
              <li>numer telefonu,</li>
              <li>treść wiadomości przesłanej przez formularz kontaktowy,</li>
              <li>informacje dotyczące wybranego wydarzenia sportowego,</li>
              <li>preferowane miejsce wylotu,</li>
              <li>liczbę osób podróżujących,</li>
              <li>dane niezbędne do dokonania rezerwacji,</li>
              <li>dane niezbędne do organizacji wyjazdu,</li>
              <li>
                informacje przekazane dobrowolnie w treści wiadomości,
              </li>
              <li>
                dane techniczne związane z korzystaniem z serwisu,
                w zakresie wynikającym z jego funkcjonowania.
              </li>
            </ul>

            <p>
              Zakres danych jest ograniczany do informacji niezbędnych do
              realizacji konkretnego celu przetwarzania.
            </p>

            <p>
              Prosimy o nieprzekazywanie za pośrednictwem formularzy informacji
              szczególnie wrażliwych, jeżeli nie jest to konieczne do realizacji
              usługi.
            </p>
          </div>
        </section>

        {/* 3. CELE */}
        <section
          id="cele"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            3. Cele i podstawy prawne przetwarzania
          </h2>

          <div className="mt-5 space-y-6 leading-relaxed text-muted-foreground">
            <div>
              <h3 className="font-bold text-foreground">
                Obsługa zapytań i kontakt z użytkownikiem
              </h3>

              <p className="mt-2">
                Dane przekazane za pośrednictwem formularza kontaktowego mogą
                być przetwarzane w celu odpowiedzi na zapytanie, przygotowania
                oferty oraz prowadzenia dalszej korespondencji dotyczącej
                wyjazdu.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. b RODO, jeżeli
                przetwarzanie jest niezbędne do podjęcia działań na żądanie
                osoby przed zawarciem umowy, oraz w odpowiednich przypadkach
                art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes
                Administratora polegający na obsłudze zapytań i komunikacji.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Zawarcie i realizacja umowy
              </h3>

              <p className="mt-2">
                Jeżeli użytkownik zdecyduje się na rezerwację wyjazdu, dane
                osobowe są przetwarzane w celu zawarcia i wykonania umowy,
                w szczególności organizacji transportu, zakwaterowania,
                biletów, ubezpieczenia oraz innych świadczeń objętych ofertą.
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
                Dane mogą być przetwarzane w celu realizacji obowiązków
                wynikających z przepisów prawa, w szczególności obowiązków
                podatkowych, rachunkowych oraz związanych z rozpatrywaniem
                reklamacji i roszczeń.
              </p>

              <p className="mt-2">
                Podstawą prawną jest art. 6 ust. 1 lit. c RODO.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground">
                Dochodzenie i obrona przed roszczeniami
              </h3>

              <p className="mt-2">
                Dane mogą być przetwarzane w celu ustalenia, dochodzenia lub
                obrony przed roszczeniami związanymi z działalnością
                Administratora.
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
                Jeżeli użytkownik wyrazi zgodę na analitykę, dane związane
                z korzystaniem z serwisu mogą być wykorzystywane w celu
                analizowania ruchu, popularności podstron oraz poprawy
                funkcjonowania serwisu.
              </p>

              <p className="mt-2">
                Podstawą prawną przetwarzania danych w tym celu jest zgoda
                użytkownika, tj. art. 6 ust. 1 lit. a RODO.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SOURCE */}
        <section
          id="zrodlo"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            4. Źródło danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Co do zasady dane osobowe są pozyskiwane bezpośrednio od osoby,
              której dotyczą, w szczególności poprzez formularz kontaktowy,
              wiadomość e-mail, telefonicznie lub w związku z dokonaniem
              rezerwacji.
            </p>

            <p>
              W przypadku organizacji wyjazdu określone dane mogą zostać
              przekazane Administratorowi przez osobę dokonującą rezerwacji
              również w imieniu innych uczestników wyjazdu.
            </p>

            <p>
              W takim przypadku osoba przekazująca dane powinna poinformować
              osoby, których dane przekazuje, o zasadach ich przetwarzania.
            </p>
          </div>
        </section>

        {/* 5. ODBIORCY */}
        <section
          id="odbiorcy"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            5. Odbiorcy danych osobowych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe mogą być przekazywane podmiotom, które wspierają
              Administratora w prowadzeniu działalności oraz realizacji
              wyjazdów, wyłącznie w zakresie niezbędnym do realizacji
              określonego celu.
            </p>

            <p>W zależności od konkretnego wyjazdu mogą to być w szczególności:</p>

            <ul className="list-disc space-y-2 pl-6">
              <li>przewoźnicy i linie lotnicze,</li>
              <li>hotele i obiekty zakwaterowania,</li>
              <li>organizatorzy wydarzeń sportowych,</li>
              <li>ubezpieczyciele,</li>
              <li>operatorzy płatności,</li>
              <li>firmy transportowe i transferowe,</li>
              <li>
                dostawcy hostingu i infrastruktury informatycznej,
              </li>
              <li>
                dostawcy poczty elektronicznej i narzędzi komunikacyjnych,
              </li>
              <li>
                dostawcy narzędzi analitycznych - jeżeli użytkownik wyraził
                zgodę na analitykę,
              </li>
              <li>
                podmioty świadczące usługi księgowe, prawne lub IT,
              </li>
              <li>
                organy publiczne, jeżeli obowiązek przekazania danych wynika
                z przepisów prawa.
              </li>
            </ul>

            <p>
              Podmioty przetwarzające dane na zlecenie Administratora są
              zobowiązane do zapewnienia odpowiedniego poziomu ochrony danych
              zgodnie z obowiązującymi przepisami.
            </p>
          </div>
        </section>

        {/* 6. TRANSFERS */}
        <section
          id="transfery"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            6. Przekazywanie danych poza Europejski Obszar Gospodarczy
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W związku z korzystaniem z niektórych usług informatycznych,
              hostingowych, pocztowych lub analitycznych dane osobowe mogą
              w określonych przypadkach być przekazywane lub dostępne poza
              Europejskim Obszarem Gospodarczym.
            </p>

            <p>
              Jeżeli takie przekazanie ma miejsce, Administrator stosuje
              mechanizmy wymagane przez RODO, odpowiednie do konkretnego
              przypadku, w szczególności decyzję Komisji Europejskiej
              stwierdzającą odpowiedni stopień ochrony lub odpowiednie
              zabezpieczenia przewidziane w RODO.
            </p>

            <p>
              Przykładowo infrastruktura wykorzystywana przez dostawcę
              hostingu lub analityki może obejmować przetwarzanie danych
              w Stanach Zjednoczonych lub innych państwach. W przypadku
              korzystania z usług przetwarzanie może obejmować transfery
              poza EOG, przy zastosowaniu mechanizmów opisanych przez administratora usług hostingowych
              w dokumentacji dotyczącej ochrony danych.
            </p>

            <p>
              Zakres i sposób transferu danych zależy od faktycznie
              wykorzystywanych przez Administratora usług.
            </p>
          </div>
        </section>

        {/* 7. RETENTION */}
        <section
          id="przechowywanie"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            7. Okres przechowywania danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe są przechowywane przez okres nie dłuższy niż jest
              to niezbędne do realizacji celu, dla którego zostały zebrane,
              z uwzględnieniem obowiązków prawnych Administratora.
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                dane związane z zapytaniem - przez okres niezbędny do jego
                obsługi i zakończenia komunikacji, a następnie przez okres
                potrzebny do zabezpieczenia ewentualnych roszczeń;
              </li>

              <li>
                dane związane z zawartą umową - przez okres jej realizacji
                oraz przez okres wymagany przepisami prawa, w szczególności
                przepisami podatkowymi i rachunkowymi;
              </li>

              <li>
                dane potrzebne do ustalenia, dochodzenia lub obrony roszczeń -
                do czasu upływu właściwych terminów przedawnienia;
              </li>

              <li>
                dane przetwarzane na podstawie zgody - do czasu jej wycofania,
                chyba że dalsze przetwarzanie jest dopuszczalne na innej
                podstawie prawnej.
              </li>
            </ul>

            <p>
              Po upływie odpowiedniego okresu dane są usuwane lub poddawane
              anonimizacji, chyba że ich dalsze przechowywanie jest wymagane
              przez przepisy prawa.
            </p>

            <p>
              Wskazanie kryteriów okresu przechowywania jest stosowane tam,
              gdzie dokładny termin zależy od konkretnego celu lub obowiązku
              prawnego.
            </p>
          </div>
        </section>

        {/* 8. RIGHTS */}
        <section
          id="prawa"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            8. Prawa osoby, której dane dotyczą
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              W związku z przetwarzaniem danych osobowych przysługują Ci,
              w przypadkach określonych w RODO, następujące prawa:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>prawo dostępu do swoich danych,</li>
              <li>prawo do sprostowania danych,</li>
              <li>prawo do usunięcia danych,</li>
              <li>
                prawo do ograniczenia przetwarzania danych,
              </li>
              <li>prawo do przenoszenia danych,</li>
              <li>
                prawo wniesienia sprzeciwu wobec przetwarzania danych,
              </li>
              <li>
                prawo do cofnięcia zgody w dowolnym momencie, jeżeli
                przetwarzanie odbywa się na podstawie zgody,
              </li>
              <li>
                prawo wniesienia skargi do organu nadzorczego.
              </li>
            </ul>

            <p>
              Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania,
              którego dokonano przed jej wycofaniem.
            </p>

            <p>
              Nie wszystkie prawa mają charakter bezwzględny. Ich zakres może
              zależeć od podstawy prawnej i celu konkretnego przetwarzania.
            </p>
          </div>
        </section>

        {/* 9. UODO */}
        <section
          id="skarga"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            9. Prawo wniesienia skargi
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Jeżeli uznasz, że przetwarzanie Twoich danych osobowych narusza
              przepisy RODO, masz prawo wnieść skargę do organu nadzorczego.
            </p>

            <p>
              W Polsce organem właściwym jest:
            </p>

            <div className="rounded-xl border bg-card p-5">
              <p className="font-semibold text-foreground">
                Prezes Urzędu Ochrony Danych Osobowych
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                ul. Moniuszki 1A
                <br />
                00-014 Warszawa
              </p>
            </div>

            <p>
              Przed wniesieniem skargi możesz również skontaktować się
              bezpośrednio z Administratorem w celu wyjaśnienia sprawy.
            </p>
          </div>
        </section>

        {/* 10. DATA REQUIREMENT */}
        <section
          id="podanie-danych"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            10. Czy podanie danych jest obowiązkowe?
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Podanie danych osobowych jest dobrowolne, jednak w niektórych
              przypadkach może być niezbędne do udzielenia odpowiedzi na
              zapytanie, przygotowania oferty, dokonania rezerwacji lub
              realizacji umowy.
            </p>

            <p>
              Zakres wymaganych danych może różnić się w zależności od rodzaju
              usługi oraz świadczeń objętych konkretnym wyjazdem.
            </p>

            <p>
              Niepodanie danych niezbędnych do realizacji określonej czynności
              może uniemożliwić jej wykonanie.
            </p>
          </div>
        </section>

        {/* 11. AUTOMATION */}
        <section
          id="profilowanie"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            11. Profilowanie i automatyczne podejmowanie decyzji
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Dane osobowe nie są wykorzystywane przez Administratora do
              podejmowania wobec użytkowników decyzji opartych wyłącznie na
              zautomatyzowanym przetwarzaniu, które wywoływałyby wobec nich
              skutki prawne lub w podobny sposób istotnie na nich wpływały.
            </p>

            <p>
              Administrator nie prowadzi profilowania użytkowników w celu
              podejmowania takich decyzji.
            </p>
          </div>
        </section>

        {/* 12. COOKIES */}
        <section
          id="cookies"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            12. Pliki cookies
          </h2>

          <div className="mt-5 space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Serwis wykorzystuje pliki cookies oraz podobne technologie,
              które mogą być zapisywane na urządzeniu użytkownika.
            </p>

            <h3 className="font-bold text-foreground">
              Cookies niezbędne
            </h3>

            <p>
              Niezbędne pliki cookies służą do zapewnienia prawidłowego
              działania serwisu, zapamiętania ustawień prywatności oraz
              zapewnienia podstawowych funkcji strony.
            </p>

            <p>
              W szczególności serwis wykorzystuje cookie służące do zapisania
              wyboru użytkownika dotyczącego analityki.
            </p>

            <h3 className="font-bold text-foreground">
              Cookies analityczne
            </h3>

            <p>
              Analityka jest uruchamiana dopiero po wyrażeniu przez użytkownika
              zgody poprzez wybór opcji „Akceptuję analitykę”.
            </p>

            <p>
              Jeżeli użytkownik odmówi zgody, analityka nie powinna być
              uruchamiana.
            </p>

            <p>
              Zgodę można zmienić w dowolnym momencie za pomocą przycisku
              „Ustawienia cookies”, znajdującego się w lewym dolnym rogu
              serwisu.
            </p>

            <p>
              Szczegółowe informacje o wykorzystywanych cookies powinny być
              aktualizowane wraz ze zmianami technicznymi w serwisie.
            </p>
          </div>
        </section>

       
        <section
          id="analityka"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            13. Analityka serwisu
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Serwis może korzystać z narzędzi analitycznych w celu uzyskiwania
              informacji statystycznych dotyczących korzystania ze strony,
              takich jak liczba odwiedzin, źródła ruchu oraz popularność
              poszczególnych podstron.
            </p>

            <p>
              W aktualnej konfiguracji aplikacji analityka jest uruchamiana
              dopiero po wyrażeniu przez użytkownika zgody na analitykę.
            </p>

          </div>
        </section>

        {/* 14. SECURITY */}
        <section
          id="bezpieczenstwo"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            14. Bezpieczeństwo danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Administrator stosuje odpowiednie środki techniczne i
              organizacyjne mające na celu ochronę danych osobowych przed
              przypadkowym lub niezgodnym z prawem zniszczeniem, utratą,
              zmianą, nieuprawnionym ujawnieniem lub dostępem.
            </p>

            <p>
              Zakres stosowanych zabezpieczeń jest dostosowywany do charakteru,
              zakresu, kontekstu i celów przetwarzania oraz ryzyka naruszenia
              praw i wolności osób, których dane dotyczą.
            </p>

            <p>
              Dostęp do danych jest ograniczany do osób i podmiotów, które
              potrzebują go do realizacji określonych zadań.
            </p>
          </div>
        </section>

        {/* 15. IOD */}
        <section
          id="iod"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            15. Inspektor ochrony danych
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Jeżeli Administrator wyznaczył inspektora ochrony danych,
              jego dane kontaktowe są udostępniane osobom, których dane
              dotyczą, w sposób zgodny z obowiązującymi przepisami.
            </p>

            <p>
              Jeżeli w danym przypadku Administrator nie jest zobowiązany do
              wyznaczenia inspektora ochrony danych, funkcję punktu kontaktowego
              w sprawach ochrony danych pełni Administrator pod adresem:
            </p>

            <p>
              <a
                href={`mailto:${email}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {email}
              </a>
            </p>
          </div>
        </section>

        {/* 16. WARUNKI */}
        <section
          id="warunki"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            16. Warunki uczestnictwa
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Szczegółowe zasady dotyczące udziału w organizowanych wyjazdach,
              rezerwacji, płatności, świadczeń, zmian programu, rezygnacji,
              reklamacji oraz odpowiedzialności stron zostały określone
              w odrębnym dokumencie.
            </p>

            <Link
              href="/warunki-uczestnictwa"
              className="inline-flex font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Zapoznaj się z Warunkami Uczestnictwa →
            </Link>
          </div>
        </section>

        {/* 17. CHANGES */}
        <section
          id="zmiany"
          className="scroll-mt-24"
        >
          <h2 className="font-sans text-3xl font-black uppercase">
            17. Zmiany Polityki Prywatności
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Niniejsza Polityka Prywatności może być aktualizowana w związku
              ze zmianami przepisów prawa, zmianami technicznymi serwisu,
              zmianami sposobu przetwarzania danych lub wprowadzeniem nowych
              usług.
            </p>

            <p>
              Aktualna wersja dokumentu jest publikowana na tej stronie.
            </p>

            <p>
              Zalecamy okresowe zapoznawanie się z treścią Polityki Prywatności.
            </p>
          </div>
        </section>

        {/* COMPANY */}
        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="font-sans text-xl font-black uppercase">
            Administrator
          </h2>

          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">
              {companyName}
            </p>

            <p>{companyAddress}</p>

            <p>NIP: {companyNip}</p>

            <p>
              E-mail:{" "}
              <a
                href={`mailto:${email}`}
                className="text-primary underline underline-offset-4"
              >
                {email}
              </a>
            </p>
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