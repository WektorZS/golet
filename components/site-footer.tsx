
"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

import { setLocalePreference } from "@/app/actions/locale"
import { getDictionary } from "@/lib/dictionaries"
import {
  localeFromPathname,
  localizedPath,
  type Locale,
} from "@/lib/i18n"

function LanguageFlag({ locale }: { locale: Locale }) {
  if (locale === "pl") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 20"
        className="h-3.5 w-5.5 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/15"
      >
        <path fill="#fff" d="M0 0h32v10H0z" />
        <path fill="#dc143c" d="M0 10h32v10H0z" />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 36"
      className="h-3.5 w-5.5 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/15"
    >
      <path fill="#012169" d="M0 0h60v36H0z" />
      <path
        stroke="#fff"
        strokeWidth="8"
        d="m0 0 60 36M60 0 0 36"
      />
      <path
        stroke="#c8102e"
        strokeWidth="4"
        d="m0 0 60 36M60 0 0 36"
      />
      <path
        stroke="#fff"
        strokeWidth="12"
        d="M30 0v36M0 18h60"
      />
      <path
        stroke="#c8102e"
        strokeWidth="7"
        d="M30 0v36M0 18h60"
      />
    </svg>
  )
}

export function LanguageSwitcher({
  compact = false,
}: {
  compact?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null)

  const locale = localeFromPathname(pathname)
  const dictionary = getDictionary(locale)

  const languages = ["pl", "en"] as const

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale || isPending) return

    setPendingLocale(nextLocale)

    startTransition(async () => {
      await setLocalePreference(nextLocale)

      const destination = localizedPath(pathname, nextLocale)

      router.push(
        `${destination}${window.location.search}${window.location.hash}`,
      )
    })
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md bg-black/10 p-0.5"
      role="group"
      aria-label={dictionary.language.label}
    >
      {languages.map((value) => {
        const isActive = locale === value
        const isLoading = isPending && pendingLocale === value

        return (
          <button
            key={value}
            type="button"
            onClick={() => changeLocale(value)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-busy={isLoading}
            title={
              value === "pl"
                ? dictionary.language.polish
                : dictionary.language.english
            }
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-neutral-700 text-white"
                : "text-current/60 hover:bg-black/5 hover:text-current"
            } ${compact ? "w-9 px-1" : "min-w-14"}`}
          >
            {isLoading ? (
              <span
                className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current/25 border-t-current"
                aria-hidden="true"
              />
            ) : (
              <LanguageFlag locale={value} />
            )}

            <span className={compact ? "sr-only" : undefined}>
              {value === "pl" ? "PL" : "EN"}
            </span>
          </button>
        )
      })}
    </div>
  )
}

