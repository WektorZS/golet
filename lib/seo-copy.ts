import type { Locale } from "@/lib/i18n"

export const seoCopy = {
  home: {
    pl: {
      title: "Wyjazdy na mecze piłkarskie w Europie",
      description:
        "Wyjazdy na mecze piłkarskie w Europie z biletem, lotem, hotelem i opieką koordynatora. Wybierz gotowy pakiet lub poproś o indywidualną ofertę.",
    },
    en: {
      title: "Football Match Trips Across Europe",
      description:
        "Travel to football matches across Europe with match tickets, flights, hotels and coordinator support. Choose a ready-made package or request a custom trip.",
    },
  },

  trips: {
    pl: {
      title: "Aktualne wyjazdy na mecze piłkarskie",
      description:
        "Sprawdź aktualne wyjazdy na mecze piłkarskie w Europie. Porównaj terminy, ceny i warianty z biletem, lotem, hotelem oraz opieką koordynatora.",
    },
    en: {
      title: "Current Football Match Trips",
      description:
        "Explore current football match trips across Europe. Compare dates, prices and options with match tickets, flights, hotels and coordinator support.",
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
        "See photos from Let’s Gol football trips across Europe. Discover stadiums, cities, supporters and unforgettable match-day moments.",
    },
  },

  about: {
    pl: {
      title: "O nas – wyjazdy na mecze",
      description:
        "Poznaj Let’s Gol i ludzi stojących za naszymi wyjazdami na mecze. Zobacz, jak Łukasz i Mateusz łączą futbol, podróże i organizację wyjazdów.",
    },
    en: {
      title: "About Let’s Gol",
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
        "Skontaktuj się z Let’s Gol w sprawie wyjazdu na mecz, dostępnych terminów, rezerwacji, oferty dla grupy lub indywidualnej wyceny wyjazdu.",
    },
    en: {
      title: "Contact Let’s Gol",
      description:
        "Contact Let’s Gol about football match trips, available dates, bookings, group travel or a custom package built around your chosen match.",
    },
  },

  privacy: {
    pl: {
      title: "Polityka prywatności i pliki cookies",
      description:
        "Sprawdź, jak Let’s Gol przetwarza dane osobowe, chroni prywatność użytkowników oraz wykorzystuje niezbędne i opcjonalne pliki cookies.",
    },
    en: {
      title: "Privacy and Cookie Policy",
      description:
        "Learn how Let’s Gol processes personal data, protects visitor privacy and uses essential and optional cookies across the website.",
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
        "Read the booking, payment and participation terms for Let’s Gol football trips, including tickets, transport, accommodation and traveller responsibilities.",
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
    return `Football trip to ${title} with Let’s Gol. Explore options with match tickets, flights, hotel and coordinator support. Prices from PLN ${formattedPrice} per person.`
  }

  return `Wyjazd na mecz ${title} z Let’s Gol. Sprawdź dostępne warianty z biletem, lotem, hotelem i opieką koordynatora. Cena od ${formattedPrice} zł za osobę.`
}