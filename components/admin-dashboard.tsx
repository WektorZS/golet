
"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  Archive,
  BookOpen,
  CheckCircle2,
  Clapperboard,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileImage,
  HelpCircle,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trophy,
  Upload,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"


import {
  archiveTestimonial,
  addGalleryItem,
  reorderGalleryItems,
    addYouTubeVideoToHomepage,
  removeYouTubeVideoFromHomepage,
  reorderYouTubeVideos,
  type AddGalleryItemState,
  deleteMedia,
  duplicateTrip,
  removeGalleryItem,
  type SaveSettingsState,
  type SaveTripState,
  type SaveTeamState,
  type SaveLeagueState,
  deleteLeague,
  deleteTeam,
  saveLeague,
  saveTeam,
  saveSettings,
  deleteInquiry,
  saveTestimonial,
  saveTrip,
  setTripCover,
  setTripStatus,
  type SyncYouTubeState,
  syncYouTubeNow,
  type UpdateGalleryItemState,
  updateGalleryItem,
  updateTripGalleryItem,
  updateTeamGalleryItem as updateTeamGalleryItemState,
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
import { getPackageVariants, packageFeatures, packageVariantOptions, parsePackageItems } from "@/lib/package-options"

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
  teams: any[]
  leagues: any[]
  inquiries: any[]
  testimonials: any[]
  media: any[]
  gallery: any[]
  tripGallery: any[]
  teamGallery: any[]
  settings: Record<string, string>
  activity: any[]
  videos: any[]
  email: string
}

const sections = [
  ["dashboard", "Pulpit", LayoutDashboard],
  ["trips", "Wyjazdy", Plane],
  ["teams", "Drużyny", Trophy],
  ["leagues", "Ligi", Star],
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

const formatInquiryDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
const getInquiryWaitingTime = (date: Date | string) => {
  const created = new Date(date).getTime()
  const now = Date.now()

  const diffMs = Math.max(0, now - created)
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return {
      label: "Dzisiaj",
      className: "text-muted-foreground",
      dotClassName: "bg-muted-foreground",
    }
  }

  if (diffDays === 1) {
    return {
      label: "1 dzień temu",
      className: "font-semibold text-amber-600 dark:text-amber-400",
      dotClassName: "bg-amber-500",
    }
  }

  if (diffDays < 4) {
    return {
      label: `${diffDays} dni temu`,
      className: "font-semibold text-orange-600 dark:text-orange-400",
      dotClassName: "bg-orange-500",
    }
  }

  return {
    label: `${diffDays} dni temu`,
    className: "font-bold text-red-600 dark:text-red-400",
    dotClassName: "bg-red-500",
  }
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
  const [tripStatusFilter, setTripStatusFilter] = useState("all")
const [tripSort, setTripSort] = useState("nearest")
  const [inquiryTab, setInquiryTab] = useState<
  "new" | "contacted" | "closed"
>("new")
  const [activeSection, setActiveSection] = useState<(typeof sections)[number][0]>("dashboard")
  const [galleryItems, setGalleryItems] = useState(data.gallery)
  const [youtubeItems, setYoutubeItems] = useState(data.videos)

  useEffect(() => {
    const savedSection = window.sessionStorage.getItem("admin-active-section")
    if (sections.some(([value]) => value === savedSection)) {
      setActiveSection(savedSection as (typeof sections)[number][0])
    }
  }, [])

  useEffect(() => {
    setGalleryItems(data.gallery)
  }, [data.gallery])

  useEffect(() => {
  setYoutubeItems(data.videos)
}, [data.videos])

const featuredYouTubeItems = useMemo(
  () =>
    youtubeItems
      .filter((video) => video.featured)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  [youtubeItems]
)

const youtubeLibraryItems = useMemo(
  () =>
    [...youtubeItems].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    ),
  [youtubeItems]
)

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

  const filteredTrips = useMemo(() => {
  const result = data.trips.filter((trip) => {
    const search = query.trim().toLowerCase()

    const matchesSearch =
      !search ||
      trip.title.toLowerCase().includes(search) ||
      trip.city.toLowerCase().includes(search) ||
      trip.country.toLowerCase().includes(search)

    const expired =
      trip.status === "published" &&
      isTripExpired(trip)

    const matchesStatus =
      tripStatusFilter === "all" ||
      (tripStatusFilter === "published" &&
        trip.status === "published" &&
        !expired) ||
      (tripStatusFilter === "draft" &&
        trip.status === "draft") ||
      (tripStatusFilter === "expired" &&
        expired)

    return matchesSearch && matchesStatus
  })

  return [...result].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()

    if (tripSort === "nearest") {
      return dateA - dateB
    }

    if (tripSort === "furthest") {
      return dateB - dateA
    }

    if (tripSort === "newest") {
      return b.id - a.id
    }

    return 0
  })
}, [data.trips, query, tripStatusFilter, tripSort])

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

