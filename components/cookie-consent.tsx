
"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Check, Cookie, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

const COOKIE_NAME = "letsgol_analytics_consent"
const COOKIE_MAX_AGE = 31536000

type Consent = "accepted" | "rejected" | null

function readConsent(): Consent {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1]

  return value === "accepted" || value === "rejected"
    ? value
    : null
}

function saveConsent(value: Exclude<Consent, null>) {
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [floatingButtonReady, setFloatingButtonReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const headerHeight = 80
      const viewportHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const passedHeader = scrollY > headerHeight

      const nearBottom =
        scrollY + viewportHeight >= documentHeight - 350

      setShowFloatingButton(passedHeader && !nearBottom)
    }

    updateVisibility()

    const frame = requestAnimationFrame(() => {
      setFloatingButtonReady(true)
    })

    window.addEventListener("scroll", updateVisibility, {
      passive: true,
    })

    window.addEventListener("resize", updateVisibility, {
      passive: true,
    })

    return () => {
      cancelAnimationFrame(frame)

      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    if (!consent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [ready, consent])

  useEffect(() => {
    if (!editing) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditing(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [editing])

  function choose(value: Exclude<Consent, null>) {
    saveConsent(value)
    setConsent(value)
    setEditing(false)
  }

  if (!ready) {
    return null
  }

  const firstVisit = consent === null

  return (
    <>
      {process.env.NODE_ENV === "production" &&
      consent === "accepted" ? (
        <Analytics />
      ) : null}

      {firstVisit ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/55 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <section className="my-auto w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground shadow-2xl">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:gap-5">
                {/* Nagłówek */}
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:size-11">
                    <Cookie
                      className="size-5 text-black sm:size-6"
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">
                    <h2
                      id="cookie-consent-title"
                      className="font-sans text-xl font-black uppercase leading-tight sm:text-2xl"
                    >
                      Witaj w Let&apos;s Gol!
                    </h2>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                      Zanim ruszymy na stadion
                    </p>
                  </div>
                </div>

                {/* Opis */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Zanim ruszysz z nami na stadion, wybierz,
                  jak chcesz, abyśmy korzystali z plików cookies.
                  Niezbędne cookies są zawsze aktywne, a analityka
                  jest opcjonalna.
                </p>

                {/* Opcje */}
                <div className="grid gap-3">
                  {/* Niezbędne */}
                  <button
                    type="button"
                    onClick={() => choose("rejected")}
                    className="group w-full rounded-xl border border-border bg-background p-3 text-left transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md sm:p-4"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-black sm:size-10">
                        <ShieldCheck
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className="font-bold">
                            Niezbędne cookies
                          </p>

                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                            NIEZBĘDNE
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Są potrzebne do prawidłowego działania
                          strony i zapewnienia jej podstawowej
                          funkcjonalności.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Analityka */}
                  <button
                    type="button"
                    onClick={() => choose("accepted")}
                    className="group w-full rounded-xl border border-border bg-background p-3 text-left transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md sm:p-4"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-black sm:size-10">
                        <Cookie
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className="font-bold">
                            Analityka
                          </p>

                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#8a6500] sm:text-xs">
                            OPCJONALNE
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Pomaga nam anonimowo analizować
                          ruch na stronie, zbierać statystyki i poprawiać
                          jej działanie.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Informacja */}
                <div className="flex items-start gap-3 border-t border-border pt-3 sm:pt-4">
                  <ShieldCheck
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Twój wybór zostanie zapisany. W każdej chwili
                    możesz go zmienić, korzystając z ikony ciasteczka
                    w lewym dolnym rogu strony.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : editing ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/45 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditing(false)
            }
          }}
        >
          <section className="my-auto w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground shadow-2xl">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:gap-5">
                {/* Nagłówek */}
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:size-11">
                    <Cookie
                      className="size-5 text-black sm:size-6"
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">
                    <h2
                      id="cookie-settings-title"
                      className="font-sans text-xl font-black uppercase leading-tight sm:text-2xl"
                    >
                      Ustawienia prywatności
                    </h2>

                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                      Zarządzaj zgodami
                    </p>
                  </div>
                </div>

                {/* Opis */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Wybierz poniżej, jak chcesz, abyśmy korzystali
                  z plików cookies. Twoja decyzja zostanie
                  zapisana i możesz ją zmienić w dowolnym momencie.
                </p>

                {/* Opcje */}
                <div className="grid gap-3">
                  {/* Niezbędne */}
                  <button
                    type="button"
                    onClick={() => choose("rejected")}
                    aria-pressed={consent === "rejected"}
                    className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 sm:p-4 ${
                      consent === "rejected"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:border-primary hover:bg-primary/10 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:size-10 ${
                          consent === "rejected"
                            ? "bg-primary text-black"
                            : "bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-black"
                        }`}
                      >
                        <ShieldCheck
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className="font-bold">
                            Niezbędne cookies
                          </p>

                          {consent === "rejected" ? (
                            <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
                              <Check className="size-4" />
                              Wybrane
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Zawsze aktywne. Są potrzebne do
                          prawidłowego działania strony.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Analityka */}
                  <button
                    type="button"
                    onClick={() => choose("accepted")}
                    aria-pressed={consent === "accepted"}
                    className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 sm:p-4 ${
                      consent === "accepted"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:border-primary hover:bg-primary/10 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:size-10 ${
                          consent === "accepted"
                            ? "bg-primary text-black"
                            : "bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-black"
                        }`}
                      >
                        <Cookie
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className="font-bold">
                            Analityka
                          </p>

                          {consent === "accepted" ? (
                            <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
                              <Check className="size-4" />
                              Wybrane
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                          Pomaga nam anonimowo analizować
                          korzystanie ze strony i poprawiać
                          jej działanie.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Zamknięcie */}
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="mx-auto pt-1 text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Zamknij bez zmian
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={() => setEditing(true)}
          aria-label="Ustawienia cookies"
          title="Ustawienia cookies"
          className={`fixed bottom-2 left-2 z-40 h-12 w-12 border border-[#f4b91e] bg-black text-black shadow-xl transition-[transform,opacity] duration-500 ease-out hover:scale-105 hover:bg-white md:bottom-3 md:left-3 ${
            floatingButtonReady && showFloatingButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-10 opacity-0"
          }`}
        >
          <Cookie className="!h-7 !w-7 text-[#f4b91e]" />
        </Button>
      )}
    </>
  )
}
