"use client"

import Link from "next/link"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { Archive, BookOpen, Clapperboard, Copy, ExternalLink, FileImage, HelpCircle, Home, Inbox, KeyRound, LayoutDashboard, LogOut, Pencil, Plane, Plus, RefreshCw, Search, Settings, Star, Upload, Users } from "lucide-react"
import { toast } from "sonner"
import { archiveTestimonial, addGalleryItem, type AddGalleryItemState, duplicateTrip, removeGalleryItem, type SaveSettingsState, type SaveTripState, saveSettings, saveTestimonial, saveTrip, setTripCover, setTripStatus, type SyncYouTubeState, syncYouTubeNow, type UpdateGalleryItemState, updateGalleryItem, updateTripGalleryItem, updateInquiry, updateMedia, uploadMedia } from "@/app/actions/admin"
import { changeAdminPassword, type ChangePasswordState, signOutAdmin } from "@/app/actions/auth"
import { DescriptionEditor } from "@/components/description-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DeleteTripDialog } from "@/components/delete-trip-dialog"

export type AdminData = {
  trips: any[]; inquiries: any[]; testimonials: any[]; media: any[]; gallery: any[]; tripGallery: any[]; settings: Record<string, string>; activity: any[]; videos: any[]; email: string
}

const sections = [
  ["dashboard", "Pulpit", LayoutDashboard], ["trips", "Wyjazdy", Plane], ["media", "Media i galerie", FileImage],
  ["content", "Treści strony", BookOpen], ["testimonials", "Opinie", Star], ["youtube", "YouTube", Clapperboard],
  ["inquiries", "Zapytania", Inbox], ["account", "Bezpieczeństwo", Settings],
] as const

