"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, MessageCircle, Phone } from "lucide-react"
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
  const [showMobileButton, setShowMobileButton] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Przycisk pojawia się po przewinięciu 240 px
      const passedHeader = scrollY > 240

      // Przycisk znika w ostatnich 200 px strony
      const nearBottom =
        scrollY + viewportHeight >= documentHeight - 500

      setShowMobileButton(passedHeader && !nearBottom)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [pathname])

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className={`fixed bottom-1 right-1 border-1 border-foreground shadow-xl transition-all duration-200 hover:scale-105 md:bottom-3 md:right-3 ${
              showMobileButton
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"
            }`}
            size="lg"
          />
        }
      >
        <MessageCircle data-icon="inline-start" />
        Skontaktuj się
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jak chcesz się skontaktować?</DialogTitle>
          <DialogDescription>
            Wybierz najwygodniejszą formę kontaktu z zespołem Let&apos;s Gol.
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
            render={<a href={`mailto:${EMAIL}`} />}
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