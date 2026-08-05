import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { Brand } from "@/components/site-header"

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="flex flex-col gap-4"><Brand /><p className="text-sm leading-relaxed text-background/60">Piłkarskie podróże, które pamięta się dłużej niż wynik.</p></div>
        <div className="flex flex-col gap-3 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Dane firmy</h2><p>Let&apos;s Gol Sp. z o.o.</p><p>00-100 Warszawa</p><p>NIP: 123 456 78 90</p></div>
        <div className="flex flex-col gap-3 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Gwarancja turystyczna</h2><p className="text-background/65">SIGNAL IDUNA Polska TU S.A.</p><p className="text-background/65">Wpis ROT: 1234</p><Link href="/informacje-prawne#warunki" className="underline underline-offset-4">Warunki uczestnictwa</Link></div>
        <div className="flex flex-col gap-3 text-sm"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Kontakt</h2><a className="flex items-center gap-2" href="tel:+48123456789"><Phone aria-hidden="true" />+48 123 456 789</a><a className="flex items-center gap-2" href="mailto:kontakt@letsgol.pl"><Mail aria-hidden="true" />kontakt@letsgol.pl</a></div>
      </div>
      <div className="border-t border-background/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-background/50 md:flex-row md:items-center md:justify-between md:px-6"><p>© 2026 Let&apos;s Gol. Wszystkie prawa zastrzeżone.</p><div className="flex flex-wrap gap-4"><Link href="/informacje-prawne#warunki">Regulamin</Link><Link href="/informacje-prawne#prywatnosc">Polityka prywatności</Link><Link href="/informacje-prawne#cookies">Cookies</Link></div></div></div>
    </footer>
  )
}