export function AdminDashboard({ data }: { data: AdminData }) {
  const [query, setQuery] = useState("")
  const filteredTrips = useMemo(() => data.trips.filter((trip) => `${trip.title} ${trip.city}`.toLowerCase().includes(query.toLowerCase())), [data.trips, query])
  const newLeads = data.inquiries.filter((item) => item.status === "new").length

  return <Tabs defaultValue="dashboard" orientation="vertical" className="min-h-screen gap-0 bg-muted/40 lg:flex-row">
    <aside className="border-b bg-foreground text-background lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 border-b border-background/10 px-5 py-5">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Let&apos;s Gol</p><p className="font-sans text-lg font-black uppercase">Centrum dowodzenia</p></div>
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/" />} className="text-background hover:bg-background/10 hover:text-background"><Home /><span className="sr-only">Strona główna</span></Button>
      </div>
      <TabsList variant="line" className="flex h-auto w-full flex-row justify-start overflow-x-auto rounded-none bg-transparent p-3 text-background/70 lg:flex-col lg:items-stretch">
        {sections.map(([value, label, Icon]) => <TabsTrigger key={value} value={value} className="min-w-max justify-start px-3 py-2.5 text-background/65 transition-all duration-200 hover:translate-x-1 hover:bg-background/10 hover:text-background data-active:text-primary"><Icon />{label}{value === "inquiries" && newLeads > 0 ? <Badge className="ml-auto">{newLeads}</Badge> : null}</TabsTrigger>)}
      </TabsList>
      <div className="hidden border-t border-background/10 p-4 lg:block"><p className="truncate text-xs text-background/50">{data.email}</p><form action={signOutAdmin}><Button type="submit" variant="ghost" className="mt-2 w-full justify-start text-background hover:bg-background/10 hover:text-background"><LogOut />Wyloguj</Button></form></div>
    </aside>

    <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
      <TabsContent value="dashboard"><SectionHeader eyebrow="Przegląd" title="Pulpit" description="Najważniejsze informacje i szybkie akcje w jednym miejscu." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Plane} label="Opublikowane" value={data.trips.filter((t) => t.status === "published").length} /><Metric icon={Archive} label="Szkice i archiwum" value={data.trips.filter((t) => t.status !== "published").length} /><Metric icon={Inbox} label="Nowe zapytania" value={newLeads} /><Metric icon={FileImage} label="Pliki w bibliotece" value={data.media.length} /></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_.7fr]"><Card><CardHeader><CardTitle>Szybkie działania</CardTitle><CardDescription>Najczęściej używane operacje.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><TripDialog trigger={<Button><Plus />Nowy wyjazd</Button>} /><Button variant="outline" onClick={() => document.querySelector<HTMLElement>('[data-value="media"]')?.click()}><Upload />Dodaj zdjęcia</Button><Button variant="outline" onClick={() => document.querySelector<HTMLElement>('[data-value="content"]')?.click()}><BookOpen />Edytuj stronę</Button></CardContent></Card><Card><CardHeader><CardTitle>Ostatnia aktywność</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{data.activity.slice(0, 6).map((item) => <div key={item.id} className="border-b pb-3 last:border-0"><p className="font-medium">{item.action} · {item.entityType}</p><p className="text-xs text-muted-foreground">{item.details || item.entityId || "Zmiana w panelu"}</p></div>)}</CardContent></Card></div>
      </TabsContent>

      <TabsContent value="trips"><SectionHeader eyebrow="Oferta" title="Wyjazdy" description="Twórz, edytuj, publikuj, duplikuj i archiwizuj oferty." action={<TripDialog trigger={<Button><Plus />Nowy wyjazd</Button>} />} />
        <Card><CardContent className="pt-6"><div className="mb-5 flex max-w-md items-center gap-2"><Search className="text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj po nazwie lub mieście" /></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Oferta</TableHead><TableHead>Termin</TableHead><TableHead>Cena</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Operacje</TableHead></TableRow></TableHeader><TableBody>{filteredTrips.map((trip) => <TableRow key={trip.id}><TableCell><strong>{trip.title}</strong><span className="block text-xs text-muted-foreground">{trip.city}, {trip.country}</span></TableCell><TableCell>{trip.startDate}{trip.endDate ? ` – ${trip.endDate}` : ""}</TableCell><TableCell>{trip.price.toLocaleString("pl-PL")} zł</TableCell><TableCell><StatusBadge status={trip.status} /></TableCell><TableCell><div className="flex justify-end gap-2"><TripDialog trip={trip} trigger={<Button size="icon-sm" variant="outline"><Pencil /><span className="sr-only">Edytuj</span></Button>} /><form action={duplicateTrip}><input type="hidden" name="id" value={trip.id} /><Button type="submit" size="icon-sm" variant="outline"><Copy /><span className="sr-only">Duplikuj</span></Button></form><form action={setTripStatus}><input type="hidden" name="id" value={trip.id} /><input type="hidden" name="status" value={trip.status === "published" ? "draft" : "published"} /><Button type="submit" size="sm" variant="outline">{trip.status === "published" ? "Ukryj" : "Publikuj"}</Button></form><form action={setTripStatus}><input type="hidden" name="id" value={trip.id} /><input type="hidden" name="status" value="archived" /><Button type="submit" size="icon-sm" variant="ghost"><Archive /><span className="sr-only">Archiwizuj</span></Button></form><DeleteTripDialog
  tripId={trip.id}
  tripTitle={trip.title}
  /></div>
  </TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
      </TabsContent>

      <TabsContent value="media"><SectionHeader eyebrow="Biblioteka" title="Media i galerie" description="Wgrywaj zdjęcia raz i wykorzystuj je w wielu miejscach." />
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]"><Card><CardHeader><CardTitle>Wgraj zdjęcie</CardTitle><CardDescription>JPEG, PNG, WebP lub AVIF, maksymalnie 15 MB. Plik zostanie automatycznie zoptymalizowany.</CardDescription></CardHeader><CardContent><form action={uploadMedia} className="flex flex-col gap-4"><Field label="Plik"><Input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></Field><Field label="Opis alternatywny"><Input name="alt" placeholder="Kibice na stadionie w Mediolanie" /></Field><Button type="submit"><Upload />Wgraj do biblioteki</Button></form></CardContent></Card><div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">{data.media.map((asset) => <Card key={asset.id} className="overflow-hidden"><img src={`/api/media/${asset.id}`} alt={asset.alt || asset.originalName} className="aspect-video w-full object-cover" /><CardContent className="flex flex-col gap-3 pt-4"><p className="truncate font-medium">{asset.originalName}</p><p className="text-xs text-muted-foreground">{Math.round(asset.size / 1024)} KB · ID {asset.id}</p><form action={updateMedia} className="flex gap-2"><input type="hidden" name="id" value={asset.id} /><Input name="alt" defaultValue={asset.alt} placeholder="Tekst alternatywny" /><Button type="submit" size="sm">Zapisz</Button></form><div className="grid grid-cols-2 gap-2"><GalleryDialog asset={asset} trips={data.trips} /><form action={deleteMedia}><input type="hidden" name="id" value={asset.id} /><Button type="submit" className="w-full" variant="ghost" size="sm">Usuń</Button></form></div></CardContent></Card>)}</div></div>
        <Card className="mt-6"><CardHeader><CardTitle>Galeria strony głównej</CardTitle><CardDescription>Opublikowane zdjęcia pojawią się automatycznie na stronie.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.gallery.map((item) => <div key={item.id} className="overflow-hidden rounded-xl border"><img src={item.mediaId ? `/api/media/${item.mediaId}` : item.image} alt={item.alt || item.title} className="aspect-video w-full object-cover" /><div className="flex flex-col gap-3 p-3"><div><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.city}</p></div><div className="flex gap-2"><EditGalleryItemDialog item={item} /><form action={removeGalleryItem}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="scope" value="global" /><Button type="submit" size="sm" variant="ghost">Usuń</Button></form></div></div></div>)}</CardContent></Card>
        <Card className="mt-6"><CardHeader><CardTitle>Galerie wyjazdów</CardTitle><CardDescription>Zdjęcia przypisane do poszczególnych ofert.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6">{data.trips.filter((trip) => data.tripGallery.some((item) => item.tripId === trip.id)).map((trip) => <section key={trip.id}><h3 className="mb-3 font-bold">{trip.title}</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{data.tripGallery.filter((item) => item.tripId === trip.id).map((item) => <div key={item.id} className="overflow-hidden rounded-xl border"><img src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || trip.title} className="aspect-video w-full object-cover" /><div className="flex flex-col gap-3 p-3"><div><p className="truncate text-sm font-medium">{item.caption || "Bez podpisu"}</p><p className="text-xs text-muted-foreground">{trip.city}</p></div><div className="flex gap-2"><EditTripGalleryItemDialog item={item} city={trip.city} /><form action={removeGalleryItem}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="scope" value="trip" /><Button type="submit" size="sm" variant="ghost">Usuń</Button></form></div></div></div>)}</div></section>)}</CardContent></Card>
      </TabsContent>

      <TabsContent value="content"><SectionHeader eyebrow="Mini-CMS" title="Treści strony" description="Zmień kluczowe komunikaty bez edycji kodu." /><SettingsForm settings={data.settings} /></TabsContent>
      <TabsContent value="testimonials"><SectionHeader eyebrow="Wiarygodność" title="Opinie klientów" description="Publikuj i porządkuj rekomendacje." action={<TestimonialDialog trigger={<Button><Plus />Dodaj opinię</Button>} />} /><div className="grid gap-4 lg:grid-cols-2">{data.testimonials.map((item) => <Card key={item.id}><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>{item.author}</CardTitle><CardDescription>{item.tripName} · {"★".repeat(item.rating)}</CardDescription></div><StatusBadge status={item.status} /></div></CardHeader><CardContent><p className="mb-4 text-muted-foreground">{item.content}</p><div className="flex gap-2"><TestimonialDialog item={item} trigger={<Button variant="outline" size="sm"><Pencil />Edytuj</Button>} /><form action={archiveTestimonial}><input type="hidden" name="id" value={item.id} /><Button type="submit" variant="ghost" size="sm"><Archive />Archiwizuj</Button></form></div></CardContent></Card>)}</div></TabsContent>
      <TabsContent value="youtube"><SectionHeader eyebrow="Kanał wideo" title="YouTube" description="Podaj adres kanału, a najnowsze filmy pojawią się na stronie głównej." /><div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Card><CardHeader><CardTitle>Konfiguracja kanału</CardTitle><CardDescription>Obsługiwane są adresy /channel/UC…, /@nazwa oraz /user/nazwa.</CardDescription></CardHeader><CardContent><YouTubeSettingsForm settings={data.settings} /></CardContent><CardFooter className="flex flex-col items-start gap-3 border-t pt-5"><YouTubeSyncStatus lastSyncedAt={data.settings.youtubeLastSyncedAt} lastSyncStatus={data.settings.youtubeLastSyncStatus} /></CardFooter></Card><Card><CardHeader><CardTitle>Podgląd najnowszych filmów</CardTitle><CardDescription>{data.videos.length ? `Pobrano ${data.videos.length} filmów z kanału.` : "Po zapisaniu poprawnego kanału zobaczysz tutaj podgląd."}</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">{data.videos.map((video) => <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border"><img src={video.thumbnail} alt={video.title} className="aspect-video w-full object-cover" /><div className="flex gap-3 p-3"><p className="line-clamp-2 flex-1 text-sm font-medium">{video.title}</p><ExternalLink className="shrink-0 text-primary" /></div></a>)}</CardContent></Card></div></TabsContent>

      <TabsContent value="inquiries"><SectionHeader eyebrow="Sprzedaż" title="Zapytania klientów" description="Obsługuj zgłoszenia, notatki i status kontaktu." action={<Button variant="outline" nativeButton={false} render={<a href="/api/admin/inquiries.csv" />}><ExternalLink />Eksportuj CSV</Button>} /><div className="flex flex-col gap-4">{data.inquiries.map((lead) => <Card key={lead.id}><CardContent className="grid gap-5 pt-6 lg:grid-cols-[1fr_1.4fr_auto]"><div><div className="flex items-center gap-2"><strong>{lead.name}</strong><StatusBadge status={lead.status} /></div><a className="block text-sm text-primary underline-offset-4 hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a><a className="text-sm text-primary underline-offset-4 hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></div><div><p className="font-medium">{lead.matchName}</p><p className="text-sm text-muted-foreground">{lead.departureCity} · {lead.travelers} os.</p><p className="mt-2 text-sm">{lead.message || "Brak dodatkowej wiadomości."}</p></div><form action={updateInquiry} className="flex min-w-72 flex-col gap-2"><input type="hidden" name="id" value={lead.id} /><select name="status" defaultValue={lead.status} className="h-9 rounded-lg border bg-background px-3"><option value="new">Nowe</option><option value="contacted">Skontaktowano</option><option value="closed">Zamknięte</option></select><Textarea name="adminNote" defaultValue={lead.adminNote} placeholder="Notatka wewnętrzna" rows={2} /><Button type="submit" size="sm">Zapisz obsługę</Button></form></CardContent></Card>)}</div></TabsContent>

      <TabsContent value="account"><SectionHeader eyebrow="Konto" title="Bezpieczeństwo" description="Zmień hasło administratora i chroń dostęp do panelu." /><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Zmiana hasła</CardTitle><CardDescription>Nowe hasło powinno mieć co najmniej 12 znaków.</CardDescription></CardHeader><CardContent><ChangePasswordForm /></CardContent></Card><Card><CardHeader><CardTitle>Administrator</CardTitle></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">M</span><div><p className="font-medium">{data.email}</p><p className="text-sm text-muted-foreground">Pełny dostęp do panelu</p></div></div><p className="text-sm text-muted-foreground">Dostęp jest dodatkowo ograniczony do zatwierdzonego adresu e-mail oraz zaufanych domen Neon Auth.</p></CardContent></Card></div></TabsContent>
    </main>
  </Tabs>
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h1 className="text-balance font-sans text-3xl font-black uppercase md:text-4xl">{title}</h1><p className="mt-1 text-muted-foreground">{description}</p></div>{action}</header> }
function Metric({ icon: Icon, label, value }: { icon: typeof Plane; label: string; value: number }) { return <Card><CardContent className="flex items-center gap-4 pt-6"><span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Icon /></span><div><p className="text-3xl font-black">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></CardContent></Card> }
function StatusBadge({ status }: { status: string }) { const labels: Record<string, string> = { published: "Opublikowane", draft: "Szkic", archived: "Archiwum", new: "Nowe", contacted: "Kontakt", closed: "Zamknięte" }; return <Badge variant={status === "published" || status === "new" ? "default" : "secondary"}>{labels[status] || status}</Badge> }
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <div className="flex flex-col gap-2"><Label className="flex items-center gap-2">{label}{hint ? <span title={hint} aria-label={hint} className="cursor-help text-muted-foreground"><HelpCircle className="size-4" /></span> : null}</Label>{children}{hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}</div> }

