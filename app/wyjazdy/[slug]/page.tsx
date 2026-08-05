import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Check, Headphones, MapPin, Plane, ShieldCheck, TicketCheck } from "lucide-react"
import { InquiryForm } from "@/components/inquiry-form"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { getTripBySlug, getTripGallery } from "@/lib/trips"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) return { title: "Wyjazd niedostępny" }
  return { title: trip.seoTitle || trip.title, description: trip.seoDescription || `${trip.description} Pakiet od ${trip.price} zł.` }
}

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) notFound()
  const gallery = await getTripGallery(trip.id)
  const date = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${trip.startDate}T12:00:00`))
  const jsonLd = { "@context": "https://schema.org", "@type": "TouristTrip", name: trip.title, description: trip.description, touristType: "Kibice piłkarscy", offers: { "@type": "Offer", price: trip.price, priceCurrency: "PLN", availability: "https://schema.org/InStock" } }

  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="relative isolate min-h-[620px] overflow-hidden bg-foreground text-background">
        <Image src={trip.image} alt={`Stadion w mieście ${trip.city}`} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/15" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col px-4 py-8 md:px-6">
          <Button variant="ghost" className="w-fit text-background hover:bg-background/10 hover:text-background" nativeButton={false} render={<Link href="/wyjazdy" />}><ArrowLeft data-icon="inline-start" />Wszystkie wyjazdy</Button>
          <div className="mt-auto flex max-w-3xl flex-col gap-5 pb-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">{trip.city} · {trip.country}</p>
            <h1 className="text-balance font-sans text-5xl font-black uppercase leading-none md:text-7xl">{trip.title}</h1>
            <div className="flex flex-wrap gap-5 text-sm font-semibold"><span className="flex items-center gap-2"><CalendarDays className="text-primary" />{date}</span><span className="flex items-center gap-2"><MapPin className="text-primary" />Wyloty z Polski</span></div>
            <p className="text-3xl font-black text-primary">od {trip.price.toLocaleString("pl-PL")} zł <span className="text-sm font-normal text-background/65">/ osoba</span></p>
          </div>
        </div>
      </section>
      <section className="px-4 py-20 md:px-6"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr]">
        <div className="flex flex-col gap-8"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Pełny pakiet</p><h2 className="mt-3 font-sans text-4xl font-black uppercase">Wszystko przygotowane</h2><p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{trip.description}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{trip.includes.map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border p-4 font-semibold"><Check className="text-primary" />{item}</div>)}</div>
          <div className="grid gap-4 sm:grid-cols-2">{[[TicketCheck,"Pewne bilety"],[Plane,"Dopasowany lot"],[Headphones,"Koordynator"],[ShieldCheck,"Ubezpieczenie"]].map(([Icon,label]) => { const I=Icon as typeof Plane; return <div key={label as string} className="flex items-center gap-3"><I className="text-primary" /><span>{label as string}</span></div>})}</div>
          <div className="rounded-xl bg-secondary p-6"><h3 className="font-bold uppercase">Ważna informacja</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dokładna godzina meczu może zostać potwierdzona przez ligę bliżej terminu. Program podróży dopasujemy do oficjalnego terminarza.</p></div>
        </div>
        <aside id="rezerwacja" className="rounded-xl bg-foreground p-6 text-background md:p-8"><h2 className="font-sans text-3xl font-black uppercase">Zapytaj o ten wyjazd</h2><p className="mt-3 mb-7 text-sm leading-relaxed text-background/65">W formularzu wpisz „{trip.title}”. Oddzwonimy z dostępnością i wariantami wylotu.</p><InquiryForm /></aside>
      </div></section>
      {gallery.length > 0 && <section className="bg-secondary px-4 py-20 md:px-6"><div className="mx-auto max-w-7xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Zobacz atmosferę</p><h2 className="mt-3 font-sans text-4xl font-black uppercase">Galeria wyjazdu</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{gallery.map((item, index) => <figure key={item.id} className={`overflow-hidden rounded-xl bg-card ${index === 0 ? "sm:col-span-2" : ""}`}><div className={`relative ${index === 0 ? "aspect-[2/1]" : "aspect-[4/3]"}`}><Image src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || `Zdjęcie z wyjazdu ${trip.title}`} fill className="object-cover" sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"} /></div>{item.caption && <figcaption className="p-4 text-sm text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div></div></section>}
      <SiteFooter />
    </main>
  )
}
