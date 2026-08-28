"use client"

import Link from "next/link"
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  Archive,
  BookOpen,
  Check,
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
  Trash2,
  Upload,
  X,
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
import { DeleteTripDialog } from "@/components/delete-trip-dialog"

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

const formatActivityDate = (date: Date | string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))

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
  const [query, setQuery] = useState("")
  const [galleryItems, setGalleryItems] = useState(data.gallery)

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

    toast.success("Kolejność galerii została zapisana")
  }

  return (
    <Tabs
      defaultValue="dashboard"
      orientation="vertical"
      className="min-h-screen gap-0 bg-muted/40 lg:flex-row"
    >
      <aside className="border-b bg-foreground text-background lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 border-b border-background/10 px-6 py-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Let&apos;s Gol
            </p>

            <p className="mt-1 font-sans text-xl font-black uppercase tracking-tight">
              Centrum dowodzenia
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/" />}
            className="size-10 rounded-xl text-background hover:bg-background/10 hover:text-background"
          >
            <Home className="size-5" />

            <span className="sr-only">
              Strona główna
            </span>
          </Button>
        </div>

        <TabsList
          variant="line"
          className="flex h-auto w-full flex-row justify-start overflow-x-auto rounded-none bg-transparent p-3 text-background/70 lg:flex-col lg:items-stretch lg:p-4"
        >
          {sections.map(([value, label, Icon]) => (
            <TabsTrigger
              key={value}
              id={`tab-${value}`}
              value={value}
              className="min-w-max justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-background/65 transition-all duration-200 hover:bg-background/10 hover:text-background data-active:bg-background/10 data-active:text-primary"
            >
              <Icon className="size-5" />

              <span>{label}</span>

              {value === "inquiries" && newLeads > 0 ? (
                <Badge className="ml-auto min-w-6 justify-center">
                  {newLeads}
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="hidden border-t border-background/10 p-5 lg:block">
          <p className="truncate text-sm text-background/50">
            {data.email}
          </p>

          <form action={signOutAdmin}>
            <Button
              type="submit"
              variant="ghost"
              className="mt-3 h-11 w-full justify-start rounded-xl text-background hover:bg-background/10 hover:text-background"
            >
              <LogOut className="size-5" />
              Wyloguj
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8 xl:p-10">
        {/* DASHBOARD */}

        <TabsContent value="dashboard">
          <SectionHeader
            eyebrow="Przegląd"
            title="Pulpit"
            description="Najważniejsze informacje i szybkie akcje w jednym miejscu."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
              label="Pliki w bibliotece"
              value={data.media.length}
            />
          </div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Szybkie działania
                </CardTitle>

                <CardDescription className="text-sm">
                  Najczęściej używane operacje.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3 p-6 sm:grid-cols-3">
                <TripDialog
                  trigger={
                    <Button className="h-12 rounded-xl text-sm font-semibold">
                      <Plus />
                      Nowy wyjazd
                    </Button>
                  }
                />

                <Button
                  variant="outline"
                  className="h-12 rounded-xl text-sm font-semibold"
                  onClick={() =>
                    document.getElementById("tab-media")?.click()
                  }
                >
                  <Upload />
                  Dodaj zdjęcie
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-xl text-sm font-semibold"
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

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Ostatnia aktywność
                </CardTitle>

                <CardDescription className="text-sm">
                  Ostatnie zmiany wykonane w panelu.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
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
                              title:
                                "Zaktualizowano wyjazd",
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
                            item.entityType === "media"
                          ) {
                            return {
                              title:
                                "Zaktualizowano zdjęcie",
                              description:
                                "Zmieniono informacje dotyczące zdjęcia.",
                            }
                          }

                          if (
                            item.entityType === "gallery"
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
                            item.entityType === "trip"
                          ) {
                            return {
                              title: "Usunięto wyjazd",
                              description: item.details
                                ? `Usunięto wyjazd „${item.details}”.`
                                : "Wyjazd został usunięty.",
                            }
                          }

                          if (
                            item.entityType === "media"
                          ) {
                            return {
                              title: "Usunięto zdjęcie",
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
                            item.entityType === "gallery"
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
                      ) : item.entityType === "media" ||
                        item.entityType === "gallery" ||
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
                        className="flex gap-4 border-b py-4 last:border-0 first:pt-0 last:pb-0"
                      >
                        <div className="flex shrink-0 items-start justify-center">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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

                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
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

        {/* TRIPS */}

        <TabsContent value="trips">
          <SectionHeader
            eyebrow="Oferta"
            title="Wyjazdy"
            description="Twórz, edytuj, publikuj, duplikuj i archiwizuj oferty."
            action={
              <TripDialog
                trigger={
                  <Button className="h-11 rounded-xl px-5 font-semibold">
                    <Plus />
                    Nowy wyjazd
                  </Button>
                }
              />
            }
          />

          <Card className="overflow-hidden">
            <CardContent className="p-5 md:p-6">
              <div className="mb-6 flex max-w-xl items-center gap-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <Input
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Szukaj po nazwie lub mieście"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-12 text-sm">
                        Oferta
                      </TableHead>

                      <TableHead className="h-12 text-sm">
                        Termin
                      </TableHead>

                      <TableHead className="h-12 text-sm">
                        Cena
                      </TableHead>

                      <TableHead className="h-12 text-sm">
                        Status
                      </TableHead>

                      <TableHead className="h-12 text-right text-sm">
                        Operacje
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredTrips.map((trip) => (
                      <TableRow
                        key={trip.id}
                        className="h-20"
                      >
                        <TableCell>
                          <strong className="text-sm">
                            {trip.title}
                          </strong>

                          <span className="mt-1 block text-sm text-muted-foreground">
                            {trip.city}, {trip.country}
                          </span>
                        </TableCell>

                        <TableCell className="text-sm">
                          {trip.startDate}
                          {trip.endDate
                            ? ` – ${trip.endDate}`
                            : ""}
                        </TableCell>

                        <TableCell className="text-sm font-semibold">
                          {trip.price.toLocaleString(
                            "pl-PL"
                          )}{" "}
                          zł
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            status={trip.status}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <TripDialog
                              trip={trip}
                              trigger={
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="size-10 rounded-xl"
                                >
                                  <Pencil />
                                  <span className="sr-only">
                                    Edytuj
                                  </span>
                                </Button>
                              }
                            />

                            <ConfirmDuplicateButton
                              tripId={trip.id}
                            />

                            <form
                              action={setTripStatus}
                            >
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
                                className="h-10 rounded-xl px-4"
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

        {/* MEDIA */}

        <TabsContent value="media">
          <SectionHeader
            eyebrow="Biblioteka"
            title="Media i galerie"
            description="Wgrywaj zdjęcia raz i wykorzystuj je w wielu miejscach."
          />

          <div className="grid gap-7 xl:grid-cols-[380px_1fr]">
            <MediaUploadCard />

            <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
              {data.media.map((asset) => (
                <Card
                  key={asset.id}
                  className="overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-muted">
                    <img
                      src={`/api/media/${asset.id}`}
                      alt={
                        asset.alt ||
                        asset.originalName
                      }
                      className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>

                  <CardContent className="flex flex-col gap-4 p-5">
                    <div>
                      <p className="truncate text-sm font-semibold">
                        {asset.originalName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {Math.round(
                          asset.size / 1024
                        )}{" "}
                        KB · ID {asset.id}
                      </p>
                    </div>

                    <form
                      action={updateMedia}
                      className="flex gap-2"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={asset.id}
                      />

                      <Input
                        name="alt"
                        defaultValue={asset.alt}
                        placeholder="Tekst alternatywny"
                        className="h-10 rounded-xl"
                      />

                      <Button
                        type="submit"
                        size="sm"
                        className="h-10 rounded-xl"
                      >
                        Zapisz
                      </Button>
                    </form>

                    <div className="grid grid-cols-2 gap-2">
                      <GalleryDialog
                        asset={asset}
                        trips={data.trips}
                      />

                      <form
                        action={deleteMedia}
                        onSubmit={(event) => {
                          if (
                            !window.confirm(
                              "Czy na pewno chcesz usunąć to zdjęcie? Tej operacji nie można cofnąć."
                            )
                          ) {
                            event.preventDefault()
                          }
                        }}
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={asset.id}
                        />

                        <Button
                          type="submit"
                          className="h-10 w-full rounded-xl"
                          variant="ghost"
                        >
                          <Trash2 />
                          Usuń
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8 overflow-hidden">
            <CardHeader className="border-b bg-background/50 px-6 py-5">
              <CardTitle className="text-xl">
                Galeria strony głównej
              </CardTitle>

              <CardDescription className="text-sm">
                Przeciągaj zdjęcia, aby zmienić ich kolejność.
                Zmiany zapisują się automatycznie.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
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
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryItems.map((item) => (
                      <SortableGalleryItem
                        key={item.id}
                        item={item}
                      >
                        <div className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md">
                          <div className="relative overflow-hidden">
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
                              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />

                            <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                              Przeciągnij
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 p-4">
                            <div>
                              <p className="font-semibold">
                                {item.title}
                              </p>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.city}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <EditGalleryItemDialog
                                item={item}
                              />

                              <form
                                action={
                                  removeGalleryItem
                                }
                                onSubmit={(event) => {
                                  if (
                                    !window.confirm(
                                      "Usunąć zdjęcie z galerii strony głównej?"
                                    )
                                  ) {
                                    event.preventDefault()
                                  }
                                }}
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
                                  className="rounded-xl"
                                >
                                  <Trash2 />
                                  Usuń
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </SortableGalleryItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          <Card className="mt-8 overflow-hidden">
            <CardHeader className="border-b bg-background/50 px-6 py-5">
              <CardTitle className="text-xl">
                Galerie wyjazdów
              </CardTitle>

              <CardDescription className="text-sm">
                Zdjęcia przypisane do poszczególnych ofert.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-8 p-6">
              {data.trips
                .filter((trip) =>
                  data.tripGallery.some(
                    (item) =>
                      item.tripId === trip.id
                  )
                )
                .map((trip) => (
                  <section key={trip.id}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Plane className="size-5" />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {trip.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {trip.city}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {data.tripGallery
                        .filter(
                          (item) =>
                            item.tripId ===
                            trip.id
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-2xl border bg-background"
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

                            <div className="flex flex-col gap-4 p-4">
                              <div>
                                <p className="truncate text-sm font-semibold">
                                  {item.caption ||
                                    "Bez podpisu"}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
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
                                  onSubmit={(event) => {
                                    if (
                                      !window.confirm(
                                        "Usunąć zdjęcie z galerii tego wyjazdu?"
                                      )
                                    ) {
                                      event.preventDefault()
                                    }
                                  }}
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
                                    className="rounded-xl"
                                  >
                                    <Trash2 />
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

        {/* CONTENT */}

        <TabsContent value="content">
          <SectionHeader
            eyebrow="Mini-CMS"
            title="Treści strony"
            description="Zmień kluczowe komunikaty bez edycji kodu."
          />

          <SettingsForm settings={data.settings} />
        </TabsContent>

        {/* TESTIMONIALS */}

        <TabsContent value="testimonials">
          <SectionHeader
            eyebrow="Wiarygodność"
            title="Opinie klientów"
            description="Publikuj i porządkuj rekomendacje."
            action={
              <TestimonialDialog
                trigger={
                  <Button className="h-11 rounded-xl px-5 font-semibold">
                    <Plus />
                    Dodaj opinię
                  </Button>
                }
              />
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {data.testimonials.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden"
              >
                <CardHeader className="border-b bg-background/50 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        {item.author}
                      </CardTitle>

                      <CardDescription className="mt-1 text-sm">
                        {item.tripName} ·{" "}
                        {"★".repeat(item.rating)}
                      </CardDescription>
                    </div>

                    <StatusBadge
                      status={item.status}
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="mb-5 text-base leading-7 text-muted-foreground">
                    {item.content}
                  </p>

                  <div className="flex gap-2">
                    <TestimonialDialog
                      item={item}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
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

        {/* YOUTUBE */}

        <TabsContent value="youtube">
          <SectionHeader
            eyebrow="Kanał wideo"
            title="YouTube"
            description="Podaj adres kanału, a najnowsze filmy pojawią się na stronie głównej."
          />

          <div className="grid gap-7 xl:grid-cols-[.8fr_1.2fr]">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Konfiguracja kanału
                </CardTitle>

                <CardDescription className="text-sm">
                  Obsługiwane są adresy /channel/UC…,
                  /@nazwa oraz /user/nazwa.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <YouTubeSettingsForm
                  settings={data.settings}
                />
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-3 border-t p-6">
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

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Podgląd najnowszych filmów
                </CardTitle>

                <CardDescription className="text-sm">
                  {data.videos.length
                    ? `Pobrano ${data.videos.length} filmów z kanału.`
                    : "Po zapisaniu poprawnego kanału zobaczysz tutaj podgląd."}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
                {data.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="flex gap-3 p-4">
                      <p className="line-clamp-2 flex-1 text-sm font-semibold">
                        {video.title}
                      </p>

                      <ExternalLink className="size-4 shrink-0 text-primary" />
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* INQUIRIES */}

        <TabsContent value="inquiries">
          <SectionHeader
            eyebrow="Sprzedaż"
            title="Zapytania klientów"
            description="Obsługuj zgłoszenia, notatki i status kontaktu."
            action={
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                nativeButton={false}
                render={
                  <a href="/api/admin/inquiries.csv" />
                }
              >
                <ExternalLink />
                Eksportuj CSV
              </Button>
            }
          />

          <div className="flex flex-col gap-5">
            {data.inquiries.map((lead) => (
              <Card
                key={lead.id}
                className="overflow-hidden"
              >
                <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr_auto]">
                  <div>
                    <div className="flex items-center gap-3">
                      <strong className="text-base">
                        {lead.name}
                      </strong>

                      <StatusBadge
                        status={lead.status}
                      />
                    </div>

                    <a
                      className="mt-3 block text-sm text-primary underline-offset-4 hover:underline"
                      href={`mailto:${lead.email}`}
                    >
                      {lead.email}
                    </a>

                    <a
                      className="mt-1 block text-sm text-primary underline-offset-4 hover:underline"
                      href={`tel:${lead.phone}`}
                    >
                      {lead.phone}
                    </a>
                  </div>

                  <div>
                    <p className="text-base font-semibold">
                      {lead.matchName}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.departureCity} ·{" "}
                      {lead.travelers} os.
                    </p>

                    <p className="mt-3 text-sm leading-6">
                      {lead.message ||
                        "Brak dodatkowej wiadomości."}
                    </p>
                  </div>

                  <form
                    action={updateInquiry}
                    className="flex min-w-72 flex-col gap-3"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={lead.id}
                    />

                    <select
                      name="status"
                      defaultValue={lead.status}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
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

                    <Textarea
                      name="adminNote"
                      defaultValue={lead.adminNote}
                      placeholder="Notatka wewnętrzna"
                      rows={3}
                      className="rounded-xl"
                    />

                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 rounded-xl"
                    >
                      Zapisz obsługę
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ACCOUNT */}

        <TabsContent value="account">
          <SectionHeader
            eyebrow="Konto"
            title="Bezpieczeństwo"
            description="Zmień hasło administratora i chroń dostęp do panelu."
          />

          <div className="grid gap-7 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Zmiana hasła
                </CardTitle>

                <CardDescription className="text-sm">
                  Nowe hasło powinno mieć co najmniej
                  12 znaków.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-background/50 px-6 py-5">
                <CardTitle className="text-xl">
                  Administrator
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-5 p-6">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground">
                    M
                  </span>

                  <div>
                    <p className="font-semibold">
                      {data.email}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Pełny dostęp do panelu
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  Dostęp jest dodatkowo ograniczony do
                  zatwierdzonego adresu e-mail oraz zaufanych
                  domen Neon Auth.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </main>
    </Tabs>
  )
}

/* -------------------------------------------------------------------------- */
/* UI HELPERS                                                                 */
/* -------------------------------------------------------------------------- */

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
    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="inline-flex rounded-md bg-black px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-balance font-sans text-4xl font-black uppercase tracking-tight md:text-5xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-6 text-muted-foreground md:text-lg">
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
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-6" />
        </span>

        <div>
          <p className="text-3xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  const labels: Record<string, string> = {
    published: "Opublikowane",
    draft: "Szkic",
    archived: "Archiwum",
    new: "Nowe",
    contacted: "Kontakt",
    closed: "Zamknięte",
  }

  return (
    <Badge
      variant={
        status === "published" ||
        status === "new"
          ? "default"
          : "secondary"
      }
      className="px-2.5 py-1 text-xs font-semibold"
    >
      {labels[status] || status}
    </Badge>
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
    <div className="flex flex-col gap-2.5">
      <Label className="flex items-center gap-2 text-sm font-semibold">
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

/* -------------------------------------------------------------------------- */
/* MEDIA UPLOAD                                                               */
/* -------------------------------------------------------------------------- */

function MediaUploadCard() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [dragging, setDragging] = useState(false)

  const handleFile = (file?: File) => {
    if (!file) return

    setSelectedFile(file)

    if (inputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      inputRef.current.files = dataTransfer.files
    }
  }

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files?.[0]

    if (file) {
      handleFile(file)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-background/50 px-6 py-5">
        <CardTitle className="text-xl">
          Dodaj zdjęcie
        </CardTitle>

        <CardDescription className="text-sm leading-5">
          JPEG, PNG, WebP lub AVIF, maksymalnie 15 MB.
          Zdjęcie zostanie automatycznie zoptymalizowane.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form
          action={uploadMedia}
          className="flex flex-col gap-5"
        >
          <input
            ref={inputRef}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            required
            onChange={(event) =>
              handleFile(event.target.files?.[0])
            }
          />

          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              inputRef.current?.click()
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault()
                inputRef.current?.click()
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setDragging(false)
            }}
            onDrop={handleDrop}
            className={[
              "group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-all",
              dragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-primary/5",
            ].join(" ")}
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <Upload className="size-7" />
            </div>

            <p className="mt-4 text-base font-semibold">
              {dragging
                ? "Upuść zdjęcie tutaj"
                : "Przeciągnij zdjęcie tutaj"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              albo kliknij, aby wybrać plik
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              Jedno zdjęcie na raz
            </p>
          </div>

          {selectedFile ? (
            <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileImage className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {selectedFile.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {Math.max(
                    1,
                    Math.round(
                      selectedFile.size / 1024
                    )
                  )}{" "}
                  KB
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-xl"
                onClick={() => {
                  setSelectedFile(null)

                  if (inputRef.current) {
                    inputRef.current.value = ""
                  }
                }}
              >
                <X />

                <span className="sr-only">
                  Usuń wybrany plik
                </span>
              </Button>
            </div>
          ) : null}

          <Field label="Opis alternatywny">
            <Input
              name="alt"
              placeholder="Kibice na stadionie w Mediolanie"
              className="h-11 rounded-xl"
            />
          </Field>

          <Button
            type="submit"
            disabled={!selectedFile}
            className="h-11 rounded-xl font-semibold"
          >
            <Upload />
            Wgraj do biblioteki
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* DUPLICATE TRIP                                                             */
/* -------------------------------------------------------------------------- */

function ConfirmDuplicateButton({
  tripId,
}: {
  tripId: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            className="size-10 rounded-xl"
          />
        }
      >
        <Copy />

        <span className="sr-only">
          Duplikuj wyjazd
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Zduplikować wyjazd?
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Zostanie utworzona kopia tego wyjazdu z
            jego obecnymi danymi. Możesz ją później
            edytować niezależnie od oryginału.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            Anuluj
          </Button>

          <form action={duplicateTrip}>
            <input
              type="hidden"
              name="id"
              value={tripId}
            />

            <Button
              type="submit"
              className="rounded-xl"
            >
              <Copy />
              Tak, zduplikuj
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/* YOUTUBE                                                                    */
/* -------------------------------------------------------------------------- */

const initialSaveSettingsState: SaveSettingsState = {}

function YouTubeSettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const [state, action, pending] =
    useActionState(
      saveSettings,
      initialSaveSettingsState
    )

  return (
    <form
      action={action}
      className="flex flex-col gap-5"
    >
      <Field label="Link do kanału">
        <Input
          name="setting.youtubeUrl"
          type="url"
          defaultValue={settings.youtubeUrl}
          placeholder="https://www.youtube.com/@twojkanal"
          className="h-11 rounded-xl"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Liczba filmów">
          <Input
            name="setting.youtubeLimit"
            type="number"
            min="1"
            max="12"
            defaultValue={
              settings.youtubeLimit || "6"
            }
            className="h-11 rounded-xl"
          />
        </Field>

        <Field label="Widoczność">
          <select
            name="setting.youtubeEnabled"
            defaultValue={
              settings.youtubeEnabled || "true"
            }
            className="h-11 rounded-xl border bg-background px-3 text-sm"
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
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Check className="size-4" />
          Zapisano konfigurację.
        </p>
      )}

      <Button
        type="submit"
        className="h-11 self-start rounded-xl font-semibold"
        disabled={pending}
      >
        <Clapperboard />

        {pending
          ? "Zapisuję…"
          : "Zapisz konfigurację"}
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
  const [state, action, pending] =
    useActionState(
      syncYouTubeNow,
      initialSyncState
    )

  const formRef =
    useRef<HTMLFormElement>(null)

  const automaticSyncStarted =
    useRef(false)

  const formatted = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString(
        "pl-PL",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      )
    : null

  useEffect(() => {
    if (automaticSyncStarted.current)
      return

    const lastSyncTime = lastSyncedAt
      ? new Date(lastSyncedAt).getTime()
      : 0

    const isStale =
      !lastSyncTime ||
      Date.now() - lastSyncTime >=
        24 * 60 * 60 * 1000

    const lastAttemptFailed =
      lastSyncStatus?.startsWith("Błąd:") ??
      false

    if (!isStale && !lastAttemptFailed)
      return

    automaticSyncStarted.current = true
    formRef.current?.requestSubmit()
  }, [lastSyncedAt, lastSyncStatus])

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm leading-6 text-muted-foreground">
        Lista filmów odświeża się automatycznie raz
        dziennie. Jeśli nocna próba się nie powiedzie,
        panel ponowi ją automatycznie po otwarciu.
      </p>

      <p className="text-sm">
        Ostatnie odświeżenie:{" "}
        <span className="font-medium text-foreground">
          {formatted ?? "jeszcze nie wykonano"}
        </span>
      </p>

      {lastSyncStatus && (
        <p className="text-sm text-muted-foreground">
          Status: {lastSyncStatus}
        </p>
      )}

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm font-medium text-primary">
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
          className="h-10 rounded-xl"
        >
          <RefreshCw
            className={
              pending ? "animate-spin" : ""
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

/* -------------------------------------------------------------------------- */
/* PASSWORD                                                                   */
/* -------------------------------------------------------------------------- */

const initialPasswordState: ChangePasswordState =
  {}

function ChangePasswordForm() {
  const [state, action, pending] =
    useActionState(
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
      className="flex flex-col gap-5"
    >
      <Field label="Aktualne hasło">
        <Input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 rounded-xl"
        />
      </Field>

      <Field label="Nowe hasło">
        <Input
          name="newPassword"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
      </Field>

      <Field label="Powtórz nowe hasło">
        <Input
          name="confirmPassword"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
      </Field>

      <label className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4 text-sm">
        <input
          name="revokeOtherSessions"
          type="checkbox"
          defaultChecked
          className="size-4"
        />

        <span>
          Wyloguj pozostałe sesje
        </span>
      </label>

      {state.error && (
        <p className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Check className="size-4" />
          Hasło zostało zmienione.
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 rounded-xl font-semibold"
      >
        <KeyRound />

        {pending
          ? "Zmieniam…"
          : "Zmień hasło"}
      </Button>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* TRIP                                                                       */
/* -------------------------------------------------------------------------- */

const initialTripState: SaveTripState = {}

function TripDialog({
  trip,
  trigger,
}: {
  trip?: any
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const [state, action, pending] =
    useActionState(
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
          <DialogTitle className="text-2xl">
            {trip
              ? "Edytuj wyjazd"
              : "Nowy wyjazd"}
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Uzupełnij ofertę. Pod każdym polem znajdziesz
            krótką podpowiedź.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="grid gap-5 sm:grid-cols-2"
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
            hint="Pełna nazwa widoczna na karcie, np. Real Madryt vs Barcelona."
          >
            <Input
              name="title"
              defaultValue={trip?.title}
              required
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Slug URL"
            hint="Adres podstrony. Zostaw puste, aby utworzył się automatycznie z tytułu."
          >
            <Input
              name="slug"
              defaultValue={trip?.slug}
              placeholder="utworzy-sie-automatycznie"
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Miasto"
            hint="Miasto, w którym odbywa się mecz."
          >
            <Input
              name="city"
              defaultValue={trip?.city}
              required
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Kraj"
            hint="Kraj docelowy wyjazdu."
          >
            <Input
              name="country"
              defaultValue={trip?.country}
              required
              className="h-11 rounded-xl"
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
              defaultValue={trip?.price}
              required
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Status"
            hint="Szkic jest niewidoczny, opublikowany widoczny."
          >
            <select
              name="status"
              defaultValue={
                trip?.status || "draft"
              }
              className="h-11 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="draft">
                Szkic
              </option>

              <option value="published">
                Opublikowany
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
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Data zakończenia"
            hint="Ostatni dzień wyjazdu; pole może pozostać puste."
          >
            <Input
              name="endDate"
              type="date"
              defaultValue={
                trip?.endDate
              }
              className="h-11 rounded-xl"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Zdjęcie główne z urządzenia"
              hint="Wybierz zdjęcie z komputera lub galerii telefonu. JPEG, PNG, WebP lub AVIF, maks. 8 MB."
            >
              <Input
                name="coverFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="h-11 rounded-xl"
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
              defaultValue={trip?.description}
            />
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Pakiet zawiera"
              hint="Wpisz jeden element pakietu w każdej linii."
            >
              <Textarea
                name="includes"
                defaultValue={trip?.includes?.join(
                  "\n"
                )}
                rows={5}
                className="rounded-xl"
              />
            </Field>
          </div>

          <Field
            label="Tytuł SEO"
            hint="Tytuł w Google. Najlepiej około 50–60 znaków; pusty użyje tytułu wyjazdu."
          >
            <Input
              name="seoTitle"
              defaultValue={trip?.seoTitle}
              maxLength={70}
              className="h-11 rounded-xl"
            />
          </Field>

          <Field
            label="Opis SEO"
            hint="Krótki opis dla wyników Google. Najlepiej 140–160 znaków."
          >
            <Textarea
              name="seoDescription"
              defaultValue={
                trip?.seoDescription
              }
              rows={3}
              maxLength={180}
              className="rounded-xl"
            />
          </Field>

          <label className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4 text-sm sm:col-span-2">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={
                trip?.featured
              }
              className="mt-1 size-4"
            />

            <span>
              <strong>
                Wyróżnij wyjazd
              </strong>

              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                Oferta pojawi się przed pozostałymi i
                otrzyma etykietę „Polecany wyjazd”.
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

          <DialogFooter className="gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Anuluj
            </Button>

            <Button
              type="submit"
              disabled={pending}
              className="rounded-xl font-semibold"
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

/* -------------------------------------------------------------------------- */
/* GALLERY                                                                    */
/* -------------------------------------------------------------------------- */

const initialGalleryState: AddGalleryItemState =
  {}

function GalleryDialog({
  asset,
  trips,
}: {
  asset: any
  trips: any[]
}) {
  const [state, action, pending] =
    useActionState(
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
            className="h-10 rounded-xl"
          />
        }
      >
        Użyj
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Użyj zdjęcia
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Dodaj zdjęcie do galerii albo ustaw je jako
            okładkę wyjazdu.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-5"
        >
          <input
            type="hidden"
            name="mediaId"
            value={asset.id}
          />

          <Field label="Miejsce w galerii">
            <select
              name="tripId"
              className="h-11 rounded-xl border bg-background px-3 text-sm"
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

          <Field label="Podpis">
            <Input
              name="caption"
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Miasto (galeria główna)">
            <Input
              name="city"
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Alt">
            <Input
              name="alt"
              defaultValue={asset.alt}
              className="h-11 rounded-xl"
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
            className="h-11 rounded-xl font-semibold"
          >
            {pending
              ? "Dodaję…"
              : "Dodaj do galerii"}
          </Button>
        </form>

        <div className="border-t pt-5">
          <form
            action={setTripCover}
            className="flex flex-col gap-5"
          >
            <input
              type="hidden"
              name="mediaId"
              value={asset.id}
            />

            <Field label="Ustaw jako zdjęcie główne">
              <select
                name="tripId"
                className="h-11 rounded-xl border bg-background px-3 text-sm"
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
              <Button
                variant="outline"
                className="rounded-xl"
              >
                Ustaw okładkę
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const initialUpdateGalleryState: UpdateGalleryItemState =
  {}

function EditGalleryItemDialog({
  item,
}: {
  item: any
}) {
  const [state, action, pending] =
    useActionState(
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
            className="rounded-xl"
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
            Zmień podpis i miasto wyświetlane przy
            zdjęciu.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-5"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <Field label="Podpis">
            <Input
              name="title"
              defaultValue={item.title}
              required
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Miasto">
            <Input
              name="city"
              defaultValue={item.city}
              className="h-11 rounded-xl"
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
              className="rounded-xl"
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
  const [open, setOpen] = useState(false)

  const [state, action, pending] =
    useActionState(
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
            className="rounded-xl"
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
            Możesz zmienić podpis i opis alternatywny
            zdjęcia.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col gap-5"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <Field label="Miasto wyjazdu">
            <Input
              value={city}
              disabled
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Podpis">
            <Input
              name="caption"
              defaultValue={item.caption}
              maxLength={160}
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Opis alternatywny">
            <Input
              name="alt"
              defaultValue={item.alt}
              maxLength={240}
              placeholder={`Zdjęcie z wyjazdu do ${city}`}
              className="h-11 rounded-xl"
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
              className="rounded-xl"
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

/* -------------------------------------------------------------------------- */
/* TESTIMONIALS                                                               */
/* -------------------------------------------------------------------------- */

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
          <DialogTitle className="text-xl">
            {item
              ? "Edytuj opinię"
              : "Nowa opinia"}
          </DialogTitle>

          <DialogDescription>
            Opinie opublikowane są widoczne na stronie
            głównej.
          </DialogDescription>
        </DialogHeader>

        <form
          action={saveTestimonial}
          className="flex flex-col gap-5"
        >
          {item && (
            <input
              type="hidden"
              name="id"
              value={item.id}
            />
          )}

          <Field label="Autor">
            <Input
              name="author"
              defaultValue={item?.author}
              required
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Wyjazd">
            <Input
              name="tripName"
              defaultValue={item?.tripName}
              className="h-11 rounded-xl"
            />
          </Field>

          <Field label="Treść">
            <Textarea
              name="content"
              defaultValue={item?.content}
              required
              className="rounded-xl"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ocena">
              <Input
                name="rating"
                type="number"
                min="1"
                max="5"
                defaultValue={
                  item?.rating || 5
                }
                className="h-11 rounded-xl"
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                defaultValue={
                  item?.status ||
                  "published"
                }
                className="h-11 rounded-xl border bg-background px-3 text-sm"
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
            <Button
              type="submit"
              className="rounded-xl font-semibold"
            >
              Zapisz opinię
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/* SETTINGS                                                                   */
/* -------------------------------------------------------------------------- */

function SettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const fields = [
    [
      "seoTitle",
      "Tytuł SEO strony",
      "Let’s Gol — wyjazdy na mecze piłkarskie",
    ],
    [
      "seoDescription",
      "Opis SEO strony",
      "Kompleksowe wyjazdy na największe mecze w Europie: bilety, lot, hotel i opieka koordynatora.",
    ],
    [
      "heroEyebrow",
      "Nadtytuł hero",
      "Wyjazdy na największe mecze Europy",
    ],
    [
      "heroTitle",
      "Główny nagłówek",
      "Ty wybierasz mecz. My organizujemy resztę.",
    ],
    [
      "heroDescription",
      "Opis hero",
      "Bilety, lot, hotel i opieka koordynatora w jednym pakiecie.",
    ],
    [
      "heroCta",
      "Przycisk hero",
      "Zobacz wyjazdy",
    ],
    [
      "tripsTitle",
      "Nagłówek sekcji wyjazdów",
      "Najbliższe wyjazdy",
    ],
    [
      "tripsDescription",
      "Opis sekcji wyjazdów",
      "Wybierz gotowy pakiet i zajmij miejsce na trybunach największych stadionów Europy.",
    ],
    [
      "customTripTitle",
      "Nagłówek wyjazdu indywidualnego",
      "Nie ma meczu na liście? Zorganizujemy go dla Ciebie",
    ],
    [
      "packageTitle",
      "Nagłówek pakietu",
      "Co zawiera pełny pakiet?",
    ],
    [
      "benefitsTitle",
      "Nagłówek przewag",
      "Let’s Gol pilnuje szczegółów. Ty przeżywasz mecz.",
    ],
    [
      "processTitle",
      "Nagłówek procesu",
      "Jak wygląda rezerwacja?",
    ],
    [
      "galleryTitle",
      "Nagłówek galerii",
      "Galeria z wyjazdów",
    ],
    [
      "testimonialsTitle",
      "Nagłówek opinii",
      "Emocje potwierdzone na trybunach",
    ],
    [
      "faqTitle",
      "Nagłówek FAQ",
      "Najczęstsze pytania",
    ],
    [
      "youtubeTitle",
      "Nagłówek YouTube",
      "Najnowsze na YouTube",
    ],
    [
      "aboutTitle",
      "Nagłówek O nas",
      "Jedziemy razem, kibicujemy razem",
    ],
    [
      "aboutText",
      "Opis O nas",
      "Tworzymy wyjazdy, które zostają w pamięci na lata.",
    ],
    [
      "contactTitle",
      "Nagłówek kontaktu",
      "Jaki mecz chodzi Ci po głowie?",
    ],
    [
      "contactEmail",
      "E-mail kontaktowy",
      "kontakt@letsgol.pl",
    ],
    [
      "contactPhone",
      "Telefon",
      "+48 000 000 000",
    ],
    [
      "footerText",
      "Opis w stopce",
      "Kompleksowe wyjazdy na mecze w Europie.",
    ],
    [
      "companyName",
      "Nazwa firmy",
      "Let's Gol Sp. z o.o.",
    ],
    [
      "companyAddress",
      "Adres firmy",
      "00-100 Warszawa",
    ],
    [
      "companyNip",
      "NIP",
      "123 456 78 90",
    ],
  ] as const

  const [state, action, pending] =
    useActionState(
      saveSettings,
      initialSaveSettingsState
    )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-background/50 px-6 py-5">
        <CardTitle className="text-xl">
          Najważniejsze teksty
        </CardTitle>

        <CardDescription className="text-sm">
          Puste pola użyją bezpiecznych treści
          domyślnych.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form
          action={action}
          className="grid gap-5 md:grid-cols-2"
        >
          {fields.map(
            ([key, label, fallback]) => (
              <Field
                key={key}
                label={label}
              >
                {key.endsWith("Text") ||
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
                    className="rounded-xl"
                  />
                ) : (
                  <Input
                    name={`setting.${key}`}
                    defaultValue={
                      settings[key] ||
                      fallback
                    }
                    className="h-11 rounded-xl"
                  />
                )}
              </Field>
            )
          )}

          <Field label="Liczba zdjęć w galerii na stronie głównej">
            <Input
              name="setting.galleryHomeLimit"
              type="number"
              min="1"
              max="5"
              defaultValue={
                settings.galleryHomeLimit ||
                "5"
              }
              className="h-11 rounded-xl"
            />
          </Field>

          <div className="flex flex-col gap-3 md:col-span-2">
            {state.error && (
              <p className="text-sm text-destructive">
                {state.error}
              </p>
            )}

            {state.success && (
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <Check className="size-4" />
                Treści strony zostały zapisane.
              </p>
            )}

            <Button
              type="submit"
              className="h-11 self-start rounded-xl font-semibold"
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
