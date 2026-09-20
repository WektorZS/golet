import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  FileText,
  Mail,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react"

import { Brand } from "@/components/site-header"
import { SocialLinks } from "@/components/social-links"
import type { SiteContent } from "@/lib/content"

const quickLinks = [
  { label: "Wyjazdy", href: "/wyjazdy" },
  { label: "Twój wyjazd", href: "/#twoj-wyjazd" },
  { label: "Galeria", href: "/galeria" },
  { label: "O nas", href: "/o-nas" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
] as const

const documentLinks = [
  {
    label: "Gwarancja Turystyczna",
    href: "/dokumenty/Gwarancja-LB-Coaching%202026-2027.pdf",
    pdf: true,
  },
  {
    label: "Ubezpieczenie",
    href: "/dokumenty/Ubezpieczenie-Compensa.pdf",
    pdf: true,
  },
  {
    label: "Wzór umowy",
    href: "/dokumenty/Lets_Gol_wzór-umowy-o-świadczenie-usług-turystycznych.pdf",
    pdf: true,
  },
  {
    label: "Warunki Uczestnictwa",
    href: "/warunki-uczestnictwa",
    pdf: false,
  },
  {
    label: "Polityka prywatności",
    href: "/polityka-prywatnosci",
    pdf: false,
  },
] as const

function WhatsAppIcon({
  className = "",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.55-4.4A8.5 8.5 0 1 1 20.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.15 7.8c.2-.45.42-.46.65-.47h.55c.17 0 .36.06.46.31l.85 2.05c.08.2.04.4-.1.57l-.7.84c-.12.14-.1.34-.02.49.53 1.03 1.57 2.04 2.62 2.55.16.08.35.1.49-.03l.82-.75c.16-.15.37-.19.57-.1l1.96.93c.23.11.3.3.3.48 0 .2-.1 1.1-.7 1.66-.54.51-1.27.72-1.98.62-1.04-.15-2.56-.7-4.18-2.17-1.34-1.22-2.26-2.72-2.58-3.82-.3-1.02-.15-2.22.3-2.86.22-.31.45-.3.69-.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FooterHeading({
  icon: Icon,
  children,
}: {
  icon: typeof Navigation
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className="size-5 shrink-0 text-primary"
        strokeWidth={2.3}
        aria-hidden="true"
      />

      <h2 className="font-sans text-sm font-black uppercase tracking-wide text-primary">
        {children}
      </h2>
    </div>
  )
}

export function SiteFooter({
  content = {},
}: {
  content?: SiteContent
}) {
  const phone = content.contactPhone || "+48 501 465 318"
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`

  const email =
    content.contactEmail || "kontakt.letsgol@gmail.com"

  const whatsappNumber = "48501465318"
  const whatsappHref = `https://wa.me/${whatsappNumber}`

  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-stadium.webp"
          alt=""
          fill
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-foreground/86" />

        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/80" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-foreground via-foreground/90 to-transparent" />

        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-foreground to-transparent" />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-10 xl:px-12">
        <div className="grid gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.12fr_0.8fr_1.05fr_1.05fr_1.3fr] lg:gap-0 lg:py-16">
          <div className="pr-0 sm:pr-8 lg:pr-10">
            <Brand />

            <p className="mt-6 max-w-60 text-[15px] leading-6 text-background/70">
              {content.footerText ||
                "Razem tworzymy niezapomniane piłkarskie doświadczenia."}
            </p>

            <p className="mt-7 max-w-56 -rotate-2 font-serif text-xl italic leading-tight text-background/90">
              Do zobaczenia
              <br />
              na stadionach!
            </p>

            <div className="mt-4 h-1 w-16 -rotate-6 rounded-full bg-primary" />
          </div>

          <nav
            aria-label="Nawigacja w stopce"
            className="border-white/10 sm:border-l sm:pl-8 lg:px-8"
          >
            <FooterHeading icon={Navigation}>
              Nawigacja
            </FooterHeading>

            <div className="mt-6 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex w-fit items-center gap-3 text-sm font-medium text-background/72 transition-colors duration-200 hover:text-background"
                >
                  <ChevronRight
                    className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={3}
                    aria-hidden="true"
                  />

                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-white/10 sm:border-l sm:pl-8 lg:px-8">
            <FooterHeading icon={Building2}>
              Dane firmy
            </FooterHeading>

            <div className="mt-6 space-y-3 text-sm leading-6">
              <p className="font-bold text-background">
                {content.companyName ||
                  "LB Coaching Łukasz Borger"}
              </p>

              <p className="text-background/70">
                NIP: {content.companyNip || "8512915273"}
              </p>

              <p className="text-background/70">
                REGON: 520474445
              </p>

              <div className="my-5 h-px bg-white/12" />

              <div>
                <p className="text-background/65">
                  Nr wpisu do rejestru
                </p>

                <p className="text-background/65">
                  organizatorów turystyki:
                </p>

                <a
                  href="/dokumenty/Wpis-do-rejestru-organizatorów-turystyki-LB-Coaching.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-1 inline-flex items-center gap-2 text-xl font-black text-primary transition-colors hover:text-background"
                >
                  42848

                  <ArrowUpRight
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>

                <p className="mt-1 text-xs text-background/45">
                  Sprawdź wpis w oficjalnym rejestrze
                </p>
              </div>
            </div>
          </div>

          <div className="border-white/10 sm:border-l sm:pl-8 lg:px-8">
            <FooterHeading icon={FileText}>
              Dokumenty
            </FooterHeading>

            <div className="mt-6 flex flex-col gap-3">
              {documentLinks.map((link) => {
                const className =
                  "group flex w-fit items-center gap-3 text-sm font-medium text-background/72 transition-colors hover:text-background"

                const content = (
                  <>
                    <ChevronRight
                      className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={3}
                      aria-hidden="true"
                    />

                    <span>{link.label}</span>
                  </>
                )

                if (link.pdf) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {content}
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={className}
                  >
                    {content}
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-background/40">
                Gwarancja turystyczna
              </p>

              <p className="mt-2 text-sm font-semibold text-background">
                COMPENSA TU S.A.
              </p>
            </div>
          </div>

          <div className="border-white/10 sm:border-l sm:pl-8 lg:pl-8">
            <FooterHeading icon={MessageCircle}>
              Kontakt
            </FooterHeading>

            <div className="mt-6 space-y-5">
              <a
                href={phoneHref}
                className="group flex items-start gap-4"
              >
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <div>
                  <p className="font-bold text-background transition-colors group-hover:text-primary">
                    {phone}
                  </p>

                  <p className="mt-1 text-xs text-background/45">
                    Pon - Pt 9:00 - 18:00
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="group flex items-start gap-4"
              >
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <p className="break-all font-bold text-background transition-colors group-hover:text-primary">
                    {email}
                  </p>

                  <p className="mt-1 text-xs text-background/45">
                    Odpowiadamy na wszystkie wiadomości
                  </p>
                </div>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4"
              >
                <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-green-500" />

                <div>
                  <p className="font-bold text-background transition-colors group-hover:text-primary">
                    Napisz na WhatsApp
                  </p>

                  <p className="mt-1 text-xs text-background/45">
                    Szybki kontakt
                  </p>
                </div>
              </a>
            </div>

            <div className="mt-7 border-t border-white/12 pt-6">
              <p className="mb-4 text-sm font-black uppercase tracking-wide text-primary">
                Śledź nas
              </p>

              <SocialLinks />
            </div>
          </div>
        </div>

       <div className="border-t border-primary/55">
  <div className="grid items-center gap-5 py-7 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.15fr] lg:gap-0">
    <div className="flex min-w-0 justify-start lg:justify-center lg:px-6">
      <div className="flex w-fit items-center gap-3">
        <BadgeCheck
          className="size-8 shrink-0 text-primary"
          strokeWidth={2}
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-sm font-black leading-tight text-background">
            Legalny organizator turystyki
          </p>

          <p className="mt-1 text-xs leading-tight text-background/60">
            Nr wpisu: 42848
          </p>
        </div>
      </div>
    </div>

    <div className="flex min-w-0 justify-start lg:justify-center border-white/10 lg:border-l lg:px-6">
      <div className="flex w-fit items-center gap-4">
        <div className="shrink-0 font-sans text-2xl font-black leading-none tracking-tight text-primary">
          TFG / TFP
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black leading-tight text-background">
            Turystyczny Fundusz
          </p>

          <p className="mt-1 text-xs leading-tight text-background/60">
            Gwarancyjny i Pomocowy
          </p>
        </div>
      </div>
    </div>

    <div className="flex min-w-0 justify-start lg:justify-center border-white/10 lg:border-l lg:px-6">
      <div className="flex w-fit items-center gap-3">
        <ShieldCheck
          className="size-8 shrink-0 text-primary"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-sm font-black leading-tight text-background">
            Ubezpieczenie podróżne
          </p>

          <p className="mt-1 text-xs leading-tight text-background/50">
            Vienna Insurance Group
          </p>
        </div>
      </div>
    </div>

    <div className="flex min-w-0 justify-start lg:justify-center border-white/10 lg:border-l lg:px-6">
      <div className="flex w-fit items-center gap-3">
        <Users
          className="size-8 shrink-0 text-primary"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-sm font-black leading-tight text-background lg:whitespace-nowrap">
            Sprawdzone hotele i pewne bilety
          </p>

          <p className="mt-1 text-xs leading-tight text-background/50">
            Twój komfort to nasz priorytet
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

        <div className="border-t border-white/10">
          <div className="flex flex-col gap-4 py-5 text-xs text-background/45 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 Let&apos;s Gol. Wszystkie prawa zastrzeżone.
            </p>

            <a
              href="https://share.google/kRvcJRnquoIaDz3YT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-background"
            >
              Profil firmy w Google

              <ArrowUpRight
                className="size-3"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}