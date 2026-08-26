import Link from "next/link"

export default function WarunkiUczestnictwaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Informacje dla uczestników
            </p>

            <h1 className="font-sans text-4xl font-black uppercase tracking-tight md:text-5xl">
              Warunki uczestnictwa
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Zanim wybierzesz się z nami na wydarzenie sportowe, zapoznaj się
              z najważniejszymi zasadami dotyczącymi organizacji i udziału
              w naszych wyjazdach.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="space-y-12">

          <section>
            <h2 className="text-2xl font-black uppercase">
              1. Postanowienia ogólne
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Niniejsze Warunki Uczestnictwa określają zasady udziału
                w wyjazdach organizowanych przez{" "}
                <strong className="text-foreground">[NAZWA FIRMY]</strong>,
                z siedzibą w{" "}
                <strong className="text-foreground">[ADRES]</strong>,
                NIP: <strong className="text-foreground">[NIP]</strong>,
                REGON: <strong className="text-foreground">[REGON]</strong>,
                zwaną dalej „Organizatorem”.
              </p>

              <p>
                Organizujemy wspólne wyjazdy na wydarzenia sportowe odbywające
                się w Polsce oraz innych krajach Europy, w szczególności na
                mecze piłkarskie, turnieje, zawody i inne wydarzenia sportowe.
              </p>

              <p>
                Szczegółowe informacje dotyczące każdego wyjazdu, w tym termin,
                miejsce, program, zakres świadczeń, transport, zakwaterowanie,
                wydarzenie sportowe oraz cena, są określone w ofercie danego
                wyjazdu oraz dokumentach przekazanych uczestnikowi przed
                zawarciem umowy.
              </p>

              <p>
                Dokonując rezerwacji, uczestnik potwierdza, że zapoznał się
                z niniejszymi Warunkami Uczestnictwa oraz informacjami
                dotyczącymi wybranego wyjazdu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              2. Charakter naszych wyjazdów
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Nasze wyjazdy są przygotowywane z myślą o osobach, które chcą
                wspólnie przeżywać najważniejsze wydarzenia sportowe w Europie.
                W zależności od wybranej oferty możemy zapewnić kompleksową
                organizację wyjazdu.
              </p>

              <p>
                W ramach poszczególnych wyjazdów mogą być zapewnione między
                innymi:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>przelot lub inny transport,</li>
                <li>zakwaterowanie w hotelu,</li>
                <li>ubezpieczenie podróżne,</li>
                <li>bilet na wydarzenie sportowe,</li>
                <li>transfery,</li>
                <li>opieka koordynatora wyjazdu,</li>
                <li>atrakcje dodatkowe i zwiedzanie.</li>
              </ul>

              <p>
                Zakres świadczeń może różnić się w zależności od konkretnego
                wyjazdu. Wszystkie elementy zawarte w cenie są wskazane
                w jego indywidualnej ofercie.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              3. Rezerwacja miejsca
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Rezerwacji można dokonać za pośrednictwem strony internetowej,
                telefonicznie, mailowo lub w inny sposób wskazany przez
                Organizatora.
              </p>

              <p>
                Rezerwacja zostaje potwierdzona po przekazaniu wymaganych danych
                oraz dokonaniu płatności w wysokości i terminie określonym
                w ofercie lub dokumentach rezerwacyjnych.
              </p>

              <p>
                Liczba miejsc na poszczególne wyjazdy może być ograniczona.
                O dostępności miejsc decyduje kolejność prawidłowo dokonanych
                rezerwacji, chyba że oferta stanowi inaczej.
              </p>

              <p>
                W przypadku braku wymaganej płatności w terminie Organizator
                może anulować rezerwację, z uwzględnieniem warunków zawartej
                umowy oraz obowiązujących przepisów prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              4. Cena i zakres świadczeń
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Cena każdego wyjazdu jest podana w jego indywidualnej ofercie.
                Organizator wskazuje również, jakie świadczenia są zawarte
                w cenie.
              </p>

              <p>
                W zależności od wybranego pakietu cena może obejmować przelot,
                zakwaterowanie, ubezpieczenie, bilet na wydarzenie sportowe,
                transfery, atrakcje oraz inne świadczenia wymienione w ofercie.
              </p>

              <p>
                Wydatki niewymienione w ofercie jako zawarte w cenie nie są
                objęte ceną wyjazdu. Dotyczy to w szczególności wydatków
                osobistych, posiłków i napojów, dodatkowego bagażu lub
                dodatkowych atrakcji, jeżeli nie zostały wskazane jako
                element pakietu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              5. Transport i przelot
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Transport podczas wyjazdu może być realizowany samolotem,
                autokarem, koleją, samochodem lub innym środkiem transportu
                wskazanym w ofercie.
              </p>

              <p>
                W przypadku transportu lotniczego uczestnika obowiązują również
                warunki przewoźnika lotniczego, w szczególności dotyczące
                odprawy, bagażu oraz bezpieczeństwa.
              </p>

              <p>
                Uczestnik zobowiązany jest do punktualnego stawienia się
                w miejscu i czasie wskazanym przez Organizatora lub przewoźnika.
              </p>

              <p>
                Godziny lotów, numery rejsów, miejsca zbiórek oraz szczegóły
                dotyczące transportu mogą ulec zmianie. O istotnych zmianach
                Organizator poinformuje uczestników w możliwie najkrótszym
                terminie.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              6. Zakwaterowanie
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Zakwaterowanie odbywa się w hotelu lub innym obiekcie wskazanym
                w ofercie danego wyjazdu.
              </p>

              <p>
                Standard obiektu, rodzaj pokoju oraz liczba osób w pokoju
                określone są w ofercie.
              </p>

              <p>
                Uczestnik zobowiązany jest do przestrzegania regulaminu hotelu
                lub innego obiektu zakwaterowania.
              </p>

              <p>
                Uczestnik ponosi odpowiedzialność za szkody wyrządzone przez
                siebie w hotelu lub innym obiekcie na zasadach określonych
                przepisami prawa oraz regulaminem danego obiektu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              7. Bilety na wydarzenia sportowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Jeżeli bilet na wydarzenie sportowe jest elementem wyjazdu,
                jego rodzaj oraz kategoria są określone w ofercie.
              </p>

              <p>
                Sposób odbioru lub przekazania biletu jest każdorazowo
                przekazywany uczestnikowi przed wydarzeniem.
              </p>

              <p>
                Konkretne miejsce na stadionie, hali lub innym obiekcie jest
                gwarantowane wyłącznie wtedy, gdy zostało wyraźnie określone
                w ofercie lub dokumentach dotyczących wyjazdu.
              </p>

              <p>
                Uczestnik zobowiązany jest do przestrzegania regulaminu
                obiektu oraz zasad organizatora wydarzenia sportowego.
              </p>

              <p>
                Organizator wydarzenia może stosować własne zasady dotyczące
                wejścia na obiekt, kontroli bezpieczeństwa, przedmiotów
                dozwolonych na stadionie oraz zachowania podczas wydarzenia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              8. Zmiana lub odwołanie wydarzenia sportowego
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Wydarzenie sportowe może zostać przełożone, odwołane,
                skrócone, przeniesione do innej lokalizacji lub odbyć się
                bez udziału publiczności.
              </p>

              <p>
                Decyzje dotyczące terminu, miejsca i sposobu przeprowadzenia
                wydarzenia podejmuje jego organizator lub właściwe organy.
              </p>

              <p>
                W przypadku zmiany lub odwołania wydarzenia Organizator podejmie
                działania zgodne z warunkami zawartej umowy, zasadami organizatora
                wydarzenia oraz obowiązującymi przepisami prawa.
              </p>

              <p>
                Szczegółowe zasady dotyczące ewentualnych zmian, zwrotów lub
                świadczeń zastępczych wynikają z umowy oraz obowiązujących
                przepisów prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              9. Program i atrakcje dodatkowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Program wyjazdu może obejmować zwiedzanie, transfery, wspólne
                aktywności, wydarzenia towarzyszące oraz inne atrakcje wskazane
                w ofercie.
              </p>

              <p>
                Kolejność poszczególnych punktów programu może ulec zmianie,
                jeżeli jest to uzasadnione względami organizacyjnymi,
                logistycznymi, bezpieczeństwa lub innymi okolicznościami
                niezależnymi od Organizatora.
              </p>

              <p>
                W przypadku konieczności zastąpienia atrakcji Organizator,
                w miarę możliwości, zapewni świadczenie o porównywalnym
                charakterze i wartości, zgodnie z warunkami umowy
                i obowiązującymi przepisami.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              10. Ubezpieczenie
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Jeżeli ubezpieczenie jest elementem danego pakietu, uczestnik
                otrzymuje ochronę ubezpieczeniową na zasadach określonych
                w warunkach ubezpieczenia.
              </p>

              <p>
                Uczestnik powinien przed wyjazdem zapoznać się z zakresem
                ochrony, sumami ubezpieczenia oraz wyłączeniami odpowiedzialności
                ubezpieczyciela.
              </p>

              <p>
                W przypadku wystąpienia zdarzenia objętego ubezpieczeniem
                uczestnik powinien postępować zgodnie z instrukcjami
                ubezpieczyciela.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              11. Dokumenty podróży
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik jest odpowiedzialny za posiadanie ważnych dokumentów
                wymaganych do odbycia podróży, w szczególności dowodu osobistego
                lub paszportu, zależnie od kraju docelowego.
              </p>

              <p>
                W przypadku konieczności posiadania wizy, zezwolenia lub
                spełnienia dodatkowych warunków wjazdu uczestnik jest zobowiązany
                do ich uzyskania przed rozpoczęciem podróży.
              </p>

              <p>
                Wymagania dotyczące dokumentów i przekraczania granic mogą
                ulegać zmianie. Uczestnik powinien przed wyjazdem sprawdzić
                aktualne wymagania dotyczące kraju docelowego.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              12. Zasady zachowania uczestnika
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik zobowiązany jest do zachowania zgodnego z prawem,
                zasadami współżycia społecznego oraz zasadami bezpieczeństwa.
              </p>

              <p>Podczas wyjazdu uczestnik zobowiązany jest w szczególności do:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>przestrzegania zasad bezpieczeństwa,</li>
                <li>stosowania się do uzasadnionych poleceń Organizatora,</li>
                <li>przestrzegania regulaminów hoteli i obiektów sportowych,</li>
                <li>punktualnego stawiania się w miejscach zbiórek,</li>
                <li>poszanowania innych uczestników wyjazdu,</li>
                <li>poszanowania mienia,</li>
                <li>przestrzegania przepisów obowiązujących w kraju pobytu.</li>
              </ul>

              <p>
                Niedopuszczalne jest zachowanie stwarzające zagrożenie dla
                innych osób, mienia lub bezpieczeństwa wyjazdu.
              </p>

              <p>
                W przypadku wyrządzenia szkody przez uczestnika może on ponosić
                odpowiedzialność za jej naprawienie na zasadach określonych
                przepisami prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              13. Rezygnacja z wyjazdu
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik może zrezygnować z udziału w wyjeździe na zasadach
                określonych w zawartej umowie oraz obowiązujących przepisach
                prawa.
              </p>

              <p>
                Rezygnację należy zgłosić Organizatorowi w formie umożliwiającej
                jej udokumentowanie.
              </p>

              <p>
                W przypadku rezygnacji mogą wystąpić koszty związane
                z usługami już zarezerwowanymi lub zakupionymi na rzecz
                uczestnika, w zakresie dopuszczonym przez obowiązujące
                przepisy prawa.
              </p>

              <p>
                Szczegółowe zasady dotyczące rezygnacji, wysokości ewentualnych
                kosztów oraz zwrotów są każdorazowo określone w umowie dotyczącej
                danego wyjazdu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              14. Zmiany w programie wyjazdu
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator może dokonywać zmian w programie wyjazdu, jeżeli
                jest to uzasadnione przyczynami organizacyjnymi, logistycznymi,
                bezpieczeństwa lub innymi okolicznościami przewidzianymi
                w umowie i obowiązujących przepisach prawa.
              </p>

              <p>
                W przypadku istotnej zmiany warunków wyjazdu uczestnik zostanie
                poinformowany o zmianie oraz przysługujących mu prawach zgodnie
                z obowiązującymi przepisami.
              </p>

              <p>
                Organizator dokłada starań, aby wszelkie zmiany miały możliwie
                najmniejszy wpływ na komfort i przebieg wyjazdu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              15. Sytuacje niezależne od Organizatora
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Na przebieg wyjazdu mogą wpływać okoliczności niezależne od
                Organizatora, w szczególności:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>opóźnienia lub odwołania lotów,</li>
                <li>strajki,</li>
                <li>decyzje przewoźników,</li>
                <li>niekorzystne warunki pogodowe,</li>
                <li>klęski żywiołowe,</li>
                <li>decyzje władz państwowych,</li>
                <li>ograniczenia w podróżowaniu,</li>
                <li>sytuacje związane z bezpieczeństwem,</li>
                <li>konflikty zbrojne,</li>
                <li>zamknięcie granic,</li>
                <li>odwołanie lub przełożenie wydarzenia sportowego,</li>
                <li>inne nadzwyczajne okoliczności.</li>
              </ul>

              <p>
                W przypadku wystąpienia takich okoliczności Organizator podejmuje
                działania mające na celu ograniczenie ich wpływu na realizację
                wyjazdu, zgodnie z zawartą umową oraz obowiązującymi przepisami
                prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              16. Odpowiedzialność Organizatora
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Organizator odpowiada za realizację świadczeń objętych umową
                na zasadach określonych w tej umowie oraz obowiązujących
                przepisach prawa.
              </p>

              <p>
                W przypadku gdy poszczególne świadczenia realizowane są przez
                innych usługodawców, mogą mieć zastosowanie również warunki
                świadczenia usług określone przez tych usługodawców.
              </p>

              <p>
                Odpowiedzialność Organizatora nie wyłącza ani nie ogranicza
                praw uczestnika wynikających z bezwzględnie obowiązujących
                przepisów prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              17. Reklamacje
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik ma prawo zgłosić reklamację dotyczącą realizacji
                świadczeń objętych umową.
              </p>

              <p>
                Reklamację można złożyć drogą mailową:
              </p>

              <p className="font-semibold text-foreground">
                [ADRES E-MAIL]
              </p>

              <p>
                W reklamacji zaleca się wskazanie imienia i nazwiska uczestnika,
                numeru rezerwacji lub umowy, opisu problemu, daty i miejsca
                jego wystąpienia oraz oczekiwanego sposobu rozwiązania sprawy,
                jeżeli uczestnik go wskazuje.
              </p>

              <p>
                W przypadku problemu występującego podczas wyjazdu uczestnik
                powinien, w miarę możliwości, niezwłocznie poinformować
                Organizatora lub jego przedstawiciela, aby umożliwić podjęcie
                działań naprawczych.
              </p>

              <p>
                Reklamacje są rozpatrywane w terminach wynikających
                z obowiązujących przepisów prawa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              18. Dane osobowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Dane osobowe uczestników są przetwarzane w celu realizacji
                rezerwacji, organizacji wyjazdu, dokonania niezbędnych
                rezerwacji oraz realizacji obowiązków prawnych Organizatora.
              </p>

              <p>
                Szczegółowe informacje dotyczące przetwarzania danych osobowych
                znajdują się w{" "}
                <Link
                  href="/polityka-prywatnosci"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Polityce Prywatności
                </Link>
                .
              </p>

              <p>
                W zakresie niezbędnym do realizacji wyjazdu dane uczestnika
                mogą być przekazywane podmiotom uczestniczącym w organizacji
                poszczególnych świadczeń, w szczególności przewoźnikom,
                hotelom, ubezpieczycielom oraz organizatorom wydarzeń sportowych.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              19. Kontakt i komunikacja
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Uczestnik powinien podać aktualne dane kontaktowe umożliwiające
                Organizatorowi przekazywanie informacji związanych z wyjazdem.
              </p>

              <p>
                Komunikacja może obejmować informacje dotyczące godzin lotów,
                miejsca zbiórki, zakwaterowania, biletów, zmian programu oraz
                innych kwestii organizacyjnych.
              </p>

              <p>
                Za aktualność przekazanych Organizatorowi danych kontaktowych
                odpowiada uczestnik.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase">
              20. Postanowienia końcowe
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Niniejsze Warunki Uczestnictwa stanowią integralną część
                informacji dotyczących organizowanych wyjazdów.
              </p>

              <p>
                W sprawach nieuregulowanych niniejszym dokumentem zastosowanie
                mają postanowienia zawartej umowy oraz właściwe przepisy prawa.
              </p>

              <p>
                W przypadku rozbieżności pomiędzy niniejszymi Warunkami
                Uczestnictwa a bezwzględnie obowiązującymi przepisami prawa,
                zastosowanie mają przepisy prawa.
              </p>

              <p>
                Organizator zastrzega sobie prawo do aktualizacji niniejszych
                Warunków Uczestnictwa. Zmiany nie naruszają praw nabytych przez
                uczestników, którzy zawarli umowę przed ich wejściem w życie.
              </p>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-black uppercase">
              Organizator
            </h2>

            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                [NAZWA FIRMY]
              </p>
              <p>[ADRES]</p>
              <p>NIP: [NIP]</p>
              <p>REGON: [REGON]</p>
              <p>E-mail: [ADRES E-MAIL]</p>
              <p>Telefon: [NUMER TELEFONU]</p>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Data ostatniej aktualizacji: [DATA]
            </p>
          </section>

        </div>
      </section>
    </main>
  )
}
```
