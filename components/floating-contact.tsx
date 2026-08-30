
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const PHONE_DISPLAY = "+48 501 465 318"
const PHONE_HREF = "tel:+48501465318"
const EMAIL = "kontakt.letsgol@gmail.com"

export function FloatingContact() {
  const pathname = usePathname()

  const [showButton, setShowButton] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const [open, setOpen] = useState(false)

  /*
   * Sprawdzamy, czy użytkownik opuścił
   * pierwszy ekran / hero.
   */
  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight =
        document.documentElement.scrollHeight

      /*
       * Przycisk pojawia się dopiero
       * po opuszczeniu pierwszego ekranu.
       */
      const passedHeader = scrollY > 80

      /*
       * Pod koniec strony chowamy przycisk,
       * żeby nie nachodził na stopkę.
       */
      const nearBottom =
        scrollY + viewportHeight >=
        documentHeight - 500

      setShowButton(
        passedHeader && !nearBottom
      )
    }

    updateVisibility()

    /*
     * Pozwala przeglądarce najpierw wyrenderować
     * przycisk w pozycji ukrytej, a dopiero potem
     * uruchomić animację.
     */
    requestAnimationFrame(() => {
      setButtonReady(true)
    })

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
   * Nie pokazujemy przycisku w panelu admina
   * ani na stronie logowania.
   */
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth")
  ) {
    return null
  }

  const isVisible =
    buttonReady && showButton

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            className={`
              fixed bottom-2 right-2 z-40
              border border-foreground
              shadow-xl

              transition-[transform,opacity]
              duration-500
              ease-out

              md:bottom-3
              md:right-3

              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-10 opacity-0"
              }
            `}
            size="lg"
          />
        }
      >
        <MessageCircle data-icon="inline-start" />
        Skontaktuj się
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Jak chcesz się skontaktować?
          </DialogTitle>

          <DialogDescription>
            Wybierz najwygodniejszą formę kontaktu
            z zespołem Let&apos;s Gol.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Button
            nativeButton={false}
            render={<a href={PHONE_HREF} />}
            size="lg"
          >
            <Phone data-icon="inline-start" />
            Zadzwoń: {PHONE_DISPLAY}
          </Button>

          <Button
            nativeButton={false}
            render={
              <Link
                href="/#kontakt"
                onClick={() => setOpen(false)}
              />
            }
            variant="outline"
            size="lg"
          >
            <MessageCircle data-icon="inline-start" />
            Przejdź do formularza
          </Button>

          <Button
            nativeButton={false}
            render={
              <a href={`mailto:${EMAIL}`} />
            }
            variant="outline"
            size="lg"
          >
            <Mail data-icon="inline-start" />
            Napisz e-mail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}