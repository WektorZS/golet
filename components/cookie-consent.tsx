
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Cookie } from "lucide-react"

import { Button } from "@/components/ui/button"

const COOKIE_NAME = "letsgol_analytics_consent"

type Consent = "accepted" | "rejected" | null

function readConsent(): Consent {
  const value = document.cookie
    .split("; ")
    .find((item) =>
      item.startsWith(`${COOKIE_NAME}=`)
    )
    ?.split("=")[1]

  return value === "accepted" || value === "rejected"
    ? value
    : null
}

function saveConsent(
  value: Exclude<Consent, null>
) {
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showFloatingButton, setShowFloatingButton] =
    useState(false)

  /*
   * Odczyt zapisanej zgody.
   */
  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  /*
   * Mała ikonka cookies pojawia się dopiero
   * po opuszczeniu pierwszego ekranu / hero.
   */
  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight =
        document.documentElement.scrollHeight

      const passedHero = scrollY > viewportHeight - 80

      const nearBottom =
        scrollY + viewportHeight >=
        documentHeight - 350

      setShowFloatingButton(
        passedHero && !nearBottom
      )
    }

    updateVisibility()

    window.addEventListener(
      "scroll",
      updateVisibility,
      { passive: true }
    )

    window.addEventListener(
      "resize",
      updateVisibility,
      { passive: true }
    )

    return () => {
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

  /*
   * Blokujemy przewijanie strony, kiedy
   * użytkownik musi podjąć decyzję.
   */
  useEffect(() => {
    if (!ready) return

    const shouldLock =
      !consent || editing

    if (shouldLock) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [ready, consent, editing])

  function choose(
    value: Exclude<Consent, null>
  ) {
    saveConsent(value)
    setConsent(value)
    setEditing(false)
  }

  if (!ready) {
    return null
  }

  return (
    <>
      {process.env.NODE_ENV === "production" &&
      consent === "accepted" ? (
        <Analytics />
      ) : null}

      {/*
       * GŁÓWNE OKNO COOKIES
       *
       * Pokazuje się na środku ekranu.
       * Tło strony zostaje przyciemnione
       * i rozmazane.
       */}
      {!consent || editing ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <section className="w-full max-w-xl rounded-xl border border-white/10 bg-card p-6 text-card-foreground shadow-2xl md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Cookie
                    className="size-6 text-primary"
                    aria-hidden="true"
                  />
                </span>

                <h2
                  id="cookie-consent-title"
                  className="font-sans text-2xl font-black uppercase"
                >
                  Twoja prywatność
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Niezbędne cookies są wymagane do
                prawidłowego działania strony i zapewnienia
                jej podstawowej funkcjonalności.
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Jeśli wyrazisz zgodę na analitykę,
                będziemy zbierać anonimowe informacje o tym,
                jak użytkownicy korzystają z naszej strony.
                Dzięki temu możemy analizować liczbę
                odwiedzin, źródła ruchu oraz popularność
                poszczególnych podstron.
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Analityka pomaga nam również poprawiać
                działanie i funkcjonalność serwisu.
              </p>

              <Link
                href="/polityka-prywatnosci#cookies"
                className="w-fit text-sm font-medium text-[#7a5a00] underline underline-offset-4"
              >
                Dowiedz się więcej o cookies
              </Link>

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
          </section>
        </div>
      ) : (
        /*
         * MAŁA IKONA USTAWIEŃ COOKIES
         *
         * Pokazuje się dopiero po opuszczeniu hero.
         */
        <Button
          type="button"
          size="lg"
          onClick={() => setEditing(true)}
          aria-label="Ustawienia cookies"
          title="Ustawienia cookies"
          className={`fixed bottom-2 left-2 z-40 h-12 w-12 border border-[#f4b91e] bg-black text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white md:bottom-3 md:left-3 ${
            showFloatingButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <Cookie className="!h-7 !w-7 text-[#f4b91e]" />
        </Button>
      )}
    </>
  )
}