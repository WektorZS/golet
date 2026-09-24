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

import type { Locale } from "@/lib/i18n"

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

const faqCategoriesEn: FaqCategory[] = [
  {
    id: "booking",
    title: "Booking and payment",
    description: "Key information about booking, payments and preparing for your trip.",
    items: [
      { question: "How do I book a trip?", answer: "Choose a listed trip or tell us which match you would like to attend. We confirm the details and availability, send you an offer and then provide the contract and payment instructions. Once the booking is confirmed, we take care of the agreed travel arrangements." },
      { question: "Do I have to pay the full amount immediately?", answer: "Not always. Most trips require a deposit, with the remaining balance due on the date shown in your contract. You will receive the exact payment schedule before signing." },
      { question: "Can I travel on my own?", answer: "Of course. Solo travellers regularly join our trips. We will explain the available room options and any single-room supplement before booking." },
    ],
  },
  {
    id: "package",
    title: "Package and organisation",
    description: "What a Let's Gol trip can include and how we support you while travelling.",
    items: [
      { question: "What is included in a Let's Gol trip?", answer: "The exact scope depends on the offer. A full package may include flights, accommodation, a match ticket, insurance, local transport, an itinerary, sightseeing and coordinator support. The confirmed inclusions are always stated in the offer and contract.", popular: true },
      { question: "Will a coordinator travel with us?", answer: "Support may be provided in person or remotely, depending on the package. An on-site coordinator helps with the itinerary, transport and match-day arrangements. With remote support, our team remains available to help throughout the trip.", popular: true },
      { question: "Do I have to join the group sightseeing?", answer: "No. Group sightseeing is an option, and you are welcome to use your free time independently as long as it does not conflict with key parts of the itinerary." },
    ],
  },
  {
    id: "transport",
    title: "Transport and baggage",
    description: "Departure airports, baggage allowances and transport arrangements.",
    items: [
      { question: "What baggage is included?", answer: "The standard price normally includes a small cabin bag up to 40 x 30 x 20 cm, stored under the seat. Larger cabin baggage or checked baggage can usually be added for an extra charge. We confirm the final allowance before departure according to the airline's rules.", popular: true },
      { question: "Which airports do you use?", answer: "We choose the airport based on each trip and available connections. We commonly use Warsaw, Krakow, Wroclaw, Gdansk, Katowice and Berlin. For a custom quote, we can also check another departure airport.", popular: true },
    ],
  },
  {
    id: "tickets",
    title: "Tickets and matches",
    description: "Important information about tickets, stadium seating and fixture changes.",
    items: [
      { question: "Will we sit together at the stadium?", answer: "We aim to provide adjacent seats or seats as close together as possible. The final allocation depends on availability and the ticketing rules for the event. If a particular seating arrangement is guaranteed, we state it clearly in the offer." },
      { question: "Can I choose a better seat category?", answer: "For many matches, we can offer several ticket categories, including premium options. Availability and any surcharge are confirmed individually." },
      { question: "What happens if the match date changes?", answer: "Fixture dates are set by leagues, clubs and competition organisers and may change. If this happens, we inform you and adjust the arrangements where possible. Any material change is handled according to the contract and applicable law.", popular: true },
      { question: "When will I receive my match ticket?", answer: "The timing and delivery method depend on the club. Tickets may be supplied as a PDF, through the club's official app or in another required format. You will receive the relevant instructions before the match." },
    ],
  },
  {
    id: "custom",
    title: "Custom and group trips",
    description: "Matches outside our calendar and trips for private groups, companies, schools and clubs.",
    items: [
      { question: "Can you organise a trip to a match that is not listed?", answer: "Yes. Tell us the match, club, preferred dates and departure airport. We will prepare a tailored proposal, subject to availability. You can choose anything from a match ticket only to a complete ticket, flight and hotel package.", popular: true },
      { question: "Do you organise trips for companies, schools, clubs or larger groups?", answer: "Yes. We prepare tailored trips for companies, schools, academies, sports clubs and private groups. Transport, accommodation, tickets and the programme are matched to the group size and requirements." },
      { question: "Is Let's Gol a licensed tour operator and are trips insured?", answer: "Yes. Let's Gol is a registered tour operator with the required insolvency protection. Our operator register number is 42848. When travel insurance is part of a package, its cover is described in the documents for that trip." },
    ],
  },
]

export function getFaqCategories(locale: Locale = "pl") {
  return locale === "en" ? faqCategoriesEn : faqCategories
}

export function getPopularFaqs(locale: Locale = "pl") {
  return getFaqCategories(locale).flatMap((category) => category.items).filter((item) => item.popular)
}
