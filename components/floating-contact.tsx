
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
import { getDictionary } from "@/lib/dictionaries"
import { localeFromPathname, routeFor } from "@/lib/i18n"

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
const WHATSAPP_HREF = "https://wa.me/48501465318"
const EMAIL = "kontakt.letsgol@gmail.com"

/*
 * Ikona WhatsApp bez dodatkowej biblioteki.
 * Kontener ma dokładnie 20x20 px,
 * tak samo jak pozostałe ikony.
 */
function WhatsappIcon() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.6 5.96L.1 24l6.3-1.65a11.86 11.86 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.15-3.42-8.42ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.88 9.88 0 0 1-1.52-5.28C2.17 6.43 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.86 9.86 0 0 1 2.89 7c0 5.45-4.43 9.9-9.87 9.9Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.61.56-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </span>
  )
}

export function FloatingContact() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const dictionary = getDictionary(locale)

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
        {dictionary.floating.buttonContact}
      </DialogTrigger>

      <DialogContent>
  <DialogHeader>
    <DialogTitle>
       {dictionary.floating.choiceTitle}
    </DialogTitle>

    <DialogDescription>
       {dictionary.floating.choiceDescription}
    </DialogDescription>
  </DialogHeader>

  <div className="flex flex-col gap-3">
    {/* FORMULARZ */}
    <Button
      nativeButton={false}
      render={
        <Link
          href={`${routeFor(locale, "/")}#kontakt`}
          onClick={() => setOpen(false)}
        />
      }
      variant="outline"
      size="lg"
    >
      <MessageCircle className="size-5 shrink-0" />
       {dictionary.floating.goToForm}
    </Button>

    {/* E-MAIL */}
    <Button
      nativeButton={false}
      render={<a href={`mailto:${EMAIL}`} />}
      variant="outline"
      size="lg"
    >
      <Mail className="size-5 shrink-0" />
       {dictionary.floating.email}
    </Button>

    {/* TELEFON */}
    <Button
      nativeButton={false}
      render={<a href={PHONE_HREF} />}
      size="lg"
    >
      <Phone className="size-5 shrink-0" />
       {dictionary.floating.call}: {PHONE_DISPLAY}
    </Button>

    {/* WHATSAPP */}
    <Button
      nativeButton={false}
      render={
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      size="lg"
    >
      <WhatsappIcon />
       {dictionary.footer.whatsapp}
    </Button>
  </div>
</DialogContent>
    </Dialog>
  )
}
