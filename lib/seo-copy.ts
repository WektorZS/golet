import type { Locale } from "@/lib/i18n"

export const seoCopy = {
  home: {
    pl: {
      title: "Let’s Gol | Wyjazdy na mecze piłkarskie",
      description:
        "Wyjazdy na mecze piłkarskie w Europie z biletem, lotem, hotelem i opieką koordynatora. Wybierz gotowy pakiet lub poproś o indywidualną ofertę.",
    },
    en: {
      title: "Let’s Gol | Football Match Trips Across Europe",
      description:
        "Travel to Europe’s biggest football matches with tickets, flights, hotels and coordinator support included. Choose a package or request a custom trip.",
    },
  },
  trips: {
    pl: {
      title: "Wyjazdy na mecze piłkarskie w Europie",
      description:
        "Sprawdź aktualne wyjazdy na mecze piłkarskie w Europie. Porównaj terminy, ceny i pakiety obejmujące bilet, lot, hotel oraz opiekę koordynatora.",
    },
    en: {
      title: "Football Match Trips Across Europe",
      description:
        "Explore current football match trips across Europe. Compare dates, prices and packages that include match tickets, flights, hotels and coordinator support.",
    },
  },
  gallery: {
    pl: {
      title: "Galeria wyjazdów na mecze piłkarskie",
      description:
        "Zobacz zdjęcia z wyjazdów na mecze piłkarskie organizowanych przez Let’s Gol. Stadiony, miasta, kibice i emocje z największych spotkań w Europie.",
    },
    en: {
      title: "Football Match Trip Gallery",
      description:
        "See photos from Let’s Gol football match trips across Europe, including iconic stadiums, city breaks, travelling supporters and unforgettable match days.",
    },
  },
  about: {
    pl: {
      title: "O nas i organizacji wyjazdów na mecze",
      description:
        "Poznaj Let’s Gol, organizatora wyjazdów na mecze piłkarskie w Europie. Dowiedz się, jak Łukasz i Mateusz łączą podróże, futbol i opiekę nad kibicami.",
    },
    en: {
      title: "About Our Football Match Trips",
      description:
        "Meet the people behind Let’s Gol and learn how we combine football, travel planning and personal support to organise memorable match trips across Europe.",
    },
  },
  faq: {
    pl: {
      title: "FAQ o wyjazdach na mecze piłkarskie",
      description:
        "Znajdź odpowiedzi na pytania o wyjazdy na mecze piłkarskie, bilety, loty, hotele, płatności, ubezpieczenie, dokumenty i organizację podróży.",
    },
    en: {
      title: "Football Match Trip FAQ",
      description:
        "Find answers about football match trips, tickets, flights, hotels, payments, travel documents, insurance and how Let’s Gol organises each journey.",
    },
  },
  contact: {
    pl: {
      title: "Kontakt i wycena wyjazdu na mecz",
      description:
        "Skontaktuj się z Let’s Gol w sprawie wyjazdu na mecz piłkarski, dostępnych terminów, rezerwacji, oferty dla grupy lub wyceny indywidualnego pakietu.",
    },
    en: {
      title: "Contact Us About a Football Match Trip",
      description:
        "Contact Let’s Gol about a football match trip, available dates, booking, a group offer, partnership or a custom package built around your chosen game.",
    },
  },
  privacy: {
    pl: {
      title: "Polityka prywatności i plików cookies",
      description:
        "Sprawdź, jak Let’s Gol przetwarza dane osobowe, chroni prywatność użytkowników oraz wykorzystuje niezbędne i opcjonalne pliki cookies na stronie.",
    },
    en: {
      title: "Privacy and Cookie Policy",
      description:
        "Learn how Let’s Gol processes personal data, protects visitor privacy and uses essential and optional cookies across the website and booking process.",
    },
  },
  terms: {
    pl: {
      title: "Warunki uczestnictwa w wyjazdach na mecze",
      description:
        "Poznaj zasady rezerwacji, płatności i udziału w wyjazdach na mecze organizowanych przez Let’s Gol, w tym warunki biletów, transportu i noclegów.",
    },
    en: {
      title: "Football Trip Terms and Conditions",
      description:
        "Read the booking, payment and participation terms for Let’s Gol football match trips, including tickets, transport, accommodation and traveller duties.",
    },
  },
} as const

export type SeoPage = keyof typeof seoCopy

export function getSeoCopy(page: SeoPage, locale: Locale) {
  return seoCopy[page][locale]
}

export function buildTripSeoDescription({
  title,
  price,
  locale,
  customDescription,
}: {
  title: string
  price: number
  locale: Locale
  customDescription?: string
}) {
  const custom = customDescription?.trim()

  if (custom && custom.length >= 140) return custom

  const formattedPrice = new Intl.NumberFormat(locale === "en" ? "en-GB" : "pl-PL").format(price)

  if (locale === "en") {
    return `Explore the football trip to ${title}. Packages with tickets, flights, hotel and coordinator support. Prices from PLN ${formattedPrice} per person.`
  }

  return `Zobacz ofertę wyjazdu na mecz ${title}. Pakiety z biletem, lotem, hotelem i opieką koordynatora. Cena od ${formattedPrice} zł za osobę.`
}