const initialSaveSettingsState: SaveSettingsState = {}

function YouTubeSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, action, pending] = useActionState(saveSettings, initialSaveSettingsState)
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Link do kanału"><Input name="setting.youtubeUrl" type="url" defaultValue={settings.youtubeUrl} placeholder="https://www.youtube.com/@twojkanal" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Liczba filmów"><Input name="setting.youtubeLimit" type="number" min="1" max="12" defaultValue={settings.youtubeLimit || "6"} /></Field>
        <Field label="Widoczność"><select name="setting.youtubeEnabled" defaultValue={settings.youtubeEnabled || "true"} className="h-9 rounded-lg border bg-background px-3"><option value="true">Sekcja włączona</option><option value="false">Sekcja wyłączona</option></select></Field>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Zapisano konfigurację.</p>}
      <Button type="submit" className="self-start" disabled={pending}><Clapperboard />{pending ? "Zapisuję…" : "Zapisz konfigurację"}</Button>
    </form>
  )
}

const initialSyncState: SyncYouTubeState = {}

function YouTubeSyncStatus({ lastSyncedAt, lastSyncStatus }: { lastSyncedAt?: string; lastSyncStatus?: string }) {
  const [state, action, pending] = useActionState(syncYouTubeNow, initialSyncState)
  const formRef = useRef<HTMLFormElement>(null)
  const automaticSyncStarted = useRef(false)
  const formatted = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" })
    : null

  useEffect(() => {
    if (automaticSyncStarted.current) return
    const lastSyncTime = lastSyncedAt ? new Date(lastSyncedAt).getTime() : 0
    const isStale = !lastSyncTime || Date.now() - lastSyncTime >= 24 * 60 * 60 * 1000
    const lastAttemptFailed = lastSyncStatus?.startsWith("Błąd:") ?? false
    if (!isStale && !lastAttemptFailed) return

    automaticSyncStarted.current = true
    formRef.current?.requestSubmit()
  }, [lastSyncedAt, lastSyncStatus])

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Lista filmów odświeża się automatycznie raz dziennie. Jeśli nocna próba się nie powiedzie, panel ponowi ją automatycznie po otwarciu.
      </p>
      <p className="text-sm">
        Ostatnie odświeżenie: <span className="font-medium text-foreground">{formatted ?? "jeszcze nie wykonano"}</span>
      </p>
      {lastSyncStatus && <p className="text-sm text-muted-foreground">Status: {lastSyncStatus}</p>}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Lista filmów została odświeżona.</p>}
      <form ref={formRef} action={action}>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          <RefreshCw className={pending ? "animate-spin" : ""} />
          {pending ? "Odświeżam…" : "Odśwież teraz"}
        </Button>
      </form>
    </div>
  )
}

