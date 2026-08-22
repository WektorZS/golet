'use client'

import Image from "next/image"
import Link from "next/link"
import { Menu, Plane, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const links = [
  ["Wyjazdy", "/#wyjazdy"],
  ["Bilety", "/#bilety"],
  ["Dla grup", "/#grupy"],
  ["O nas", "/#o-nas"],
  ["FAQ", "/#faq"],
] as const

export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-background"
      aria-label="Let’s Gol – strona główna"
    >
      <span className="flex size-16 shrink-0 items-center justify-center">
        <Image
          src="/logo.png"
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
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-background/15 bg-foreground/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Główna nawigacja">
          {links.map(([label, href]) => <Link key={href} href={href} className="font-mono text-xs font-semibold uppercase tracking-wider text-background/80 transition-colors hover:text-primary">{label}</Link>)}
        </nav>
        <Button className="hidden h-11 rounded-md px-5 font-bold uppercase md:inline-flex" nativeButton={false} render={<Link href="/#kontakt" />}>
          Zapytaj o wyjazd <Plane data-icon="inline-end" />
        </Button>
        <Button variant="outline" size="icon-lg" className="border-background/30 bg-transparent text-background md:hidden" aria-label={open ? "Zamknij menu" : "Otwórz menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open ? (
        <nav className="absolute inset-x-0 top-full flex h-[calc(100svh-5rem)] flex-col gap-1 overflow-y-auto border-t border-background/15 bg-foreground px-4 py-4 md:hidden" aria-label="Menu mobilne">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background hover:bg-background/10 hover:text-primary">{label}</Link>)}
          <Button className="mt-2 w-full font-bold uppercase" nativeButton={false} render={<Link href="/#kontakt" onClick={() => setOpen(false)} />}>Zapytaj o wyjazd <Plane data-icon="inline-end" /></Button>
        </nav>
      ) : null}
    </header>
  )
}
