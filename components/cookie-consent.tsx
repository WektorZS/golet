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
        <section aria-label="Ustawienia plików cookies" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border bg-card p-5 text-card-foreground shadow-xl md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="font-sans text-xl font-black uppercase">Twoja prywatność</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">Niezbędne cookies zapewniają działanie strony. Zezwól na analitykę jeśli zgadzasz się na zbieranie anonimowych informacji o tym, jak użytkownicy korzystają z naszej strony. Pozwala nam to m.in. sprawdzać liczbę odwiedzin, źródła ruchu, popularność poszczególnych podstron oraz poprawiać działanie i funkcjonalność serwisu.</p>
              <Link href="/informacje-prawne#cookies" className="text-sm font-medium text-primary underline underline-offset-4">Dowiedz się więcej</Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => choose("rejected")}>Tylko niezbędne</Button>
              <Button onClick={() => choose("accepted")}>Akceptuję analitykę</Button>
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
  className="fixed bottom-3 left-3 z-40 h-12 w-12 border border-[#f4b91e] bg-white text-black transition-all duration-200 hover:scale-105 hover:bg-black md:bottom-3 md:left-3"
>
  <Cookie className="!h-7 !w-7 text-[#f4b91e]" />
</Button>
      )}
    </>
  )
}
