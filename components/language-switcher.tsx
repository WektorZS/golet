"use client"

import { usePathname, useRouter } from "next/navigation"

import { setLocalePreference } from "@/app/actions/locale"
import { getDictionary } from "@/lib/dictionaries"
import { localeFromPathname, localizedPath, type Locale } from "@/lib/i18n"

function LanguageFlag({ locale }: { locale: Locale }) {
  if (locale === "pl") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 20" className="h-3.5 w-[22px] shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/15">
        <path fill="#fff" d="M0 0h32v10H0z" />
        <path fill="#dc143c" d="M0 10h32v10H0z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 60 36" className="h-3.5 w-[22px] shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/15">
      <path fill="#012169" d="M0 0h60v36H0z" />
      <path stroke="#fff" strokeWidth="8" d="m0 0 60 36M60 0 0 36" />
      <path stroke="#c8102e" strokeWidth="4" d="m0 0 60 36M60 0 0 36" />
      <path stroke="#fff" strokeWidth="12" d="M30 0v36M0 18h60" />
      <path stroke="#c8102e" strokeWidth="7" d="M30 0v36M0 18h60" />
    </svg>
  )
}

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

  const languages = ["pl", "en"] as const

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-current/20 bg-black/10 p-1"
      role="group"
      aria-label={dictionary.language.label}
    >
      {languages.map((value) => (
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
          <LanguageFlag locale={value} />
          <span>{value.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}
