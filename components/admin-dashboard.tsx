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
  CheckCircle2,
  ChevronDown,
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
  MoreHorizontal,
  Pencil,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  Upload,
  Users,
  AlertCircle,
  ImagePlus,
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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                 */
/* -------------------------------------------------------------------------- */

const navigationGroups = [
  {
    label: null,
    items: [
      ["dashboard", "Pulpit", LayoutDashboard],
    ],
  },
  {
    label: "Sprzedaż",
    items: [
      ["trips", "Wyjazdy", Plane],
      ["inquiries", "Zapytania", Inbox],
    ],
  },
  {
    label: "Zawartość",
    items: [
      ["media", "Media", FileImage],
      ["testimonials", "Opinie", Star],
      ["youtube", "YouTube", Clapperboard],
    ],
  },
  {
    label: "Strona",
    items: [
      ["content", "Treści strony", BookOpen],
    ],
  },
  {
    label: "System",
    items: [
      ["account", "Ustawienia", Settings],
    ],
  },
] as const

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const formatActivityDate = (date: Date | string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))

function getActivityInfo(item: any) {
  switch (item.action) {
    case "created":
      if (item.entityType === "trip") {
        return {
          title: "Utworzono wyjazd",
          description: item.details
            ? `Dodano wyjazd „${item.details}”.`
            : "Dodano nowy wyjazd.",
          icon: Plane,
        }
      }

      if (item.entityType === "testimonial") {
        return {
          title: "Dodano opinię",
          description: item.details
            ? `Dodano opinię klienta „${item.details}”.`
            : "Dodano nową opinię klienta.",
          icon: Star,
        }
      }

      return {
        title: "Utworzono",
        description: item.details || "Dodano nowy element.",
        icon: Plus,
      }

    case "updated":
      if (item.entityType === "trip") {
        return {
          title: "Zaktualizowano wyjazd",
          description: item.details
            ? `Zmieniono dane wyjazdu „${item.details}”.`
            : "Zmieniono dane wyjazdu.",
          icon: Plane,
        }
      }

      if (item.entityType === "settings") {
        return {
          title: "Zaktualizowano treści strony",
          description: "Zmieniono ustawienia treści strony.",
          icon: Settings,
        }
      }

      if (
        item.entityType === "media" ||
        item.entityType === "gallery" ||
        item.entityType === "trip_gallery"
      ) {
        return {
          title:
            item.entityType === "trip_gallery"
              ? "Zaktualizowano zdjęcie w galerii"
              : item.entityType === "gallery"
                ? "Zaktualizowano galerię"
                : "Zaktualizowano zdjęcie",
          description:
            item.entityType === "trip_gallery"
              ? "Zmieniono informacje dotyczące zdjęcia przypisanego do wyjazdu."
              : item.entityType === "gallery"
                ? "Zmieniono informacje dotyczące zdjęcia w galerii."
                : "Zmieniono informacje dotyczące zdjęcia.",
          icon: FileImage,
        }
      }

      if (item.entityType === "inquiry") {
        return {
          title: "Zaktualizowano zapytanie",
          description: item.details
            ? `Zmieniono status zapytania: ${item.details}.`
            : "Zmieniono dane zapytania.",
          icon: Inbox,
        }
      }

      return {
        title: "Zaktualizowano",
        description: item.details || "Wprowadzono zmianę.",
        icon: RefreshCw,
      }

    case "deleted":
      if (item.entityType === "trip") {
        return {
          title: "Usunięto wyjazd",
          description: item.details
            ? `Usunięto wyjazd „${item.details}”.`
            : "Wyjazd został usunięty.",
          icon: Archive,
        }
      }

      if (item.entityType === "media") {
        return {
          title: "Usunięto zdjęcie",
          description: item.details
            ? `Usunięto zdjęcie „${item.details}”.`
            : "Zdjęcie zostało usunięte z biblioteki.",
          icon: FileImage,
        }
      }

      return {
        title: "Usunięto",
        description: item.details || "Element został usunięty.",
        icon: Archive,
      }

    case "uploaded":
      return {
        title: "Wgrano zdjęcie",
        description: item.details
          ? `Dodano zdjęcie „${item.details}” do biblioteki.`
          : "Dodano nowe zdjęcie do biblioteki.",
        icon: Upload,
      }

    case "duplicated":
      return {
        title: "Zduplikowano wyjazd",
        description: item.details
          ? `Utworzono kopię wyjazdu „${item.details}”.`
          : "Utworzono kopię wyjazdu.",
        icon: Copy,
      }

    case "published":
      return {
        title: "Opublikowano wyjazd",
        description: item.details
          ? `Wyjazd „${item.details}” jest teraz widoczny na stronie.`
          : "Wyjazd został opublikowany.",
        icon: CheckCircle2,
      }

    case "draft":
      return {
        title: "Ukryto wyjazd",
        description: item.details
          ? `Wyjazd „${item.details}” został ukryty na stronie.`
          : "Wyjazd został przeniesiony do szkiców.",
        icon: Archive,
      }

    case "synced":
      return {
        title: "Odświeżono filmy YouTube",
        description:
          item.details || "Lista filmów YouTube została zaktualizowana.",
        icon: Clapperboard,
      }

    case "updated_cover":
      return {
        title: "Zmieniono zdjęcie główne",
        description: "Zmieniono zdjęcie główne wyjazdu.",
        icon: ImagePlus,
      }

    case "added":
      if (item.entityType === "trip_gallery") {
        return {
          title: "Dodano zdjęcie do galerii wyjazdu",
          description: "Zdjęcie zostało przypisane do galerii wyjazdu.",
          icon: ImagePlus,
        }
      }

      if (item.entityType === "gallery") {
        return {
          title: "Dodano zdjęcie do galerii",
          description: "Zdjęcie zostało dodane do galerii strony głównej.",
          icon: ImagePlus,
        }
      }

      return {
        title: "Dodano element",
        description: item.details || "Dodano nowy element.",
        icon: Plus,
      }

    case "removed":
      if (item.entityType === "trip_gallery") {
        return {
          title: "Usunięto zdjęcie z galerii wyjazdu",
          description: "Zdjęcie zostało usunięte z galerii wyjazdu.",
          icon: Archive,
        }
      }

      if (item.entityType === "global_gallery") {
        return {
          title: "Usunięto zdjęcie z galerii",
          description: "Zdjęcie zostało usunięte z galerii strony głównej.",
          icon: Archive,
        }
      }

      return {
        title: "Usunięto element z galerii",
        description: "Element został usunięty z galerii.",
        icon: Archive,
      }

    default:
      return {
        title: "Wprowadzono zmianę",
        description: item.details || "Wykonano zmianę w panelu.",
        icon: RefreshCw,
      }
  }
}

