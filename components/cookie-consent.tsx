"use client"

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Analytics } from "@vercel/analytics/next"
import {
  Check,
  Cookie,
  ShieldCheck,
  X,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionaries"
import { localeFromPathname } from "@/lib/i18n"

const COOKIE_NAME = "letsgol_analytics_consent"
const COOKIE_MAX_AGE = 31536000
const CONSENT_EVENT = "letsgol-consent-change"

type Consent = "accepted" | "rejected" | null
type SavedConsent = Exclude<Consent, null>

function readConsent(): Consent {
  const value = document.cookie
    .split("; ")
    .find((item) =>
      item.startsWith(`${COOKIE_NAME}=`),
    )
    ?.split("=")[1]

  return value === "accepted" ||
    value === "rejected"
    ? value
    : null
}

function saveConsent(value: SavedConsent) {
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`

  window.dispatchEvent(
    new Event(CONSENT_EVENT),
  )
}

function subscribeConsent(
  onChange: () => void,
) {
  window.addEventListener(
    CONSENT_EVENT,
    onChange,
  )

  return () => {
    window.removeEventListener(
      CONSENT_EVENT,
      onChange,
    )
  }
}

function subscribeHydration() {
  return () => {}
}

export function CookieConsent() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const dictionary = getDictionary(locale)

  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    () => null,
  )

  const ready = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  )

  const [editing, setEditing] =
    useState(false)

  const [draftConsent, setDraftConsent] =
    useState<SavedConsent>("rejected")

  const [
    showFloatingButton,
    setShowFloatingButton,
  ] = useState(false)

  const [
    floatingButtonReady,
    setFloatingButtonReady,
  ] = useState(false)

  const consentDialogRef =
    useRef<HTMLDivElement>(null)

  const firstVisit = consent === null

  const languageLabel =
    locale === "en"
      ? "Choose language"
      : "Wybierz język"

  const optionalInfo =
    locale === "en"
      ? "Analytics are optional. The website works normally without them."
      : "Analityka jest opcjonalna. Strona działa normalnie również bez niej."

  const saveLabel =
    locale === "en"
      ? "Save choice"
      : "Zapisz wybór"

  useEffect(() => {
    if (
      !ready ||
      (consent !== null && !editing)
    ) {
      return
    }

    const previousFocus =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null

    const focusable = () =>
      Array.from(
        consentDialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled)',
        ) ?? [],
      ).filter(
        (element) =>
          element.getClientRects().length > 0,
      )

    const frame = requestAnimationFrame(
      () => {
        focusable()[0]?.focus()
      },
    )

    const trapFocus = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== "Tab") return

      const items = focusable()

      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !consentDialogRef.current?.contains(
            document.activeElement,
          ))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !consentDialogRef.current?.contains(
            document.activeElement,
          ))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener(
      "keydown",
      trapFocus,
    )

    return () => {
      cancelAnimationFrame(frame)

      document.removeEventListener(
        "keydown",
        trapFocus,
      )

      previousFocus?.focus()
    }
  }, [ready, consent, editing])

  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const headerHeight = 80
      const viewportHeight =
        window.innerHeight

      const documentHeight =
        document.documentElement.scrollHeight

      const passedHeader =
        scrollY > headerHeight

      const nearBottom =
        scrollY + viewportHeight >=
        documentHeight - 350

      setShowFloatingButton(
        passedHeader && !nearBottom,
      )
    }

    updateVisibility()

    const frame = requestAnimationFrame(
      () => {
        setFloatingButtonReady(true)
      },
    )

    window.addEventListener(
      "scroll",
      updateVisibility,
      {
        passive: true,
      },
    )

    window.addEventListener(
      "resize",
      updateVisibility,
      {
        passive: true,
      },
    )

    return () => {
      cancelAnimationFrame(frame)

      window.removeEventListener(
        "scroll",
        updateVisibility,
      )

      window.removeEventListener(
        "resize",
        updateVisibility,
      )
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    document.body.style.overflow =
      consent === null || editing
        ? "hidden"
        : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [ready, consent, editing])

  useEffect(() => {
    if (!editing) return

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setEditing(false)
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [editing])

  function choose(
    value: SavedConsent,
  ) {
    saveConsent(value)
    setEditing(false)
  }

  function openSettings() {
    setDraftConsent(
      consent === "accepted"
        ? "accepted"
        : "rejected",
    )

    setEditing(true)
  }

  function saveSettings() {
    saveConsent(draftConsent)
    setEditing(false)
  }

  if (!ready) {
    return null
  }

  return (
    <>
      {process.env.NODE_ENV ===
        "production" &&
      consent === "accepted" ? (
        <Analytics />
      ) : null}

      {firstVisit ? (
  <div
    ref={consentDialogRef}
    className="fixed inset-0 z-99999 flex items-end justify-center overflow-hidden bg-black/30 p-3 backdrop-blur-[2px] sm:items-center sm:bg-black/60 sm:p-4 sm:backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cookie-consent-title"
  >
    <section className="max-h-[78svh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/20 bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl sm:max-h-none sm:overflow-visible sm:bg-card">
      <div className="p-4 sm:p-7">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-black sm:size-11">
            <Cookie
              className="size-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h2
              id="cookie-consent-title"
              className="font-sans text-lg font-black uppercase leading-tight sm:text-2xl"
            >
              {dictionary.cookies.welcome}
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {dictionary.cookies.settingsTitle}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-muted/60 p-2.5 sm:mt-6 sm:p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
            {languageLabel}
          </p>

          <LanguageSwitcher />
        </div>

        <div className="mt-4 sm:mt-6">
          <p className="text-sm font-medium leading-5 text-foreground sm:text-[15px] sm:leading-6">
            {dictionary.cookies.choosePrompt}
          </p>

          <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5">
            {optionalInfo}
          </p>
        </div>

        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-36 sm:flex-col sm:items-stretch sm:p-4"
          >
            <div className="flex items-center justify-between gap-3 sm:items-start">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-black sm:size-10">
                <ShieldCheck
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <span className="hidden rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline-flex">
                {dictionary.cookies.required}
              </span>
            </div>

            <div className="min-w-0 flex-1 sm:mt-4">
              <div className="flex items-center gap-2">
                <p className="font-sans text-sm font-black sm:text-base">
                  {dictionary.cookies.necessary}
                </p>

                <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:hidden">
                  {dictionary.cookies.required}
                </span>
              </div>

              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground sm:mt-1 sm:text-xs sm:leading-5">
                {dictionary.cookies.necessaryDescription}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => choose("accepted")}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-36 sm:flex-col sm:items-stretch sm:p-4"
          >
            <div className="flex items-center justify-between gap-3 sm:items-start">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-black sm:size-10">
                <Cookie
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <span className="hidden rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#705300] sm:inline-flex">
                {dictionary.cookies.optional}
              </span>
            </div>

            <div className="min-w-0 flex-1 sm:mt-4">
              <div className="flex items-center gap-2">
                <p className="font-sans text-sm font-black sm:text-base">
                  {dictionary.cookies.analytics}
                </p>

                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#705300] sm:hidden">
                  {dictionary.cookies.optional}
                </span>
              </div>

              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground sm:mt-1 sm:text-xs sm:leading-5">
                {dictionary.cookies.analyticsDescription}
              </p>
            </div>
          </button>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-center text-[10px] leading-4 text-muted-foreground sm:mt-5 sm:pt-4 sm:text-[11px] sm:leading-5">
          {dictionary.cookies.changeAnytime}
        </p>
      </div>
    </section>
  </div>
) : editing ? (
        <div
          ref={consentDialogRef}
          className="fixed inset-0 z-99999 flex items-end justify-center overflow-y-auto bg-black/55 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setEditing(false)
            }
          }}
        >
          <section className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/10 sm:rounded-2xl">
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-black">
                    <Cookie
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2
                      id="cookie-settings-title"
                      className="font-sans text-xl font-black uppercase leading-tight sm:text-2xl"
                    >
                      {
                        dictionary.cookies
                          .privacySettings
                      }
                    </h2>

                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {
                        dictionary.cookies
                          .manage
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditing(false)
                  }
                  aria-label={
                    locale === "en"
                      ? "Close"
                      : "Zamknij"
                  }
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X
                    className="size-5"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <p className="mt-6 text-sm leading-6 text-muted-foreground">
                {
                  dictionary.cookies
                    .chooseOption
                }
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDraftConsent(
                      "rejected",
                    )
                  }
                  aria-pressed={
                    draftConsent ===
                    "rejected"
                  }
                  className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    draftConsent ===
                    "rejected"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/60"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      draftConsent ===
                      "rejected"
                        ? "bg-primary text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ShieldCheck
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-foreground">
                        {
                          dictionary.cookies
                            .necessary
                        }
                      </p>

                      {draftConsent ===
                      "rejected" ? (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#705300]">
                          <Check className="size-3.5" />

                          {
                            dictionary.cookies
                              .selected
                          }
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {
                            dictionary.cookies
                              .required
                          }
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {
                        dictionary.cookies
                          .necessaryDescription
                      }
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDraftConsent(
                      "accepted",
                    )
                  }
                  aria-pressed={
                    draftConsent ===
                    "accepted"
                  }
                  className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    draftConsent ===
                    "accepted"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/60"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      draftConsent ===
                      "accepted"
                        ? "bg-primary text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Cookie
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-foreground">
                        {
                          dictionary.cookies
                            .analytics
                        }
                      </p>

                      {draftConsent ===
                      "accepted" ? (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#705300]">
                          <Check className="size-3.5" />

                          {
                            dictionary.cookies
                              .selected
                          }
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#705300]">
                          {
                            dictionary.cookies
                              .optional
                          }
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {
                        dictionary.cookies
                          .analyticsDescription
                      }
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <Button
                  type="button"
                  className="h-11 w-full font-bold"
                  onClick={saveSettings}
                >
                  {saveLabel}
                </Button>

                <button
                  type="button"
                  onClick={() =>
                    setEditing(false)
                  }
                  className="mx-auto mt-4 block text-sm font-medium text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground"
                >
                  {
                    dictionary.cookies
                      .closeWithoutChanges
                  }
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Button
          type="button"
          size="icon-lg"
          onClick={openSettings}
          aria-label={
            dictionary.cookies
              .settingsTitle
          }
          title={
            dictionary.cookies
              .settingsTitle
          }
          className={`fixed bottom-2 left-2 z-40 size-12 rounded-xl border border-primary/60 bg-black text-primary shadow-xl transition-[transform,opacity,background-color] duration-500 ease-out hover:scale-105 hover:bg-foreground md:bottom-3 md:left-3 ${
            floatingButtonReady &&
            showFloatingButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-10 opacity-0"
          }`}
        >
          <Cookie className="size-6" />
        </Button>
      )}
    </>
  )
}