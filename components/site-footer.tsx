import Link from "next/link"
import { Mail, Phone, ArrowUpRight } from "lucide-react"
import { Brand } from "@/components/site-header"
import { SocialLinks } from "@/components/social-links"
import type { SiteContent } from "@/lib/content"

const quickLinks = [
  { label: "Wyjazdy", href: "/wyjazdy" },
  { label: "Twój wyjazd", href: "/wycena-indywidualna" },
  { label: "Galeria", href: "/galeria" },
  { label: "O nas", href: "/o-nas" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
] as const

export function SiteFooter({ content = {} }: { content?: SiteContent }) {
  const phone = content.contactPhone || "+48 123 456 789"
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`
  const email = content.contactEmail || "kontakt@letsgol.pl"

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.05fr_0.8fr_1fr_1fr_1.45fr] lg:gap-8">
        {/* MARKA */}
        <div className="flex flex-col gap-4">
          <Brand />

          <p className="text-sm leading-relaxed text-background/60">
            {content.footerText ||
              "Piłkarskie podróże, które pamięta się dłużej niż wynik."}
          </p>
        </div>

        {/* SZYBKIE LINKI */}
        <nav
          className="flex flex-col gap-3 text-sm"
          aria-label="Szybkie linki"
        >
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Szybkie linki
          </h2>

          <div className="flex flex-col items-start gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-background/65 transition-colors hover:text-background"
              >
                <span>{link.label}</span>

                <ArrowUpRight
                  className="size-3.5 text-primary opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </nav>

        {/* DANE FIRMY */}
        <div className="flex flex-col gap-3 text-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Dane firmy
          </h2>

          <p>{content.companyName || "LB Coaching Łukasz Borger"}</p>

          <p>
            {content.companyAddress ||
              "ul. Stefana Roweckiego 1/2, 72-010 Police"}
          </p>

          <p>NIP: {content.companyNip || "8512915273"}</p>

          <p>REGON: 520474445</p>
        </div>

        {/* GWARANCJA */}
        <div className="flex flex-col gap-3 text-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Gwarancja turystyczna
          </h2>

          <p className="text-background/65">COMPENSA TU S.A</p>

          <p className="text-background/65">Wpis ROT: 34/25</p>

          <p className="text-background/65">Nr ewidencyjny UFG: 42848</p>

          <Link
            href="/warunki-uczestnictwa"
            className="underline underline-offset-4 transition-colors hover:text-primary"
          >
            Warunki uczestnictwa
          </Link>
        </div>

        {/* KONTAKT */}
        <div className="flex flex-col gap-4 text-sm">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Kontakt i social media
          </h2>

          <a
            className="flex items-center gap-2 transition-colors hover:text-primary"
            href={phoneHref}
          >
            <Phone
              className="size-4"
              aria-hidden="true"
            />
            {phone}
          </a>

          <a
            className="flex items-center gap-2 transition-colors hover:text-primary"
            href={`mailto:${email}`}
          >
            <Mail
              className="size-4"
              aria-hidden="true"
            />
            {email}
          </a>

          <a
            href="https://share.google/kRvcJRnquoIaDz3YT"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex w-fit items-center gap-2 text-background/65 transition-colors hover:text-background"
            aria-label="Profil naszej firmy w Google"
          >
            <span className="font-medium">
              Profil naszej firmy w Google
            </span>

            <ArrowUpRight
              className="size-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <SocialLinks />
        </div>
      </div>

      {/* DOLNY PASEK */}
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-background/50 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2026 Let&apos;s Gol. Wszystkie prawa zastrzeżone.</p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/polityka-prywatnosci"
              className="transition-colors hover:text-background"
            >
              Polityka prywatności i cookies
            </Link>

            <Link
              href="/warunki-uczestnictwa"
              className="transition-colors hover:text-background"
            >
              Warunki uczestnictwa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}