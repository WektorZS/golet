
"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  Archive,
  BookOpen,
  Clapperboard,
  Copy,
  ExternalLink,
  FileImage,
  HelpCircle,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import {
  archiveTestimonial,
  addGalleryItem,
  reorderGalleryItems,
  type AddGalleryItemState,
  deleteMedia,
  duplicateTrip,
  removeGalleryItem,
  type SaveSettingsState,
  type SaveTripState,
  saveSettings,
  saveTestimonial,
  saveTrip,
  setTripCover,
  setTripStatus,
  type SyncYouTubeState,
  syncYouTubeNow,
  type UpdateGalleryItemState,
  updateGalleryItem,
  updateTripGalleryItem,
  updateInquiry,
  updateMedia,
  uploadMedia,
} from "@/app/actions/admin"

import {
  changeAdminPassword,
  type ChangePasswordState,
  signOutAdmin,
} from "@/app/actions/auth"

import { DescriptionEditor } from "@/components/description-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DeleteTripDialog } from "@/components/delete-trip-dialog"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

export type AdminData = {
  trips: any[]
  inquiries: any[]
  testimonials: any[]
  media: any[]
  gallery: any[]
  tripGallery: any[]
  settings: Record<string, string>
  activity: any[]
  videos: any[]
  email: string
}

const sections = [
  ["dashboard", "Pulpit", LayoutDashboard],
  ["trips", "Wyjazdy", Plane],
  ["media", "Media i galerie", FileImage],
  ["content", "Treści strony", BookOpen],
  ["testimonials", "Opinie", Star],
  ["youtube", "YouTube", Clapperboard],
  ["inquiries", "Zapytania", Inbox],
  ["account", "Bezpieczeństwo", Settings],
] as const

const formatActivityDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function SortableGalleryItem({
  item,
  children,
}: {
  item: { id: number }
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
}

export function AdminDashboard({ data }: { data: AdminData }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState<(typeof sections)[number][0]>("dashboard")
  const [galleryItems, setGalleryItems] = useState(data.gallery)

  useEffect(() => {
    const savedSection = window.sessionStorage.getItem("admin-active-section")
    if (sections.some(([value]) => value === savedSection)) {
      setActiveSection(savedSection as (typeof sections)[number][0])
    }
  }, [])

  useEffect(() => {
    setGalleryItems(data.gallery)
  }, [data.gallery])

  const handleSectionChange = (value: string) => {
    const section = value as (typeof sections)[number][0]
    setActiveSection(section)
    window.sessionStorage.setItem("admin-active-section", section)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const filteredTrips = useMemo(
    () =>
      data.trips.filter((trip) =>
        `${trip.title} ${trip.city}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [data.trips, query]
  )

  const newLeads = data.inquiries.filter(
    (item) => item.status === "new"
  ).length

  const handleGalleryDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = galleryItems.findIndex(
      (item) => item.id === active.id
    )

    const newIndex = galleryItems.findIndex(
      (item) => item.id === over.id
    )

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(
      galleryItems,
      oldIndex,
      newIndex
    )

    setGalleryItems(reordered)

    const formData = new FormData()

    formData.append("scope", "global")

    formData.append(
      "items",
      JSON.stringify(
        reordered.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        }))
      )
    )

    await reorderGalleryItems(formData)
    router.refresh()

    toast.success("Kolejność galerii została zapisana")
  }

  return (
    <Tabs
      value={activeSection}
      onValueChange={handleSectionChange}
      orientation="vertical"
      className="min-h-screen gap-0 bg-muted/40 lg:flex-row"
    >
      <aside className="border-b bg-foreground text-background lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 border-b border-background/10 px-5 py-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Let&apos;s Gol
            </p>

            <p className="font-sans text-lg font-black uppercase">
              Centrum dowodzenia
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/" />}
            className="text-background hover:bg-background/10 hover:text-background"
          >
            <Home />
            <span className="sr-only">Strona główna</span>
          </Button>
        </div>

        <TabsList
          variant="line"
          className="flex h-auto w-full flex-row justify-start overflow-x-auto rounded-none bg-transparent p-3 text-background/70 lg:flex-col lg:items-stretch"
        >
          {sections.map(([value, label, Icon]) => (
            <TabsTrigger
              key={value}
              id={`tab-${value}`}
              value={value}
              className="min-w-max justify-start px-3 py-2.5 text-background/65 transition-all duration-200 hover:translate-x-1 hover:bg-background/10 hover:text-background data-active:text-primary"
            >
              <Icon />
              {label}

              {value === "inquiries" && newLeads > 0 ? (
                <Badge className="ml-auto">{newLeads}</Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="hidden border-t border-background/10 p-4 lg:block">
          <p className="truncate text-xs text-background/50">
            {data.email}
          </p>

          <form action={signOutAdmin}>
            <Button
              type="submit"
              variant="ghost"
              className="mt-2 w-full justify-start text-background hover:bg-background/10 hover:text-background"
            >
              <LogOut />
              Wyloguj
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
        <TabsContent value="dashboard">
          <SectionHeader
            eyebrow="Przegląd"
            title="Pulpit"
            description="Najważniejsze informacje i szybkie akcje w jednym miejscu."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={Plane}
              label="Opublikowane"
              value={
                data.trips.filter(
                  (t) => t.status === "published"
                ).length
              }
            />

            <Metric
              icon={Archive}
              label="Szkice wyjazdów"
              value={
                data.trips.filter(
                  (t) => t.status !== "published"
                ).length
              }
            />

            <Metric
              icon={Inbox}
              label="Nowe zapytania"
              value={newLeads}
            />

            <Metric
              icon={FileImage}
              label="Zdjęcia w bibliotece"
              value={data.media.length}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
            <Card>
              <CardHeader>
                <CardTitle>Szybkie działania</CardTitle>
                <CardDescription>
                  Najczęściej używane operacje.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-3">
                <TripDialog
                  trigger={
                    <Button>
                      <Plus />
                      Nowy wyjazd
                    </Button>
                  }
                />

                <Button
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("tab-media")
                      ?.click()
                  }
                >
                  <Upload />
                  Dodaj zdjęcia
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("tab-content")
                      ?.click()
                  }
                >
                  <BookOpen />
                  Edytuj stronę
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ostatnia aktywność</CardTitle>
                <CardDescription>
                  Ostatnie zmiany wykonane w panelu.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col">
                  {data.activity.slice(0, 6).map((item) => {
                    const getActivity = () => {
                      switch (item.action) {
                        case "created":
                          if (item.entityType === "trip") {
                            return {
                              title: "Utworzono wyjazd",
                              description: item.details
                                ? `Dodano wyjazd „${item.details}”.`
                                : "Dodano nowy wyjazd.",
                            }
                          }

                          if (
                            item.entityType ===
                            "testimonial"
                          ) {
                            return {
                              title: "Dodano opinię",
                              description: item.details
                                ? `Dodano opinię klienta „${item.details}”.`
                                : "Dodano nową opinię klienta.",
                            }
                          }

                          return {
                            title: "Utworzono",
                            description:
                              item.details ||
                              "Dodano nowy element.",
                          }

                        case "updated":
                          if (item.entityType === "trip") {
                            return {
                              title: "Zaktualizowano wyjazd",
                              description: item.details
                                ? `Zmieniono dane wyjazdu „${item.details}”.`
                                : "Zmieniono dane wyjazdu.",
                            }
                          }

                          if (
                            item.entityType ===
                            "settings"
                          ) {
                            return {
                              title:
                                "Zaktualizowano treści strony",
                              description:
                                "Zmieniono ustawienia treści strony.",
                            }
                          }

                          if (
                            item.entityType ===
                            "media"
                          ) {
                            return {
                              title:
                                "Zaktualizowano zdjęcie",
                              description:
                                "Zmieniono informacje dotyczące zdjęcia.",
                            }
                          }

                          if (
                            item.entityType ===
                            "gallery"
                          ) {
                            return {
                              title:
                                "Zaktualizowano galerię",
                              description:
                                "Zmieniono informacje dotyczące zdjęcia w galerii.",
                            }
                          }

                          if (
                            item.entityType ===
                            "trip_gallery"
                          ) {
                            return {
                              title:
                                "Zaktualizowano zdjęcie w galerii",
                              description:
                                "Zmieniono informacje dotyczące zdjęcia przypisanego do wyjazdu.",
                            }
                          }

                          if (
                            item.entityType ===
                            "inquiry"
                          ) {
                            return {
                              title:
                                "Zaktualizowano zapytanie",
                              description: item.details
                                ? `Zmieniono status zapytania: ${item.details}.`
                                : "Zmieniono dane zapytania.",
                            }
                          }

                          return {
                            title: "Zaktualizowano",
                            description:
                              item.details ||
                              "Wprowadzono zmianę.",
                          }

                        case "deleted":
                          if (
                            item.entityType ===
                            "trip"
                          ) {
                            return {
                              title:
                                "Usunięto wyjazd",
                              description: item.details
                                ? `Usunięto wyjazd „${item.details}”.`
                                : "Wyjazd został usunięty.",
                            }
                          }

                          if (
                            item.entityType ===
                            "media"
                          ) {
                            return {
                              title:
                                "Usunięto zdjęcie",
                              description: item.details
                                ? `Usunięto zdjęcie „${item.details}”.`
                                : "Zdjęcie zostało usunięte z biblioteki.",
                            }
                          }

                          return {
                            title: "Usunięto",
                            description:
                              item.details ||
                              "Element został usunięty.",
                          }

                        case "uploaded":
                          return {
                            title: "Wgrano zdjęcie",
                            description: item.details
                              ? `Dodano zdjęcie „${item.details}” do biblioteki.`
                              : "Dodano nowe zdjęcie do biblioteki.",
                          }

                        case "duplicated":
                          return {
                            title:
                              "Zduplikowano wyjazd",
                            description: item.details
                              ? `Utworzono kopię wyjazdu „${item.details}”.`
                              : "Utworzono kopię wyjazdu.",
                          }

                        case "published":
                          return {
                            title:
                              "Opublikowano wyjazd",
                            description: item.details
                              ? `Wyjazd „${item.details}” jest teraz widoczny na stronie.`
                              : "Wyjazd został opublikowany.",
                          }

                        case "draft":
                          return {
                            title: "Ukryto wyjazd",
                            description: item.details
                              ? `Wyjazd „${item.details}” został ukryty na stronie.`
                              : "Wyjazd został przeniesiony do szkiców.",
                          }

                        case "synced":
                          return {
                            title:
                              "Odświeżono filmy YouTube",
                            description:
                              item.details ||
                              "Lista filmów YouTube została zaktualizowana.",
                          }

                        case "updated_cover":
                          return {
                            title:
                              "Zmieniono zdjęcie główne",
                            description:
                              "Zmieniono zdjęcie główne wyjazdu.",
                          }

                        case "added":
                          if (
                            item.entityType ===
                            "trip_gallery"
                          ) {
                            return {
                              title:
                                "Dodano zdjęcie do galerii wyjazdu",
                              description:
                                "Zdjęcie zostało przypisane do galerii wyjazdu.",
                            }
                          }

                          if (
                            item.entityType ===
                            "gallery"
                          ) {
                            return {
                              title:
                                "Dodano zdjęcie do galerii",
                              description:
                                "Zdjęcie zostało dodane do galerii strony głównej.",
                            }
                          }

                          return {
                            title: "Dodano element",
                            description:
                              item.details ||
                              "Dodano nowy element.",
                          }

                        case "removed":
                          if (
                            item.entityType ===
                            "trip_gallery"
                          ) {
                            return {
                              title:
                                "Usunięto zdjęcie z galerii wyjazdu",
                              description:
                                "Zdjęcie zostało usunięte z galerii wyjazdu.",
                            }
                          }

                          if (
                            item.entityType ===
                            "global_gallery"
                          ) {
                            return {
                              title:
                                "Usunięto zdjęcie z galerii",
                              description:
                                "Zdjęcie zostało usunięte z galerii strony głównej.",
                            }
                          }

                          return {
                            title:
                              "Usunięto element z galerii",
                            description:
                              "Element został usunięty z galerii.",
                          }

                        default:
                          return {
                            title:
                              "Wprowadzono zmianę",
                            description:
                              item.details ||
                              "Wykonano zmianę w panelu.",
                          }
                      }
                    }

                    const activity = getActivity()

                    const icon =
                      item.entityType === "trip" ? (
                        <Plane className="size-4" />
                      ) : item.entityType ===
                          "media" ||
                        item.entityType ===
                          "gallery" ||
                        item.entityType ===
                          "trip_gallery" ? (
                        <FileImage className="size-4" />
                      ) : item.entityType ===
                        "inquiry" ? (
                        <Inbox className="size-4" />
                      ) : item.entityType ===
                        "settings" ? (
                        <Settings className="size-4" />
                      ) : item.entityType ===
                        "youtube" ? (
                        <Clapperboard className="size-4" />
                      ) : item.entityType ===
                        "testimonial" ? (
                        <Star className="size-4" />
                      ) : (
                        <RefreshCw className="size-4" />
                      )

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b py-3 last:border-0 first:pt-0 last:pb-0"
                      >
                        <div className="flex shrink-0 items-start justify-center">
                          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {icon}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold leading-5">
                              {activity.title}
                            </p>

                            <time
                              dateTime={new Date(
                                item.createdAt
                              ).toISOString()}
                              className="shrink-0 text-xs text-muted-foreground"
                            >
                              {formatActivityDate(
                                item.createdAt
                              )}
                            </time>
                          </div>

                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips">
          <SectionHeader
            eyebrow="Oferta"
            title="Wyjazdy"
            description="Twórz, edytuj, publikuj, duplikuj i archiwizuj oferty."
            action={
              <TripDialog
                trigger={
                  <Button>
                    <Plus />
                    Nowy wyjazd
                  </Button>
                }
              />
            }
          />

          <Card>
            <CardContent className="pt-6">
              <div className="mb-5 flex max-w-md items-center gap-2">
                <Search className="text-muted-foreground" />

                <Input
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Szukaj po nazwie lub mieście"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Oferta</TableHead>
                      <TableHead>Termin</TableHead>
                      <TableHead>Cena</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        Operacje
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell>
                          <strong>{trip.title}</strong>

                          <span className="block text-xs text-muted-foreground">
                            {trip.city}, {trip.country}
                          </span>
                        </TableCell>

                        <TableCell>
                          {trip.startDate}
                          {trip.endDate
                            ? ` - ${trip.endDate}`
                            : ""}
                        </TableCell>

                        <TableCell>
                          {trip.price.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          zł
                        </TableCell>

                        <TableCell>
                          <StatusBadge
  status={trip.status}
  expired={
    trip.status === "published" &&
    isTripExpired(trip)
  }
/>
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <TripDialog
                              trip={trip}
                              trigger={
                                <Button
                                  size="icon-sm"
                                  variant="outline"
                                >
                                  <Pencil />
                                  <span className="sr-only">
                                    Edytuj
                                  </span>
                                </Button>
                              }
                            />

                            <form
                              action={duplicateTrip}
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={trip.id}
                              />

                              <Button
                                type="submit"
                                size="icon-sm"
                                variant="outline"
                              >
                                <Copy />
                                <span className="sr-only">
                                  Duplikuj
                                </span>
                              </Button>
                            </form>

                            <form action={setTripStatus}>
                              <input
                                type="hidden"
                                name="id"
                                value={trip.id}
                              />

                              <input
                                type="hidden"
                                name="status"
                                value={
                                  trip.status ===
                                  "published"
                                    ? "draft"
                                    : "published"
                                }
                              />

                              <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                              >
                                {trip.status ===
                                "published"
                                  ? "Ukryj"
                                  : "Publikuj"}
                              </Button>
                            </form>

                            <DeleteTripDialog
                              tripId={trip.id}
                              tripTitle={trip.title}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <SectionHeader
            eyebrow="Biblioteka"
            title="Media i galerie"
            description="Wgrywaj zdjęcia raz i wykorzystuj je w wielu miejscach."
          />

          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Dodaj zdjęcie</CardTitle>

                <CardDescription>
                  JPEG, PNG, WebP lub AVIF, maksymalnie 15 MB.
                  Zdjęcie zostanie automatycznie zoptymalizowane.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  action={uploadMedia}
                  className="flex flex-col gap-4"
                >
                  <Field
                    label="Zdjęcie"
                    hint=""
                  >
                    <ImageDropzone
                      name="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      required
                    />
                  </Field>

                  <Field
                    label="Opis zdjęcia"
                    hint="Napisz krótko, co znajduje się na zdjęciu, np. „Kibice na stadionie w Mediolanie”. Nie musisz używać żadnych specjalnych oznaczeń."
                  >
                    <Input
                      name="alt"
                      placeholder="Np. Kibice na stadionie w Mediolanie"
                    />
                  </Field>

                  <Button type="submit">
                    <Upload />
                    Dodaj zdjęcie
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {data.media.map((asset) => (
                <Card
                  key={asset.id}
                  className="overflow-hidden"
                >
                  <img
                    src={`/api/media/${asset.id}`}
                    alt={
                      asset.alt ||
                      asset.originalName
                    }
                    className="aspect-video w-full object-cover"
                  />

                  <CardContent className="flex flex-col gap-3 pt-4">
                    <p className="truncate font-medium">
                      {asset.originalName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        asset.size / 1024
                      )}{" "}
                      KB
                    </p>

                    <form
                      action={updateMedia}
                      className="flex gap-2"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={asset.id}
                      />

                      <Field
                        label="Opis zdjęcia"
                        hint="Krótko opisz, co znajduje się na zdjęciu. Taki opis pomaga również osobom korzystającym z czytników ekranu."
                      >
                        <Input
                          name="alt"
                          defaultValue={asset.alt}
                          placeholder="Np. Kibice podczas meczu"
                        />
                      </Field>

                      <Button
                        type="submit"
                        size="sm"
                      >
                        Zapisz
                      </Button>
                    </form>

                    <div className="grid grid-cols-2 gap-2">
                      <GalleryDialog
                        asset={asset}
                        trips={data.trips}
                      />

                      <form action={deleteMedia}>
                        <input
                          type="hidden"
                          name="id"
                          value={asset.id}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          variant="ghost"
                          size="sm"
                        >
                          Usuń
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Galeria strony głównej
              </CardTitle>

              <CardDescription>
                Przeciągnij zdjęcia, aby zmienić ich kolejność.
                Opublikowane zdjęcia pojawią się automatycznie
                na stronie głównej.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleGalleryDragEnd}
              >
                <SortableContext
                  items={galleryItems.map(
                    (item) => item.id
                  )}
                  strategy={rectSortingStrategy}
                >
                  {galleryItems.map((item) => (
                    <SortableGalleryItem
                      key={item.id}
                      item={item}
                    >
                      <div className="overflow-hidden rounded-xl border">
                        <img
                          src={
                            item.mediaId
                              ? `/api/media/${item.mediaId}`
                              : item.image
                          }
                          alt={
                            item.alt ||
                            item.title
                          }
                          className="aspect-video w-full object-cover"
                        />

                        <div className="flex flex-col gap-3 p-3">
                          <div>
                            <p className="font-medium">
                              {item.title}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {item.city}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <EditGalleryItemDialog
                              item={item}
                            />

                            <form
                              action={removeGalleryItem}
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={item.id}
                              />

                              <input
                                type="hidden"
                                name="scope"
                                value="global"
                              />

                              <Button
                                type="submit"
                                size="sm"
                                variant="ghost"
                              >
                                Usuń
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </SortableGalleryItem>
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Galerie wyjazdów</CardTitle>

              <CardDescription>
                Zdjęcia przypisane do poszczególnych wyjazdów.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              {data.trips
                .filter((trip) =>
                  data.tripGallery.some(
                    (item) =>
                      item.tripId === trip.id
                  )
                )
                .map((trip) => (
                  <section key={trip.id}>
                    <h3 className="mb-3 font-bold">
                      {trip.title}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {data.tripGallery
                        .filter(
                          (item) =>
                            item.tripId ===
                            trip.id
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border"
                          >
                            <img
                              src={`/api/media/${item.mediaId}`}
                              alt={
                                item.alt ||
                                item.caption ||
                                trip.title
                              }
                              className="aspect-video w-full object-cover"
                            />

                            <div className="flex flex-col gap-3 p-3">
                              <div>
                                <p className="truncate text-sm font-medium">
                                  {item.caption ||
                                    "Bez podpisu"}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {trip.city}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <EditTripGalleryItemDialog
                                  item={item}
                                  city={trip.city}
                                />

                                <form
                                  action={
                                    removeGalleryItem
                                  }
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={item.id}
                                  />

                                  <input
                                    type="hidden"
                                    name="scope"
                                    value="trip"
                                  />

                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="ghost"
                                  >
                                    Usuń
                                  </Button>
                                </form>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <SectionHeader
            eyebrow="Treści strony"
            title="Treści strony"
            description="Zmień teksty widoczne na stronie bez edycji kodu."
          />

          <SettingsForm
            settings={data.settings}
          />
        </TabsContent>

        <TabsContent value="testimonials">
          <SectionHeader
            eyebrow="Wiarygodność"
            title="Opinie klientów"
            description="Dodawaj, edytuj i porządkuj opinie klientów."
            action={
              <TestimonialDialog
                trigger={
                  <Button>
                    <Plus />
                    Dodaj opinię
                  </Button>
                }
              />
            }
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {data.testimonials.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>
                        {item.author}
                      </CardTitle>

                      <CardDescription>
                        {item.tripName} ·{" "}
                        {"★".repeat(item.rating)}
                      </CardDescription>
                    </div>

                    <StatusBadge
                      status={item.status}
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    {item.content}
                  </p>

                  <div className="flex gap-2">
                    <TestimonialDialog
                      item={item}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Pencil />
                          Edytuj
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="youtube">
          <SectionHeader
            eyebrow="Kanał wideo"
            title="YouTube"
            description="Dodaj swój kanał, aby najnowsze filmy pojawiały się automatycznie na stronie."
          />

          <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle>
                  Ustawienia kanału YouTube
                </CardTitle>

                <CardDescription>
                  Wklej adres swojego kanału YouTube.
                  Nie musisz znać żadnych technicznych
                  ustawień.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <YouTubeSettingsForm
                  settings={data.settings}
                />
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-3 border-t pt-5">
                <YouTubeSyncStatus
                  lastSyncedAt={
                    data.settings
                      .youtubeLastSyncedAt
                  }
                  lastSyncStatus={
                    data.settings
                      .youtubeLastSyncStatus
                  }
                />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Najnowsze filmy
                </CardTitle>

                <CardDescription>
                  {data.videos.length
                    ? `Pobrano ${data.videos.length} filmów z kanału.`
                    : "Po zapisaniu poprawnego kanału zobaczysz tutaj podgląd filmów."}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                {data.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="aspect-video w-full object-cover"
                    />

                    <div className="flex gap-3 p-3">
                      <p className="line-clamp-2 flex-1 text-sm font-medium">
                        {video.title}
                      </p>

                      <ExternalLink className="shrink-0 text-primary" />
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inquiries">
          <SectionHeader
            eyebrow="Sprzedaż"
            title="Zapytania klientów"
            description="Obsługuj zgłoszenia, notatki i status kontaktu."
            action={
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a href="/api/admin/inquiries.csv" />
                }
              >
                <ExternalLink />
                Pobierz zapytania
              </Button>
            }
          />

          <div className="flex flex-col gap-4">
            {data.inquiries.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="grid gap-5 pt-6 lg:grid-cols-[1fr_1.4fr_auto]">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong>{lead.name}</strong>

                      <StatusBadge
                        status={lead.status}
                      />
                    </div>

                    <a
                      className="block text-sm text-primary underline-offset-4 hover:underline"
                      href={`mailto:${lead.email}`}
                    >
                      {lead.email}
                    </a>

                    <a
                      className="text-sm text-primary underline-offset-4 hover:underline"
                      href={`tel:${lead.phone}`}
                    >
                      {lead.phone}
                    </a>
                  </div>

                  <div>
                    <p className="font-medium">
                      {lead.matchName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {lead.departureCity} ·{" "}
                      {lead.travelers} os.
                    </p>

                    <p className="mt-2 text-sm">
                      {lead.message ||
                        "Brak dodatkowej wiadomości."}
                    </p>
                  </div>

                  <form
                    action={updateInquiry}
                    className="flex min-w-72 flex-col gap-2"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={lead.id}
                    />

                    <Field
                      label="Status kontaktu"
                      hint="Wybierz etap obsługi tego zapytania."
                    >
                      <select
                        name="status"
                        defaultValue={
                          lead.status
                        }
                        className="h-9 rounded-lg border bg-background px-3"
                      >
                        <option value="new">
                          Nowe
                        </option>

                        <option value="contacted">
                          Skontaktowano
                        </option>

                        <option value="closed">
                          Zamknięte
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Notatka dla Ciebie"
                      hint="To prywatna informacja widoczna tylko w panelu administracyjnym."
                    >
                      <Textarea
                        name="adminNote"
                        defaultValue={
                          lead.adminNote
                        }
                        placeholder="Np. Klient czeka na potwierdzenie terminu"
                        rows={2}
                      />
                    </Field>

                    <Button
                      type="submit"
                      size="sm"
                    >
                      Zapisz obsługę
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="account">
          <SectionHeader
            eyebrow="Konto"
            title="Bezpieczeństwo"
            description="Zmień hasło administratora i chroń dostęp do panelu."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Zmiana hasła
                </CardTitle>

                <CardDescription>
                  Nowe hasło powinno mieć co najmniej
                  12 znaków.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Administrator
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">
                    M
                  </span>

                  <div>
                    <p className="font-medium">
                      {data.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Pełny dostęp do panelu
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Dostęp jest dodatkowo ograniczony do
                  zatwierdzonego adresu e-mail oraz
                  zaufanych domen Neon Auth.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </main>
    </Tabs>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="inline-block bg-black px-2.5 py-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>

        <h1 className="text-balance font-sans text-3xl font-black uppercase md:text-4xl">
          {title}
        </h1>

        <p className="mt-1 text-muted-foreground">
          {description}
        </p>
      </div>

      {action}
    </header>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Plane
  label: string
  value: number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon />
        </span>

        <div>
          <p className="text-3xl font-black">
            {value}
          </p>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function isTripExpired(trip: any) {
  if (!trip?.startDate) return false

  const today = new Date()
  const todayString = today.toISOString().split("T")[0]

  return trip.startDate < todayString
}

function StatusBadge({
  status,
  expired = false,
}: {
  status: string
  expired?: boolean
}) {
  const labels: Record<string, string> = {
    published: "Opublikowane",
    draft: "Szkic",
    archived: "Archiwum",
    new: "Nowe",
    contacted: "Kontakt",
    closed: "Zamknięte",
  }

 if (expired) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-red-500/50 bg-red-500/10 text-red-600 dark:border-red-400/50 dark:bg-red-400/10 dark:text-red-400"
    >
      <AlertCircle className="size-3.5" />
      Po terminie
    </Badge>
  )
}
  return (
    <Badge
      variant={
        status === "published" ||
        status === "new"
          ? "default"
          : "secondary"
      }
    >
      {labels[status] || status}
    </Badge>
  )
}
function ImageDropzone({
  name,
  accept = "image/jpeg,image/png,image/webp,image/avif",
  required = false,
  currentImage,
}: {
  name: string
  accept?: string
  required?: boolean
  currentImage?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("")

  const setFiles = (files: FileList | null) => {
    if (!files || !files.length || !inputRef.current) return

    const file = files[0]

    // Ustawiamy plik również w prawdziwym input[type=file],
    // dzięki czemu zostanie wysłany normalnie przez FormData.
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    inputRef.current.files = dataTransfer.files

    setFileName(file.name)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setIsDragging(false)
    setFiles(event.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        event.stopPropagation()

        // Nie wyłączaj stanu przy przejściu między elementami wewnątrz dropzone.
        if (event.currentTarget === event.target) {
          setIsDragging(false)
        }
      }}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        "relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(event) => {
          setFiles(event.target.files)
        }}
      />

      {currentImage && !fileName ? (
        <div className="relative mb-4 aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
          <Image
            src={currentImage}
            alt="Aktualne zdjęcie główne wyjazdu"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      ) : (
        <Upload
          className={[
            "mb-3 size-8 transition-transform",
            isDragging ? "scale-110 text-primary" : "text-muted-foreground",
          ].join(" ")}
        />
      )}

      {fileName ? (
        <>
          <p className="font-medium">
            {fileName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Kliknij lub upuść inne zdjęcie, aby je zmienić
          </p>
        </>
      ) : (
        <>
          <p className="font-medium">
            Przeciągnij i upuść zdjęcie tutaj
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            lub kliknij, aby wybrać plik z komputera
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            JPEG, PNG, WebP lub AVIF
          </p>
        </>
      )}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="flex items-center gap-2">
        {label}

        {hint ? (
          <span
            title={hint}
            aria-label={hint}
            className="cursor-help text-muted-foreground"
          >
            <HelpCircle className="size-4" />
          </span>
        ) : null}
      </Label>

      {children}

      {hint ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const initialSaveSettingsState: SaveSettingsState = {}

function YouTubeSettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    saveSettings,
    initialSaveSettingsState
  )

  return (
    <form
      action={action}
      className="flex flex-col gap-5"
    >
      <Field
        label="Adres kanału YouTube"
        hint="Wklej adres swojego kanału YouTube. Możesz skopiować go bezpośrednio z paska adresu przeglądarki."
      >
        <Input
          name="setting.youtubeUrl"
          type="url"
          defaultValue={
            settings.youtubeUrl
          }
          placeholder="https://www.youtube.com/@twojkanal"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Liczba filmów"
          hint="Określ, ile najnowszych filmów ma być wyświetlanych na stronie."
        >
          <Input
            name="setting.youtubeLimit"
            type="number"
            min="1"
            max="12"
            defaultValue={
              settings.youtubeLimit ||
              "6"
            }
          />
        </Field>

        <Field
          label="Widoczność filmów"
          hint="Zdecyduj, czy sekcja z filmami YouTube ma być widoczna na stronie."
        >
          <select
            name="setting.youtubeEnabled"
            defaultValue={
              settings.youtubeEnabled ||
              "true"
            }
            className="h-9 rounded-lg border bg-background px-3"
          >
            <option value="true">
              Sekcja włączona
            </option>

            <option value="false">
              Sekcja wyłączona
            </option>
          </select>
        </Field>
      </div>

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-primary">
          Ustawienia zostały zapisane.
        </p>
      )}

      <Button
        type="submit"
        className="self-start"
        disabled={pending}
      >
        <Clapperboard />

        {pending
          ? "Zapisuję…"
          : "Zapisz ustawienia"}
      </Button>
    </form>
  )
}

const initialSyncState: SyncYouTubeState = {}

function YouTubeSyncStatus({
  lastSyncedAt,
  lastSyncStatus,
}: {
  lastSyncedAt?: string
  lastSyncStatus?: string
}) {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    syncYouTubeNow,
    initialSyncState
  )

  const formRef =
    useRef<HTMLFormElement>(null)

  const automaticSyncStarted =
    useRef(false)

  const formatted = lastSyncedAt
    ? new Date(
        lastSyncedAt
      ).toLocaleString("pl-PL", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null

  useEffect(() => {
    if (automaticSyncStarted.current)
      return

    const lastSyncTime = lastSyncedAt
      ? new Date(
          lastSyncedAt
        ).getTime()
      : 0

    const isStale =
      !lastSyncTime ||
      Date.now() - lastSyncTime >=
        24 * 60 * 60 * 1000

    const lastAttemptFailed =
      lastSyncStatus?.startsWith(
        "Błąd:"
      ) ?? false

    if (!isStale && !lastAttemptFailed)
      return

    automaticSyncStarted.current =
      true

    formRef.current?.requestSubmit()
  }, [
    lastSyncedAt,
    lastSyncStatus,
  ])

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Lista filmów odświeża się
        automatycznie raz dziennie. Jeśli
        odświeżenie się nie powiedzie, panel
        spróbuje ponownie przy kolejnym
        otwarciu.
      </p>

      <p className="text-sm">
        Ostatnie odświeżenie:{" "}
        <span className="font-medium text-foreground">
          {formatted ??
            "jeszcze nie wykonano"}
        </span>
      </p>

      {lastSyncStatus && (
        <p className="text-sm text-muted-foreground">
          Informacja: {lastSyncStatus}
        </p>
      )}

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-primary">
          Lista filmów została odświeżona.
        </p>
      )}

      <form
        ref={formRef}
        action={action}
      >
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={pending}
        >
          <RefreshCw
            className={
              pending
                ? "animate-spin"
                : ""
            }
          />

          {pending
            ? "Odświeżam…"
            : "Odśwież teraz"}
        </Button>
      </form>
    </div>
  )
}

const initialPasswordState: ChangePasswordState = {}

function ChangePasswordForm() {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    changeAdminPassword,
    initialPasswordState
  )

  return (
    <form
      key={
        state.success
          ? "done"
          : "form"
      }
      action={action}
      className="flex flex-col gap-4"
    >
      <Field
        label="Aktualne hasło"
        hint="Wpisz obecne hasło używane do logowania do panelu."
      >
        <Input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Field
        label="Nowe hasło"
        hint="Nowe hasło musi mieć co najmniej 12 znaków."
      >
        <Input
          name="newPassword"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
        />
      </Field>

      <Field
        label="Powtórz nowe hasło"
        hint="Wpisz ponownie nowe hasło, aby upewnić się, że nie ma w nim literówki."
      >
        <Input
          name="confirmPassword"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="revokeOtherSessions"
          type="checkbox"
          defaultChecked
        />

        Wyloguj pozostałe urządzenia
      </label>

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-primary">
          Hasło zostało zmienione.
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
      >
        <KeyRound />

        {pending
          ? "Zmieniam…"
          : "Zmień hasło"}
      </Button>
    </form>
  )
}

const initialTripState: SaveTripState = {}

function TripDialog({
  trip,
  trigger,
}: {
  trip?: any
  trigger: React.ReactNode
}) {
  const [open, setOpen] =
    useState(false)

  const [
    state,
    action,
    pending,
  ] = useActionState(
    saveTrip,
    initialTripState
  )

  useEffect(() => {
    if (!state.success) return

    toast.success(
      trip
        ? "Zmiany wyjazdu zostały zapisane."
        : "Nowy wyjazd został zapisany."
    )

    setOpen(false)
  }, [state.success, trip])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          trigger as React.ReactElement
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {trip
              ? "Edytuj wyjazd"
              : "Nowy wyjazd"}
          </DialogTitle>

          <DialogDescription>
            Uzupełnij informacje o wyjeździe.
            Przy trudniejszych polach znajdziesz
            krótką podpowiedź.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="grid gap-4 sm:grid-cols-2"
        >
          {trip && (
            <input
              type="hidden"
              name="id"
              value={trip.id}
            />
          )}

          <Field
            label="Tytuł"
            hint="Pełna nazwa wyjazdu widoczna dla klientów, np. Real Madryt vs Barcelona."
          >
            <Input
              name="title"
              defaultValue={
                trip?.title
              }
              required
            />
          </Field>

          <Field
            label="Adres strony"
            hint="Końcowa część adresu strony wyjazdu, np. real-madryt-vs-barcelona. Jeśli nie wiesz, co wpisać, zostaw pole puste - adres utworzy się automatycznie z tytułu."
          >
            <Input
              name="slug"
              defaultValue={
                trip?.slug
              }
              placeholder="Utworzy się automatycznie"
            />
          </Field>

          <Field
            label="Miasto"
            hint="Miasto, w którym odbywa się mecz."
          >
            <Input
              name="city"
              defaultValue={
                trip?.city
              }
              required
            />
          </Field>

          <Field
            label="Kraj"
            hint="Kraj, do którego organizowany jest wyjazd."
          >
            <Input
              name="country"
              defaultValue={
                trip?.country
              }
              required
            />
          </Field>

          <Field
            label="Cena od (zł)"
            hint="Najniższa cena pakietu za jedną osobę."
          >
            <Input
              name="price"
              type="number"
              min="0"
              defaultValue={
                trip?.price
              }
              required
            />
          </Field>

          <Field
            label="Widoczność wyjazdu"
            hint="Wybierz, czy wyjazd ma być widoczny dla klientów. Szkic jest niewidoczny na stronie."
          >
            <select
              name="status"
              defaultValue={
                trip?.status ||
                "draft"
              }
              className="h-9 rounded-lg border bg-background px-3"
            >
              <option value="draft">
                Szkic - niewidoczny
              </option>

              <option value="published">
                Opublikowany - widoczny
              </option>
            </select>
          </Field>

          <Field
            label="Data rozpoczęcia"
            hint="Pierwszy dzień wyjazdu."
          >
            <Input
              name="startDate"
              type="date"
              defaultValue={
                trip?.startDate
              }
              required
            />
          </Field>

          <Field
            label="Data zakończenia"
            hint="Ostatni dzień wyjazdu. Jeśli wyjazd jest jednodniowy, możesz pozostawić pole puste."
          >
            <Input
              name="endDate"
              type="date"
              defaultValue={
                trip?.endDate
              }
            />
          </Field>

          <Field
            label="Kolejność"
            hint="Określa kolejność wyjazdów na stronie. Niższa liczba oznacza wcześniejsze miejsce."
          >
            <Input
              name="sortOrder"
              type="number"
              defaultValue={
                trip?.sortOrder ||
                0
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Zdjęcie główne"
              hint="Wybierz zdjęcie, które będzie głównym zdjęciem tego wyjazdu. Możesz wybrać je z komputera lub telefonu."
            >
              <ImageDropzone
                name="coverFile"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required={!trip?.image}
                currentImage={trip?.image}
              />
            </Field>

            {trip?.image ? (
              <input
                type="hidden"
                name="image"
                value={trip.image}
              />
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <DescriptionEditor
              name="description"
              defaultValue={
                trip?.description
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Pakiet zawiera"
              hint="Wpisz każdy element pakietu w osobnej linii, np. Bilet na mecz, Przelot, Hotel, Opieka koordynatora."
            >
              <Textarea
                name="includes"
                defaultValue={
                  trip?.includes?.join(
                    "\n"
                  )
                }
                rows={5}
              />
            </Field>
          </div>

          <Field
            label="Tytuł strony w Google"
            hint="Tytuł, który może być wyświetlany przy stronie w wynikach Google. Najlepiej około 50-60 znaków."
          >
            <Input
              name="seoTitle"
              defaultValue={
                trip?.seoTitle
              }
              maxLength={70}
            />
          </Field>

          <Field
            label="Opis strony w Google"
            hint="Krótki opis, który może pojawić się pod tytułem strony w Google. Najlepiej napisać 1-2 zdania zachęcające do wyjazdu."
          >
            <Textarea
              name="seoDescription"
              defaultValue={
                trip?.seoDescription
              }
              rows={3}
              maxLength={180}
            />
          </Field>

          <label className="flex items-start gap-2 text-sm sm:col-span-2">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={
                trip?.featured
              }
              className="mt-1"
            />

            <span>
              <strong>
                Wyróżnij wyjazd
              </strong>

              <span className="block text-xs leading-relaxed text-muted-foreground">
                Oferta pojawi się przed pozostałymi
                i otrzyma oznaczenie „Polecany wyjazd”.
              </span>
            </span>
          </label>

          {state.error ? (
            <p
              role="alert"
              className="text-sm text-destructive sm:col-span-2"
            >
              {state.error}
            </p>
          ) : null}

          <DialogFooter className="sm:col-span-2">
            <Button
              type="submit"
              disabled={pending}
            >
              {pending
                ? "Zapisuję…"
                : "Zapisz wyjazd"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function LegacyTripDialog({
  trip,
  trigger,
}: {
  trip?: any
  trigger: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger as React.ReactElement
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {trip
              ? "Edytuj wyjazd"
              : "Nowy wyjazd"}
          </DialogTitle>

          <DialogDescription>
            Uzupełnij informacje o wyjeździe,
            termin, pakiet i ustawienia publikacji.
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            await saveTrip({}, formData)
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {trip && (
            <input
              type="hidden"
              name="id"
              value={trip.id}
            />
          )}

          <Field label="Tytuł">
            <Input
              name="title"
              defaultValue={
                trip?.title
              }
              required
            />
          </Field>

          <Field
            label="Adres strony"
            hint="Końcowa część adresu strony wyjazdu. Jeśli nie wiesz, co wpisać, pozostaw puste."
          >
            <Input
              name="slug"
              defaultValue={
                trip?.slug
              }
              placeholder="Utworzy się automatycznie"
            />
          </Field>

          <Field label="Przeciwnik / wydarzenie">
            <Input
              name="opponent"
              defaultValue={
                trip?.opponent
              }
              required
            />
          </Field>

          <Field label="Miasto">
            <Input
              name="city"
              defaultValue={
                trip?.city
              }
              required
            />
          </Field>

          <Field label="Kraj">
            <Input
              name="country"
              defaultValue={
                trip?.country
              }
              required
            />
          </Field>

          <Field label="Cena od (zł)">
            <Input
              name="price"
              type="number"
              min="0"
              defaultValue={
                trip?.price
              }
              required
            />
          </Field>

          <Field label="Data rozpoczęcia">
            <Input
              name="startDate"
              type="date"
              defaultValue={
                trip?.startDate
              }
              required
            />
          </Field>

          <Field label="Data zakończenia">
            <Input
              name="endDate"
              type="date"
              defaultValue={
                trip?.endDate
              }
            />
          </Field>

          <Field
            label="Widoczność wyjazdu"
            hint="Szkic jest niewidoczny dla klientów. Opublikowany wyjazd jest widoczny na stronie."
          >
            <select
              name="status"
              defaultValue={
                trip?.status ||
                "draft"
              }
              className="h-9 rounded-lg border bg-background px-3"
            >
              <option value="draft">
                Szkic - niewidoczny
              </option>

              <option value="published">
                Opublikowany - widoczny
              </option>

              <option value="archived">
                Archiwalny
              </option>
            </select>
          </Field>

          <Field
            label="Kolejność"
            hint="Niższa liczba oznacza wcześniejsze miejsce wyjazdu na stronie."
          >
            <Input
              name="sortOrder"
              type="number"
              defaultValue={
                trip?.sortOrder ||
                0
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Adres zdjęcia głównego"
              hint="Pole dla starszych zapisów. W przypadku nowego zdjęcia najlepiej użyć pola „Zdjęcie główne” w aktualnym formularzu."
            >
              <Input
                name="image"
                defaultValue={
                  trip?.image
                }
                placeholder="/images/... lub /api/media/ID"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <DescriptionEditor
              name="description"
              defaultValue={
                trip?.description
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Pakiet zawiera"
              hint="Wpisz każdy element pakietu w osobnej linii."
            >
              <Textarea
                name="includes"
                defaultValue={
                  trip?.includes?.join(
                    "\n"
                  )
                }
                rows={5}
              />
            </Field>
          </div>

          <Field
            label="Tytuł strony w Google"
            hint="Tytuł, który może pojawić się przy stronie w wynikach Google."
          >
            <Input
              name="seoTitle"
              defaultValue={
                trip?.seoTitle
              }
            />
          </Field>

          <Field
            label="Opis strony w Google"
            hint="Krótki opis strony, który może pojawić się w wynikach Google."
          >
            <Input
              name="seoDescription"
              defaultValue={
                trip?.seoDescription
              }
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={
                trip?.featured
              }
            />

            Wyróżnij wyjazd
          </label>

          <DialogFooter className="sm:col-span-2">
            <Button type="submit">
              Zapisz wyjazd
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const initialGalleryState: AddGalleryItemState = {}

function GalleryDialog({
  asset,
  trips,
}: {
  asset: any
  trips: any[]
}) {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    addGalleryItem,
    initialGalleryState
  )

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
          />
        }
      >
        Użyj
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Użyj zdjęcia
          </DialogTitle>

          <DialogDescription>
            Dodaj zdjęcie do galerii lub ustaw je
            jako zdjęcie główne wyjazdu.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="mediaId"
            value={asset.id}
          />

          <Field
            label="Gdzie użyć zdjęcia?"
            hint="Wybierz, czy zdjęcie ma trafić do galerii strony głównej, czy do galerii konkretnego wyjazdu."
          >
            <select
              name="tripId"
              className="h-9 rounded-lg border bg-background px-3"
            >
              <option value="0">
                Galeria strony głównej
              </option>

              {trips.map((trip) => (
                <option
                  key={trip.id}
                  value={trip.id}
                >
                  {trip.title}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Podpis zdjęcia"
            hint="Tekst, który może być wyświetlany przy zdjęciu. Możesz zostawić puste."
          >
            <Input name="caption" />
          </Field>

          <Field
            label="Miasto"
            hint="Wpisz miasto, które ma być pokazane przy zdjęciu w galerii strony głównej."
          >
            <Input name="city" />
          </Field>

          <Field
            label="Opis zdjęcia"
            hint="Krótko opisz, co znajduje się na zdjęciu, np. „Kibice na stadionie”."
          >
            <Input
              name="alt"
              defaultValue={
                asset.alt
              }
              placeholder="Np. Kibice na stadionie"
            />
          </Field>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          {state.success && (
            <p
              role="status"
              className="text-sm font-medium text-primary"
            >
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
          >
            {pending
              ? "Dodaję…"
              : "Dodaj do galerii"}
          </Button>
        </form>

        <div className="border-t pt-5">
          <form
            action={setTripCover}
            className="flex flex-col gap-4"
          >
            <input
              type="hidden"
              name="mediaId"
              value={asset.id}
            />

            <Field
              label="Ustaw jako zdjęcie główne"
              hint="To zdjęcie będzie głównym zdjęciem wybranego wyjazdu."
            >
              <select
                name="tripId"
                className="h-9 rounded-lg border bg-background px-3"
                required
              >
                <option value="">
                  Wybierz wyjazd
                </option>

                {trips.map((trip) => (
                  <option
                    key={trip.id}
                    value={trip.id}
                  >
                    {trip.title}
                  </option>
                ))}
              </select>
            </Field>

            <DialogFooter>
              <Button variant="outline">
                Ustaw zdjęcie główne
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const initialUpdateGalleryState: UpdateGalleryItemState = {}

function EditGalleryItemDialog({
  item,
}: {
  item: any
}) {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    updateGalleryItem,
    initialUpdateGalleryState
  )

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
          />
        }
      >
        <Pencil />
        Edytuj
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edytuj zdjęcie galerii
          </DialogTitle>

          <DialogDescription>
            Zmień podpis lub miasto wyświetlane
            przy zdjęciu.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <Field
            label="Podpis zdjęcia"
            hint="Nazwa lub krótki tekst wyświetlany przy zdjęciu."
          >
            <Input
              name="title"
              defaultValue={
                item.title
              }
              required
            />
          </Field>

          <Field
            label="Miasto"
            hint="Miasto wyświetlane przy zdjęciu."
          >
            <Input
              name="city"
              defaultValue={
                item.city
              }
            />
          </Field>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          {state.success && (
            <p
              role="status"
              className="text-sm font-medium text-primary"
            >
              Zmiany zostały zapisane.
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
            >
              {pending
                ? "Zapisuję…"
                : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditTripGalleryItemDialog({
  item,
  city,
}: {
  item: any
  city: string
}) {
  const [open, setOpen] =
    useState(false)

  const [
    state,
    action,
    pending,
  ] = useActionState(
    updateTripGalleryItem,
    initialUpdateGalleryState
  )

  useEffect(() => {
    if (!state.success) return

    toast.success(
      "Dane zdjęcia zostały zapisane."
    )

    setOpen(false)
  }, [state.success])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
          />
        }
      >
        <Pencil />
        Edytuj
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edytuj zdjęcie wyjazdu
          </DialogTitle>

          <DialogDescription>
            Miasto wynika z przypisanego wyjazdu.
            Możesz zmienić podpis oraz opis zdjęcia.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <Field
            label="Miasto wyjazdu"
            hint="To miasto jest pobierane automatycznie z wybranego wyjazdu."
          >
            <Input
              value={city}
              disabled
            />
          </Field>

          <Field
            label="Podpis zdjęcia"
            hint="Krótki tekst, który może być wyświetlany przy zdjęciu."
          >
            <Input
              name="caption"
              defaultValue={
                item.caption
              }
              maxLength={160}
              placeholder="Np. Kibice przed meczem"
            />
          </Field>

          <Field
            label="Opis zdjęcia"
            hint="Krótko opisz, co znajduje się na zdjęciu, np. „Kibice przed stadionem”."
          >
            <Input
              name="alt"
              defaultValue={
                item.alt
              }
              maxLength={240}
              placeholder={`Np. Kibice podczas wyjazdu do ${city}`}
            />
          </Field>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
            >
              {pending
                ? "Zapisuję…"
                : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TestimonialDialog({
  item,
  trigger,
}: {
  item?: any
  trigger: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger as React.ReactElement
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item
              ? "Edytuj opinię"
              : "Nowa opinia"}
          </DialogTitle>

          <DialogDescription>
            Opinie oznaczone jako widoczne
            pojawią się na stronie głównej.
          </DialogDescription>
        </DialogHeader>

        <form
          action={saveTestimonial}
          className="flex flex-col gap-4"
        >
          {item && (
            <input
              type="hidden"
              name="id"
              value={item.id}
            />
          )}

          <Field
            label="Autor"
            hint="Imię lub nazwa osoby, która wystawiła opinię."
          >
            <Input
              name="author"
              defaultValue={
                item?.author
              }
              required
            />
          </Field>

          <Field
            label="Wyjazd"
            hint="Nazwa wyjazdu, którego dotyczy opinia."
          >
            <Input
              name="tripName"
              defaultValue={
                item?.tripName
              }
            />
          </Field>

          <Field
            label="Treść opinii"
            hint="Wpisz pełną treść opinii klienta."
          >
            <Textarea
              name="content"
              defaultValue={
                item?.content
              }
              required
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Ocena"
              hint="Ocena klienta w skali od 1 do 5."
            >
              <Input
                name="rating"
                type="number"
                min="1"
                max="5"
                defaultValue={
                  item?.rating ||
                  5
                }
              />
            </Field>

            <Field
              label="Kolejność"
              hint="Niższa liczba oznacza wcześniejsze wyświetlenie opinii na stronie."
            >
              <Input
                name="sortOrder"
                type="number"
                defaultValue={
                  item?.sortOrder ||
                  0
                }
              />
            </Field>

            <Field
              label="Widoczność"
              hint="Zdecyduj, czy opinia ma być widoczna na stronie."
            >
              <select
                name="status"
                defaultValue={
                  item?.status ||
                  "published"
                }
                className="h-9 rounded-lg border bg-background px-3"
              >
                <option value="published">
                  Widoczna
                </option>

                <option value="draft">
                  Ukryta
                </option>
              </select>
            </Field>
          </div>

          <DialogFooter>
            <Button>
              Zapisz opinię
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const fields = [
    [
      "seoTitle",
      "Tytuł strony w Google",
      "Tytuł, który może pojawić się przy stronie w wynikach Google.",
      "Let’s Gol - wyjazdy na mecze piłkarskie",
    ],
    [
      "seoDescription",
      "Opis strony w Google",
      "Krótki opis strony, który może pojawić się pod tytułem w wynikach Google.",
      "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora.",
    ],
    [
      "heroEyebrow",
      "Mały napis nad głównym nagłówkiem",
      "Krótki tekst znajdujący się nad głównym nagłówkiem strony.",
      "Wyjazdy na największe mecze Europy",
    ],
    [
      "heroTitle",
      "Główny nagłówek strony",
      "Najważniejsze hasło widoczne na początku strony.",
      "Ty wybierasz mecz. My organizujemy resztę.",
    ],
    [
      "heroDescription",
      "Opis pod głównym nagłówkiem",
      "Krótki tekst wyjaśniający ofertę znajdującą się na stronie głównej.",
      "Bilety, lot, hotel i opieka koordynatora w jednym pakiecie.",
    ],
    [
      "heroCta",
      "Napis na głównym przycisku",
      "Tekst wyświetlany na przycisku prowadzącym do wyjazdów.",
      "Zobacz wyjazdy",
    ],
    [
      "tripsTitle",
      "Nagłówek sekcji wyjazdów",
      "Tytuł sekcji pokazuj��cej dostępne wyjazdy.",
      "Najbliższe wyjazdy",
    ],
    [
      "tripsDescription",
      "Opis sekcji wyjazdów",
      "Tekst znajdujący się pod nagłówkiem sekcji wyjazdów.",
      "Wybierz gotowy pakiet i zajmij miejsce na trybunach największych stadionów Europy.",
    ],
    [
      "customTripTitle",
      "Nagłówek wyjazdu indywidualnego",
      "Tekst zachęcający klienta do kontaktu, jeśli nie ma interesującego go meczu na liście.",
      "Nie ma meczu na liście? Zorganizujemy go dla Ciebie",
    ],
    [
      "packageTitle",
      "Nagłówek pakietu",
      "Tytuł sekcji opisującej elementy zawarte w pakiecie.",
      "Co zawiera pełny pakiet?",
    ],
    [
      "benefitsTitle",
      "Nagłówek naszych przewag",
      "Tytuł sekcji pokazującej, dlaczego warto wybrać Let’s Gol.",
      "Let’s Gol pilnuje szczegółów. Ty przeżywasz mecz.",
    ],
    [
      "processTitle",
      "Nagłówek procesu rezerwacji",
      "Tytuł sekcji wyjaśniającej klientowi, jak wygląda rezerwacja.",
      "Jak wygląda rezerwacja?",
    ],
    [
      "galleryTitle",
      "Nagłówek galerii",
      "Tytuł sekcji ze zdjęciami z wyjazdów.",
      "Galeria z wyjazdów",
    ],
    [
      "testimonialsTitle",
      "Nagłówek opinii",
      "Tytuł sekcji zawierającej opinie klientów.",
      "Emocje potwierdzone na trybunach",
    ],
    [
      "faqTitle",
      "Nagłówek najczęstszych pytań",
      "Tytuł sekcji z odpowiedziami na pytania klientów.",
      "Najczęstsze pytania",
    ],
    [
      "youtubeTitle",
      "Nagłówek YouTube",
      "Tytuł sekcji z najnowszymi filmami z YouTube.",
      "Najnowsze na YouTube",
    ],
    [
      "aboutTitle",
      "Nagłówek sekcji „O nas”",
      "Tytuł sekcji przedstawiającej firmę.",
      "Jedziemy razem, kibicujemy razem",
    ],
    [
      "aboutText",
      "Opis sekcji „O nas”",
      "Krótki tekst przedstawiający firmę i sposób działania.",
      "Tworzymy wyjazdy, które zostają w pamięci na lata.",
    ],
    [
      "contactTitle",
      "Nagłówek kontaktu",
      "Tytuł sekcji zachęcającej klienta do kontaktu.",
      "Jaki mecz chodzi Ci po głowie?",
    ],
    [
      "contactEmail",
      "Adres e-mail",
      "Adres e-mail, na który klienci mogą się z Tobą kontaktować.",
      "kontakt@letsgol.pl",
    ],
    [
      "contactPhone",
      "Numer telefonu",
      "Numer telefonu, pod którym klienci mogą się z Tobą skontaktować.",
      "+48 000 000 000",
    ],
    [
      "footerText",
      "Opis w stopce strony",
      "Krótki opis firmy znajdujący się na dole strony.",
      "Kompleksowe wyjazdy na mecze w Europie.",
    ],
    [
      "companyName",
      "Nazwa firmy",
      "Pełna nazwa firmy wyświetlana na stronie.",
      "Let's Gol Sp. z o.o.",
    ],
    [
      "companyAddress",
      "Adres firmy",
      "Adres firmy wyświetlany na stronie.",
      "00-100 Warszawa",
    ],
    [
      "companyNip",
      "NIP firmy",
      "Numer NIP firmy.",
      "123 456 78 90",
    ],
  ] as const

  const [
    state,
    action,
    pending,
  ] = useActionState(
    saveSettings,
    initialSaveSettingsState
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Najważniejsze teksty
        </CardTitle>

        <CardDescription>
          Zmieniaj teksty strony bez znajomości
          kodowania. Przy każdym polu znajdziesz
          krótkie wyjaśnienie.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          action={action}
          className="grid gap-5 md:grid-cols-2"
        >
          {fields.map(
            ([
              key,
              label,
              hint,
              fallback,
            ]) => (
              <Field
                key={key}
                label={label}
                hint={hint}
              >
                {key.endsWith(
                  "Text"
                ) ||
                key.endsWith(
                  "Description"
                ) ? (
                  <Textarea
                    name={`setting.${key}`}
                    defaultValue={
                      settings[key] ||
                      fallback
                    }
                    rows={4}
                  />
                ) : (
                  <Input
                    name={`setting.${key}`}
                    defaultValue={
                      settings[key] ||
                      fallback
                    }
                  />
                )}
              </Field>
            )
          )}

          <Field
            label="Liczba zdjęć na stronie głównej"
            hint="Określ, ile zdjęć ma być widocznych w galerii na stronie głównej."
          >
            <Input
              name="setting.galleryHomeLimit"
              type="number"
              min="1"
              max="5"
              defaultValue={
                settings.galleryHomeLimit ||
                "5"
              }
            />
          </Field>

          <div className="flex flex-col gap-2 md:col-span-2">
            {state.error && (
              <p className="text-sm text-destructive">
                {state.error}
              </p>
            )}

            {state.success && (
              <p className="text-sm text-primary">
                Treści strony zostały zapisane.
              </p>
            )}

            <Button
              type="submit"
              className="self-start"
              disabled={pending}
            >
              <BookOpen />

              {pending
                ? "Zapisuję…"
                : "Zapisz treści strony"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
