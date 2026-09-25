"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plane, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionaries"
import {
  localeFromPathname,
  routeFor,
  type Locale,
} from "@/lib/i18n"

export function Brand({
  priority = false,
  locale = "pl",
}: {
  priority?: boolean
  locale?: Locale
}) {
  const dictionary = getDictionary(locale)

  return (
    <Link
      href={routeFor(locale, "/")}
      className="flex items-center gap-3 text-background xl:gap-4"
    >
      <span className="flex size-16 shrink-0 items-center justify-center xl:size-20">
        <Image
          src="/logo.webp"
          alt=""
          width={96}
          height={96}
          className="size-16 object-contain xl:size-20"
          priority={priority}
        />
      </span>

      <span className="flex min-w-0 flex-col font-sans font-black uppercase leading-none tracking-tight">
        <span className="whitespace-nowrap text-xl xl:text-2xl">
          Let&apos;s Gol
        </span>

        <span className="mt-1 whitespace-nowrap font-mono text-[10px] font-semibold tracking-[0.16em] text-primary xl:text-[11px] xl:tracking-[0.18em]">
          {dictionary.brandTagline}
        </span>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const dictionary = getDictionary(locale)

  const links = [
    [
      dictionary.navigation.trips,
      routeFor(locale, "/wyjazdy"),
    ],
    [
      dictionary.navigation.customTrip,
      `${routeFor(locale, "/")}#twoj-wyjazd`,
    ],
    [
      dictionary.navigation.gallery,
      routeFor(locale, "/galeria"),
    ],
    [
      dictionary.navigation.about,
      routeFor(locale, "/o-nas"),
    ],
    [
      dictionary.navigation.faq,
      routeFor(locale, "/faq"),
    ],
    [
      dictionary.navigation.contact,
      routeFor(locale, "/kontakt"),
    ],
  ] as const

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

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
      <div className="relative mx-auto flex h-20 max-w-screen-2xl items-center px-4 md:px-6 xl:h-24 xl:px-8 2xl:px-12">
        <div className="shrink-0">
          <Brand priority locale={locale} />
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-7 xl:flex 2xl:gap-8"
          aria-label={dictionary.navigation.label}
        >
          {links.map(([label, href]) => {
            const route = href.split("#")[0] || "/"
            const active =
              route !== "/" && pathname === route

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-primary after:transition-transform ${
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

        <div className="ml-auto hidden items-center gap-4 text-background xl:flex">
          <LanguageSwitcher compact />

          <Button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new Event("open-floating-contact"),
              )
            }}
            className="group h-12 items-center gap-3 rounded-lg border border-primary/60 bg-primary/10 px-6 font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-black"
          >
            <span>
              {dictionary.navigation.ask}
            </span>

            <Plane className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <div className="text-background">
            <LanguageSwitcher compact />
          </div>

          <Button
            variant="outline"
            size="icon-lg"
            className="border-background/30 bg-transparent text-background"
            aria-label={
              open
                ? dictionary.navigation.close
                : dictionary.navigation.open
            }
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav
          className="absolute inset-x-0 top-full flex h-[calc(100svh-5rem)] flex-col gap-1 overflow-y-auto border-t border-background/15 bg-foreground px-4 py-4 xl:hidden"
          aria-label={dictionary.navigation.mobileLabel}
        >
          {links.map(([label, href]) => {
            const route = href.split("#")[0] || "/"
            const active =
              route !== "/" && pathname === route

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
                new Event("open-floating-contact"),
              )
            }}
          >
            {dictionary.navigation.ask}

            <Plane data-icon="inline-end" />
          </Button>

          <div className="mt-auto border-t border-background/15 pt-5">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              {dictionary.navigation.follow}
            </p>

            <SocialLinks showLabels />
          </div>
        </nav>
      ) : null}
    </header>
  )
}