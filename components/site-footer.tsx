import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { Brand } from "@/components/site-header"
import { SocialLinks } from "@/components/social-links"
import type { SiteContent } from "@/lib/content"

export function SiteFooter({ content = {} }: { content?: SiteContent }) {
  const phone = content.contactPhone || "+48 123 456 789"
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`
  const email = content.contactEmail || "kontakt@letsgol.pl"

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="flex flex-col gap-4"><Brand /><p className="text-sm leading-relaxed text-background/60">{content.footerText || "Piłkarskie podróże, które pamięta się dłużej niż wynik."}</p></div>
        <div className="flex flex-col gap-3 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Dane firmy</h2><p>{content.companyName || "Let's Gol Sp. z o.o."}</p><p>{content.companyAddress || "00-100 Warszawa"}</p><p>NIP: {content.companyNip || "123 456 78 90"}</p></div>
        <div className="flex flex-col gap-3 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Gwarancja turystyczna</h2><p className="text-background/65">SIGNAL IDUNA Polska TU S.A.</p><p className="text-background/65">Wpis ROT: 1234</p><Link href="/warunki-uczestnictwa" className="underline underline-offset-4">Warunki uczestnictwa</Link></div>
        <div className="flex flex-col gap-4 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Kontakt i social media</h2><a className="flex items-center gap-2" href={phoneHref}><Phone aria-hidden="true" />{phone}</a><a className="flex items-center gap-2" href={`mailto:${email}`}><Mail aria-hidden="true" />{email}</a><SocialLinks /></div>
      </div>
      <div className="border-t border-background/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-background/50 md:flex-row md:items-center md:justify-between md:px-6"><p>© 2026 Let&apos;s Gol. Wszystkie prawa zastrzeżone.</p><div className="flex flex-wrap gap-4"><Link href="/informacje-prawne">Regulamin</Link><Link href="/informacje-prawne">Polityka prywatności</Link><Link href="/informacje-prawne">Cookies</Link></div></div></div>
    </footer>
  )
}