const handleYouTubeDragEnd = async (event: any) => {
  const { active, over } = event

  if (!over || active.id === over.id) return

  const currentFeatured = youtubeItems
    .filter((video) => video.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const oldIndex = currentFeatured.findIndex(
    (video) => video.id === active.id
  )

  const newIndex = currentFeatured.findIndex(
    (video) => video.id === over.id
  )

  if (oldIndex === -1 || newIndex === -1) return

  const reordered = arrayMove(
    currentFeatured,
    oldIndex,
    newIndex
  ).map((video, index) => ({
    ...video,
    sortOrder: index,
  }))

  const orderMap = new Map(
    reordered.map((video) => [video.id, video.sortOrder])
  )

  setYoutubeItems((current: any[]) =>
    current.map((video) =>
      orderMap.has(video.id)
        ? {
            ...video,
            sortOrder: orderMap.get(video.id),
          }
        : video
    )
  )

  const formData = new FormData()

  formData.append(
    "items",
    JSON.stringify(
      reordered.map((video) => ({
        id: video.id,
        sortOrder: video.sortOrder,
      }))
    )
  )

  try {
    await reorderYouTubeVideos(formData)
    router.refresh()
    toast.success("Kolejność filmów została zapisana")
  } catch {
    setYoutubeItems(data.videos)
    toast.error("Nie udało się zapisać kolejności filmów")
  }
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
                  teams={data.teams}
                  leagues={data.leagues}
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
        teams={data.teams}
        leagues={data.leagues}
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
      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Szukaj po nazwie lub mieście"
              className="pl-9"
            />
          </div>

          <select
            value={tripStatusFilter}
            onChange={(e) =>
              setTripStatusFilter(e.target.value)
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:w-44"
          >
            <option value="all">
              Wszystkie statusy
            </option>

            <option value="published">
              Opublikowane
            </option>

            <option value="draft">
              Szkice
            </option>

            <option value="expired">
              Po terminie
            </option>
          </select>

          <select
            value={tripSort}
            onChange={(e) =>
              setTripSort(e.target.value)
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:w-52"
          >
            <option value="nearest">
              Najbliższy termin
            </option>

            <option value="furthest">
              Najdalszy termin
            </option>

            <option value="newest">
              Ostatnio dodane
            </option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredTrips.length === 1
            ? "1 wyjazd"
            : `${filteredTrips.length} wyjazdów`}
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <Plane className="mb-3 size-8 text-muted-foreground" />

          <p className="font-medium">
            Nie znaleziono wyjazdów
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Zmień kryteria wyszukiwania lub dodaj nowy wyjazd.
          </p>
        </div>
      ) : (
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
              {filteredTrips.map((trip) => {
                const expired =
                  trip.status === "published" &&
                  isTripExpired(trip)

                return (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <strong className="font-semibold">
                        {trip.title}
                      </strong>

                      <span className="block text-xs text-muted-foreground">
                        {trip.city}, {trip.country}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {trip.startDate}
                      {trip.endDate
                        ? ` - ${trip.endDate}`
                        : ""}
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-medium">
                      {trip.price.toLocaleString(
                        "pl-PL"
                      )}{" "}
                      zł
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={trip.status}
                        expired={expired}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <TripDialog
                          trip={trip}
                          teams={data.teams}
                          leagues={data.leagues}
                          trigger={
                            <Button
                              size="icon-sm"
                              variant="outline"
                              title="Edytuj wyjazd"
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
                            title="Duplikuj wyjazd"
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
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

        <TabsContent value="teams">
          <SectionHeader
            eyebrow="Baza danych"
            title="Drużyny"
            description="Dodaj drużynę raz. Jej herb, stadion i lokalizacja będą automatycznie używane przy kolejnych wyjazdach."
            action={<TeamDialog trigger={<Button><Plus />Nowa drużyna</Button>} />}
          />

          {data.teams.length === 0 ? (
            <Card><CardContent className="flex min-h-56 flex-col items-center justify-center text-center"><Trophy className="mb-3 size-10 text-primary" /><h3 className="font-sans text-2xl font-black uppercase">Dodaj pierwszą drużynę</h3><p className="mt-2 max-w-lg text-sm text-muted-foreground">Po zapisaniu drużyny będzie można wybrać ją jako gospodarza lub gościa w formularzu wyjazdu.</p></CardContent></Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Drużyna</TableHead><TableHead>Stadion</TableHead><TableHead>Lokalizacja</TableHead><TableHead className="text-right">Operacje</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {data.teams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell><div className="flex items-center gap-3"><span className="relative block size-12 shrink-0 rounded-lg bg-secondary p-1"><Image src={team.logo} alt={`Herb ${team.name}`} fill className="object-contain p-1" sizes="48px" /></span><strong>{team.name}</strong></div></TableCell>
                          <TableCell>{team.stadium}</TableCell>
                          <TableCell>{team.city}, {team.country}</TableCell>
                          <TableCell><div className="flex justify-end gap-2"><TeamDialog team={team} trigger={<Button size="icon-sm" variant="outline" title="Edytuj drużynę"><Pencil /><span className="sr-only">Edytuj</span></Button>} /><TeamDeleteButton team={team} /></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leagues">
          <SectionHeader eyebrow="Baza rozgrywek" title="Ligi" description="Dodaj ligę raz, a jej nazwa i logo będą dostępne przy każdym wyjeździe." action={<LeagueDialog trigger={<Button><Plus />Nowa liga</Button>} />} />
          <Card>
            <CardContent className="pt-6">
              {data.leagues.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">Nie dodano jeszcze żadnej ligi.</p> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.leagues.map((league) => <div key={league.id} className="flex items-center gap-4 border-b py-4"><span className="relative size-14 shrink-0"><Image src={league.logo} alt={`Logo ${league.name}`} fill className="object-contain" sizes="56px" /></span><strong className="min-w-0 flex-1 truncate">{league.name}</strong><LeagueDialog league={league} trigger={<Button size="icon-sm" variant="outline"><Pencil /><span className="sr-only">Edytuj</span></Button>} /><LeagueDeleteButton league={league} /></div>)}</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <SectionHeader
            eyebrow="Biblioteka"
            title="Media i galerie"
            description="Zdjęcia galerii i herby drużyn są przechowywane osobno, aby łatwiej było nimi zarządzać."
          />

          <Tabs defaultValue="photos" className="mt-6">
            <TabsList className="grid! h-auto! min-h-14 w-full grid-cols-3 gap-1 rounded-xl border bg-card p-1.5 shadow-sm">
              <TabsTrigger className="h-full min-w-0 whitespace-normal px-2 py-3 text-center text-xs sm:text-sm" value="photos"><FileImage />Zdjęcia i galerie</TabsTrigger>
              <TabsTrigger className="h-full min-w-0 whitespace-normal px-2 py-3 text-center text-xs sm:text-sm" value="logos"><Trophy />Herby drużyn</TabsTrigger>
              <TabsTrigger className="h-full min-w-0 whitespace-normal px-2 py-3 text-center text-xs sm:text-sm" value="team-galleries"><FileImage />Galerie drużyn</TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-6">
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
              {data.media
                .filter((asset) => !data.teams.some((team) => team.logo === `/api/media/${asset.id}`) && !data.leagues.some((league) => league.logo === `/api/media/${asset.id}`))
                .map((asset) => (
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
                        teams={data.teams}
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

            <TabsContent value="logos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biblioteka herbów</CardTitle>
                  <CardDescription>
                    Herby dodajesz i zmieniasz w danych drużyny. Nie są wyświetlane w bibliotece zdjęć ani proponowane jako zdjęcia galerii.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.teams.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center text-center">
                      <Trophy className="mb-3 size-10 text-primary" />
                      <p className="font-bold">Nie dodano jeszcze żadnej drużyny.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {data.teams.map((team) => (
                        <div key={team.id} className="flex items-center gap-4 rounded-xl border p-4">
                          <span className="relative block size-20 shrink-0 rounded-xl bg-secondary p-2">
                            <Image src={team.logo} alt={`Herb ${team.name}`} fill className="object-contain p-2" sizes="80px" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold">{team.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{team.city}, {team.country}</p>
                            <TeamDialog
                              team={team}
                              trigger={<Button className="mt-3" size="sm" variant="outline"><Pencil />Zmień herb</Button>}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team-galleries" className="mt-6">
              <Card><CardHeader><CardTitle>Galerie drużyn</CardTitle><CardDescription>Te zdjęcia będą automatycznie widoczne przy każdym wyjeździe danej drużyny.</CardDescription></CardHeader><CardContent className="space-y-8">{data.teams.map((team) => { const items = data.teamGallery.filter((item) => item.teamId === team.id); return <section key={team.id}><div className="mb-3 flex items-center gap-3"><span className="relative size-8"><Image src={team.logo} alt="" fill className="object-contain" sizes="32px" /></span><h3 className="font-bold">{team.name}</h3><span className="text-xs text-muted-foreground">{items.length} zdjęć</span></div>{items.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <div key={item.id} className="border-b pb-3"><img src={`/api/media/${item.mediaId}`} alt={item.alt || item.caption || team.name} className="aspect-video w-full object-cover" /><form action={updateTeamGalleryItem} className="mt-3 grid gap-2"><input type="hidden" name="id" value={item.id} /><Input name="caption" defaultValue={item.caption} placeholder="Podpis zdjęcia" /><Input name="alt" defaultValue={item.alt} placeholder="Opis alternatywny" /><Input name="sortOrder" type="number" defaultValue={item.sortOrder} aria-label="Kolejność zdjęcia" /><Button type="submit" size="sm" variant="outline">Zapisz</Button></form><form action={removeGalleryItem} className="mt-2"><input type="hidden" name="id" value={item.id} /><input type="hidden" name="scope" value="team" /><Button type="submit" size="sm" variant="ghost">Usuń przypisanie</Button></form></div>)}</div> : <p className="border-y py-5 text-sm text-muted-foreground">Brak zdjęć. Przypisz je z biblioteki przez przycisk Użyj.</p>}</section>})}</CardContent></Card>
            </TabsContent>
          </Tabs>
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

  {/* Statystyki Facebook */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Star className="size-5 text-primary" />
        Statystyki Facebook
      </CardTitle>

      <CardDescription>
        Ustaw liczbę opinii wyświetlaną na stronie głównej.
        Zmieniaj tę wartość, gdy liczba opinii na Facebooku wzrośnie.
      </CardDescription>
    </CardHeader>

   <CardContent>
  <FacebookReviewsSettingsForm settings={data.settings} />
</CardContent>
  </Card>

  {/* Opinie klientów */}
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
    description="Synchronizuj filmy z kanału i wybieraj, które materiały mają być widoczne na stronie głównej."
  />

  <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia kanału YouTube</CardTitle>

        <CardDescription>
          Połącz kanał i zarządzaj synchronizacją filmów.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <YouTubeSettingsForm settings={data.settings} />
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 border-t pt-5">
        <YouTubeSyncStatus
          lastSyncedAt={data.settings.youtubeLastSyncedAt}
          lastSyncStatus={data.settings.youtubeLastSyncStatus}
        />
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Filmy na stronie głównej</CardTitle>

            <CardDescription className="mt-1">
              Wybierz filmy i przeciągnij je, aby ustawić kolejność.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {featuredYouTubeItems.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {featuredYouTubeItems.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clapperboard className="size-5" />
            </div>

            <p className="font-semibold">
              Nie wybrano jeszcze żadnych filmów
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Dodaj filmy z biblioteki poniżej. Tylko wybrane tutaj
              materiały będą widoczne na stronie głównej.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleYouTubeDragEnd}
          >
            <SortableContext
              items={featuredYouTubeItems.map(
                (video) => video.id
              )}
              strategy={rectSortingStrategy}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredYouTubeItems.map((video, index) => (
                  <SortableGalleryItem
                    key={video.id}
                    item={video}
                  >
                    <div className="group overflow-hidden rounded-xl border border-primary/20 bg-card transition-colors hover:border-primary/40">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="aspect-video w-full object-cover"
                        />

                        <div className="absolute left-3 top-3">
                          <Badge className="shadow-sm">
                            NA STRONIE
                          </Badge>
                        </div>

                        <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md bg-background/90 text-sm font-bold shadow-sm backdrop-blur">
                          {index + 1}
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-2 min-h-10 text-sm font-semibold">
                          {video.title}
                        </p>

                        {video.publishedAt ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("pl-PL", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(video.publishedAt))}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            nativeButton={false}
                            render={
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <ExternalLink />
                            YouTube
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={async (event) => {
                              event.stopPropagation()

                              const formData = new FormData()
                              formData.append(
                                "id",
                                String(video.id)
                              )

                              try {
                                await removeYouTubeVideoFromHomepage(
                                  formData
                                )

                                setYoutubeItems((current: any[]) =>
                                  current.map((item) =>
                                    item.id === video.id
                                      ? {
                                          ...item,
                                          featured: false,
                                          sortOrder: 0,
                                        }
                                      : item
                                  )
                                )

                                router.refresh()

                                toast.success(
                                  "Film został usunięty ze strony głównej"
                                )
                              } catch {
                                toast.error(
                                  "Nie udało się usunąć filmu ze strony"
                                )
                              }
                            }}
                          >
                            <XCircle />
                            Usuń ze strony
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SortableGalleryItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  </div>

  <Card className="mt-6">
    <CardHeader>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Biblioteka filmów</CardTitle>

          <CardDescription className="mt-1">
            Wszystkie filmy zsynchronizowane z Twojego kanału YouTube.
            Wybierz materiały, które chcesz pokazać na stronie głównej.
          </CardDescription>
        </div>

        <Badge variant="secondary">
          {youtubeLibraryItems.length} filmów
        </Badge>
      </div>
    </CardHeader>

    <CardContent>
      {youtubeLibraryItems.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
          <RefreshCw className="mb-3 size-8 text-muted-foreground" />

          <p className="font-semibold">
            Biblioteka jest pusta
          </p>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Skonfiguruj kanał YouTube i użyj przycisku
            „Odśwież teraz”, aby pobrać filmy.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {youtubeLibraryItems.map((video) => (
            <div
              key={video.id}
              className={`overflow-hidden rounded-xl border bg-card transition-colors ${
                video.featured
                  ? "border-primary/40"
                  : "hover:border-primary/30"
              }`}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video w-full object-cover"
                />

                {video.featured ? (
                  <div className="absolute left-3 top-3">
                    <Badge>NA STRONIE</Badge>
                  </div>
                ) : null}
              </div>

              <div className="flex h-full flex-col p-4">
                <p className="line-clamp-2 text-sm font-semibold">
                  {video.title}
                </p>

                {video.publishedAt ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("pl-PL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(video.publishedAt))}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <ExternalLink />
                    YouTube
                  </Button>

                  {video.featured ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        const formData = new FormData()

                        formData.append(
                          "id",
                          String(video.id)
                        )

                        try {
                          await removeYouTubeVideoFromHomepage(
                            formData
                          )

                          setYoutubeItems((current: any[]) =>
                            current.map((item) =>
                              item.id === video.id
                                ? {
                                    ...item,
                                    featured: false,
                                    sortOrder: 0,
                                  }
                                : item
                            )
                          )

                          router.refresh()

                          toast.success(
                            "Film został usunięty ze strony głównej"
                          )
                        } catch {
                          toast.error(
                            "Nie udało się usunąć filmu ze strony"
                          )
                        }
                      }}
                    >
                      <XCircle />
                      Usuń ze strony
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        const formData = new FormData()

                        formData.append(
                          "id",
                          String(video.id)
                        )

                        try {
  await addYouTubeVideoToHomepage(formData)

  const nextSortOrder =
    featuredYouTubeItems.length > 0
      ? Math.max(
          ...featuredYouTubeItems.map(
            (item) => item.sortOrder
          )
        ) + 1
      : 0

  setYoutubeItems((current: any[]) =>
    current.map((item) =>
      item.id === video.id
        ? {
            ...item,
            featured: true,
            sortOrder: nextSortOrder,
          }
        : item
    )
  )

  router.refresh()

  toast.success(
    "Film został dodany na stronę główną"
  )
} catch {
  toast.error(
    "Nie udało się dodać filmu na stronę"
  )
}
                      }}
                    >
                      <Plus />
                      Dodaj na stronę
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="inquiries">
  <SectionHeader
    eyebrow="KONTAKT"
    title="Zapytania klientów"
    description="Zarządzaj zapytaniami, kontaktami i dalszą obsługą klientów."
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

  <div className="mb-6 grid gap-3 sm:grid-cols-3">
    <button
      type="button"
      onClick={() => setInquiryTab("new")}
      className={`rounded-xl border p-4 text-left transition-all ${
        inquiryTab === "new"
          ? "border-primary bg-primary/5 shadow-sm"
          : "bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Inbox className="size-5" />
        </div>

        <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
          {data.inquiries.filter(
            (item) => item.status === "new"
          ).length}
        </span>
      </div>

      <p className="mt-3 font-semibold">
        Nowe zapytania
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Wymagają Twojej uwagi
      </p>
    </button>

    <button
      type="button"
      onClick={() => setInquiryTab("contacted")}
      className={`rounded-xl border p-4 text-left transition-all ${
        inquiryTab === "contacted"
          ? "border-primary bg-primary/5 shadow-sm"
          : "bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MessageCircle className="size-5" />
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
          {data.inquiries.filter(
            (item) => item.status === "contacted"
          ).length}
        </span>
      </div>

      <p className="mt-3 font-semibold">
        W trakcie kontaktu
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Klienci, z którymi już rozmawiasz
      </p>
    </button>

    <button
      type="button"
      onClick={() => setInquiryTab("closed")}
      className={`rounded-xl border p-4 text-left transition-all ${
        inquiryTab === "closed"
          ? "border-primary bg-primary/5 shadow-sm"
          : "bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CheckCircle2 className="size-5" />
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
          {data.inquiries.filter(
            (item) => item.status === "closed"
          ).length}
        </span>
      </div>

      <p className="mt-3 font-semibold">
        Zamknięte
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Zakończone zapytania
      </p>
    </button>
  </div>

  <div className="flex flex-col gap-4">
    {data.inquiries
      .filter((lead) => lead.status === inquiryTab)
      .sort(
  (a, b) =>
    new Date(a.createdAt).getTime() -
    new Date(b.createdAt).getTime()
)
      .map((lead) => (
        <Card
          key={lead.id}
          className={
            lead.status === "new"
              ? "border-primary/30 shadow-sm"
              : ""
          }
        >
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                    lead.status === "new"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {lead.status === "new" ? (
                    <Inbox className="size-5" />
                  ) : lead.status === "contacted" ? (
                    <MessageCircle className="size-5" />
                  ) : (
                    <CheckCircle2 className="size-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">
                      {lead.name}
                    </CardTitle>

                    <StatusBadge
                      status={lead.status}
                    />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline"
                    >
                      <Mail className="size-3.5" />
                      {lead.email}
                    </a>

                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {lead.phone}
                    </a>
                  </div>
                </div>
              </div>

              {lead.createdAt ? (
  (() => {
    const waitingTime = getInquiryWaitingTime(
      lead.createdAt
    )

    return (
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div
          className={`flex items-center gap-1.5 text-xs ${waitingTime.className}`}
        >
          <span
            className={`size-2 rounded-full ${waitingTime.dotClassName}`}
          />

          <span>
            {waitingTime.label}
          </span>
        </div>

        <time
          dateTime={new Date(
            lead.createdAt
          ).toISOString()}
          className="text-[11px] text-muted-foreground"
        >
          {formatInquiryDate(
            lead.createdAt
          )}
        </time>
      </div>
    )
  })()
) : null}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Plane className="size-4 text-primary" />

                  <p className="text-sm font-semibold">
                    Szczegóły wyjazdu
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Mecz
                    </p>

                    <p className="mt-0.5 font-semibold">
                      {lead.matchName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Skąd wylot
                      </p>

                      <p className="mt-0.5 text-sm font-medium">
                        {lead.departureCity}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Liczba osób
                      </p>

                      <p className="mt-0.5 text-sm font-medium">
                        {lead.travelers} os.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Wiadomość
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {lead.message ||
                        "Brak dodatkowej wiadomości."}
                    </p>
                  </div>
                </div>
              </div>

              <form
                action={updateInquiry}
                className="rounded-xl border p-4"
              >
                <input
                  type="hidden"
                  name="id"
                  value={lead.id}
                />

                <div className="mb-4 flex items-center gap-2">
                  <Settings className="size-4 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">
                      Obsługa zapytania
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Ustaw status i dodaj prywatną notatkę.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Field
                    label="Status kontaktu"
                    hint=""
                  >
                    <select
                      name="status"
                      defaultValue={
                        lead.status
                      }
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    hint="Prywatna informacja widoczna tylko w panelu."
                  >
                    <Textarea
                      name="adminNote"
                      defaultValue={
                        lead.adminNote
                      }
                      placeholder="Np. Klient czeka na potwierdzenie terminu..."
                      rows={3}
                    />
                  </Field>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
  <Button
    type="submit"
    size="sm"
    className="w-full sm:w-auto"
  >
    Zapisz obsługę
  </Button>

  {lead.status === "closed" ? (
  <Button
    type="submit"
    formAction={deleteInquiry}
    size="sm"
    variant="outline"
    className="w-full border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600 sm:w-auto"
    onClick={(event) => {
      if (
        !window.confirm(
          `Czy na pewno chcesz usunąć zapytanie klienta „${lead.name}”? Ta operacja jest nieodwracalna.`
        )
      ) {
        event.preventDefault()
      }
    }}
  >
    <XCircle />
    Usuń zapytanie
  </Button>
) : null}
</div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}

    {data.inquiries.filter(
      (lead) => lead.status === inquiryTab
    ).length === 0 ? (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            {inquiryTab === "new" ? (
              <Inbox className="size-6 text-muted-foreground" />
            ) : inquiryTab === "contacted" ? (
              <MessageCircle className="size-6 text-muted-foreground" />
            ) : (
              <CheckCircle2 className="size-6 text-muted-foreground" />
            )}
          </div>

          <h3 className="mt-4 font-semibold">
            {inquiryTab === "new"
              ? "Brak nowych zapytań"
              : inquiryTab === "contacted"
                ? "Brak zapytań w trakcie kontaktu"
                : "Brak zamkniętych zapytań"}
          </h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {inquiryTab === "new"
              ? "Świetnie — wszystkie zapytania zostały obsłużone."
              : inquiryTab === "contacted"
                ? "Nie masz obecnie klientów oczekujących na dalszą obsługę."
                : "Zamknięte zapytania pojawią się tutaj."}
          </p>
        </CardContent>
      </Card>
    ) : null}
  </div>
</TabsContent>

      <TabsContent value="account">
  <SectionHeader
    eyebrow="Konto"
    title="Bezpieczeństwo"
    description="Zarządzaj dostępem do panelu administratora i zabezpiecz swoje konto."
  />

  <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-5" />
          </div>

          <div>
            <CardTitle>
              Zmiana hasła
            </CardTitle>

            <CardDescription className="mt-1">
              Regularna zmiana hasła pomaga
              chronić dostęp do panelu.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>

    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <CardTitle>
                Administrator
              </CardTitle>

              <CardDescription className="mt-1">
                Konto z pełnym dostępem do panelu.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">
              {data.email
                ?.charAt(0)
                .toUpperCase() || "A"}
            </span>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {data.email}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />

                <span className="text-xs text-muted-foreground">
                  Dostęp administratora
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-3.5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dostęp do panelu jest przyznawany
              wyłącznie zatwierdzonemu adresowi
              e-mail administratora.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Dodatkowa ochrona
          </CardTitle>

          <CardDescription>
            Ważne informacje dotyczące bezpieczeństwa
            konta.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

            <p className="text-sm text-muted-foreground">
              Operacje administracyjne wymagają
              aktywnej sesji administratora.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

            <p className="text-sm text-muted-foreground">
              Przy zmianie hasła możesz wylogować
              wszystkie pozostałe urządzenia.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

            <p className="text-sm text-muted-foreground">
              Dostęp do panelu jest ograniczony do
              konta administratora.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
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
      <CardContent className="flex items-center gap-4 py-1">
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
      className="gap-1.5 border-red-500/50 bg-red-500/10 text-black dark:border-red-400/50 dark:bg-red-400/10 dark:text-red-400"
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
  const [state, action, pending] = useActionState(
    saveSettings,
    initialSaveSettingsState
  )

  return (
    <form action={action} className="flex flex-col gap-6">
      <Field
        label="Adres kanału YouTube"
        hint="Wklej adres swojego kanału YouTube. Możesz skopiować go bezpośrednio z paska adresu przeglądarki."
      >
        <Input
          name="setting.youtubeUrl"
          type="url"
          defaultValue={settings.youtubeUrl}
          placeholder="https://www.youtube.com/@twojkanal"
          className="h-10"
        />
      </Field>

      <Field
  label="Widoczność sekcji"
  hint="Możesz tymczasowo ukryć całą sekcję YouTube na stronie głównej bez usuwania wybranych filmów."
>
  <select
    name="setting.youtubeEnabled"
    defaultValue={settings.youtubeEnabled || "true"}
    className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
  >
    <option value="true">Sekcja włączona</option>
    <option value="false">Sekcja wyłączona</option>
  </select>
</Field>

      {state.error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-medium">
              Nie udało się zapisać ustawień
            </p>

            <p className="mt-1 text-destructive/80">
              {state.error}
            </p>
          </div>
        </div>
      ) : null}

      {state.success ? (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
          <CheckCircle2 className="size-4 shrink-0" />

          <p className="font-medium">
            Ustawienia YouTube zostały zapisane.
          </p>
        </div>
      ) : null}

      <div className="flex justify-start">
        <Button
          type="submit"
          disabled={pending}
          className="min-w-[170px]"
        >
          <Clapperboard />

          {pending ? "Zapisuję…" : "Zapisz ustawienia"}
        </Button>
      </div>
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
  const [state, action, pending] = useActionState(
    syncYouTubeNow,
    initialSyncState
  )

  const formRef = useRef<HTMLFormElement>(null)
  const automaticSyncStarted = useRef(false)

  const formatted = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString("pl-PL", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null

  const lastSyncTime = lastSyncedAt
    ? new Date(lastSyncedAt).getTime()
    : 0

  const isStale =
    !lastSyncTime ||
    Date.now() - lastSyncTime >= 24 * 60 * 60 * 1000

  const lastAttemptFailed =
    lastSyncStatus?.startsWith("Błąd:") ?? false

  useEffect(() => {
    if (automaticSyncStarted.current) return

    if (!isStale && !lastAttemptFailed) return

    automaticSyncStarted.current = true

    formRef.current?.requestSubmit()
  }, [isStale, lastAttemptFailed])

  const hasError =
    Boolean(state.error) || lastAttemptFailed

  const isSuccessful =
    Boolean(state.success) ||
    (!lastAttemptFailed && Boolean(lastSyncedAt))

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RefreshCw className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="font-medium">
              Automatyczna aktualizacja
            </p>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Lista filmów jest automatycznie odświeżana
              raz na 24 godziny. Nie musisz robić tego ręcznie.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                hasError
                  ? "bg-destructive/10 text-destructive"
                  : isSuccessful
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {hasError ? (
                <AlertCircle className="size-5" />
              ) : isSuccessful ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium">
                {hasError
                  ? "Wymagana ponowna synchronizacja"
                  : isSuccessful
                    ? "Filmy są aktualne"
                    : "Synchronizacja nie została jeszcze wykonana"}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Ostatnie odświeżenie:{" "}
                <span className="font-medium text-foreground">
                  {formatted ?? "jeszcze nie wykonano"}
                </span>
              </p>
            </div>
          </div>

          <form ref={formRef} action={action}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={pending ? "animate-spin" : ""}
              />

              {pending ? "Odświeżam…" : "Odśwież teraz"}
            </Button>
          </form>
        </div>
      </div>

      {state.error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-medium">
              Nie udało się odświeżyć filmów
            </p>

            <p className="mt-1 text-destructive/80">
              {state.error}
            </p>
          </div>
        </div>
      ) : null}

     {state.success ? (
  <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
    <CheckCircle2 className="size-4 shrink-0" />

    <p className="font-medium text-foreground">
      Lista filmów została pomyślnie odświeżona.
    </p>
  </div>
) : null}

      {lastAttemptFailed && !state.error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-medium">
              Ostatnia próba aktualizacji nie powiodła się
            </p>

            <p className="mt-1 text-destructive/80">
              Panel spróbuje ponownie przy kolejnym otwarciu.
            </p>
          </div>
        </div>
      ) : null}
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

  const [newPassword, setNewPassword] =
    useState("")

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const passwordLengthOk =
    newPassword.length >= 12

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
        <div className="relative">
          <Input
            name="currentPassword"
            type={
              showCurrentPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            required
            className="pr-10"
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrentPassword(
                (value) => !value
              )
            }
            className="absolute right-0 top-0 flex h-9 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showCurrentPassword
                ? "Ukryj hasło"
                : "Pokaż hasło"
            }
          >
            {showCurrentPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </Field>

      <Field
        label="Nowe hasło"
        hint="Nowe hasło musi mieć co najmniej 12 znaków."
      >
        <div className="relative">
          <Input
            name="newPassword"
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            minLength={12}
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="pr-10"
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword(
                (value) => !value
              )
            }
            className="absolute right-0 top-0 flex h-9 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showNewPassword
                ? "Ukryj nowe hasło"
                : "Pokaż nowe hasło"
            }
          >
            {showNewPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm">
          {passwordLengthOk ? (
            <>
              <CheckCircle2 className="size-4 text-green-600" />

              <span className="font-medium text-green-600">
                Minimum 12 znaków zostało osiągnięte
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="size-4 text-muted-foreground" />

              <span className="text-muted-foreground">
                {newPassword.length === 0
                  ? "Minimum 12 znaków"
                  : `${newPassword.length}/12 znaków`}
              </span>
            </>
          )}
        </div>
      </Field>

      <Field
        label="Powtórz nowe hasło"
        hint="Wpisz ponownie nowe hasło, aby upewnić się, że nie ma w nim literówki."
      >
        <div className="relative">
          <Input
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            minLength={12}
            autoComplete="new-password"
            required
            className="pr-10"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (value) => !value
              )
            }
            className="absolute right-0 top-0 flex h-9 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              showConfirmPassword
                ? "Ukryj hasło"
                : "Pokaż hasło"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="revokeOtherSessions"
          type="checkbox"
          defaultChecked
          className="size-4 rounded border"
        />

        Wyloguj pozostałe urządzenia
      </label>

      {state.error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />

          <p className="font-medium">
            {state.error}
          </p>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />

          <p className="font-medium text-foreground">
            Hasło zostało pomyślnie zmienione.
          </p>
        </div>
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

const initialTeamState: SaveTeamState = {}

function TeamDialog({ team, trigger }: { team?: any; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(saveTeam, initialTeamState)

  useEffect(() => {
    if (!state.success) return
    toast.success(team ? "Dane drużyny zostały zapisane." : "Drużyna została dodana.")
    setOpen(false)
  }, [state.success, team])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader><DialogTitle>{team ? "Edytuj drużynę" : "Nowa drużyna"}</DialogTitle><DialogDescription>Te dane będą automatycznie podpowiadane podczas tworzenia wyjazdu.</DialogDescription></DialogHeader>
        <form action={action} className="grid gap-4 sm:grid-cols-2">
          {team && <input type="hidden" name="id" value={team.id} />}
          <div className="sm:col-span-2"><Field label="Nazwa drużyny" hint="Pełna, oficjalna nazwa widoczna na stronie."><Input name="name" defaultValue={team?.name} required /></Field></div>
          <Field label="Miasto" hint="Domyślne miasto rozgrywania meczów."><Input name="city" defaultValue={team?.city} required /></Field>
          <Field label="Kraj" hint="Domyślny kraj drużyny."><Input name="country" defaultValue={team?.country} required /></Field>
          <div className="sm:col-span-2"><Field label="Stadion" hint="Domyślny stadion gospodarza."><Input name="stadium" defaultValue={team?.stadium} required /></Field></div>
          <div className="sm:col-span-2"><Field label="Herb" hint="Plik zostanie zmniejszony do maksymalnie 128 x 128 px i zapisany jako WebP."><ImageDropzone name="logoFile" accept="image/png,image/webp,image/jpeg,image/avif" required={!team?.logo} currentImage={team?.logo} /></Field></div>
          {state.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.error}</p>}
          <DialogFooter className="sm:col-span-2"><Button type="submit" disabled={pending}>{pending ? "Zapisuję..." : "Zapisz drużynę"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TeamDeleteButton({ team }: { team: any }) {
  const [state, action, pending] = useActionState(deleteTeam, initialTeamState)
  useEffect(() => {
    if (state.error) toast.error(state.error)
    if (state.success) toast.success("Drużyna została usunięta.")
  }, [state])
  return <form action={action}><input type="hidden" name="id" value={team.id} /><Button type="submit" size="icon-sm" variant="outline" disabled={pending} title="Usuń drużynę"><XCircle /><span className="sr-only">Usuń</span></Button></form>
}

const initialLeagueState: SaveLeagueState = {}

function LeagueDialog({ league, trigger }: { league?: any; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(saveLeague, initialLeagueState)
  useEffect(() => { if (state.success) { toast.success(league ? "Liga została zaktualizowana." : "Liga została dodana."); setOpen(false) } }, [state.success, league])
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={trigger as React.ReactElement} /><DialogContent><DialogHeader><DialogTitle>{league ? "Edytuj ligę" : "Nowa liga"}</DialogTitle><DialogDescription>Nazwa i logo będą widoczne przy przypisanych wyjazdach.</DialogDescription></DialogHeader><form action={action} className="grid gap-4">{league && <input type="hidden" name="id" value={league.id} />}<Field label="Nazwa ligi" hint="Np. LaLiga lub Premier League."><Input name="name" defaultValue={league?.name} required /></Field><Field label="Logo ligi" hint="Plik zostanie zoptymalizowany do niewielkiego formatu WebP."><ImageDropzone name="logoFile" accept="image/png,image/webp,image/jpeg" required={!league?.logo} currentImage={league?.logo} /></Field>{state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}<DialogFooter><Button disabled={pending}>{pending ? "Zapisuję..." : "Zapisz ligę"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function LeagueDeleteButton({ league }: { league: any }) {
  const [state, action, pending] = useActionState(deleteLeague, initialLeagueState)
  useEffect(() => { if (state.error) toast.error(state.error); if (state.success) toast.success("Liga została usunięta.") }, [state])
  return <form action={action}><input type="hidden" name="id" value={league.id} /><Button type="submit" size="icon-sm" variant="outline" disabled={pending}><XCircle /><span className="sr-only">Usuń ligę</span></Button></form>
}

const initialTripState: SaveTripState = {}

function TripDialog({
  trip,
  teams,
  leagues,
  trigger,
}: {
  trip?: any
  teams: any[]
  leagues: any[]
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
  const [homeTeamId, setHomeTeamId] = useState(String(trip?.homeTeamId || ""))
  const [awayTeamId, setAwayTeamId] = useState(String(trip?.awayTeamId || ""))
  const [title, setTitle] = useState(trip?.title || "")
  const [city, setCity] = useState(trip?.city || "")
  const [country, setCountry] = useState(trip?.country || "")
  const [stadium, setStadium] = useState(trip?.stadium || "")
  const packageValues = parsePackageItems(trip?.packageItems)
  const activePackageVariants = getPackageVariants(trip?.packageVariants, trip?.packageItems).map((variant) => variant.key)

  const updateTitle = (homeId: string, awayId: string) => {
    const home = teams.find((team) => String(team.id) === homeId)
    const away = teams.find((team) => String(team.id) === awayId)
    if (home && away) setTitle(`${home.name} vs ${away.name}`)
  }

  const selectHomeTeam = (value: string) => {
    setHomeTeamId(value)
    const team = teams.find((item) => String(item.id) === value)
    if (team) {
      setCity(team.city)
      setCountry(team.country)
      setStadium(team.stadium)
    }
    updateTitle(value, awayTeamId)
  }

  const selectAwayTeam = (value: string) => {
    setAwayTeamId(value)
    updateTitle(homeTeamId, value)
  }

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

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
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
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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

          <Field label="Gospodarz" hint="Po wyborze uzupełnimy stadion, miasto, kraj i herb.">
            <select name="homeTeamId" value={homeTeamId} onChange={(event) => selectHomeTeam(event.target.value)} required className="h-9 rounded-lg border bg-background px-3">
              <option value="">Wybierz drużynę</option>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </Field>

          <Field label="Gość" hint="Herb i nazwa zostaną pobrane z katalogu drużyn.">
            <select name="awayTeamId" value={awayTeamId} onChange={(event) => selectAwayTeam(event.target.value)} required className="h-9 rounded-lg border bg-background px-3">
              <option value="">Wybierz drużynę</option>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </Field>

          <Field label="Liga" hint="Logo i nazwa ligi pojawią się przy wyjeździe.">
            <select name="leagueId" defaultValue={trip?.leagueId || ""} className="h-9 rounded-lg border bg-background px-3">
              <option value="">Bez przypisanej ligi</option>
              {leagues.map((league) => <option key={league.id} value={league.id}>{league.name}</option>)}
            </select>
          </Field>

          <Field label="Miasto" hint="Uzupełniane z drużyny gospodarza. Możesz zmienić dla tego meczu.">
            <Input name="city" value={city} onChange={(event) => setCity(event.target.value)} required />
          </Field>

          <Field
            label="Stadion"
            hint="Nazwa stadionu, na którym odbędzie się mecz."
          >
            <Input name="stadium" value={stadium} onChange={(event) => setStadium(event.target.value)} required />
          </Field>

          <Field
            label="Termin meczu"
            hint="Data meczu. Może różnić się od pierwszego dnia całego wyjazdu."
          >
            <Input name="matchDate" type="date" defaultValue={trip?.matchDate || trip?.startDate} required />
          </Field>

          <Field
            label="Kraj"
            hint="Kraj, do którego organizowany jest wyjazd."
          >
            <Input
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
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
            label="Dostępność miejsc"
            hint="Status sprzedażowy widoczny w kalendarzu i na stronie wyjazdu."
          >
            <select name="availabilityStatus" defaultValue={trip?.availabilityStatus || "available"} className="h-9 rounded-lg border bg-background px-3">
              <option value="available">Dostępne miejsca</option>
              <option value="last_places">Ostatnie miejsca</option>
              <option value="sold_out">Wyprzedane</option>
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
            label="Liczba dni"
            hint="Łączna długość pobytu liczona w dniach."
          >
            <Input name="durationDays" type="number" min="1" max="30" defaultValue={trip?.durationDays || 1} required />
          </Field>

          <Field
            label="Liczba nocy"
            hint="Liczba noclegów w pakiecie."
          >
            <Input name="durationNights" type="number" min="0" max="29" defaultValue={trip?.durationNights ?? 0} required />
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

          <div className="rounded-xl border bg-muted/30 p-4 sm:col-span-2">
            <h3 className="font-sans text-lg font-black uppercase">Skład pakietu</h3>
            <p className="mt-1 text-sm text-muted-foreground">Przy każdym elemencie określ, czy jest w cenie, dostępny opcjonalnie, czy pozostaje po stronie podróżnego.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {packageFeatures.map((feature) => (
                <label key={feature.key} className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 text-sm font-medium">
                  <span>{feature.label}</span>
                  <select name={`package.${feature.key}`} defaultValue={packageValues[feature.key]} className="h-9 max-w-40 rounded-md border bg-background px-2 text-xs">
                    <option value="included">W cenie</option>
                    <option value="optional">Opcjonalnie</option>
                    <option value="excluded">We własnym zakresie</option>
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="border-y py-5 sm:col-span-2">
            <h3 className="font-sans text-lg font-black uppercase">Warianty dostępne dla klienta</h3>
            <p className="mt-1 text-sm text-muted-foreground">Zaznacz wszystkie warianty, które klient może wybrać dla tego wyjazdu.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {packageVariantOptions.map((variant) => <label key={variant.key} className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" name={`packageVariant.${variant.key}`} defaultChecked={activePackageVariants.includes(variant.key)} className="size-4 accent-primary" />{variant.label}</label>)}
            </div>
          </div>

          <Field label="Kategoria biletu" hint="Np. trybuna boczna, sektor gospodarzy lub kategoria 2."><Input name="ticketCategory" defaultValue={trip?.ticketCategory} /></Field>
          <Field label="Miejsca na stadionie" hint="Np. miejsca obok siebie lub zależnie od dostępności."><Input name="seatingInfo" defaultValue={trip?.seatingInfo} /></Field>
          <Field label="Standard hotelu" hint="Wybierz 0, jeśli hotel nie jest częścią oferty.">
            <select name="hotelStars" defaultValue={trip?.hotelStars || 0} className="h-9 rounded-lg border bg-background px-3"><option value="0">Nie określono</option>{[1, 2, 3, 4, 5].map((stars) => <option key={stars} value={stars}>{stars} {stars === 1 ? "gwiazdka" : stars < 5 ? "gwiazdki" : "gwiazdek"}</option>)}</select>
          </Field>
          <Field label="Wyżywienie" hint="Np. śniadania w cenie lub bez wyżywienia."><Input name="hotelBoard" defaultValue={trip?.hotelBoard} /></Field>
          <Field label="Rodzaj pokoju" hint="Np. pokój dwuosobowy."><Input name="roomType" defaultValue={trip?.roomType} /></Field>
          <Field label="Lotniska wylotu" hint="Możesz podać kilka miast, np. Warszawa, Berlin, Poznań."><Input name="departureAirports" defaultValue={trip?.departureAirports} /></Field>
          <Field label="Rodzaj lotu" hint="Np. bezpośredni lub z jedną przesiadką."><Input name="flightType" defaultValue={trip?.flightType} /></Field>
          <Field label="Bagaż" hint="Domyślnie chodzi o mały bagaż podręczny mieszczący się pod siedzeniem. Każdy większy wariant opisz wyraźnie."><Input name="baggageInfo" defaultValue={trip?.baggageInfo} placeholder="Mały bagaż podręczny pod siedzenie" /></Field>

          <div className="sm:col-span-2">
            <Field
              label="Dodatkowe elementy pakietu"
              hint="Wpisz tylko elementy, których nie ma w konfiguratorze powyżej. Każdy w osobnej linii."
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

          <div className="sm:col-span-2">
            <Field label="Plan wyjazdu" hint="Każdy etap wpisz w osobnej linii. Na stronie zostanie pokazany jako uporządkowany plan.">
              <Textarea name="itinerary" defaultValue={trip?.itinerary?.join("\n")} rows={6} />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Hotel" hint="Nazwa lub standard hotelu, lokalizacja, wyżywienie i najważniejsze udogodnienia.">
              <Textarea name="hotelInfo" defaultValue={trip?.hotelInfo} rows={5} />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Loty" hint="Lotniska, bagaż i informacje o godzinach lub sposobie ich potwierdzenia.">
              <Textarea name="flightInfo" defaultValue={trip?.flightInfo} rows={5} />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="FAQ" hint="Jedno pytanie i odpowiedź w wierszu, rozdzielone znakiem |. Przykład: Czy potrzebuję paszportu? | Wystarczy ważny dowód osobisty.">
              <Textarea name="faq" defaultValue={trip?.faq?.join("\n")} rows={6} />
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

async function updateTeamGalleryItem(formData: FormData) {
  await updateTeamGalleryItemState({}, formData)
}

function GalleryDialog({
  asset,
  trips,
  teams,
}: {
  asset: any
  trips: any[]
  teams: any[]
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
              name="destination"
              className="h-9 rounded-lg border bg-background px-3"
            >
              <option value="global">
                Galeria strony głównej
              </option>

              {trips.map((trip) => (
                <option
                  key={trip.id}
                  value={`trip:${trip.id}`}
                >
                  Wyjazd: {trip.title}
                </option>
              ))}
              {teams.map((team) => <option key={`team-${team.id}`} value={`team:${team.id}`}>Drużyna: {team.name}</option>)}
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
const initialFacebookReviewsSettingsState: SaveSettingsState = {}

function FacebookReviewsSettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const [state, action, pending] = useActionState(
    saveSettings,
    initialFacebookReviewsSettingsState
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("Liczba opinii została zapisana")
    }

    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form
      action={action}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <div className="w-full sm:max-w-xs">
        <Label htmlFor="facebookReviewsCount">
          Liczba opinii na Facebooku
        </Label>

        <Input
          id="facebookReviewsCount"
          name="setting.facebookReviewsCount"
          type="number"
          min="0"
          max="100000"
          step="1"
          defaultValue={settings.facebookReviewsCount || "160"}
          className="mt-2"
        />
      </div>
      <div className="w-full sm:max-w-xs">
  <Label htmlFor="facebookReviewsAverage">
    Średnia ocen na Facebooku
  </Label>

  <Input
    id="facebookReviewsAverage"
    name="setting.facebookReviewsAverage"
    type="number"
    min="0"
    max="5"
    step="0.1"
    defaultValue={settings.facebookReviewsAverage || "5.0"}
    className="mt-2"
  />
</div>

      <Button type="submit" disabled={pending}>
        {pending ? "Zapisywanie..." : "Zapisz liczbę opinii"}
      </Button>
    </form>
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
      "Tytuł sekcji pokazującej dostępne wyjazdy.",
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

  const [state, action, pending] = useActionState(
    saveSettings,
    initialSaveSettingsState
  )

  const getField = (key: string) =>
    fields.find((field) => field[0] === key)

  const renderField = (key: string) => {
    const field = getField(key)

    if (!field) return null

    const [, label, hint, fallback] = field
    const isTextarea =
      key.endsWith("Text") ||
      key.endsWith("Description")

    return (
      <Field key={key} label={label} hint={hint}>
        {isTextarea ? (
          <Textarea
            name={`setting.${key}`}
            defaultValue={settings[key] || fallback}
            rows={4}
          />
        ) : (
          <Input
            name={`setting.${key}`}
            defaultValue={settings[key] || fallback}
          />
        )}
      </Field>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Treści strony</CardTitle>
          <CardDescription>
            Zarządzaj tekstami wyświetlanymi na stronie bez
            konieczności edytowania kodu.
          </CardDescription>
        </CardHeader>
      </Card>

      <form action={action} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Widoczność w Google</CardTitle>
            <CardDescription>
              Ustawienia wpływające na tytuł i opis strony
              wyświetlane w wyszukiwarce Google.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            {renderField("seoTitle")}
            {renderField("seoDescription")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strona główna</CardTitle>
            <CardDescription>
              Najważniejsze treści widoczne zaraz po wejściu
              na stronę.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            {renderField("heroEyebrow")}
            {renderField("heroTitle")}
            {renderField("heroDescription")}
            {renderField("heroCta")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sekcje strony</CardTitle>
            <CardDescription>
              Nagłówki i opisy poszczególnych sekcji strony
              głównej.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            {renderField("tripsTitle")}
            {renderField("tripsDescription")}
            {renderField("customTripTitle")}
            {renderField("packageTitle")}
            {renderField("benefitsTitle")}
            {renderField("processTitle")}
            {renderField("galleryTitle")}
            {renderField("testimonialsTitle")}
            {renderField("faqTitle")}
            {renderField("youtubeTitle")}
            {renderField("aboutTitle")}
            {renderField("aboutText")}
            {renderField("contactTitle")}
            {renderField("footerText")}

            <Field
              label="Liczba zdjęć na stronie głównej"
              hint="Określ, ile zdjęć ma być widocznych w galerii na stronie głównej."
            >
              <Input
                name="setting.galleryHomeLimit"
                type="number"
                min="1"
                max="5"
                defaultValue={settings.galleryHomeLimit || "5"}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt</CardTitle>
            <CardDescription>
              Dane kontaktowe wyświetlane klientom na stronie.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            {renderField("contactEmail")}
            {renderField("contactPhone")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dane firmy</CardTitle>
            <CardDescription>
              Informacje o firmie wyświetlane na stronie.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-2">
            {renderField("companyName")}
            {renderField("companyAddress")}
            {renderField("companyNip")}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {state.error && (
                <p className="text-sm text-destructive">
                  {state.error}
                </p>
              )}

              {state.success && (
                <p className="flex items-center gap-2 text-sm text-foreground">
  <CheckCircle2 className="size-4" />
  Treści strony zostały zapisane.
</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="sm:min-w-48"
            >
              <BookOpen />
              {pending ? "Zapisuję…" : "Zapisz treści strony"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
