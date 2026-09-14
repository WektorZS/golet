
"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Plane, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"

const links = [
  ["WYJAZDY", "/wyjazdy"],
  ["TWÓJ WYJAZD", "/wycena-indywidualna"],
  ["GALERIA", "/galeria"],
  ["O NAS", "/o-nas"],
  ["FAQ", "/faq"],
  ["KONTAKT", "/kontakt"],
] as const

export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-background"
      aria-label="Let’s Gol - strona główna"
    >
      <span className="flex size-16 shrink-0 items-center justify-center">
        <Image
          src="/logo.webp"
          alt="Let’s Gol"
          width={84}
          height={84}
          className="size-16 object-contain"
          priority
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[99999] isolate transition-all duration-300 ${
        scrolled
          ? "bg-black"
          : "bg-foreground/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        {/* LOGO */}
        <Brand />

      <nav
  className="hidden items-center justify-center gap-7 lg:flex"
  aria-label="Główna nawigacja"
>
  {links.map(([label, href]) => (
    <Link
      key={href}
      href={href}
      className="font-mono text-xs font-semibold uppercase tracking-wider text-background/80 transition-colors hover:text-primary"
    >
      {label}
    </Link>
  ))}
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
          className="border-background/30 bg-transparent text-background md:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>


{open ? (
  <nav
    className="absolute inset-x-0 top-full flex h-[calc(100svh-5rem)] flex-col gap-1 overflow-y-auto border-t border-background/15 bg-foreground px-4 py-4 md:hidden"
    aria-label="Menu mobilne"
  >
    {links.map(([label, href]) => (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className="rounded-md px-3 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background hover:bg-background/10 hover:text-primary"
      >
        {label}
      </Link>
    ))}

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
