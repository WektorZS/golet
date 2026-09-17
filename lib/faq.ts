export type FaqItem = {
  question: string
  answer: string
  popular?: boolean
}

export type FaqCategory = {
  id: string
  title: string
  description: string
  items: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: "rezerwacja",
    title: "Rezerwacja i płatność",
    description: "Jak wygląda rezerwacja od pierwszego zapytania do potwierdzenia wyjazdu.",
    items: [
      {
        question: "Jak zarezerwować wyjazd?",
        answer:
          "Wybierz interesujący Cię wyjazd i wyślij formularz. Sprawdzimy dostępność, potwierdzimy szczegóły i prześlemy Ci ofertę. Jeżeli wszystko Ci odpowiada, przechodzimy do rezerwacji i podpisania umowy.",
        popular: true,
      },
      {
        question: "Czy wysłanie formularza oznacza rezerwację miejsca?",
        answer:
          "Nie. Formularz jest zapytaniem o wyjazd. Rezerwacja zostaje potwierdzona dopiero po zaakceptowaniu oferty i spełnieniu warunków wskazanych w umowie.",
        popular: true,
      },
      {
        question: "Co dzieje się po wysłaniu zapytania?",
        answer:
          "Sprawdzamy dostępność wybranego meczu i pakietu. Jeżeli potrzebujemy dodatkowych informacji, kontaktujemy się z Tobą. Następnie otrzymujesz konkretną ofertę z ceną, zakresem wyjazdu i kolejnymi krokami.",
      },
      {
        question: "Jak wygląda płatność za wyjazd?",
        answer:
          "Warunki płatności otrzymujesz razem z ofertą. Przy części wyjazdów płatność może być podzielona na kilka etapów, ponieważ bilety, loty i noclegi mają różne terminy rezerwacji.",
      },
      {
        question: "Czy można zapłacić za wyjazd w ratach?",
        answer:
          "W wielu przypadkach możemy podzielić płatność na etapy. Zależy to jednak od terminu wyjazdu i warunków konkretnej oferty. Najlepiej zapytać o to przed rezerwacją.",
      },
      {
        question: "Czy mogę zarezerwować kilka miejsc jednocześnie?",
        answer:
          "Tak. W formularzu podaj liczbę osób, które chcą jechać. Sprawdzimy dostępność biletów i pozostałych elementów wyjazdu dla całej grupy.",
      },
      {
        question: "Czy mogę zarezerwować wyjazd dla innej osoby?",
        answer:
          "Tak. Możesz wysłać zapytanie również dla innych uczestników. Przed finalizacją rezerwacji poprosimy o dane potrzebne do przygotowania dokumentów i rezerwacji.",
      },
    ],
  },

  {
    id: "pakiety",
    title: "Pakiety i wyjazdy indywidualne",
    description: "Co możesz zarezerwować i jak dopasować wyjazd do swoich potrzeb.",
    items: [
      {
        question: "Co zawiera pełny pakiet?",
        answer:
          "Zakres zależy od konkretnego wyjazdu, ale pełny pakiet może obejmować bilet na mecz, przelot, nocleg, lokalne transfery, plan podróży i opiekę organizacyjną. Dokładny zakres zawsze znajdziesz przy wybranym wyjeździe.",
        popular: true,
      },
      {
        question: "Czy muszę kupować pełny pakiet?",
        answer:
          "Nie. Przy części wyjazdów dostępne są również inne warianty, na przykład sam bilet, bilet z lotem albo bilet z noclegiem. Dostępne opcje są pokazane na stronie konkretnego wyjazdu.",
      },
      {
        question: "Czy możecie zorganizować wyjazd na mecz, którego nie ma w kalendarzu?",
        answer:
          "Tak. Jeżeli nie widzisz interesującego Cię meczu, napisz do nas. Sprawdzimy dostępność biletów, lotów i noclegów i przygotujemy indywidualną propozycję.",
        popular: true,
      },
      {
        question: "Czy mogę wybrać inne lotnisko wylotu?",
        answer:
          "Przy wyjeździe indywidualnym możemy sprawdzić różne lotniska i dopasować wariant do Twojego miejsca zamieszkania. Przy gotowych wyjazdach miejsce wylotu zależy od konkretnej oferty.",
      },
      {
        question: "Czy organizujecie wyjazdy dla grup?",
        answer:
          "Tak. Możemy przygotować wyjazd dla pary, rodziny, grupy znajomych, firmy, klubu lub większej grupy zorganizowanej.",
      },
      {
        question: "Czy mogę poprosić o wycenę przed podjęciem decyzji?",
        answer:
          "Oczywiście. Wyślij zapytanie i napisz, jaki mecz Cię interesuje, ile osób jedzie i czego potrzebujesz. Sprawdzimy możliwości i przygotujemy propozycję.",
      },
    ],
  },

  {
    id: "bilety",
    title: "Bilety na mecz",
    description: "Informacje o biletach, miejscach na stadionie i sposobie ich przekazania.",
    items: [
      {
        question: "Czy bilet na mecz jest zawarty w cenie?",
        answer:
          "To zależy od wybranego wariantu. Przy każdym wyjeździe pokazujemy, co dokładnie obejmuje dana opcja. Przed rezerwacją otrzymujesz również pełny zakres oferty.",
        popular: true,
      },
      {
        question: "Jak otrzymam bilet na mecz?",
        answer:
          "Sposób przekazania biletu zależy od klubu i systemu sprzedaży. Może to być bilet elektroniczny, bilet w aplikacji albo inna forma stosowana przy danym meczu. Wszystkie instrukcje otrzymasz przed spotkaniem.",
      },
      {
        question: "Kiedy otrzymam bilet?",
        answer:
          "Kluby często udostępniają bilety dopiero przed meczem. Gdy tylko bilet będzie dostępny, przekażemy Ci go razem z potrzebnymi instrukcjami.",
      },
      {
        question: "Czy miejsca na stadionie będą obok siebie?",
        answer:
          "Przy rezerwacji dla kilku osób zawsze sprawdzamy możliwość miejsc obok siebie. Ostateczny układ zależy jednak od dostępności przy konkretnym meczu.",
      },
      {
        question: "Czy mogę wybrać kategorię biletu?",
        answer:
          "Jeżeli dostępnych jest kilka kategorii, pokażemy Ci możliwe warianty. Wybrana kategoria zostanie potwierdzona w ofercie.",
      },
      {
        question: "Czy klub może zmienić przydzielone miejsca?",
        answer:
          "W wyjątkowych sytuacjach klub lub operator systemu biletowego może zmienić przydział miejsc. Jeżeli otrzymamy taką informację, od razu przekażemy Ci szczegóły.",
      },
    ],
  },

  {
    id: "transport",
    title: "Transport",
    description: "Wylot, miejsce zbiórki, bagaż i informacje dotyczące podróży.",
    items: [
      {
        question: "Skąd odbywa się wyjazd?",
        answer:
          "Miejsce wylotu lub zbiórki jest podane przy konkretnym wyjeździe. Przy wyjazdach indywidualnych możemy sprawdzić kilka możliwości i dopasować je do miejsca zamieszkania uczestników.",
        popular: true,
      },
      {
        question: "Kiedy poznam godzinę wylotu lub zbiórki?",
        answer:
          "Najważniejsze godziny przekazujemy przed wyjazdem razem z informacjami organizacyjnymi. Jeżeli przewoźnik zmieni rozkład, poinformujemy Cię o aktualizacji.",
      },
      {
        question: "Czy wszystkie wyjazdy odbywają się samolotem?",
        answer:
          "Nie zawsze. Sposób podróży zależy od konkretnego meczu i wybranego wariantu. Przy każdym wyjeździe dokładnie pokazujemy, jaki transport obejmuje oferta.",
      },
      {
        question: "Ile bagażu mogę zabrać?",
        answer:
          "Limit bagażu zależy od linii lotniczej i wybranej taryfy. Przed podróżą otrzymasz informację, jaki bagaż obejmuje Twoja rezerwacja.",
      },
      {
        question: "Co się stanie, jeśli lot lub transport się opóźni?",
        answer:
          "W takiej sytuacji analizujemy aktualny plan podróży i przekazujemy uczestnikom informacje o dalszych krokach. Konkretne rozwiązanie zależy od rodzaju transportu i skali opóźnienia.",
      },
      {
        question: "Czy mogę zmienić miejsce wylotu po rezerwacji?",
        answer:
          "Czasami jest to możliwe, ale zależy od etapu rezerwacji i warunków przewoźnika. Jeżeli chcesz coś zmienić, skontaktuj się z nami jak najwcześniej.",
      },
    ],
  },

  {
    id: "noclegi",
    title: "Noclegi",
    description: "Hotel, pokoje i najważniejsze informacje dotyczące zakwaterowania.",
    items: [
      {
        question: "Czy każdy wyjazd obejmuje nocleg?",
        answer:
          "Nie. Wszystko zależy od wybranego wariantu. Jeżeli pakiet obejmuje hotel, będzie to wyraźnie zaznaczone przy danym wyjeździe.",
      },
      {
        question: "Jaki jest standard hotelu?",
        answer:
          "Informacje o standardzie i lokalizacji podajemy przy konkretnej ofercie. Jeżeli hotel nie został jeszcze wskazany, otrzymasz jego dane po potwierdzeniu rezerwacji.",
      },
      {
        question: "Czy mogę wybrać rodzaj pokoju?",
        answer:
          "Możesz podać swoje preferencje w zapytaniu. Dostępność pokoju jednoosobowego, dwuosobowego lub innej konfiguracji zależy od hotelu i konkretnego terminu.",
      },
      {
        question: "Czy osoby jadące razem będą w tym samym pokoju?",
        answer:
          "Przygotowując rezerwację staramy się uwzględnić wspólne zakwaterowanie. Ostateczny układ pokojów zależy od liczby osób i dostępności hotelu.",
      },
      {
        question: "Kiedy otrzymam dane hotelu?",
        answer:
          "Dane hotelu oraz informacje dotyczące zameldowania przekazujemy przed wyjazdem, gdy rezerwacja noclegu jest już potwierdzona.",
      },
    ],
  },

  {
    id: "dokumenty",
    title: "Dokumenty i podróż",
    description: "Dokumenty, formalności i rzeczy, które warto sprawdzić przed wyjazdem.",
    items: [
      {
        question: "Czy potrzebuję dowodu osobistego czy paszportu?",
        answer:
          "To zależy od kraju, do którego jedziesz, oraz Twojego obywatelstwa. Przed podróżą sprawdź aktualne wymagania wjazdowe i upewnij się, że Twój dokument jest ważny.",
        popular: true,
      },
      {
        question: "Kto odpowiada za ważność dokumentów?",
        answer:
          "Każdy uczestnik powinien przed wyjazdem sprawdzić ważność swoich dokumentów i wymagania dotyczące wjazdu do danego kraju.",
      },
      {
        question: "Czy osoba niepełnoletnia może uczestniczyć w wyjeździe?",
        answer:
          "Takie wyjazdy są możliwe, ale potrzebne dokumenty i zgody zależą od wieku uczestnika, opiekuna, kierunku oraz przewoźnika. Najlepiej skontaktować się z nami przed rezerwacją.",
      },
      {
        question: "Czy przy podróży zagranicznej mogą być potrzebne dodatkowe dokumenty?",
        answer:
          "Tak. W zależności od kraju mogą obowiązywać dodatkowe wymagania. Przed wyjazdem warto sprawdzić aktualne informacje na oficjalnych stronach rządowych.",
      },
      {
        question: "Czy dane na bilecie muszą zgadzać się z dokumentem?",
        answer:
          "Jeżeli bilet lub rezerwacja wymaga danych uczestnika, powinny być one podane poprawnie. Jeżeli zauważysz błąd, skontaktuj się z nami od razu.",
      },
    ],
  },

  {
    id: "zmiany",
    title: "Zmiany terminu meczu",
    description: "Co warto wiedzieć o godzinie i dacie spotkania.",
    items: [
      {
        question: "Czy godzina meczu może się zmienić?",
        answer:
          "Tak. Godzina spotkania może zostać zmieniona przez ligę, klub lub nadawcę telewizyjnego. Dlatego przy planowaniu wyjazdu warto zachować trochę elastyczności.",
        popular: true,
      },
      {
        question: "Czy data meczu może zostać zmieniona?",
        answer:
          "Tak. Zdarza się, że spotkanie zostaje przesunięte na inny dzień, szczególnie gdy początkowo podany termin nie był jeszcze ostatecznie potwierdzony.",
      },
      {
        question: "Skąd wiadomo, że termin meczu jest już potwierdzony?",
        answer:
          "Zależy to od ligi i rozgrywek. Przy konkretnym wyjeździe opieramy się na oficjalnych informacjach publikowanych przez organizatora rozgrywek i klub.",
      },
      {
        question: "Co się dzieje, jeśli termin meczu zmieni się po rezerwacji?",
        answer:
          "Sprawdzamy, jak zmiana wpływa na lot, hotel i pozostałe elementy wyjazdu. Następnie kontaktujemy się z uczestnikami i przedstawiamy dostępne rozwiązania dla konkretnej rezerwacji.",
      },
      {
        question: "Czy mogę samodzielnie dokupić dodatkowy transport?",
        answer:
          "Tak, ale jeżeli robisz to przed ostatecznym potwierdzeniem godziny meczu, warto wybierać elastyczne rezerwacje. Terminarz spotkania może jeszcze ulec zmianie.",
      },
    ],
  },

  {
    id: "anulowanie",
    title: "Rezygnacja i zmiany rezerwacji",
    description: "Co zrobić, jeżeli po rezerwacji zmienią się Twoje plany.",
    items: [
      {
        question: "Czy mogę zrezygnować z wyjazdu?",
        answer:
          "Tak, ale warunki i ewentualne koszty zależą od etapu realizacji oraz zasad określonych w umowie. Jeżeli musisz zrezygnować, skontaktuj się z nami jak najwcześniej.",
      },
      {
        question: "Czy mogę zmienić uczestnika wyjazdu?",
        answer:
          "Czasami jest to możliwe. Wszystko zależy od tego, czy bilety, loty i nocleg zostały już wystawione na konkretną osobę. Im wcześniej zgłosisz zmianę, tym większa szansa na jej wprowadzenie.",
      },
      {
        question: "Co zrobić, jeśli podałem błędne dane?",
        answer:
          "Napisz lub zadzwoń do nas od razu. Sprawdzimy, czy dane można jeszcze poprawić i czy zmiana wiąże się z dodatkowymi kosztami.",
      },
      {
        question: "Czy mogę odstąpić od umowy?",
        answer:
          "Zasady odstąpienia i rezygnacji zależą od rodzaju rezerwacji oraz warunków zawartej umowy. Dokładne informacje znajdziesz w dokumentach otrzymanych przy rezerwacji.",
      },
      {
        question: "Co się stanie, jeśli coś zmieni się po stronie organizatora?",
        answer:
          "Jeżeli zmiana wpływa na Twój wyjazd, poinformujemy Cię o niej i przedstawimy dalsze możliwości zgodnie z warunkami Twojej rezerwacji.",
      },
    ],
  },

  {
    id: "wyjazd",
    title: "Podczas wyjazdu",
    description: "Praktyczne informacje przydatne przed podróżą i w dniu meczu.",
    items: [
      {
        question: "Co zabrać ze sobą na wyjazd?",
        answer:
          "Przede wszystkim ważny dokument, telefon, dostęp do biletów i informacje organizacyjne. Warto też sprawdzić pogodę oraz regulamin stadionu dotyczący przedmiotów, które można wnieść na trybuny.",
      },
      {
        question: "Ile wcześniej powinienem być na miejscu zbiórki?",
        answer:
          "Przyjedź na godzinę podaną w informacjach organizacyjnych. Przy lotach i przejazdach grupowych punktualność jest bardzo ważna.",
      },
      {
        question: "Czy można zabrać jedzenie i napoje?",
        answer:
          "Podczas podróży obowiązują zasady danego przewoźnika, a na stadionie regulamin obiektu. To, co możesz zabrać do samolotu lub autokaru, nie zawsze można wnieść na stadion.",
      },
      {
        question: "Jak będziemy się kontaktować podczas wyjazdu?",
        answer:
          "Przed podróżą otrzymasz informację, z jakiego kanału kontaktu korzystamy podczas wyjazdu. W razie ważnych zmian lub informacji będziemy przekazywać je właśnie tam.",
      },
      {
        question: "Co zrobić, jeśli spóźnię się na zbiórkę?",
        answer:
          "Skontaktuj się z nami natychmiast. Sprawdzimy, jakie są możliwości, ale przy locie lub zorganizowanym transporcie nie zawsze będzie można czekać na spóźnioną osobę.",
      },
      {
        question: "Jak wygląda powrót po meczu?",
        answer:
          "Przed meczem otrzymasz informacje dotyczące miejsca i godziny zbiórki po spotkaniu. Jeżeli coś się zmieni, przekażemy aktualne instrukcje.",
      },
    ],
  },
]

export const popularFaqs = faqCategories
  .flatMap((category) => category.items)
  .filter((item) => item.popular)