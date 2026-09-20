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
    description:
      "Najważniejsze informacje o rezerwacji wyjazdu, płatnościach i organizacji podróży.",
    items: [
      {
        question: "Jak wygląda rezerwacja wyjazdu?",
        answer:
          "Wybierasz wyjazd lub wskazujesz mecz, na który chcesz pojechać. Ustalamy szczegóły, przedstawiamy ofertę, a następnie otrzymujesz umowę oraz informacje dotyczące płatności.\n\nPo potwierdzeniu rezerwacji zajmujemy się organizacją Twojego wyjazdu.",
      },
      {
        question: "Czy trzeba zapłacić całą kwotę od razu?",
        answer:
          "Nie zawsze. Przy naszych wyjazdach zazwyczaj obowiązuje zaliczka, a pozostała część ceny płatna jest w terminie wskazanym w umowie.\n\nDokładny harmonogram płatności otrzymujesz przed zawarciem umowy.",
      },
      {
        question: "Czy mogę pojechać sam/sama?",
        answer:
          "Oczywiście. Na nasze wyjazdy regularnie zapisują się osoby podróżujące samodzielnie. W takim przypadku ustalamy dostępne opcje zakwaterowania i ewentualną dopłatę do pokoju jednoosobowego.",
      },
    ],
  },
  {
    id: "pakiet",
    title: "Pakiet i organizacja wyjazdu",
    description:
      "Co może obejmować wyjazd z Let’s Gol i jak wygląda opieka podczas podróży.",
    items: [
      {
        question: "Co zawiera wyjazd z Let’s Gol?",
        answer:
          "Zakres zależy od konkretnej oferty. Pełny pakiet może obejmować przelot, zakwaterowanie, bilet na mecz, ubezpieczenie, transport lokalny, plan podróży, wspólne zwiedzanie oraz opiekę koordynatora. Dokładny zakres zawsze znajdziesz w ofercie i umowie.",
        popular: true,
      },
      {
        question: "Czy podczas wyjazdu jest z nami koordynator?",
        answer:
          "Opieka podczas wyjazdu może mieć charakter opieki na miejscu lub opieki zdalnej Organizatora – zależy to od wykupionego pakietu.\n\nW przypadku opieki na miejscu koordynator pomaga w organizacji pobytu, przemieszczaniu się po mieście, realizacji programu oraz w sprawach związanych z meczem. Przy opiece zdalnej pozostajemy w kontakcie z uczestnikami i zapewniamy wsparcie organizacyjne na odległość.",
        popular: true,
      },
      {
        question: "Czy muszę uczestniczyć we wspólnym zwiedzaniu?",
        answer:
          "Nie. Chcemy, żeby wyjazd był również czasem dla Ciebie. Wspólne zwiedzanie jest propozycją dla grupy, ale możesz wykorzystać czas wolny według własnego pomysłu, o ile nie koliduje to z realizacją kluczowych punktów programu.",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport i bagaż",
    description:
      "Informacje o lotniskach wylotu, bagażu i organizacji transportu.",
    items: [
      {
        question: "Jaki bagaż jest w cenie wyjazdu?",
        answer:
          "W cenie wyjazdu standardowo uwzględniony jest podstawowy bagaż podręczny o wymiarach do 40 × 30 × 20 cm, umieszczany pod siedzeniem przed pasażerem.\n\nJeżeli potrzebujesz większego bagażu podręcznego lub bagażu rejestrowanego, istnieje możliwość jego dokupienia za dodatkową opłatą.\n\nDokładny limit bagażu każdorazowo potwierdzamy przed wyjazdem zgodnie z warunkami przewoźnika.",
        popular: true,
      },
      {
        question: "Z jakich lotnisk organizujecie wyloty?",
        answer:
          "Dobieramy lotnisko do konkretnego wyjazdu i dostępności połączeń. Korzystamy m.in. z Warszawy, Krakowa, Wrocławia, Gdańska, Katowic czy Berlina. Przy indywidualnej wycenie możemy sprawdzić również inne lotnisko.",
        popular: true,
      },
    ],
  },
  {
    id: "bilety",
    title: "Bilety i mecze",
    description:
      "Najważniejsze informacje o biletach, miejscach na stadionie i zmianach terminów spotkań.",
    items: [
      {
        question: "Czy będziemy siedzieć razem na stadionie?",
        answer:
          "Staramy się zapewniać miejsca obok siebie lub możliwie blisko siebie. Ostateczny układ miejsc zależy jednak od dostępności i zasad dystrybucji biletów na konkretne wydarzenie. Jeśli określony układ miejsc jest gwarantowany, zaznaczamy to w ofercie.",
      },
      {
        question: "Czy można wybrać lepsze miejsca na stadionie?",
        answer:
          "W przypadku wielu meczów możemy zaproponować kilka kategorii biletów, w tym miejsca o podwyższonym standardzie lub PREMIUM. Dostępność i ewentualną dopłatę ustalamy indywidualnie.",
      },
      {
        question: "Co się stanie, jeśli termin meczu zostanie zmieniony?",
        answer:
          "Terminy spotkań ustalane są przez ligi, kluby i organizatorów rozgrywek i mogą ulec zmianie. Jeżeli tak się stanie, informujemy uczestników i podejmujemy działania, aby odpowiednio dostosować organizację wyjazdu.\n\nJeżeli zmiana istotnie wpływa na warunki imprezy, dalsze postępowanie odbywa się zgodnie z umową i obowiązującymi przepisami.",
        popular: true,
      },
      {
        question: "Kiedy otrzymam bilet na mecz?",
        answer:
          "Termin i sposób przekazania zależą od zasad konkretnego klubu. Bilet może zostać przesłany w PDF, udostępniony w oficjalnej aplikacji klubu albo przekazany w innej wymaganej formie. Wszystkie niezbędne instrukcje otrzymasz przed meczem.",
      },
    ],
  },
  {
    id: "indywidualne",
    title: "Wyjazdy indywidualne i grupowe",
    description:
      "Wyjazdy na mecze spoza kalendarza oraz oferty przygotowywane dla grup, firm, szkół i klubów.",
    items: [
      {
        question:
          "Czy organizujecie wyjazdy na mecze, których nie ma w kalendarzu?",
        answer:
          "Tak. W ramach „Twój Wyjazd” możesz wskazać interesujący Cię mecz, klub, termin oraz preferowane lotnisko. Przygotujemy indywidualną propozycję zgodnie z dostępnością.\n\nMożesz wybrać zakres: bilet / bilet + lot / bilet + lot + hotel. W tej formule możemy również zapewnić zdalne wsparcie Organizatora.",
        popular: true,
      },
      {
        question:
          "Czy organizujecie wyjazdy dla firm, szkół, klubów i większych grup?",
        answer:
          "Tak. Przygotowujemy indywidualne wyjazdy dla firm, szkół, akademii i klubów sportowych oraz grup prywatnych.\n\nZakres wyjazdu, transport, zakwaterowanie, bilety i program ustalamy indywidualnie, dopasowując ofertę do liczby uczestników i potrzeb grupy.",
      },
      {
        question:
          "Czy Let’s Gol jest legalnym organizatorem turystyki i czy wyjazdy są ubezpieczone?",
        answer:
          "Tak. Let’s Gol działa jako organizator turystyki i posiada wymagany wpis do rejestru oraz zabezpieczenie finansowe na wypadek niewypłacalności.\n\nNumer ewidencyjny organizatora: 42848.\n\nW przypadku wyjazdów, których pakiet obejmuje ubezpieczenie turystyczne, jego zakres określony jest w dokumentach dotyczących konkretnego wyjazdu.",
      },
    ],
  },
]

export const popularFaqs = faqCategories
  .flatMap((category) => category.items)
  .filter((item) => item.popular)