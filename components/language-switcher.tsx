"use client"

import { usePathname, useRouter } from "next/navigation"

import { setLocalePreference } from "@/app/actions/locale"
import { getDictionary } from "@/lib/dictionaries"
import { localeFromPathname, localizedPath, type Locale } from "@/lib/i18n"

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = localeFromPathname(pathname)
  const dictionary = getDictionary(locale)

  const changeLocale = async (nextLocale: Locale) => {
    await setLocalePreference(nextLocale)
    const destination = localizedPath(pathname, nextLocale)
    router.push(`${destination}${window.location.search}${window.location.hash}`)
  }

  const languages = [
    { value: "pl", flag: "🇵🇱" },
    { value: "en", flag: "🇬🇧" },
  ] as const

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-current/20 bg-black/10 p-1"
      role="group"
      aria-label={dictionary.language.label}
    >
      {languages.map(({ value, flag }) => (
        <button
          key={value}
          type="button"
          onClick={() => changeLocale(value)}
          aria-pressed={locale === value}
          title={value === "pl" ? dictionary.language.polish : dictionary.language.english}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
            locale === value
              ? "bg-primary text-black"
              : "text-current/70 hover:text-current"
          } ${compact ? "min-w-12" : "min-w-14"}`}
        >
          <span aria-hidden="true" className="font-sans text-sm leading-none">{flag}</span>
          <span>{value.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}
