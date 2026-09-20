
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plane, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"

const links = [
  ["WYJAZDY", "/wyjazdy"],
  ["TWÓJ WYJAZD", "/#twoj-wyjazd"],
  ["GALERIA", "/galeria"],
  ["O NAS", "/o-nas"],
  ["FAQ", "/faq"],
  ["KONTAKT", "/kontakt"],
] as const

export function Brand({ priority = false }: { priority?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-background"
    >
      <span className="flex size-16 shrink-0 items-center justify-center">
        <Image
          src="/logo.webp"
          alt=""
          width={84}
          height={84}
          className="size-16 object-contain"
          priority={priority}
        />
      </span>

      <span className="flex flex-col font-sans font-black uppercase leading-none tracking-tight">
        <span className="text-xl">Let&apos;s Gol</span>

        <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">
          Wyjazdy na mecze
        </span>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-99999 isolate transition-all duration-300 ${
        scrolled
          ? "bg-black"
          : "bg-foreground/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        {/* LOGO */}
        <Brand priority />

        <nav
          className="hidden items-center justify-center gap-7 lg:flex"
          aria-label="Główna nawigacja"
        >
          {links.map(([label, href]) => {
            const route = href.split("#")[0] || "/"
            const active = route !== "/" && pathname === route

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-primary after:transition-transform ${
                  active
                    ? "text-primary after:scale-x-100"
                    : "text-background/75 after:scale-x-0 hover:text-background hover:after:scale-x-100"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* DESKTOP CTA */}
        <Button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new Event("open-floating-contact")
            )
          }}
          className="group hidden h-11 items-center gap-3 rounded-lg border border-primary/60 bg-primary/10 px-5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-black lg:inline-flex"
        >
          <span>Zapytaj o wyjazd</span>

          <Plane className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Button>

        {/* MOBILE MENU BUTTON */}
        <Button
          variant="outline"
          size="icon-lg"
          className="border-background/30 bg-transparent text-background lg:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <nav
          className="absolute inset-x-0 top-full flex h-[calc(100svh-5rem)] flex-col gap-1 overflow-y-auto border-t border-background/15 bg-foreground px-4 py-4 lg:hidden"
          aria-label="Menu mobilne"
        >
        {links.map(([label, href]) => {
  const route = href.split("#")[0] || "/"
  const active = route !== "/" && pathname === route

  return (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      aria-current={active ? "page" : undefined}
      className={`group rounded-md px-3 py-3 font-mono text-sm font-semibold uppercase tracking-wider transition-colors ${
        active
          ? "text-primary"
          : "text-background hover:bg-background/10 hover:text-primary"
      }`}
    >
      <span
        className={`relative inline-block pb-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-primary after:transition-transform ${
          active
            ? "after:scale-x-100"
            : "after:scale-x-0"
        }`}
      >
        {label}
      </span>
    </Link>
  )
})}

          <Button
            type="button"
            className="mt-2 w-full font-bold uppercase"
            onClick={() => {
              setOpen(false)

              window.dispatchEvent(
                new Event("open-floating-contact")
              )
            }}
          >
            Zapytaj o wyjazd
            <Plane data-icon="inline-end" />
          </Button>

          <div className="mt-auto border-t border-background/15 pt-5">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Obserwuj nas
            </p>

            <SocialLinks showLabels />
          </div>
        </nav>
      ) : null}
    </header>
  )
}
