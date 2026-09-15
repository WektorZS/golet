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
    description: "Od pierwszego zapytania do potwierdzenia miejsca.",
    items: [
      {
        question: "Jak zarezerwować wyjazd?",
        answer: "Wybierz wyjazd z kalendarza i wyślij formularz albo skontaktuj się z nami, jeśli interesuje Cię inne wydarzenie. Po sprawdzeniu dostępności otrzymasz ofertę z zakresem pakietu, ceną i kolejnymi krokami.",
        popular: true,
      },
      {
        question: "Kiedy rezerwacja jest potwierdzona?",
        answer: "Rezerwacja jest potwierdzona zgodnie z warunkami wskazanymi w przekazanej ofercie i umowie. Samo wysłanie formularza nie oznacza jeszcze rezerwacji miejsca.",
        popular: true,
      },
      {
        question: "Jak wygląda płatność za wyjazd?",
        answer: "Kwoty, terminy i sposób płatności są podawane przed zawarciem umowy. Mogą różnić się zależnie od wyjazdu, ponieważ bilety, transport i noclegi mają różne zasady rezerwacji.",
      },
      {
        question: "Czy można zapłacić w ratach?",
        answer: "Możliwość płatności częściowych zależy od konkretnej oferty i terminów narzuconych przez dostawców świadczeń. Zapytaj o nią przed rezerwacją, a potwierdzimy dostępne rozwiązanie.",
      },
      {
        question: "Czy mogę zarezerwować kilka miejsc jednocześnie?",
        answer: "Tak, w formularzu możesz podać liczbę uczestników. Dostępność wszystkich miejsc potwierdzamy po sprawdzeniu wybranego meczu i wariantu pakietu.",
      },
      {
        question: "Czy mogę zarezerwować wyjazd dla innej osoby?",
        answer: "Możesz wysłać zapytanie w imieniu innych uczestników. Przed zawarciem umowy potrzebne będą poprawne dane osób podróżujących oraz ich zgoda na udział i przetwarzanie danych.",
      },
      {
        question: "Co dzieje się po wysłaniu zapytania?",
        answer: "Kontaktujemy się, aby potwierdzić potrzeby, dostępność i wariant podróży. Następnie otrzymujesz ofertę, a po jej akceptacji dokumenty oraz instrukcje dotyczące rezerwacji.",
      },
    ],
  },
  {
    id: "bilety",
    title: "Bilety na mecz",
    description: "Zakres pakietu, miejsca i sposób przekazania biletu.",
    items: [
      {
        question: "Czy bilet na mecz jest zawarty w cenie?",
        answer: "Zależy to od wybranego wariantu. Zakres każdego pakietu jest pokazany na stronie konkretnego wyjazdu i potwierdzony w ofercie oraz umowie.",
        popular: true,
      },
      {
        question: "Jak otrzymam bilet?",
        answer: "Sposób przekazania zależy od zasad klubu, organizatora wydarzenia i systemu biletowego. Może to być bilet elektroniczny, dostęp w aplikacji albo inna forma wskazana przed meczem.",
      },
      {
        question: "Kiedy otrzymam bilet?",
        answer: "Termin dystrybucji ustala organizator wydarzenia lub operator biletowy. Informację o sposobie i przewidywanym terminie przekazujemy uczestnikom przed wyjazdem.",
      },
      {
        question: "Czy miejsca na stadionie będą obok siebie?",
        answer: "Układ miejsc zależy od dostępności i warunków konkretnej oferty. Jeżeli wspólne miejsca są dla Ciebie kluczowe, zaznacz to w zapytaniu, abyśmy mogli sprawdzić możliwości przed rezerwacją.",
      },
      {
        question: "Czy mogę wybrać kategorię biletu?",
        answer: "Jeżeli dla danego meczu dostępnych jest kilka kategorii, przedstawimy możliwe warianty. Ostateczna kategoria zawsze powinna być wskazana w ofercie lub umowie.",
      },
      {
        question: "Czy organizator wydarzenia może zmienić miejsca?",
        answer: "Klub lub operator biletowy może wprowadzać zmiany zgodnie ze swoim regulaminem. Jeśli taka sytuacja wystąpi, przekazujemy uczestnikowi otrzymane informacje i dalsze instrukcje.",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport",
    description: "Wylot, zbiórka, bagaż i przebieg podróży.",
    items: [
      {
        question: "Skąd odbywa się wyjazd?",
        answer: "Lotnisko lub miejsce zbiórki zależy od konkretnego wyjazdu i wybranego wariantu. Przy ofercie indywidualnej sprawdzamy rozwiązania dogodne dla miejsca zamieszkania uczestników.",
        popular: true,
      },
      {
        question: "Kiedy poznam dokładną godzinę zbiórki lub wylotu?",
        answer: "Najważniejsze godziny podajemy w dokumentach organizacyjnych. Jeżeli przewoźnik albo organizator wydarzenia wprowadzi zmianę, aktualizację przekazujemy uczestnikom możliwie szybko.",
      },
      {
        question: "Czy wszystkie wyjazdy odbywają się samolotem?",
        answer: "Nie należy tego zakładać. Rodzaj transportu wynika z opisu konkretnego pakietu. W ofercie może znaleźć się przelot, przejazd autokarem albo wariant bez transportu.",
      },
      {
        question: "Ile bagażu mogę zabrać?",
        answer: "Limit bagażu zależy od przewoźnika i zakupionej taryfy. Dokładny zakres jest przekazywany razem z informacjami o podróży. Nie warto opierać się na ogólnych limitach z innych wyjazdów.",
      },
      {
        question: "Czy podczas podróży autokarem są postoje?",
        answer: "Plan postojów zależy od trasy, czasu przejazdu i zasad przewoźnika. Szczegóły dotyczące konkretnego przejazdu są przekazywane uczestnikom przed wyjazdem.",
      },
      {
        question: "Co w przypadku opóźnienia transportu?",
        answer: "Dalsze działania zależą od rodzaju transportu i sytuacji. Uczestnicy otrzymują bieżące informacje organizacyjne przez kanał wskazany przed wyjazdem.",
      },
      {
        question: "Czy można zmienić miejsce wylotu lub zbiórki?",
        answer: "Możliwość zmiany zależy od etapu rezerwacji i dostępności. Skontaktuj się z nami jak najwcześniej, zanim zostaną potwierdzone świadczenia transportowe.",
      },
    ],
  },
  {
    id: "noclegi",
    title: "Noclegi",
    description: "Hotel, pokoje, zakwaterowanie i organizacja pobytu.",
    items: [
      {
        question: "Czy każdy wyjazd obejmuje nocleg?",
        answer: "Nie. Nocleg jest częścią pakietu tylko wtedy, gdy wskazuje to opis wyjazdu lub wybrany wariant. Zakres świadczeń sprawdź przed rezerwacją.",
      },
      {
        question: "Jaki jest standard hotelu?",
        answer: "Standard i najważniejsze informacje o zakwaterowaniu są podawane przy konkretnej ofercie. Jeśli obiekt nie został jeszcze wskazany, zostanie potwierdzony zgodnie z warunkami rezerwacji.",
      },
      {
        question: "Czy mogę wybrać rodzaj pokoju?",
        answer: "Dostępne konfiguracje pokojów zależą od hotelu i liczby uczestników. Preferencje warto podać już w formularzu, ale ich realizację trzeba potwierdzić przed zawarciem umowy.",
      },
      {
        question: "Czy osoby jadące razem będą zakwaterowane razem?",
        answer: "Przygotowując ofertę uwzględniamy wspólną rezerwację, jednak ostateczny układ pokojów zależy od dostępności obiektu i ustaleń zaakceptowanych przez uczestników.",
      },
      {
        question: "Kiedy otrzymam dane hotelu i informacje o zameldowaniu?",
        answer: "Informacje organizacyjne dotyczące obiektu, zameldowania i wymeldowania są przekazywane przed rozpoczęciem wyjazdu, gdy rezerwacja hotelowa jest już potwierdzona.",
      },
    ],
  },
  {
    id: "dokumenty",
    title: "Dokumenty i podróż",
    description: "Co sprawdzić przed wyjazdem w Polsce i za granicą.",
    items: [
      {
        question: "Czy potrzebuję dowodu osobistego czy paszportu?",
        answer: "Wymagany dokument zależy od kraju, obywatelstwa i aktualnych przepisów. Przed podróżą sprawdź oficjalne wymagania dla kierunku oraz upewnij się, że dokument jest ważny przez wymagany okres.",
        popular: true,
      },
      {
        question: "Kto odpowiada za ważność dokumentów?",
        answer: "Każdy uczestnik odpowiada za posiadanie ważnych dokumentów i spełnienie warunków wjazdu. Informacje organizacyjne nie zastępują komunikatów właściwych urzędów.",
      },
      {
        question: "Czy osoba niepełnoletnia może uczestniczyć w wyjeździe?",
        answer: "Możliwość udziału i potrzebne zgody zależą od wieku, opiekuna, kierunku oraz zasad przewoźnika i wydarzenia. Skontaktuj się z nami przed rezerwacją, aby omówić konkretną sytuację.",
      },
      {
        question: "Czy potrzebuję dodatkowych dokumentów przy podróży zagranicznej?",
        answer: "W niektórych krajach mogą obowiązywać dodatkowe wymogi wjazdowe, ubezpieczeniowe lub dokumenty dla osób niepełnoletnich. Zawsze sprawdzaj aktualne informacje na stronach rządowych.",
      },
      {
        question: "Czy dane na bilecie muszą zgadzać się z dokumentem?",
        answer: "Wymagania zależą od przewoźnika, klubu i rodzaju biletu. Dane uczestnika należy podawać dokładnie i zgłaszać każdą pomyłkę od razu po jej zauważeniu.",
      },
    ],
  },
  {
    id: "zmiany",
    title: "Zmiany meczu",
    description: "Co warto wiedzieć o terminarzu wydarzeń sportowych.",
    items: [
      {
        question: "Czy godzina meczu może się zmienić?",
        answer: "Tak. Organizator rozgrywek, nadawca lub klub może zmienić godzinę spotkania także po opublikowaniu wstępnego terminarza. Warto zachować elastyczność przy planowaniu dodatkowych aktywności.",
        popular: true,
      },
      {
        question: "Czy data meczu może zostać przesunięta?",
        answer: "Tak. Terminy spotkań mogą ulegać zmianom z przyczyn sportowych, organizacyjnych lub transmisyjnych. Aktualizacje przekazujemy na podstawie oficjalnych komunikatów.",
      },
      {
        question: "Kiedy terminarz jest ostateczny?",
        answer: "Nie ma jednej reguły dla wszystkich lig i rozgrywek. Status terminu trzeba oceniać dla konkretnego wydarzenia na podstawie komunikatów organizatora rozgrywek.",
      },
      {
        question: "Co dzieje się z planem podróży po zmianie meczu?",
        answer: "Możliwe działania zależą od skali zmiany, zakupionych świadczeń i warunków dostawców. Informujemy uczestników o sytuacji i rozwiązaniach dostępnych dla konkretnej rezerwacji.",
      },
      {
        question: "Czy warto rezerwować dodatkowy transport samodzielnie?",
        answer: "Jeśli planujesz dodatkowe, własne połączenia, wybieraj elastyczne warunki i uwzględnij możliwość zmiany meczu. Najpierw sprawdź zakres pakietu i aktualny status terminarza.",
      },
    ],
  },
  {
    id: "anulowanie",
    title: "Anulowanie i zmiany rezerwacji",
    description: "Rezygnacja, zmiana danych i sytuacje po rezerwacji.",
    items: [
      {
        question: "Czy mogę zrezygnować z wyjazdu?",
        answer: "Zasady rezygnacji, terminy i możliwe koszty wynikają z zawartej umowy oraz warunków uczestnictwa. Skontaktuj się z nami możliwie szybko, aby otrzymać informację dotyczącą Twojej rezerwacji.",
      },
      {
        question: "Czy mogę zmienić uczestnika wyjazdu?",
        answer: "Możliwość zmiany zależy między innymi od zasad linii lotniczej, hotelu i operatora biletowego. Zgłoś potrzebę zmiany od razu, ponieważ z czasem może być trudniejsza lub wiązać się z opłatami dostawców.",
      },
      {
        question: "Co zrobić, gdy podałem błędne dane?",
        answer: "Skontaktuj się z nami natychmiast i wskaż poprawne dane. Nie zmieniaj ich samodzielnie w dokumentach. Możliwość korekty zależy od etapu realizacji i zasad dostawcy.",
      },
      {
        question: "Czy przysługuje mi odstąpienie od umowy?",
        answer: "Uprawnienia zależą od rodzaju umowy, momentu jej zawarcia i obowiązujących przepisów. Wiążące zasady znajdziesz w warunkach uczestnictwa oraz dokumentach swojej rezerwacji.",
      },
      {
        question: "Co w przypadku zmiany po stronie organizatora?",
        answer: "Sposób postępowania zależy od rodzaju i znaczenia zmiany. Uczestnik otrzymuje informację oraz dostępne rozwiązania zgodnie z umową, warunkami uczestnictwa i przepisami.",
      },
    ],
  },
  {
    id: "wyjazd",
    title: "Podczas wyjazdu",
    description: "Praktyczne informacje przed drogą i w dniu meczu.",
    items: [
      {
        question: "Co zabrać ze sobą?",
        answer: "Zabierz ważny dokument, potrzebne bilety lub dostęp do aplikacji, leki, odpowiednie ubranie i rzeczy wskazane w informacjach organizacyjnych. Sprawdź też zasady wnoszenia przedmiotów na stadion.",
      },
      {
        question: "Ile wcześniej być na miejscu zbiórki?",
        answer: "Staw się o godzinie wskazanej w informacjach organizacyjnych. Przy transporcie grupowym i odprawie lotniczej punktualność jest szczególnie ważna.",
      },
      {
        question: "Czy można zabrać jedzenie i napoje?",
        answer: "Zależy to od środka transportu, przewoźnika i regulaminu stadionu. Produkty dozwolone w podróży nie muszą być dozwolone przy wejściu na wydarzenie.",
      },
      {
        question: "Czy można spożywać alkohol w autokarze?",
        answer: "Obowiązują zasady przewoźnika, organizatora i przepisy dotyczące bezpieczeństwa. Szczegółowe reguły konkretnego przejazdu są przekazywane uczestnikom przed wyjazdem.",
      },
      {
        question: "Jak wygląda komunikacja podczas wyjazdu?",
        answer: "Kanał kontaktu i sposób przekazywania bieżących informacji są wskazywane uczestnikom przed podróżą. Warto regularnie sprawdzać wiadomości w czasie wyjazdu.",
      },
      {
        question: "Co zrobić, jeśli spóźnię się na zbiórkę?",
        answer: "Natychmiast skontaktuj się pod przekazanym numerem organizacyjnym. Dalsze możliwości zależą od czasu, trasy i decyzji przewoźnika, dlatego nie można zakładać, że transport będzie mógł czekać.",
      },
      {
        question: "Jak wygląda powrót po meczu?",
        answer: "Godzina i miejsce zbiórki po spotkaniu wynikają z planu konkretnego wyjazdu. Instrukcje są przekazywane przed meczem i należy ich przestrzegać także w razie zmian organizacyjnych.",
      },
    ],
  },
]

export const popularFaqs = faqCategories
  .flatMap((category) => category.items)
  .filter((item) => item.popular)
