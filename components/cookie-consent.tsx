
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

      setShowFloatingButton(
        passedHeader && !nearBottom
      )
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

      window.removeEventListener(
        "scroll",
        updateVisibility
      )

      window.removeEventListener(
        "resize",
        updateVisibility
      )
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    const shouldLock = !consent

    if (shouldLock) {
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

  function openSettings() {
    setEditing(true)
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
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <section className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Cookie
                      className="size-6 text-black"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2
                      id="cookie-consent-title"
                      className="font-sans text-2xl font-black uppercase"
                    >
                      Witaj w Let&apos;s Gol!
                    </h2>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Zanim ruszymy na stadion
                    </p>
                  </div>
                </div>

                <p className="text-base font-semibold leading-relaxed">
                  Zanim ruszysz z nami na stadion, wybierz,
                  jak możemy korzystać z cookies.
                </p>

                <div className="rounded-lg border bg-background p-4">
                  <div className="flex gap-3">
                    <ShieldCheck
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        Twoja decyzja jest pod Twoją kontrolą
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Możesz w każdej chwili zmienić swoje
                        ustawienia cookies, korzystając z ikony
                        ciasteczka widocznej na stronie.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Niezbędne cookies są wymagane do prawidłowego
                    działania strony i zapewnienia jej podstawowej
                    funkcjonalności.
                  </p>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Jeśli wyrazisz zgodę na analitykę, będziemy
                    zbierać anonimowe informacje o tym, jak
                    użytkownicy korzystają z naszej strony.
                    Dzięki temu możemy analizować liczbę odwiedzin,
                    źródła ruchu oraz popularność poszczególnych
                    podstron.
                  </p>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Analityka pomaga nam również poprawiać
                    działanie i funkcjonalność serwisu.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => choose("rejected")}
                    className="w-full sm:w-auto"
                  >
                    Tylko niezbędne
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => choose("accepted")}
                    className="w-full sm:w-auto"
                  >
                    Akceptuję analitykę
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : editing ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditing(false)
            }
          }}
        >
          <section className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Cookie
                        className="size-6 text-black"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h2
                        id="cookie-settings-title"
                        className="font-sans text-2xl font-black uppercase"
                      >
                        Ustawienia prywatności
                      </h2>

                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Zarządzaj zgodami
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Możesz w każdej chwili zmienić swoją decyzję
                  dotyczącą analitycznych plików cookies.
                  Twój wybór zostanie zapisany na 12 miesięcy.
                </p>

                <div className="grid gap-3">
                  <div className="rounded-lg border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <div>
                        <p className="font-bold">
                          Niezbędne cookies
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Zawsze aktywne. Są potrzebne do
                          prawidłowego działania strony.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <Cookie
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold">
                            Analityka
                          </p>

                          <span className="bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                            {consent === "accepted"
                              ? "Aktywna"
                              : "Wyłączona"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Pomaga nam anonimowo analizować
                          korzystanie ze strony i poprawiać
                          jej działanie.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => choose("rejected")}
                    className="w-full sm:w-auto"
                  >
                    Tylko niezbędne
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => choose("accepted")}
                    className="w-full sm:w-auto"
                  >
                    Akceptuję analitykę
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Naciśnij Esc, aby zamknąć bez zmiany ustawień.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={openSettings}
          aria-label="Ustawienia cookies"
          title="Ustawienia cookies"
          className={`fixed bottom-2 left-2 z-40 h-12 w-12 border border-[#f4b91e] bg-black text-black shadow-xl transition-[transform,opacity] duration-500 ease-out hover:scale-105 hover:bg-white md:bottom-3 md:left-3 ${floatingButtonReady && showFloatingButton
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