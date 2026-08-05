import Link from "next/link"
import { desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ArrowLeft, Inbox, LogOut, Plane, Users } from "lucide-react"
import { signOutAdmin } from "@/app/actions/auth"
import { toggleTripStatus, updateInquiryStatus } from "@/app/actions/admin"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"
import { inquiries, trips } from "@/lib/db/schema"
import { getAuth, isAuthConfigured } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!isAuthConfigured()) return <SetupRequired />
  const { data } = await getAuth().getSession()
  if (!data?.user) redirect("/auth/sign-in")

  const [allTrips, allInquiries] = await Promise.all([
    db.select().from(trips).orderBy(desc(trips.startDate)),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(50),
  ])
  const newLeads = allInquiries.filter((item) => item.status === "new").length

  return <main className="min-h-screen bg-secondary">
    <header className="border-b bg-foreground text-background"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Let&apos;s Gol</p><h1 className="font-sans text-xl font-black uppercase">Centrum dowodzenia</h1></div><div className="flex items-center gap-2"><Button variant="ghost" className="text-background hover:bg-background/10 hover:text-background" nativeButton={false} render={<Link href="/" />}><ArrowLeft data-icon="inline-start" />Strona</Button><form action={signOutAdmin}><Button variant="outline" type="submit" className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"><LogOut data-icon="inline-start" />Wyloguj</Button></form></div></div></header>
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
      <div className="grid gap-4 md:grid-cols-3"><Metric icon={Plane} label="Aktywne wyjazdy" value={allTrips.filter((item)=>item.status === "published").length} /><Metric icon={Inbox} label="Nowe zapytania" value={newLeads} /><Metric icon={Users} label="Wszystkie leady" value={allInquiries.length} /></div>
      <Card><CardHeader><CardTitle>Wyjazdy</CardTitle><CardDescription>Publikuj i ukrywaj oferty widoczne w katalogu.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Oferta</TableHead><TableHead>Termin</TableHead><TableHead>Cena</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Akcja</TableHead></TableRow></TableHeader><TableBody>{allTrips.map((trip)=><TableRow key={trip.id}><TableCell><strong>{trip.title}</strong><span className="block text-xs text-muted-foreground">{trip.city}</span></TableCell><TableCell>{trip.startDate}</TableCell><TableCell>{trip.price.toLocaleString("pl-PL")} zł</TableCell><TableCell><Badge variant={trip.status === "published" ? "default" : "secondary"}>{trip.status === "published" ? "Opublikowany" : "Szkic"}</Badge></TableCell><TableCell className="text-right"><form action={toggleTripStatus}><input type="hidden" name="id" value={trip.id} /><input type="hidden" name="current" value={trip.status} /><Button variant="outline" size="sm" type="submit">{trip.status === "published" ? "Ukryj" : "Opublikuj"}</Button></form></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      <Card><CardHeader><CardTitle>Zapytania klientów</CardTitle><CardDescription>50 ostatnich formularzy przesłanych przez stronę.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Klient</TableHead><TableHead>Mecz</TableHead><TableHead>Podróż</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Akcja</TableHead></TableRow></TableHeader><TableBody>{allInquiries.map((lead)=><TableRow key={lead.id}><TableCell><strong>{lead.name}</strong><span className="block text-xs text-muted-foreground">{lead.email} · {lead.phone}</span></TableCell><TableCell>{lead.matchName}<span className="block max-w-xs truncate text-xs text-muted-foreground">{lead.message}</span></TableCell><TableCell>{lead.departureCity} · {lead.travelers} os.</TableCell><TableCell><Badge variant={lead.status === "new" ? "default" : "secondary"}>{lead.status}</Badge></TableCell><TableCell className="text-right"><form action={updateInquiryStatus} className="flex justify-end gap-2"><input type="hidden" name="id" value={lead.id} /><select name="status" defaultValue={lead.status} className="h-8 rounded-md border bg-background px-2 text-sm"><option value="new">Nowe</option><option value="contacted">Kontakt</option><option value="closed">Zamknięte</option></select><Button size="sm" type="submit">Zapisz</Button></form></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    </div>
  </main>
}

function Metric({ icon: Icon, label, value }: { icon: typeof Plane; label: string; value: number }) { return <Card><CardContent className="flex items-center gap-4 p-6"><span className="flex size-12 items-center justify-center rounded-lg bg-primary"><Icon /></span><div><p className="text-3xl font-black">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></CardContent></Card> }

function SetupRequired() { return <main className="flex min-h-screen items-center justify-center bg-secondary px-4"><div className="w-full max-w-xl"><Alert><AlertTitle>Panel oczekuje na aktywację logowania</AlertTitle><AlertDescription>Interfejs, baza i operacje administratora są gotowe. Aby bezpiecznie uruchomić sesje Neon Auth, dodaj w Vars zmienną NEON_AUTH_COOKIE_SECRET o długości co najmniej 32 losowych znaków, a następnie utwórz użytkownika w Neon Auth.</AlertDescription></Alert><Button className="mt-5" nativeButton={false} render={<Link href="/" />}>Wróć na stronę</Button></div></main> }