const initialPasswordState: ChangePasswordState = {}

function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeAdminPassword, initialPasswordState)

  return (
    <form key={state.success ? "done" : "form"} action={action} className="flex flex-col gap-4">
      <Field label="Aktualne hasło"><Input name="currentPassword" type="password" autoComplete="current-password" required /></Field>
      <Field label="Nowe hasło"><Input name="newPassword" type="password" minLength={12} autoComplete="new-password" required /></Field>
      <Field label="Powtórz nowe hasło"><Input name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required /></Field>
      <label className="flex items-center gap-2 text-sm"><input name="revokeOtherSessions" type="checkbox" defaultChecked />Wyloguj pozostałe sesje</label>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Hasło zostało zmienione.</p>}
      <Button type="submit" disabled={pending}><KeyRound />{pending ? "Zmieniam…" : "Zmień hasło"}</Button>
    </form>
  )
}

const initialTripState: SaveTripState = {}

function TripDialog({ trip, trigger }: { trip?: any; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(saveTrip, initialTripState)
  useEffect(() => {
    if (!state.success) return
    toast.success(trip ? "Zmiany wyjazdu zostały zapisane." : "Nowy wyjazd został zapisany.")
    setOpen(false)
  }, [state.success, trip])

  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={trigger as React.ReactElement} /><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{trip ? "Edytuj wyjazd" : "Nowy wyjazd"}</DialogTitle><DialogDescription>Uzupełnij ofertę. Pod każdym polem znajdziesz krótką podpowiedź.</DialogDescription></DialogHeader><form action={action} className="grid gap-4 sm:grid-cols-2">{trip && <input type="hidden" name="id" value={trip.id} />}<Field label="Tytuł" hint="Pełna nazwa widoczna na karcie, np. Real Madryt vs Barcelona."><Input name="title" defaultValue={trip?.title} required /></Field><Field label="Slug URL" hint="Adres podstrony. Zostaw puste, aby utworzył się automatycznie z tytułu."><Input name="slug" defaultValue={trip?.slug} placeholder="utworzy-sie-automatycznie" /></Field><Field label="Miasto" hint="Miasto, w którym odbywa się mecz."><Input name="city" defaultValue={trip?.city} required /></Field><Field label="Kraj" hint="Kraj docelowy wyjazdu."><Input name="country" defaultValue={trip?.country} required /></Field><Field label="Cena od (zł)" hint="Najniższa cena pakietu za jedną osobę."><Input name="price" type="number" min="0" defaultValue={trip?.price} required /></Field><Field label="Status" hint="Szkic jest niewidoczny, opublikowany widoczny, archiwalny zachowuje dane bez publikacji."><select name="status" defaultValue={trip?.status || "draft"} className="h-9 rounded-lg border bg-background px-3"><option value="draft">Szkic</option><option value="published">Opublikowany</option><option value="archived">Archiwalny</option></select></Field><Field label="Data rozpoczęcia" hint="Pierwszy dzień wyjazdu."><Input name="startDate" type="date" defaultValue={trip?.startDate} required /></Field><Field label="Data zakończenia" hint="Ostatni dzień wyjazdu; pole może pozostać puste."><Input name="endDate" type="date" defaultValue={trip?.endDate} /></Field><Field label="Kolejność" hint="Niższa liczba oznacza wcześniejsze miejsce wśród ofert o takim samym wyróżnieniu."><Input name="sortOrder" type="number" defaultValue={trip?.sortOrder || 0} /></Field><div className="sm:col-span-2"><Field label="Zdjęcie główne z urządzenia" hint="Wybierz zdjęcie z komputera lub galerii telefonu. JPEG, PNG, WebP lub AVIF, maks. 8 MB."><Input name="coverFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></Field>{trip?.image ? <input type="hidden" name="image" value={trip.image} /> : null}</div><div className="sm:col-span-2"><DescriptionEditor name="description" defaultValue={trip?.description} /></div><div className="sm:col-span-2"><Field label="Pakiet zawiera" hint="Wpisz jeden element pakietu w każdej linii."><Textarea name="includes" defaultValue={trip?.includes?.join("\n")} rows={5} /></Field></div><Field label="Tytuł SEO" hint="Tytuł w Google. Najlepiej około 50–60 znaków; pusty użyje tytułu wyjazdu."><Input name="seoTitle" defaultValue={trip?.seoTitle} maxLength={70} /></Field><Field label="Opis SEO" hint="Krótki opis dla wyników Google. Najlepiej 140–160 znaków."><Textarea name="seoDescription" defaultValue={trip?.seoDescription} rows={3} maxLength={180} /></Field><label className="flex items-start gap-2 text-sm sm:col-span-2"><input name="featured" type="checkbox" defaultChecked={trip?.featured} className="mt-1" /><span><strong>Wyróżnij wyjazd</strong><span className="block text-xs leading-relaxed text-muted-foreground">Oferta pojawi się przed pozostałymi i otrzyma etykietę „Polecany wyjazd”.</span></span></label>{state.error ? <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}<DialogFooter className="sm:col-span-2"><Button type="submit" disabled={pending}>{pending ? "Zapisuję…" : "Zapisz wyjazd"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function LegacyTripDialog({ trip, trigger }: { trip?: any; trigger: React.ReactNode }) { return <Dialog><DialogTrigger render={trigger as React.ReactElement} /><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{trip ? "Edytuj wyjazd" : "Nowy wyjazd"}</DialogTitle><DialogDescription>Uzupełnij ofertę, termin, zawartość pakietu i ustawienia publikacji.</DialogDescription></DialogHeader><form action={async (formData) => { await saveTrip({}, formData) }} className="grid gap-4 sm:grid-cols-2">{trip && <input type="hidden" name="id" value={trip.id} />}<Field label="Tytuł"><Input name="title" defaultValue={trip?.title} required /></Field><Field label="Slug URL"><Input name="slug" defaultValue={trip?.slug} placeholder="utworzy-sie-automatycznie" /></Field><Field label="Przeciwnik / wydarzenie"><Input name="opponent" defaultValue={trip?.opponent} required /></Field><Field label="Miasto"><Input name="city" defaultValue={trip?.city} required /></Field><Field label="Kraj"><Input name="country" defaultValue={trip?.country} required /></Field><Field label="Cena od (zł)"><Input name="price" type="number" min="0" defaultValue={trip?.price} required /></Field><Field label="Data rozpoczęcia"><Input name="startDate" type="date" defaultValue={trip?.startDate} required /></Field><Field label="Data zakończenia"><Input name="endDate" type="date" defaultValue={trip?.endDate} /></Field><Field label="Status"><select name="status" defaultValue={trip?.status || "draft"} className="h-9 rounded-lg border bg-background px-3"><option value="draft">Szkic</option><option value="published">Opublikowany</option><option value="archived">Archiwalny</option></select></Field><Field label="Kolejność"><Input name="sortOrder" type="number" defaultValue={trip?.sortOrder || 0} /></Field><div className="sm:col-span-2"><Field label="Adres zdjęcia głównego"><Input name="image" defaultValue={trip?.image} placeholder="/images/... lub /api/media/ID" /></Field></div><div className="sm:col-span-2"><DescriptionEditor name="description" defaultValue={trip?.description} /></div><div className="sm:col-span-2"><Field label="Pakiet — jeden element w wierszu"><Textarea name="includes" defaultValue={trip?.includes?.join("\n")} rows={5} /></Field></div><Field label="Tytuł SEO"><Input name="seoTitle" defaultValue={trip?.seoTitle} /></Field><Field label="Opis SEO"><Input name="seoDescription" defaultValue={trip?.seoDescription} /></Field><label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={trip?.featured} />Wyróżnij wyjazd</label><DialogFooter className="sm:col-span-2"><Button type="submit">Zapisz wyjazd</Button></DialogFooter></form></DialogContent></Dialog> }

const initialGalleryState: AddGalleryItemState = {}

function GalleryDialog({ asset, trips }: { asset: any; trips: any[] }) {
  const [state, action, pending] = useActionState(addGalleryItem, initialGalleryState)

  return <Dialog><DialogTrigger render={<Button variant="outline" size="sm" />}>Użyj</DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Użyj zdjęcia</DialogTitle><DialogDescription>Dodaj zdjęcie do galerii albo ustaw je jako okładkę wyjazdu.</DialogDescription></DialogHeader><form action={action} className="flex flex-col gap-4"><input type="hidden" name="mediaId" value={asset.id} /><Field label="Miejsce w galerii"><select name="tripId" className="h-9 rounded-lg border bg-background px-3"><option value="0">Galeria strony głównej</option>{trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}</select></Field><Field label="Podpis"><Input name="caption" /></Field><Field label="Miasto (galeria główna)"><Input name="city" /></Field><Field label="Alt"><Input name="alt" defaultValue={asset.alt} /></Field><Field label="Kolejność"><Input name="sortOrder" type="number" defaultValue="0" /></Field>{state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}{state.success && <p role="status" className="text-sm font-medium text-primary">{state.message}</p>}<Button type="submit" disabled={pending}>{pending ? "Dodaję…" : "Dodaj do galerii"}</Button></form><div className="border-t pt-5"><form action={setTripCover} className="flex flex-col gap-4"><input type="hidden" name="mediaId" value={asset.id} /><Field label="Ustaw jako zdjęcie główne"><select name="tripId" className="h-9 rounded-lg border bg-background px-3" required><option value="">Wybierz wyjazd</option>{trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}</select></Field><DialogFooter><Button variant="outline">Ustaw okładkę</Button></DialogFooter></form></div></DialogContent></Dialog>
}

const initialUpdateGalleryState: UpdateGalleryItemState = {}

function EditGalleryItemDialog({ item }: { item: any }) {
  const [state, action, pending] = useActionState(updateGalleryItem, initialUpdateGalleryState)
  return <Dialog><DialogTrigger render={<Button variant="outline" size="sm" />}><Pencil />Edytuj</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edytuj zdjęcie galerii</DialogTitle><DialogDescription>Zmień podpis i miasto wyświetlane przy zdjęciu.</DialogDescription></DialogHeader><form action={action} className="flex flex-col gap-4"><input type="hidden" name="id" value={item.id} /><Field label="Podpis"><Input name="title" defaultValue={item.title} required /></Field><Field label="Miasto"><Input name="city" defaultValue={item.city} /></Field>{state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}{state.success && <p role="status" className="text-sm font-medium text-primary">Zmiany zostały zapisane.</p>}<DialogFooter><Button type="submit" disabled={pending}>{pending ? "Zapisuję…" : "Zapisz zmiany"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function EditTripGalleryItemDialog({ item, city }: { item: any; city: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(updateTripGalleryItem, initialUpdateGalleryState)
  useEffect(() => {
    if (!state.success) return
    toast.success("Dane zdjęcia zostały zapisane.")
    setOpen(false)
  }, [state.success])
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button variant="outline" size="sm" />}><Pencil />Edytuj</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edytuj zdjęcie wyjazdu</DialogTitle><DialogDescription>Miasto wynika z przypisanego wyjazdu. Możesz zmienić podpis i opis alternatywny zdjęcia.</DialogDescription></DialogHeader><form action={action} className="flex flex-col gap-4"><input type="hidden" name="id" value={item.id} /><Field label="Miasto wyjazdu"><Input value={city} disabled /></Field><Field label="Podpis"><Input name="caption" defaultValue={item.caption} maxLength={160} /></Field><Field label="Opis alternatywny"><Input name="alt" defaultValue={item.alt} maxLength={240} placeholder={`Zdjęcie z wyjazdu do ${city}`} /></Field>{state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}<DialogFooter><Button type="submit" disabled={pending}>{pending ? "Zapisuję…" : "Zapisz zmiany"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function TestimonialDialog({ item, trigger }: { item?: any; trigger: React.ReactNode }) { return <Dialog><DialogTrigger render={trigger as React.ReactElement} /><DialogContent><DialogHeader><DialogTitle>{item ? "Edytuj opinię" : "Nowa opinia"}</DialogTitle><DialogDescription>Opinie opublikowane są widoczne na stronie głównej.</DialogDescription></DialogHeader><form action={saveTestimonial} className="flex flex-col gap-4">{item && <input type="hidden" name="id" value={item.id} />}<Field label="Autor"><Input name="author" defaultValue={item?.author} required /></Field><Field label="Wyjazd"><Input name="tripName" defaultValue={item?.tripName} /></Field><Field label="Treść"><Textarea name="content" defaultValue={item?.content} required /></Field><div className="grid grid-cols-3 gap-3"><Field label="Ocena"><Input name="rating" type="number" min="1" max="5" defaultValue={item?.rating || 5} /></Field><Field label="Kolejność"><Input name="sortOrder" type="number" defaultValue={item?.sortOrder || 0} /></Field><Field label="Status"><select name="status" defaultValue={item?.status || "published"} className="h-9 rounded-lg border bg-background px-3"><option value="published">Widoczna</option><option value="draft">Ukryta</option></select></Field></div><DialogFooter><Button>Zapisz opinię</Button></DialogFooter></form></DialogContent></Dialog> }
function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const fields = [["seoTitle", "Tytuł SEO strony", "Let’s Gol — wyjazdy na mecze piłkarskie"], ["seoDescription", "Opis SEO strony", "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora."], ["heroEyebrow", "Nadtytuł hero", "Wyjazdy na największe mecze Europy"], ["heroTitle", "Główny nagłówek", "Ty wybierasz mecz. My organizujemy resztę."], ["heroDescription", "Opis hero", "Bilety, lot, hotel i opieka koordynatora w jednym pakiecie."], ["heroCta", "Przycisk hero", "Zobacz wyjazdy"], ["tripsTitle", "Nagłówek sekcji wyjazdów", "Najbliższe wyjazdy"], ["tripsDescription", "Opis sekcji wyjazdów", "Wybierz gotowy pakiet i zajmij miejsce na trybunach największych stadionów Europy."], ["customTripTitle", "Nagłówek wyjazdu indywidualnego", "Nie ma meczu na liście? Zorganizujemy go dla Ciebie"], ["packageTitle", "Nagłówek pakietu", "Co zawiera pełny pakiet?"], ["benefitsTitle", "Nagłówek przewag", "Let’s Gol pilnuje szczegółów. Ty przeżywasz mecz."], ["processTitle", "Nagłówek procesu", "Jak wygląda rezerwacja?"], ["galleryTitle", "Nagłówek galerii", "Galeria z wyjazdów"], ["testimonialsTitle", "Nagłówek opinii", "Emocje potwierdzone na trybunach"], ["faqTitle", "Nagłówek FAQ", "Najczęstsze pytania"], ["youtubeTitle", "Nagłówek YouTube", "Najnowsze na YouTube"], ["aboutTitle", "Nagłówek O nas", "Jedziemy razem, kibicujemy razem"], ["aboutText", "Opis O nas", "Tworzymy wyjazdy, które zostają w pamięci na lata."], ["contactTitle", "Nagłówek kontaktu", "Jaki mecz chodzi Ci po głowie?"], ["contactEmail", "E-mail kontaktowy", "kontakt@letsgol.pl"], ["contactPhone", "Telefon", "+48 000 000 000"], ["footerText", "Opis w stopce", "Kompleksowe wyjazdy na mecze w Europie."], ["companyName", "Nazwa firmy", "Let's Gol Sp. z o.o."], ["companyAddress", "Adres firmy", "00-100 Warszawa"], ["companyNip", "NIP", "123 456 78 90"]] as const
  const [state, action, pending] = useActionState(saveSettings, initialSaveSettingsState)
  return (
    <Card>
      <CardHeader><CardTitle>Najważniejsze teksty</CardTitle><CardDescription>Puste pola użyją bezpiecznych treści domyślnych.</CardDescription></CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5 md:grid-cols-2">
          {fields.map(([key, label, fallback]) => <Field key={key} label={label}>{key.endsWith("Text") || key.endsWith("Description") ? <Textarea name={`setting.${key}`} defaultValue={settings[key] || fallback} rows={4} /> : <Input name={`setting.${key}`} defaultValue={settings[key] || fallback} />}</Field>)}
          <Field label="Liczba zdjęć w galerii na stronie głównej"><Input name="setting.galleryHomeLimit" type="number" min="1" max="5" defaultValue={settings.galleryHomeLimit || "5"} /></Field>
          <div className="flex flex-col gap-2 md:col-span-2">
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state.success && <p className="text-sm text-primary">Treści strony zostały zapisane.</p>}
            <Button type="submit" className="self-start" disabled={pending}><BookOpen />{pending ? "Zapisuję…" : "Zapisz treści strony"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
