import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, Mail, MessageCircle, Phone, Users } from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WhatsappIcon } from "@/components/whatsapp-icon"
import { Button } from "@/components/ui/button"
import { getSiteContent } from "@/lib/content"
import { breadcrumbSchema } from "@/lib/seo"
import { getContactDetails, socialProfiles } from "@/lib/site-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z Let's Gol w sprawie wyjazdu na mecz, rezerwacji, oferty grupowej lub współpracy.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt z Let's Gol",
    description: "Wybierz wygodny kanał i zapytaj o wyjazd na mecz.",
    url: "/kontakt",
  },
}

export default async function ContactPage() {
  const content = process.env.DATABASE_URL
    ? await getSiteContent().catch(() => ({}))
    : {}
  const contact = getContactDetails(content)
  const whatsappMessage = encodeURIComponent("Dzień dobry, mam pytanie dotyczące wyjazdu z Let's Gol.")

  const channels = [
    {
      title: "WhatsApp",
      description: "Najwygodniejszy do krótkiego pytania o termin, dostępność lub konkretny mecz.",
      detail: contact.phone,
      href: `${contact.whatsappHref}?text=${whatsappMessage}`,
      label: "Napisz na WhatsApp",
      icon: <WhatsappIcon className="size-6" />,
      external: true,
    },
    {
      title: "Telefon",
      description: "Dobry wybór, jeśli chcesz szybko omówić wariant podróży albo wyjazd dla grupy.",
      detail: contact.phone,
      href: contact.phoneHref,
      label: "Zadzwoń teraz",
      icon: <Phone className="size-6" />,
      external: false,
    },
    {
      title: "E-mail",
      description: "Najlepszy kanał do współpracy, rozbudowanych pytań i wiadomości z większą liczbą szczegółów.",
      detail: contact.email,
      href: `mailto:${contact.email}`,
      label: "Napisz e-mail",
      icon: <Mail className="size-6" />,
      external: false,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Strona główna", path: "/" },
              { name: "Kontakt", path: "/kontakt" },
            ]),
            {
              "@type": "ContactPage",
              name: "Kontakt z Let's Gol",
              url: "https://letsgol.eu/kontakt",
              mainEntity: { "@id": "https://letsgol.eu/#organization" },
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
        <Image
          src="/images/madrid-trip.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground/55" />
        <div className="site-container relative grid min-h-[520px] items-center gap-10 py-16 lg:grid-cols-[1fr_0.55fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">Kontakt</p>
            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
              Porozmawiajmy o Twoim następnym meczu
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Masz wybrany mecz, dopiero szukasz pomysłu albo organizujesz wyjazd dla grupy? Wybierz wygodny kanał i opowiedz nam, czego potrzebujesz.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <Clock3 className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-4 font-sans text-2xl font-black uppercase">Szybkie pytanie?</p>
            <p className="mt-2 text-sm leading-6 text-background/60">
              Zacznij od WhatsAppa lub telefonu. Przy bardziej rozbudowanej sprawie skorzystaj z formularza.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space bg-background">
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="eyebrow">Wybierz kanał</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Skontaktuj się tak, jak Ci wygodnie
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Każda droga prowadzi do tego samego zespołu. Opis podpowiada, który kanał najlepiej pasuje do Twojej sprawy.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className="surface-card interactive-card group flex min-h-72 flex-col p-6 md:p-7"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-foreground text-primary">
                  {channel.icon}
                </span>
                <h3 className="mt-7 font-sans text-3xl font-black uppercase">{channel.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{channel.description}</p>
                <p className="mt-6 break-all text-sm font-bold">{channel.detail}</p>
                <span className="mt-3 inline-flex items-center gap-2 font-bold text-foreground group-hover:text-primary">
                  {channel.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="formularz" className="scroll-mt-20 bg-foreground text-background">
        <div className="site-container grid gap-12 py-16 md:py-20 lg:grid-cols-[0.65fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">Formularz</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              Opisz swoją sprawę
            </h2>
            <p className="mt-5 max-w-md leading-7 text-background/65">
              Podaj kontekst i najważniejsze szczegóły. Dzięki temu pierwsza odpowiedź będzie bardziej konkretna.
            </p>
            <div className="mt-8 space-y-5 border-t border-background/15 pt-7">
              <div className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-6 text-background/60">Pytanie o wyjazd, rezerwację, grupę lub współpracę trafia przez ten sam bezpieczny formularz.</p>
              </div>
              <div className="flex gap-3">
                <Users className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-6 text-background/60">Przy zapytaniu grupowym wpisz orientacyjną liczbę osób i interesujący termin w wiadomości.</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section-space bg-secondary/55">
        <div className="site-container">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Social media</p>
              <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">Bądź bliżej wyjazdów</h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Obserwuj relacje, zobacz atmosferę i dowiedz się o nowych kierunkach.</p>
            </div>
            <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/galeria" />}>
              Zobacz galerię <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {socialProfiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card interactive-card group p-5"
              >
                <Image src={profile.icon} alt="" width={24} height={24} className="size-6 object-contain" unoptimized />
                <h3 className="mt-5 font-sans text-xl font-black uppercase">{profile.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold group-hover:text-primary">
                  Otwórz profil <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
