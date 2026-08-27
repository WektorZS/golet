"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"

const COOKIE_NAME = "letsgol_analytics_consent"
type Consent = "accepted" | "rejected" | null

function readConsent(): Consent {
  const value = document.cookie.split("; ").find((item) => item.startsWith(`${COOKIE_NAME}=`))?.split("=")[1]
  return value === "accepted" || value === "rejected" ? value : null
}

function saveConsent(value: Exclude<Consent, null>) {
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  function choose(value: Exclude<Consent, null>) {
    saveConsent(value)
    setConsent(value)
    setEditing(false)
  }

  if (!ready) return null

  return (
    <>
      {process.env.NODE_ENV === "production" && consent === "accepted" ? <Analytics /> : null}
      {!consent || editing ? (
        <section
  aria-label="Ustawienia plików cookies"
  className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-xl border bg-card p-5 text-card-foreground shadow-xl md:p-6"
>
  <div className="flex flex-col gap-4">
    <h2 className="font-sans text-xl font-black uppercase">
      Twoja prywatność
    </h2>

    <p className="text-left text-sm leading-relaxed text-[#4f5258]">
Niezbędne cookies są wymagane do prawidłowego działania strony i zapewnienia jej podstawowej funkcjonalności.<br />
Jeśli wyrazisz zgodę na analitykę, będziemy zbierać anonimowe informacje o tym,
jak użytkownicy korzystają z naszej strony.
<br />
Dzięki temu możemy m.in. analizować liczbę odwiedzin, źródła ruchu,
popularność poszczególnych podstron oraz poprawiać działanie i funkcjonalność serwisu.
    </p>

    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <Link
        href="/polityka-prywatnosci#cookies"
        className="text-sm font-medium text-[#7a5a00] underline underline-offset-4"
      >
        Dowiedz się więcej
      </Link>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => choose("rejected")}
        >
          Tylko niezbędne
        </Button>

        <Button onClick={() => choose("accepted")}>
          Akceptuję analitykę
        </Button>
      </div>
    </div>
  </div>
</section>
      ) : (
    <Button
  type="button"
  size="lg"
  onClick={() => setEditing(true)}
  aria-label="Ustawienia cookies"
  title="Ustawienia cookies"
  className="fixed bottom-2 left-2 z-40 h-12 w-12 border border-[#f4b91e] bg-black text-black transition-all duration-200 hover:scale-105 hover:bg-white md:bottom-3 md:left-3"
>
  <Cookie className="!h-7 !w-7 text-[#f4b91e]" />
</Button>
      )}
    </>
  )
}
