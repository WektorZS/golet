import type { Locale } from "@/lib/i18n"

export const seoCopy = {
  home: {
    pl: {
      title: "Wyjazdy na mecze piłkarskie ze zwiedzaniem",
      description:
        "Organizujemy wyjazdy na mecze w Europie: bilet, lot, hotel, zwiedzanie, transfery i opieka koordynatora. Wybierz gotowy pakiet lub poproś o własną ofertę.",
    },
    en: {
      title: "Football Match Trips with Sightseeing",
      description:
        "We organise football match trips across Europe with tickets, flights, hotels, sightseeing, transfers and coordinator support. Choose a package or request a custom trip.",
    },
  },

  trips: {
    pl: {
      title: "Wyjazdy na mecze - aktualne terminy i ceny",
      description:
        "Zobacz najbliższe wyjazdy na mecze piłkarskie. Porównaj terminy, ceny i pakiety oraz wybierz spotkanie, które pasuje do Twoich planów.",
    },
    en: {
      title: "Football Match Trips - Dates and Prices",
      description:
        "Browse upcoming football match trips across Europe. Compare dates, prices and packages, then choose the fixture that best fits your plans.",
    },
  },

  gallery: {
    pl: {
      title: "Galeria wyjazdów na mecze piłkarskie",
      description:
        "Zobacz zdjęcia ze stadionów, miast i wspólnych wyjazdów Let’s Gol. Poczuj atmosferę naszych piłkarskich podróży.",
    },
    en: {
      title: "Football Match Trip Gallery",
      description:
        "See photos from Let’s Gol trips, stadiums and cities, and get a feel for the atmosphere of our football journeys.",
    },
  },

  about: {
    pl: {
      title: "Poznaj Let’s Gol - wyjazdy od kibiców dla kibiców",
      description:
        "Poznaj ludzi stojących za Let’s Gol i historię marki, która łączy piłkarskie emocje, podróże i kompleksową organizację wyjazdów.",
    },
    en: {
      title: "Meet Let’s Gol - Trips by Fans, for Fans",
      description:
        "Meet the people behind Let’s Gol and discover the story of a brand built around football, travel and fully organised match trips.",
    },
  },

  faq: {
    pl: {
      title: "Najczęstsze pytania - FAQ",
      description:
        "Jak wygląda rezerwacja, kiedy otrzymasz bilet i co w przypadku zmiany terminu meczu? Zebraliśmy odpowiedzi na najczęstsze pytania.",
    },
    en: {
      title: "Frequently Asked Questions - Let’s Gol",
      description:
        "How does booking work, when will you receive your ticket, and what happens if the match date changes? Find answers to our most common questions.",
    },
  },

  contact: {
    pl: {
      title: "Skontaktuj się z nami",
      description:
        "Masz wybrany mecz lub potrzebujesz pomocy z ofertą? Skontaktuj się z Let’s Gol przez formularz, telefon, e-mail lub WhatsApp.",
    },
    en: {
      title: "Contact Us",
      description:
        "Already have a match in mind or need help choosing a trip? Contact Let’s Gol by phone, email, WhatsApp or through our online enquiry form.",
    },
  },

  privacy: {
    pl: {
      title: "Polityka prywatności i pliki cookies",
      description:
        "Sprawdź, jak Let’s Gol przetwarza dane osobowe, chroni prywatność użytkowników oraz wykorzystuje niezbędne i opcjonalne pliki cookies.",
    },
    en: {
      title: "Privacy Policy and Cookies",
      description:
        "Learn how Let’s Gol processes personal data, protects your privacy and uses essential and optional cookies across the website.",
    },
  },

  terms: {
    pl: {
      title: "Warunki uczestnictwa w wyjazdach na mecze",
      description:
        "Poznaj zasady rezerwacji, płatności i udziału w wyjazdach na mecze organizowanych przez Let’s Gol, w tym warunki biletów, transportu i noclegów.",
    },
    en: {
      title: "Terms and Conditions for Football Match Trips",
      description:
        "Read the booking, payment and participation terms for Let’s Gol trips, including match tickets, transport, accommodation and traveller responsibilities.",
    },
  },
} as const

export type SeoPage =
  keyof typeof seoCopy

export function getSeoCopy(
  page: SeoPage,
  locale: Locale
) {
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
  const custom =
    customDescription?.trim()

  if (custom) {
    return custom
  }

  const formattedPrice =
    new Intl.NumberFormat(
      locale === "en"
        ? "en-GB"
        : "pl-PL"
    ).format(price)

  if (locale === "en") {
    return `Football trip to ${title} with Let’s Gol. Explore available options with match tickets, flights, hotel and coordinator support. Prices from PLN ${formattedPrice} per person.`
  }

  return `Wyjazd na mecz ${title} z Let’s Gol. Sprawdź dostępne warianty z biletem, lotem, hotelem i opieką koordynatora. Cena od ${formattedPrice} zł za osobę.`
}