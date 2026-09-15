
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
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { defaultContact } from "@/lib/site-data"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function FloatingContact() {
  const pathname = usePathname()

  const [showButton, setShowButton] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const [open, setOpen] = useState(false)

  /*
   * Pokazywanie / ukrywanie pływającego przycisku.
   */
  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight =
        document.documentElement.scrollHeight

      /*
       * Przycisk pojawia się po opuszczeniu
       * pierwszego ekranu.
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
     * Najpierw renderujemy przycisk w pozycji
     * ukrytej, a następnie uruchamiamy animację.
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
   * Pozwala otworzyć FloatingContact
   * z poziomu głównego menu.
   */
useEffect(() => {
  const openContact = () => {
    setOpen(true)
  }

  const handleContactClick = (event: MouseEvent) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const trigger = target.closest(
      "[data-open-floating-contact]"
    )

    if (!trigger) return

    event.preventDefault()
    setOpen(true)
  }

  window.addEventListener(
    "open-floating-contact",
    openContact
  )

  document.addEventListener(
    "click",
    handleContactClick
  )

  return () => {
    window.removeEventListener(
      "open-floating-contact",
      openContact
    )

    document.removeEventListener(
      "click",
      handleContactClick
    )
  }
}, [])
  /*
   * Nie pokazujemy kontaktu w panelu admina
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
        <MessageCircle className="size-5 shrink-0" />
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
    {/* FORMULARZ */}
    <Button
      nativeButton={false}
      render={
        <Link
          href="/kontakt#formularz"
          onClick={() => setOpen(false)}
        />
      }
      variant="outline"
      size="lg"
    >
      <MessageCircle className="size-5 shrink-0" />
      Przejdź do formularza
    </Button>

    {/* E-MAIL */}
    <Button
      nativeButton={false}
      render={<a href={`mailto:${defaultContact.email}`} />}
      variant="outline"
      size="lg"
    >
      <Mail className="size-5 shrink-0" />
      Napisz e-mail
    </Button>

    {/* TELEFON */}
    <Button
      nativeButton={false}
      render={<a href={defaultContact.phoneHref} />}
      size="lg"
    >
      <Phone className="size-5 shrink-0" />
      Zadzwoń: {defaultContact.phone}
    </Button>

    {/* WHATSAPP */}
    <Button
      nativeButton={false}
      render={
        <a
          href={defaultContact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      size="lg"
    >
      <WhatsappIcon className="size-5 shrink-0" />
      Napisz na WhatsApp
    </Button>
  </div>
</DialogContent>
    </Dialog>
  )
}
