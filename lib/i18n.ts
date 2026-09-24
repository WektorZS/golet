export const locales = ["pl", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "pl"

export const localeTags: Record<Locale, string> = {
  pl: "pl-PL",
  en: "en-GB",
}

export const openGraphLocales: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_GB",
}

const routePairs = [
  ["/", "/en"],
  ["/wyjazdy", "/en/trips"],
  ["/galeria", "/en/gallery"],
  ["/o-nas", "/en/about-us"],
  ["/faq", "/en/faq"],
  ["/kontakt", "/en/contact"],
  ["/polityka-prywatnosci", "/en/privacy-policy"],
  ["/warunki-uczestnictwa", "/en/terms-and-conditions"],
] as const

const polishToEnglish = new Map<string, string>(
  routePairs
)

const englishToPolish = new Map<string, string>(
  routePairs.map(([pl, en]) => [en, pl])
)

export function isLocale(
  value: string | null | undefined
): value is Locale {
  return locales.includes(value as Locale)
}

export function localeFromPathname(
  pathname: string
): Locale {
  return pathname === "/en" ||
    pathname.startsWith("/en/")
    ? "en"
    : "pl"
}

export function localizedPath(
  pathname: string,
  targetLocale: Locale
) {
  const [pathWithoutHash, hash = ""] =
    pathname.split("#", 2)

  const suffix = hash
    ? `#${hash}`
    : ""

  if (targetLocale === "en") {
    if (
      pathWithoutHash.startsWith(
        "/wyjazdy/"
      )
    ) {
      return `/en/trips/${pathWithoutHash.slice(
        "/wyjazdy/".length
      )}${suffix}`
    }

    if (
      pathWithoutHash === "/en" ||
      pathWithoutHash.startsWith("/en/")
    ) {
      return `${pathWithoutHash}${suffix}`
    }

    return `${
      polishToEnglish.get(
        pathWithoutHash
      ) || "/en"
    }${suffix}`
  }

  if (
    pathWithoutHash.startsWith(
      "/en/trips/"
    )
  ) {
    return `/wyjazdy/${pathWithoutHash.slice(
      "/en/trips/".length
    )}${suffix}`
  }

  if (
    pathWithoutHash === "/" ||
    pathWithoutHash.startsWith(
      "/wyjazdy/"
    )
  ) {
    return `${pathWithoutHash}${suffix}`
  }

  return `${
    englishToPolish.get(
      pathWithoutHash
    ) || "/"
  }${suffix}`
}

export function routeFor(
  locale: Locale,
  polishPath: string
) {
  return locale === "en"
    ? localizedPath(polishPath, "en")
    : polishPath
}

export function formatDate(
  value: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(
    localeTags[locale],
    options
  ).format(
    value instanceof Date
      ? value
      : new Date(`${value}T12:00:00`)
  )
}

export function formatPrice(
  value: number,
  locale: Locale
) {
  return new Intl.NumberFormat(
    localeTags[locale]
  ).format(value)
}

export function pluralizeDuration(
  days: number,
  nights: number,
  locale: Locale
) {
  if (locale === "en") {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } / ${nights} ${
      nights === 1
        ? "night"
        : "nights"
    }`
  }

  const dayLabel =
    days === 1
      ? "dzień"
      : "dni"

  const nightLabel =
    nights === 1
      ? "noc"
      : nights > 1 && nights < 5
        ? "noce"
        : "nocy"

  return `${days} ${dayLabel} / ${nights} ${nightLabel}`
}