/* -------------------------------------------------------------------------- */
/* SORTABLE GALLERY ITEM                                                      */
/* -------------------------------------------------------------------------- */

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
  } = useSortable({
    id: item.id,
  })

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

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD                                                             */
/* -------------------------------------------------------------------------- */

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

  const publishedTrips = data.trips.filter(
    (trip) => trip.status === "published"
  ).length

  const draftTrips = data.trips.filter(
    (trip) => trip.status !== "published"
  ).length

  const averageRating =
    data.testimonials.length > 0
      ? (
          data.testimonials.reduce(
            (sum, item) => sum + Number(item.rating || 0),
            0
          ) / data.testimonials.length
        ).toFixed(1)
      : "0.0"

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
      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR                                                            */}
      {/* ------------------------------------------------------------------ */}

      <aside className="border-b bg-foreground text-background lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-background/10 px-5 py-5">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Let&apos;s Gol
            </p>

            <p className="mt-1 truncate text-lg font-black uppercase tracking-tight">
              Centrum dowodzenia
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/" />}
            className="shrink-0 text-background hover:bg-background/10 hover:text-background"
          >
            <Home className="size-4" />
            <span className="sr-only">Strona główna</span>
          </Button>
        </div>

        <TabsList
          variant="line"
          className="flex h-auto w-full flex-row justify-start overflow-x-auto rounded-none bg-transparent p-3 text-background/60 lg:flex-col lg:items-stretch lg:overflow-visible"
        >
          {navigationGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-row gap-1 lg:flex-col"
            >
              {group.label ? (
                <p className="hidden px-3 pb-1 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-background/35 lg:block">
                  {group.label}
                </p>
              ) : null}

              {group.items.map(([value, label, Icon]) => (
                <TabsTrigger
                  key={value}
                  id={`tab-${value}`}
                  value={value}
                  className="group min-w-max justify-start gap-3 rounded-lg px-3 py-2.5 text-background/55 transition-all duration-200 hover:bg-background/8 hover:text-background data-active:bg-primary/15 data-active:text-primary data-active:shadow-[inset_3px_0_0_currentColor] lg:min-w-0"
                >
                  <Icon className="size-4 shrink-0 transition-transform group-hover:scale-105" />

                  <span>{label}</span>

                  {value === "inquiries" && newLeads > 0 ? (
                    <Badge className="ml-auto min-w-6 justify-center rounded-full px-1.5 text-[10px]">
                      {newLeads}
                    </Badge>
                  ) : null}
                </TabsTrigger>
              ))}
            </div>
          ))}
        </TabsList>

        <div className="hidden border-t border-background/10 p-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:block">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-background/5 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
              {data.email.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-background">
                {data.email}
              </p>

              <p className="text-xs text-background/40">
                Administrator
              </p>
            </div>
          </div>

          <form action={signOutAdmin}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-background/60 hover:bg-background/10 hover:text-background"
            >
              <LogOut className="size-4" />
              Wyloguj
            </Button>
          </form>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN                                                               */}
      {/* ------------------------------------------------------------------ */}

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 xl:p-10">
        {/* ================================================================ */}
        {/* DASHBOARD                                                        */}
        {/* ================================================================ */}

        <TabsContent value="dashboard">
          <SectionHeader
            eyebrow="Przegląd"
            title="Pulpit"
            description="Najważniejsze informacje i szybkie akcje w jednym miejscu."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={Plane}
              label="Aktywne wyjazdy"
              value={publishedTrips}
            />

            <Metric
              icon={Inbox}
              label="Nowe zapytania"
              value={newLeads}
              accent={newLeads > 0}
            />

            <Metric
              icon={FileImage}
              label="Zdjęcia w bibliotece"
              value={data.media.length}
            />

            <Metric
              icon={Star}
              label="Średnia ocena"
              value={Number(averageRating)}
              suffix="/ 5"
            />
          </div>

          {(newLeads > 0 || draftTrips > 0) && (
            <Card className="mt-6 overflow-hidden">
              <CardHeader className="border-b bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlertCircle className="size-5" />
                  </div>

                  <div>
                    <CardTitle>Wymaga uwagi</CardTitle>
                    <CardDescription>
                      Elementy, które mogą wymagać Twojej reakcji.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="divide-y p-0">
                {newLeads > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("tab-inquiries")
                        ?.click()
                    }
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Inbox className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {newLeads}{" "}
                        {newLeads === 1
                          ? "nowe zapytanie"
                          : "nowe zapytania"}{" "}
                        klientów
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Otwórz skrzynkę zapytań i odpowiedz klientom.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-primary">
                      Przejdź →
                    </span>
                  </button>
                )}

                {draftTrips > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("tab-trips")
                        ?.click()
                    }
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Archive className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {draftTrips}{" "}
                        {draftTrips === 1
                          ? "wyjazd wymaga"
                          : "wyjazdy wymagają"}{" "}
                        sprawdzenia
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Szkice nie są obecnie widoczne na stronie.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-primary">
                      Zobacz →
                    </span>
                  </button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
            {/* QUICK ACTIONS */}

            <Card>
              <CardHeader>
                <CardTitle>Szybkie działania</CardTitle>
                <CardDescription>
                  Najczęściej używane operacje.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-3 sm:grid-cols-3">
                <QuickAction
                  icon={Plus}
                  title="Nowy wyjazd"
                  description="Utwórz nową ofertę"
                  onClick={() => {
                    const button = document.querySelector(
                      '[data-new-trip]'
                    ) as HTMLButtonElement | null

                    button?.click()
                  }}
                />

                <QuickAction
                  icon={Upload}
                  title="Dodaj zdjęcia"
                  description="Do biblioteki mediów"
                  onClick={() =>
                    document
                      .getElementById("tab-media")
                      ?.click()
                  }
                />

                <QuickAction
                  icon={BookOpen}
                  title="Edytuj stronę"
                  description="Treści i SEO"
                  onClick={() =>
                    document
                      .getElementById("tab-content")
                      ?.click()
                  }
                />
              </CardContent>
            </Card>

            {/* ACTIVITY */}

            <Card>
              <CardHeader>
                <CardTitle>Ostatnia aktywność</CardTitle>
                <CardDescription>
                  Ostatnie zmiany w panelu.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="relative">
                  {data.activity.slice(0, 6).map(
                    (item, index) => {
                      const activity = getActivityInfo(item)
                      const Icon = activity.icon

                      return (
                        <div
                          key={item.id}
                          className="relative flex gap-3 pb-5 last:pb-0"
                        >
                          {index !==
                            Math.min(
                              data.activity.length,
                              6
                            ) -
                              1 && (
                            <span className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-border" />
                          )}

                          <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                            <Icon className="size-3.5" />
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
                                className="shrink-0 text-[10px] text-muted-foreground"
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
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================================================================ */}
        {/* TRIPS                                                            */}
        {/* ================================================================ */}

        <TabsContent value="trips">
          <SectionHeader
            eyebrow="Oferta"
            title="Wyjazdy"
            description="Twórz, edytuj, publikuj, duplikuj i archiwizuj oferty."
            action={
              <TripDialog
                trigger={
                  <Button data-new-trip>
                    <Plus />
                    Nowy wyjazd
                  </Button>
                }
              />
            }
          />

          <Card>
            <CardContent className="pt-6">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    placeholder="Szukaj po nazwie lub mieście"
                    className="pl-9"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {filteredTrips.length}{" "}
                  {filteredTrips.length === 1
                    ? "oferta"
                    : "ofert"}
                </p>
              </div>

              <div className="space-y-3">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group rounded-xl border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="hidden size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
                          {trip.image ? (
                            <img
                              src={
                                trip.image.startsWith(
                                  "/api/"
                                )
                                  ? trip.image
                                  : trip.image
                              }
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <Plane className="size-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-bold">
                              {trip.title}
                            </h3>

                            <StatusBadge
                              status={trip.status}
                            />
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {trip.city}, {trip.country}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t pt-3 sm:grid-cols-3 lg:min-w-[420px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Termin
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {trip.startDate}
                            {trip.endDate
                              ? ` – ${trip.endDate}`
                              : ""}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Cena
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {trip.price.toLocaleString(
                              "pl-PL"
                            )}{" "}
                            zł
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 sm:col-span-1">
                          <TripDialog
                            trip={trip}
                            trigger={
                              <Button
                                size="icon-sm"
                                variant="outline"
                                title="Edytuj"
                              >
                                <Pencil />
                                <span className="sr-only">
                                  Edytuj
                                </span>
                              </Button>
                            }
                          />

                          <form action={duplicateTrip}>
                            <input
                              type="hidden"
                              name="id"
                              value={trip.id}
                            />

                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="outline"
                              title="Duplikuj"
                            >
                              <Copy />
                              <span className="sr-only">
                                Duplikuj
                              </span>
                            </Button>
                          </form>

                          <TripActionsMenu trip={trip} />

                          <DeleteTripDialog
                            tripId={trip.id}
                            tripTitle={trip.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTrips.length === 0 && (
                  <EmptyState
                    icon={Search}
                    title="Nie znaleziono wyjazdów"
                    description="Spróbuj zmienić wyszukiwaną frazę."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* MEDIA                                                             */}
        {/* ================================================================ */}

        <TabsContent value="media">
          <SectionHeader
            eyebrow="Biblioteka"
            title="Media"
            description="Wgrywaj zdjęcia raz i wykorzystuj je w wielu miejscach."
            action={
              <Button
                onClick={() =>
                  document
                    .getElementById("media-upload")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                <Upload />
                Dodaj zdjęcia
              </Button>
            }
          />

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <MiniStat
              label="Wszystkie pliki"
              value={data.media.length}
              icon={FileImage}
            />

            <MiniStat
              label="Galeria główna"
              value={data.gallery.length}
              icon={ImagePlus}
            />

            <MiniStat
              label="Galerie wyjazdów"
              value={data.tripGallery.length}
              icon={Plane}
            />
          </div>

          <div
            id="media-upload"
            className="grid gap-6 xl:grid-cols-[360px_1fr]"
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Dodaj zdjęcie</CardTitle>
                <CardDescription>
                  JPEG, PNG, WebP lub AVIF. Maksymalnie 15
                  MB. Plik zostanie automatycznie
                  zoptymalizowany.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  action={uploadMedia}
                  className="flex flex-col gap-5"
                >
                  <div className="rounded-xl border-2 border-dashed bg-muted/20 p-6 text-center">
                    <Upload className="mx-auto mb-3 size-8 text-muted-foreground" />

                    <p className="text-sm font-medium">
                      Wybierz zdjęcie
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG, WebP, AVIF
                    </p>

                    <Input
                      name="file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      required
                      className="mt-4"
                    />
                  </div>

                  <Field label="Opis alternatywny">
                    <Input
                      name="alt"
                      placeholder="Kibice na stadionie w Mediolanie"
                    />
                  </Field>

                  <Button type="submit">
                    <Upload />
                    Wgraj do biblioteki
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {data.media.map((asset) => (
                <Card
                  key={asset.id}
                  className="group overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={`/api/media/${asset.id}`}
                      alt={
                        asset.alt ||
                        asset.originalName
                      }
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute right-2 top-2">
                      <Badge className="bg-black/70 text-white backdrop-blur-sm">
                        #{asset.id}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="flex flex-col gap-3 pt-4">
                    <div>
                      <p className="truncate font-medium">
                        {asset.originalName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {Math.round(
                          asset.size / 1024
                        )}{" "}
                        KB
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
                      />

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

              {data.media.length === 0 && (
                <EmptyState
                  icon={FileImage}
                  title="Biblioteka jest pusta"
                  description="Dodaj pierwsze zdjęcie, aby rozpocząć."
                />
              )}
            </div>
          </div>

          {/* GLOBAL GALLERY */}

          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>
                    Galeria strony głównej
                  </CardTitle>

                  <CardDescription>
                    Przeciągaj zdjęcia, aby zmienić ich
                    kolejność.
                  </CardDescription>
                </div>

                <Badge variant="secondary">
                  {galleryItems.length} zdjęć
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
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
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {galleryItems.map((item, index) => (
                      <SortableGalleryItem
                        key={item.id}
                        item={item}
                      >
                        <div className="overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-md">
                          <div className="relative aspect-video overflow-hidden bg-muted">
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
                              className="size-full object-cover"
                            />

                            <div className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white backdrop-blur-sm">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 p-3">
                            <div>
                              <p className="truncate font-medium">
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
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          {/* TRIP GALLERIES */}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Galerie wyjazdów</CardTitle>

              <CardDescription>
                Zdjęcia przypisane do poszczególnych
                ofert.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-8">
              {data.trips
                .filter((trip) =>
                  data.tripGallery.some(
                    (item) =>
                      item.tripId === trip.id
                  )
                )
                .map((trip) => {
                  const tripItems =
                    data.tripGallery.filter(
                      (item) =>
                        item.tripId === trip.id
                    )

                  return (
                    <section key={trip.id}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold">
                            {trip.title}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {trip.city}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {tripItems.length}{" "}
                          {tripItems.length === 1
                            ? "zdjęcie"
                            : "zdjęć"}
                        </Badge>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {tripItems.map((item) => (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border bg-background"
                          >
                            <div className="aspect-video overflow-hidden bg-muted">
                              <img
                                src={`/api/media/${item.mediaId}`}
                                alt={
                                  item.alt ||
                                  item.caption ||
                                  trip.title
                                }
                                className="size-full object-cover"
                              />
                            </div>

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
                  )
                })}

              {data.tripGallery.length === 0 && (
                <EmptyState
                  icon={ImagePlus}
                  title="Brak galerii wyjazdów"
                  description="Przypisz zdjęcia do wyjazdów z poziomu biblioteki mediów."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* CONTENT                                                           */}
        {/* ================================================================ */}

        <TabsContent value="content">
          <SectionHeader
            eyebrow="Mini-CMS"
            title="Treści strony"
            description="Zmień kluczowe komunikaty bez edycji kodu."
          />

          <SettingsForm settings={data.settings} />
        </TabsContent>

        {/* ================================================================ */}
        {/* TESTIMONIALS                                                      */}
        {/* ================================================================ */}

        <TabsContent value="testimonials">
          <SectionHeader
            eyebrow="Wiarygodność"
            title="Opinie klientów"
            description="Publikuj i porządkuj rekomendacje."
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
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users className="size-4" />
                        </div>

                        <CardTitle className="truncate">
                          {item.author}
                        </CardTitle>
                      </div>

                      <CardDescription>
                        {item.tripName || "Wyjazd klienta"}
                      </CardDescription>
                    </div>

                    <StatusBadge
                      status={item.status}
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-3 flex gap-0.5 text-primary">
                    {"★".repeat(item.rating)}
                  </div>

                  <p className="mb-5 text-sm leading-6 text-muted-foreground">
                    „{item.content}”
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

        {/* ================================================================ */}
        {/* YOUTUBE                                                           */}
        {/* ================================================================ */}

        <TabsContent value="youtube">
          <SectionHeader
            eyebrow="Kanał wideo"
            title="YouTube"
            description="Podaj adres kanału, a najnowsze filmy pojawią się na stronie głównej."
          />

          <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle>
                  Konfiguracja kanału
                </CardTitle>

                <CardDescription>
                  Obsługiwane są adresy /channel/UC…,
                  /@nazwa oraz /user/nazwa.
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
                  Podgląd najnowszych filmów
                </CardTitle>

                <CardDescription>
                  {data.videos.length
                    ? `Pobrano ${data.videos.length} filmów z kanału.`
                    : "Po zapisaniu poprawnego kanału zobaczysz tutaj podgląd."}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                {data.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex gap-3 p-3">
                      <p className="line-clamp-2 flex-1 text-sm font-medium">
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

        {/* ================================================================ */}
        {/* INQUIRIES                                                        */}
        {/* ================================================================ */}

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
                Eksportuj CSV
              </Button>
            }
          />

          <div className="mb-5 flex items-center gap-2">
            <Badge>
              {newLeads} nowych
            </Badge>

            <span className="text-sm text-muted-foreground">
              {data.inquiries.length} wszystkich zapytań
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {data.inquiries.map((lead) => (
              <Card
                key={lead.id}
                className={
                  lead.status === "new"
                    ? "border-primary/30 shadow-sm"
                    : ""
                }
              >
                <CardContent className="grid gap-5 pt-6 lg:grid-cols-[.8fr_1.2fr_auto]">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <strong>{lead.name}</strong>

                      <StatusBadge
                        status={lead.status}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <a
                        className="text-sm text-primary underline-offset-4 hover:underline"
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
                  </div>

                  <div>
                    <p className="font-semibold">
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
                    className="flex min-w-72 flex-col gap-2"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={lead.id}
                    />

                    <select
                      name="status"
                      defaultValue={lead.status}
                      className="h-9 rounded-lg border bg-background px-3 text-sm"
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
                      rows={2}
                    />

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

        {/* ================================================================ */}
        {/* ACCOUNT                                                           */}
        {/* ================================================================ */}

        <TabsContent value="account">
          <SectionHeader
            eyebrow="System"
            title="Ustawienia"
            description="Bezpieczeństwo konta administratora i dostęp do panelu."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Zmiana hasła
                </CardTitle>

                <CardDescription>
                  Nowe hasło powinno mieć co najmniej 12
                  znaków.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Administrator</CardTitle>

                <CardDescription>
                  Informacje o aktualnym koncie.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground">
                    {data.email
                      .charAt(0)
                      .toUpperCase()}
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

                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

                    <p className="text-sm leading-6 text-muted-foreground">
                      Dostęp jest dodatkowo ograniczony do
                      zatwierdzonego adresu e-mail oraz
                      zaufanych domen Neon Auth.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </main>
    </Tabs>
  )
}

/* -------------------------------------------------------------------------- */
/* SECTION HEADER                                                             */
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
    <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="mb-2 inline-flex bg-black px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>

        <h1 className="text-balance font-sans text-3xl font-black uppercase tracking-tight md:text-4xl">
          {title}
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>

      {action}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* METRIC                                                                    */
/* -------------------------------------------------------------------------- */

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
  accent = false,
}: {
  icon: typeof Plane
  label: string
  value: number
  suffix?: string
  accent?: boolean
}) {
  return (
    <Card
      className={
        accent
          ? "border-primary/30 shadow-sm"
          : ""
      }
    >
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-5" />
        </span>

        <div className="min-w-0">
          <p className="text-3xl font-black tracking-tight">
            {value}
            {suffix ? (
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                {suffix}
              </span>
            ) : null}
          </p>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* MINI STAT                                                                  */
/* -------------------------------------------------------------------------- */

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Plane
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div>
        <p className="font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* QUICK ACTION                                                               */
/* -------------------------------------------------------------------------- */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Plus
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start rounded-xl border bg-background p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm"
    >
      <span className="mb-5 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
        <Icon className="size-4" />
      </span>

      <p className="font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Search
  title: string
  description: string
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <p className="font-semibold">
        {title}
      </p>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TRIP ACTIONS MENU                                                          */
/* -------------------------------------------------------------------------- */

function TripActionsMenu({ trip }: { trip: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="icon-sm"
            variant="outline"
            title="Więcej operacji"
          />
        }
      >
        <MoreHorizontal />
        <span className="sr-only">
          Więcej operacji
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Operacje wyjazdu
          </DialogTitle>

          <DialogDescription>
            {trip.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
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
                trip.status === "published"
                  ? "draft"
                  : "published"
              }
            />

            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start"
            >
              {trip.status === "published" ? (
                <>
                  <Archive />
                  Ukryj wyjazd
                </>
              ) : (
                <>
                  <CheckCircle2 />
                  Publikuj wyjazd
                </>
              )}
            </Button>
          </form>

          <TripDialog
            trip={trip}
            trigger={
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setOpen(false)}
              >
                <Pencil />
                Edytuj wyjazd
              </Button>
            }
          />

          <form action={duplicateTrip}>
            <input
              type="hidden"
              name="id"
              value={trip.id}
            />

            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start"
            >
              <Copy />
              Duplikuj wyjazd
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

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
      className="whitespace-nowrap"
    >
      {labels[status] || status}
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* YOUTUBE SETTINGS                                                           */
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
          />
        </Field>

        <Field label="Widoczność">
          <select
            name="setting.youtubeEnabled"
            defaultValue={
              settings.youtubeEnabled ||
              "true"
            }
            className="h-9 rounded-lg border bg-background px-3 text-sm"
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
          Zapisano konfigurację.
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
          : "Zapisz konfigurację"}
      </Button>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* YOUTUBE SYNC                                                               */
/* -------------------------------------------------------------------------- */

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
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Lista filmów odświeża się automatycznie
          raz dziennie. Jeśli nocna próba się nie
          powiedzie, panel ponowi ją automatycznie
          po otwarciu.
        </p>
      </div>

      <p className="text-sm">
        Ostatnie odświeżenie:{" "}
        <span className="font-medium text-foreground">
          {formatted ??
            "jeszcze nie wykonano"}
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
        state.success ? "done" : "form"
      }
      action={action}
      className="flex flex-col gap-4"
    >
      <Field label="Aktualne hasło">
        <Input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Field label="Nowe hasło">
        <Input
          name="newPassword"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
        />
      </Field>

      <Field label="Powtórz nowe hasło">
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

        Wyloguj pozostałe sesje
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

/* -------------------------------------------------------------------------- */
/* TRIP DIALOG                                                                */
/* -------------------------------------------------------------------------- */

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
          <DialogTitle>
            {trip
              ? "Edytuj wyjazd"
              : "Nowy wyjazd"}
          </DialogTitle>

          <DialogDescription>
            Uzupełnij ofertę. Pod każdym polem
            znajdziesz krótką podpowiedź.
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
            hint="Pełna nazwa widoczna na karcie, np. Real Madryt vs Barcelona."
          >
            <Input
              name="title"
              defaultValue={trip?.title}
              required
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
              className="h-9 rounded-lg border bg-background px-3 text-sm"
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
            />
          </Field>

          <Field
            label="Kolejność"
            hint="Niższa liczba oznacza wcześniejsze miejsce wśród ofert o takim samym wyróżnieniu."
          >
            <Input
              name="sortOrder"
              type="number"
              defaultValue={
                trip?.sortOrder || 0
              }
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
              hint="Wpisz jeden element pakietu w każdej linii."
            >
              <Textarea
                name="includes"
                defaultValue={trip?.includes?.join(
                  "\n"
                )}
                rows={5}
              />
            </Field>
          </div>

          <Field
            label="Tytuł SEO"
            hint="Tytuł w Google. Najlepiej około 50–60 znaków; pusty użyje tytułu wyjazdu."
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
                Oferta pojawi się przed
                pozostałymi i otrzyma
                etykietę „Polecany wyjazd”.
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

/* -------------------------------------------------------------------------- */
/* GALLERY DIALOG                                                             */
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
            Dodaj zdjęcie do galerii albo ustaw je
            jako okładkę wyjazdu.
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

          <Field label="Miejsce w galerii">
            <select
              name="tripId"
              className="h-9 rounded-lg border bg-background px-3 text-sm"
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
            <Input name="caption" />
          </Field>

          <Field label="Miasto (galeria główna)">
            <Input name="city" />
          </Field>

          <Field label="Alt">
            <Input
              name="alt"
              defaultValue={asset.alt}
            />
          </Field>

          <Field label="Kolejność">
            <Input
              name="sortOrder"
              type="number"
              defaultValue="0"
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

            <Field label="Ustaw jako zdjęcie główne">
              <select
                name="tripId"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
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
                Ustaw okładkę
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/* EDIT GLOBAL GALLERY                                                        */
/* -------------------------------------------------------------------------- */

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
            Zmień podpis i miasto wyświetlane
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

          <Field label="Podpis">
            <Input
              name="title"
              defaultValue={item.title}
              required
            />
          </Field>

          <Field label="Miasto">
            <Input
              name="city"
              defaultValue={item.city}
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

/* -------------------------------------------------------------------------- */
/* EDIT TRIP GALLERY                                                          */
/* -------------------------------------------------------------------------- */

function EditTripGalleryItemDialog({
  item,
  city,
}: {
  item: any
  city: string
}) {
  const [open, setOpen] =
    useState(false)

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
            Miasto wynika z przypisanego
            wyjazdu. Możesz zmienić podpis i opis
            alternatywny zdjęcia.
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

          <Field label="Miasto wyjazdu">
            <Input
              value={city}
              disabled
            />
          </Field>

          <Field label="Podpis">
            <Input
              name="caption"
              defaultValue={
                item.caption
              }
              maxLength={160}
            />
          </Field>

          <Field label="Opis alternatywny">
            <Input
              name="alt"
              defaultValue={item.alt}
              maxLength={240}
              placeholder={`Zdjęcie z wyjazdu do ${city}`}
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

/* -------------------------------------------------------------------------- */
/* TESTIMONIAL DIALOG                                                         */
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
          <DialogTitle>
            {item
              ? "Edytuj opinię"
              : "Nowa opinia"}
          </DialogTitle>

          <DialogDescription>
            Opinie opublikowane są widoczne na
            stronie głównej.
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

          <Field label="Autor">
            <Input
              name="author"
              defaultValue={
                item?.author
              }
              required
            />
          </Field>

          <Field label="Wyjazd">
            <Input
              name="tripName"
              defaultValue={
                item?.tripName
              }
            />
          </Field>

          <Field label="Treść">
            <Textarea
              name="content"
              defaultValue={
                item?.content
              }
              required
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Ocena">
              <Input
                name="rating"
                type="number"
                min="1"
                max="5"
                defaultValue={
                  item?.rating || 5
                }
              />
            </Field>

            <Field label="Kolejność">
              <Input
                name="sortOrder"
                type="number"
                defaultValue={
                  item?.sortOrder || 0
                }
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                defaultValue={
                  item?.status ||
                  "published"
                }
                className="h-9 rounded-lg border bg-background px-3 text-sm"
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

/* -------------------------------------------------------------------------- */
/* SETTINGS FORM                                                              */
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
    <Card>
      <CardHeader>
        <CardTitle>
          Najważniejsze teksty
        </CardTitle>

        <CardDescription>
          Edytuj treści widoczne na stronie bez
          potrzeby zmiany kodu.
        </CardDescription>
      </CardHeader>

      <CardContent>
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