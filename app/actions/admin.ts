"use server"

import { del, put } from "@vercel/blob"
import { and, asc, eq, inArray, ne, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/require-admin"
import { db } from "@/lib/db"
import { ensureTripColumns } from "@/lib/db/ensure-trip-columns"
import {
  adminActivity,
  galleryItems,
  inquiries,
  leagues,
  mediaAssets,
  siteSettings,
  testimonials,
  teams,
  teamGalleryItems,
  tripGalleryItems,
  trips,
  youtubeVideos,
} from "@/lib/db/schema"
import { optimizeTeamLogo, optimizeUploadedImage } from "@/lib/optimize-image"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"
import { packageFeatures, packageVariantOptions, type PackageFeatureStatus } from "@/lib/package-options"
import { syncYouTubeVideos } from "@/lib/youtube-sync"

const statuses = ["draft", "published", "archived"] as const
const availabilityStatuses = ["available", "last_places", "sold_out"] as const
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim()
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

async function logActivity(userId: string, action: string, entityType: string, entityId?: string, details = "") {
  await db.transaction(async (tx) => {
    await tx.insert(adminActivity).values({ userId, action, entityType, entityId, details })
    await tx.execute(sql`
      DELETE FROM admin_activity
      WHERE id NOT IN (
        SELECT id FROM admin_activity ORDER BY created_at DESC, id DESC LIMIT 10
      )
    `)
  })
}

function refreshPublic() {
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/galeria")
  revalidatePath("/wyjazdy")
  revalidatePath("/en")
  revalidatePath("/en/trips")
  revalidatePath("/en/gallery")
  revalidatePath("/sitemap.xml")
}

function mediaIdFromUrl(url: string) {
  const match = url.match(/^\/api\/media\/(\d+)$/)
  return match ? Number(match[1]) : null
}

async function deleteMediaAsset(mediaId: number) {
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
  if (!asset || await mediaHasReferences(mediaId)) return

  await del(asset.pathname)
  await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId))
}

async function mediaHasReferences(mediaId: number): Promise<boolean> {
  await ensureTripColumns()
  const mediaUrl = `/api/media/${mediaId}`
  const references = await Promise.all([
    db.select({ id: galleryItems.id }).from(galleryItems).where(eq(galleryItems.mediaId, mediaId)).limit(1),
    db.select({ id: tripGalleryItems.id }).from(tripGalleryItems).where(eq(tripGalleryItems.mediaId, mediaId)).limit(1),
    db.select({ id: teamGalleryItems.id }).from(teamGalleryItems).where(eq(teamGalleryItems.mediaId, mediaId)).limit(1),
    db.select({ id: trips.id }).from(trips).where(or(
      eq(trips.coverMediaId, mediaId),
      eq(trips.image, mediaUrl),
      eq(trips.homeLogo, mediaUrl),
      eq(trips.awayLogo, mediaUrl),
      eq(trips.leagueLogo, mediaUrl)
    )).limit(1),
    db.select({ id: teams.id }).from(teams).where(or(eq(teams.logo, mediaUrl), eq(teams.tripImageMediaId, mediaId))).limit(1),
    db.select({ id: leagues.id }).from(leagues).where(eq(leagues.logo, mediaUrl)).limit(1),
  ])

  return references.some((rows) => rows.length > 0)
}

const tripSchema = z.object({
  title: z.string().min(3).max(120), city: z.string().min(2).max(100),
  country: z.string().min(2).max(100), startDate: z.string().date(), endDate: z.string().optional(),
  price: z.coerce.number().int().nonnegative().max(1_000_000), status: z.enum(statuses),
  stadium: z.string().min(2).max(140), matchDate: z.string().date().optional(),
  availabilityStatus: z.enum(availabilityStatuses),
  homeTeamId: z.coerce.number().int().positive(), awayTeamId: z.coerce.number().int().positive(),
  durationDays: z.coerce.number().int().min(1).max(30),
  durationNights: z.coerce.number().int().min(0).max(29),
  hotelStars: z.coerce.number().int().min(0).max(5),
  hotelBoard: z.string().max(120), roomType: z.string().max(120),
  departureAirports: z.string().max(300), flightType: z.string().max(120),
  baggageInfo: z.string().max(300), ticketCategory: z.string().max(200), seatingInfo: z.string().max(300),
  description: z.string().max(12000).refine((value) => stripHtml(value).length <= 8000, "Opis jest za długi"),
  titleEn: z.string().max(120), cityEn: z.string().max(100), countryEn: z.string().max(100),
  descriptionEn: z.string().max(12000).refine((value) => stripHtml(value).length <= 8000, "Opis angielski jest za długi"),
  hotelBoardEn: z.string().max(120), roomTypeEn: z.string().max(120),
  departureAirportsEn: z.string().max(300), flightTypeEn: z.string().max(120),
  baggageInfoEn: z.string().max(300), ticketCategoryEn: z.string().max(200), seatingInfoEn: z.string().max(300),
})

export type SaveTripState = { success?: boolean; error?: string }
export type SaveTeamState = { success?: boolean; error?: string }
export type SaveLeagueState = { success?: boolean; error?: string }

const teamSchema = z.object({
  name: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  stadium: z.string().min(2).max(140),
  nameEn: z.string().max(100),
  cityEn: z.string().max(100),
  countryEn: z.string().max(100),
  stadiumEn: z.string().max(140),
})

export async function saveTeam(_: SaveTeamState, formData: FormData): Promise<SaveTeamState> {
  const user = await requireAdmin()
  await ensureTripColumns()
  const id = Number(formData.get("id"))
  const parsed = teamSchema.safeParse({
    name: clean(formData.get("name")),
    city: clean(formData.get("city")),
    country: clean(formData.get("country")),
    stadium: clean(formData.get("stadium")),
    nameEn: clean(formData.get("nameEn")),
    cityEn: clean(formData.get("cityEn")),
    countryEn: clean(formData.get("countryEn")),
    stadiumEn: clean(formData.get("stadiumEn")),
  })
  if (!parsed.success) return { error: "Uzupełnij nazwę drużyny, miasto, kraj i stadion." }

  const duplicate = await db.select({ id: teams.id }).from(teams).where(id ? and(eq(teams.name, parsed.data.name), ne(teams.id, id)) : eq(teams.name, parsed.data.name)).limit(1)
  if (duplicate.length) return { error: "Drużyna o tej nazwie już istnieje." }

  const [existing] = Number.isInteger(id) && id > 0 ? await db.select().from(teams).where(eq(teams.id, id)).limit(1) : []
  let logo = existing?.logo || ""
  const logoFile = formData.get("logoFile")
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      const optimized = await optimizeTeamLogo(logoFile)
      const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
      const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: optimized.contentType, size: optimized.size, width: optimized.width, height: optimized.height, alt: `Herb ${parsed.data.name}`, originalName: logoFile.name, createdBy: user.id }).returning({ id: mediaAssets.id })
      logo = `/api/media/${asset.id}`
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zapisać herbu." }
    }
  }
  if (!logo) return { error: "Dodaj herb drużyny." }

  let tripImageMediaId = Number(formData.get("tripImageMediaId")) || existing?.tripImageMediaId || null
  const tripImageFile = formData.get("tripImageFile")
  if (tripImageFile instanceof File && tripImageFile.size > 0) {
    try {
      const optimized = await optimizeUploadedImage(tripImageFile)
      const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
      const [asset] = await db.insert(mediaAssets).values({
        pathname: blob.pathname,
        contentType: optimized.contentType,
        size: optimized.size,
        width: optimized.width,
        height: optimized.height,
        alt: `${parsed.data.name} - zdjęcie główne wyjazdów`,
        altEn: `${parsed.data.nameEn || parsed.data.name} - main trip image`,
        originalName: tripImageFile.name,
        category: "team",
        createdBy: user.id,
      }).returning({ id: mediaAssets.id })
      tripImageMediaId = asset.id
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zapisać zdjęcia głównego wyjazdów." }
    }
  }
  if (!tripImageMediaId) return { error: "Dodaj zdjęcie główne wyjazdów albo wybierz je z biblioteki." }

  const values = { ...parsed.data, logo, tripImageMediaId, updatedAt: new Date() }
  if (existing) {
    await db.update(teams).set(values).where(eq(teams.id, id))
    await db.update(trips).set({
      homeTeam: parsed.data.name,
      homeLogo: logo,
      updatedAt: new Date(),
    }).where(eq(trips.homeTeamId, id))
    await db.update(trips).set({
      image: `/api/media/${tripImageMediaId}`,
      updatedAt: new Date(),
    }).where(and(eq(trips.homeTeamId, id), sql`${trips.coverMediaId} IS NULL`))
    await db.update(trips).set({
      awayTeam: parsed.data.name,
      awayLogo: logo,
      opponent: parsed.data.name,
      updatedAt: new Date(),
    }).where(eq(trips.awayTeamId, id))
    await logActivity(user.id, "updated", "team", String(id), parsed.data.name)
    if (existing.logo !== logo) {
      const oldLogoId = mediaIdFromUrl(existing.logo)
      if (oldLogoId) await deleteMediaAsset(oldLogoId).catch(() => undefined)
    }
  } else {
    const [created] = await db.insert(teams).values(values).returning({ id: teams.id })
    await logActivity(user.id, "created", "team", String(created.id), parsed.data.name)
  }
  refreshPublic()
  return { success: true }
}

export async function deleteTeam(_: SaveTeamState, formData: FormData): Promise<SaveTeamState> {
  const user = await requireAdmin()
  await ensureTripColumns()
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id) || id <= 0) return { error: "Nieprawidłowa drużyna." }
  const used = await db.select({ id: trips.id }).from(trips).where(or(eq(trips.homeTeamId, id), eq(trips.awayTeamId, id))).limit(1)
  if (used.length) return { error: "Nie można usunąć drużyny używanej przez wyjazd." }
  const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1)
  if (!team) return { error: "Nie znaleziono drużyny." }
  await db.delete(teams).where(eq(teams.id, id))
  const logoId = mediaIdFromUrl(team.logo)
  if (logoId) await deleteMediaAsset(logoId).catch(() => undefined)
  if (team.tripImageMediaId) await deleteMediaAsset(team.tripImageMediaId).catch(() => undefined)
  await logActivity(user.id, "deleted", "team", String(id), team.name)
  revalidatePath("/admin")
  return { success: true }
}

export async function saveLeague(_: SaveLeagueState, formData: FormData): Promise<SaveLeagueState> {
  const user = await requireAdmin()
  await ensureTripColumns()
  const id = Number(formData.get("id"))
  const name = clean(formData.get("name"))
  if (name.length < 2 || name.length > 100) return { error: "Podaj poprawną nazwę ligi." }
  const [existing] = id > 0 ? await db.select().from(leagues).where(eq(leagues.id, id)).limit(1) : []
  let logo = existing?.logo || ""
  const file = formData.get("logoFile")
  if (file instanceof File && file.size > 0) {
    try {
      const optimized = await optimizeTeamLogo(file)
      const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
      const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: optimized.contentType, size: optimized.size, width: optimized.width, height: optimized.height, alt: `Logo ${name}`, originalName: file.name, createdBy: user.id }).returning({ id: mediaAssets.id })
      logo = `/api/media/${asset.id}`
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zapisać logo ligi." }
    }
  }
  if (!logo) return { error: "Dodaj logo ligi." }
  if (existing) {
    await db.update(leagues).set({ name, logo, updatedAt: new Date() }).where(eq(leagues.id, id))
    await db.update(trips).set({ leagueName: name, leagueLogo: logo, updatedAt: new Date() }).where(eq(trips.leagueId, id))
    if (existing.logo !== logo) {
      const oldId = mediaIdFromUrl(existing.logo)
      if (oldId) await deleteMediaAsset(oldId).catch(() => undefined)
    }
    await logActivity(user.id, "updated", "league", String(id), name)
  } else {
    const [created] = await db.insert(leagues).values({ name, logo }).returning({ id: leagues.id })
    await logActivity(user.id, "created", "league", String(created.id), name)
  }
  refreshPublic()
  return { success: true }
}

export async function deleteLeague(_: SaveLeagueState, formData: FormData): Promise<SaveLeagueState> {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))
  const [league] = await db.select().from(leagues).where(eq(leagues.id, id)).limit(1)
  if (!league) return { error: "Nie znaleziono ligi." }
  const used = await db.select({ id: trips.id }).from(trips).where(eq(trips.leagueId, id)).limit(1)
  if (used.length) return { error: "Najpierw usuń ligę z przypisanych wyjazdów." }
  await db.delete(leagues).where(eq(leagues.id, id))
  const logoId = mediaIdFromUrl(league.logo)
  if (logoId) await deleteMediaAsset(logoId).catch(() => undefined)
  await logActivity(user.id, "deleted", "league", String(id), league.name)
  refreshPublic()
  return { success: true }
}

export async function saveTrip(_: SaveTripState, formData: FormData): Promise<SaveTripState> {
  const user = await requireAdmin()
  await ensureTripColumns()
  const id = Number(formData.get("id"))
  // The description field carries HTML produced by the restricted rich-text editor
  // (bold/italic/lists/links only); sanitize before validation so stored content is
  // always the safe, allowlisted subset regardless of what the client actually sent.
  const description = sanitizeDescriptionHtml(clean(formData.get("description")))
  const descriptionEn = sanitizeDescriptionHtml(clean(formData.get("descriptionEn")))
  const parsed = tripSchema.safeParse({
    title: clean(formData.get("title")), city: clean(formData.get("city")),
    country: clean(formData.get("country")), startDate: clean(formData.get("startDate")), endDate: clean(formData.get("endDate")) || undefined,
    price: clean(formData.get("price")), status: clean(formData.get("status")), description,
    stadium: clean(formData.get("stadium")), matchDate: clean(formData.get("matchDate")) || undefined,
    availabilityStatus: clean(formData.get("availabilityStatus")),
    durationDays: clean(formData.get("durationDays")), durationNights: clean(formData.get("durationNights")),
    homeTeamId: clean(formData.get("homeTeamId")), awayTeamId: clean(formData.get("awayTeamId")),
    hotelStars: clean(formData.get("hotelStars")) || "0", hotelBoard: clean(formData.get("hotelBoard")), roomType: clean(formData.get("roomType")),
    departureAirports: clean(formData.get("departureAirports")), flightType: clean(formData.get("flightType")),
    baggageInfo: clean(formData.get("baggageInfo")), ticketCategory: clean(formData.get("ticketCategory")), seatingInfo: clean(formData.get("seatingInfo")),
    titleEn: clean(formData.get("titleEn")), cityEn: clean(formData.get("cityEn")), countryEn: clean(formData.get("countryEn")), descriptionEn,
    hotelBoardEn: clean(formData.get("hotelBoardEn")), roomTypeEn: clean(formData.get("roomTypeEn")),
    departureAirportsEn: clean(formData.get("departureAirportsEn")), flightTypeEn: clean(formData.get("flightTypeEn")),
    baggageInfoEn: clean(formData.get("baggageInfoEn")), ticketCategoryEn: clean(formData.get("ticketCategoryEn")), seatingInfoEn: clean(formData.get("seatingInfoEn")),
  })
  if (!parsed.success) return { error: "Sprawdź wymagane pola wyjazdu." }
  const slug = slugify(clean(formData.get("slug")) || parsed.data.title)
  const duplicate = await db.select({ id: trips.id }).from(trips).where(id ? and(eq(trips.slug, slug), ne(trips.id, id)) : eq(trips.slug, slug)).limit(1)
  if (duplicate.length) return { error: "Ten adres URL jest już używany." }

  if (parsed.data.homeTeamId === parsed.data.awayTeamId) return { error: "Wybierz dwie różne drużyny." }
  const selectedTeams = await db.select().from(teams).where(inArray(teams.id, [parsed.data.homeTeamId, parsed.data.awayTeamId]))
  const homeTeamRecord = selectedTeams.find((team) => team.id === parsed.data.homeTeamId)
  const awayTeamRecord = selectedTeams.find((team) => team.id === parsed.data.awayTeamId)
  if (!homeTeamRecord || !awayTeamRecord) return { error: "Nie znaleziono wybranej drużyny. Odśwież panel i spróbuj ponownie." }
  const leagueId = Number(formData.get("leagueId")) || null
  const [league] = leagueId ? await db.select().from(leagues).where(eq(leagues.id, leagueId)).limit(1) : []
  if (leagueId && !league) return { error: "Nie znaleziono wybranej ligi." }

  const isEditing = Number.isInteger(id) && id > 0
  const [existingTrip] = isEditing
    ? await db.select({ image: trips.image, coverMediaId: trips.coverMediaId, homeLogo: trips.homeLogo, awayLogo: trips.awayLogo }).from(trips).where(eq(trips.id, id)).limit(1)
    : []
  const coverMode = clean(formData.get("coverMode")) || (existingTrip?.coverMediaId ? "override" : "team")
  let coverMediaId = coverMode === "override"
    ? Number(formData.get("coverMediaId")) || existingTrip?.coverMediaId || null
    : null
  let image = coverMediaId
    ? `/api/media/${coverMediaId}`
    : homeTeamRecord.tripImageMediaId
      ? `/api/media/${homeTeamRecord.tripImageMediaId}`
      : clean(formData.get("image")) || existingTrip?.image || ""
  let homeLogo = homeTeamRecord.logo || clean(formData.get("homeLogo")) || existingTrip?.homeLogo || ""
  let awayLogo = awayTeamRecord.logo || clean(formData.get("awayLogo")) || existingTrip?.awayLogo || ""

  async function uploadTripImage(file: FormDataEntryValue | null, alt: string, kind: "cover" | "logo" = "cover") {
    if (!(file instanceof File) || file.size === 0) return ""
    const optimized = kind === "logo" ? await optimizeTeamLogo(file) : await optimizeUploadedImage(file)
    const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
    const [asset] = await db.insert(mediaAssets).values({ pathname: blob.pathname, contentType: optimized.contentType, size: optimized.size, width: optimized.width, height: optimized.height, alt, originalName: file.name, category: kind === "cover" ? "trip" : "logo", createdBy: user.id }).returning({ id: mediaAssets.id })
    return `/api/media/${asset.id}`
  }

  const coverFile = formData.get("coverFile")
  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      image = await uploadTripImage(coverFile, `Stadion - ${parsed.data.title}`)
      coverMediaId = mediaIdFromUrl(image)
      homeLogo = (await uploadTripImage(formData.get("homeLogoFile"), `Herb ${homeTeamRecord.name}`, "logo")) || homeLogo
      awayLogo = (await uploadTripImage(formData.get("awayLogoFile"), `Herb ${awayTeamRecord.name}`, "logo")) || awayLogo
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zoptymalizować zdjęcia." }
    }
  } else {
    try {
      homeLogo = (await uploadTripImage(formData.get("homeLogoFile"), `Herb ${homeTeamRecord.name}`, "logo")) || homeLogo
      awayLogo = (await uploadTripImage(formData.get("awayLogoFile"), `Herb ${awayTeamRecord.name}`, "logo")) || awayLogo
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Nie udało się zapisać herbu zespołu." }
    }
  }

  if (!image || !homeLogo || !awayLogo) return { error: "Drużyna gospodarza musi mieć zdjęcie główne wyjazdów oraz oba zespoły muszą mieć herby." }

  const values = {
    ...parsed.data, homeTeam: homeTeamRecord.name, awayTeam: awayTeamRecord.name, opponent: awayTeamRecord.name, slug, endDate: parsed.data.endDate || null, matchDate: parsed.data.matchDate || null, image, coverMediaId, homeLogo, awayLogo,
    leagueId, leagueName: league?.name || "", leagueLogo: league?.logo || "",
    featured: formData.get("featured") === "on", includes: clean(formData.get("includes")).split("\n").map((item) => item.trim()).filter(Boolean),
    includesEn: clean(formData.get("includesEn")).split("\n").map((item) => item.trim()).filter(Boolean),
    packageItems: packageFeatures.map(({ key }) => {
      const value = clean(formData.get(`package.${key}`)) as PackageFeatureStatus
      return `${key}|${["included", "optional", "excluded"].includes(value) ? value : "excluded"}`
    }),
    packageVariants: packageVariantOptions.filter(({ key }) => formData.get(`packageVariant.${key}`) === "on").map(({ key }) => key),
    itinerary: clean(formData.get("itinerary")).split("\n").map((item) => item.trim()).filter(Boolean),
    itineraryEn: clean(formData.get("itineraryEn")).split("\n").map((item) => item.trim()).filter(Boolean),
    hotelInfo: clean(formData.get("hotelInfo")), flightInfo: clean(formData.get("flightInfo")),
    hotelInfoEn: clean(formData.get("hotelInfoEn")), flightInfoEn: clean(formData.get("flightInfoEn")),
    faq: clean(formData.get("faq")).split("\n").map((item) => item.trim()).filter(Boolean),
    faqEn: clean(formData.get("faqEn")).split("\n").map((item) => item.trim()).filter(Boolean),
    sortOrder: Number(formData.get("sortOrder")) || 0, seoTitle: clean(formData.get("seoTitle")), seoDescription: clean(formData.get("seoDescription")), seoTitleEn: clean(formData.get("seoTitleEn")), seoDescriptionEn: clean(formData.get("seoDescriptionEn")), updatedAt: new Date(),
  }
  if (Number.isInteger(id) && id > 0) {
    await db.update(trips).set(values).where(eq(trips.id, id))
    await logActivity(user.id, "updated", "trip", String(id), parsed.data.title)
  } else {
    const [created] = await db.insert(trips).values(values).returning({ id: trips.id })
    await logActivity(user.id, "created", "trip", String(created.id), parsed.data.title)
  }
  refreshPublic()
  return { success: true }
}

export async function setTripStatus(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id")); const status = clean(formData.get("status"))
  if (!Number.isInteger(id) || !statuses.includes(status as typeof statuses[number])) return
  await db.update(trips).set({ status, updatedAt: new Date() }).where(eq(trips.id, id))
  await logActivity(user.id, status, "trip", String(id))
  refreshPublic()
}

export async function duplicateTrip(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await ensureTripColumns()
  const [trip] = await db.select().from(trips).where(eq(trips.id, id)).limit(1)
  if (!trip) return
  const [{ id: createdId }] = await db.insert(trips).values({ ...trip, id: undefined, slug: `${trip.slug}-kopia-${Date.now().toString().slice(-5)}`, title: `${trip.title} — kopia`, status: "draft", featured: false, createdAt: new Date(), updatedAt: new Date() }).returning({ id: trips.id })
  await logActivity(user.id, "duplicated", "trip", String(createdId), trip.title)
  refreshPublic()
}

export async function deleteTrip(formData: FormData) {
  const user = await requireAdmin()
  await ensureTripColumns()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) return

  const [trip] = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .limit(1)

  if (!trip) return

  // Pobierz wszystkie zdjęcia przypisane do tego wyjazdu
  const tripGallery = await db
    .select({ mediaId: tripGalleryItems.mediaId })
    .from(tripGalleryItems)
    .where(eq(tripGalleryItems.tripId, id))

  const mediaIds = new Set<number>()


const coverMatch = trip.image?.match(/^\/api\/media\/(\d+)$/)
  if (coverMatch) {
    mediaIds.add(Number(coverMatch[1]))
  }

  for (const logo of [trip.homeLogo, trip.awayLogo]) {
    const logoMatch = logo?.match(/^\/api\/media\/(\d+)$/)
    if (logoMatch) mediaIds.add(Number(logoMatch[1]))
  }

 
  for (const item of tripGallery) {
    if (item.mediaId) {
      mediaIds.add(item.mediaId)
    }
  }

  await db
    .delete(tripGalleryItems)
    .where(eq(tripGalleryItems.tripId, id))

  await db
    .delete(trips)
    .where(eq(trips.id, id))


  for (const mediaId of mediaIds) {
    await deleteMediaAsset(mediaId)
  }

  await logActivity(
    user.id,
    "deleted",
    "trip",
    String(id),
    trip.title
  )

  refreshPublic()
}
export async function updateInquiry(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id")); const status = clean(formData.get("status"))
  if (!Number.isInteger(id) || !["new", "contacted", "closed"].includes(status)) return
  await db.update(inquiries).set({ status, adminNote: clean(formData.get("adminNote")), updatedAt: new Date() }).where(eq(inquiries.id, id))
  await logActivity(user.id, "updated", "inquiry", String(id), status)
  revalidatePath("/admin")
}
export async function deleteInquiry(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) return

  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1)

  if (!inquiry) return

  if (inquiry.status !== "closed") return

  await db
    .delete(inquiries)
    .where(eq(inquiries.id, id))

  await logActivity(
    user.id,
    "deleted",
    "inquiry",
    String(id),
    inquiry.name
  )

  revalidatePath("/admin")
}


export async function saveTestimonial(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  const values = { author: clean(formData.get("author")), tripName: clean(formData.get("tripName")), content: clean(formData.get("content")), tripNameEn: clean(formData.get("tripNameEn")), contentEn: clean(formData.get("contentEn")), rating: Math.min(5, Math.max(1, Number(formData.get("rating")) || 5)), status: clean(formData.get("status")) === "published" ? "published" : "draft", sortOrder: Number(formData.get("sortOrder")) || 0, updatedAt: new Date() }
  if (!values.author || !values.content) throw new Error("Autor i treść opinii są wymagane")
  if (id > 0) await db.update(testimonials).set(values).where(eq(testimonials.id, id)); else await db.insert(testimonials).values(values)
  await logActivity(user.id, id > 0 ? "updated" : "created", "testimonial", id > 0 ? String(id) : undefined, values.author)
  refreshPublic()
}

export async function archiveTestimonial(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await db.update(testimonials).set({ status: "archived", updatedAt: new Date() }).where(eq(testimonials.id, id))
  await logActivity(user.id, "archived", "testimonial", String(id)); refreshPublic()
}

const ALLOWED_SETTING_KEYS = new Set([
  "seoTitle", "seoDescription",
  "heroEyebrow", "heroTitle", "heroDescription", "heroCta", "tripsTitle", "tripsDescription",
  "customTripTitle", "packageTitle", "benefitsTitle", "galleryTitle", "galleryHomeLimit",
  "testimonialsTitle", "facebookReviewsCount", "facebookReviewsAverage", "processTitle", "aboutTitle", "aboutText", "faqTitle", "contactTitle",
  "contactEmail", "contactPhone", "footerText", "companyName", "companyAddress", "companyNip",
  "youtubeTitle", "youtubeUrl", "youtubeLimit", "youtubeEnabled",
])

const isAllowedSettingKey = (key: string) =>
  ALLOWED_SETTING_KEYS.has(key) ||
  (key.endsWith("En") && ALLOWED_SETTING_KEYS.has(key.slice(0, -2)))

export type SaveSettingsState = {
  error?: string
  success?: boolean
}

export async function saveSettings(
  _: SaveSettingsState,
  formData: FormData
): Promise<SaveSettingsState> {
  const user = await requireAdmin()

  try {
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("setting.")) continue

      const settingKey = key.slice(8)

      if (!isAllowedSettingKey(settingKey)) continue

      let settingValue = String(value).slice(0, 4000)

      if (settingKey === "galleryHomeLimit") {
        settingValue = String(
          Math.min(5, Math.max(1, Number(settingValue) || 5))
        )
      }

      if (settingKey === "facebookReviewsCount") {
        const reviewsCount = Number(settingValue)

        settingValue = String(
          Number.isFinite(reviewsCount)
            ? Math.min(
                100000,
                Math.max(0, Math.floor(reviewsCount))
              )
            : 0
        )
      }
      if (settingKey === "facebookReviewsAverage") {
  const reviewsAverage = Number(settingValue.replace(",", "."))

  settingValue = Number.isFinite(reviewsAverage)
    ? Math.min(5, Math.max(0, reviewsAverage)).toFixed(1)
    : "5.0"
}

      await db
        .insert(siteSettings)
        .values({
          key: settingKey,
          value: settingValue,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: settingValue,
            updatedAt: new Date(),
          },
        })
    }

    await logActivity(
      user.id,
      "updated",
      "settings",
      undefined,
      "Treści strony"
    )

    refreshPublic()

    return { success: true }
  } catch {
    return {
      error:
        "Nie udało się zapisać treści strony. Spróbuj ponownie.",
    }
  }
}

export async function uploadMedia(formData: FormData) {
  const user = await requireAdmin()
  const files = [...formData.getAll("files"), ...formData.getAll("file")]
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
  if (!files.length) throw new Error("Wybierz co najmniej jedno zdjęcie")
  if (files.length > 20) throw new Error("Jednorazowo możesz przesłać maksymalnie 20 zdjęć")

  for (const file of files) {
    const optimized = await optimizeUploadedImage(file)
    const blob = await put(optimized.pathname, optimized.data, { access: "private", addRandomSuffix: false, contentType: optimized.contentType })
    const [asset] = await db.insert(mediaAssets).values({
      pathname: blob.pathname,
      contentType: optimized.contentType,
      size: optimized.size,
      width: optimized.width,
      height: optimized.height,
      alt: clean(formData.get("alt")),
      altEn: clean(formData.get("altEn")),
      category: clean(formData.get("category")) || "other",
      originalName: file.name,
      createdBy: user.id,
    }).returning({ id: mediaAssets.id })
    await logActivity(user.id, "uploaded", "media", String(asset.id), file.name)
  }
  revalidatePath("/admin")
}

export async function updateMedia(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id"))
  await db.update(mediaAssets).set({ alt: clean(formData.get("alt")), altEn: clean(formData.get("altEn")), category: clean(formData.get("category")) || "other", updatedAt: new Date() }).where(eq(mediaAssets.id, id))
  await logActivity(user.id, "updated", "media", String(id)); refreshPublic()
}
export async function deleteMedia(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowe ID zdjęcia")
  }

  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1)

  if (!asset) {
    throw new Error("Nie znaleziono zdjęcia")
  }

  if (await mediaHasReferences(id)) {
    throw new Error("Najpierw usuń wszystkie przypisania tego zdjęcia.")
  }

  // Usuń plik z Vercel Blob
  await del(asset.pathname)

  // Usuń zdjęcie z biblioteki
  await db
    .delete(mediaAssets)
    .where(eq(mediaAssets.id, id))

  await logActivity(
    user.id,
    "deleted",
    "media",
    String(id),
    asset.originalName
  )

  refreshPublic()
}

export type AddGalleryItemState = { error?: string; success?: boolean; message?: string }

export async function addGalleryItem(_: AddGalleryItemState, formData: FormData): Promise<AddGalleryItemState> {
  try {
    const user = await requireAdmin()
    const destination = clean(formData.get("destination"))
    const [scope, rawId] = destination.split(":")
    const targetId = Number(rawId)
    const mediaIds = [...formData.getAll("mediaIds"), formData.get("mediaId")]
      .flatMap((entry) => String(entry || "").split(","))
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0)

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (files.length > 20) return { error: "Jednorazowo możesz przesłać maksymalnie 20 zdjęć." }

    const category = scope === "trip" ? "trip" : scope === "team" ? "team" : "homepage"
    for (const file of files) {
      const optimized = await optimizeUploadedImage(file)
      const blob = await put(optimized.pathname, optimized.data, {
        access: "private",
        addRandomSuffix: false,
        contentType: optimized.contentType,
      })
      const [asset] = await db.insert(mediaAssets).values({
        pathname: blob.pathname,
        contentType: optimized.contentType,
        size: optimized.size,
        width: optimized.width,
        height: optimized.height,
        alt: clean(formData.get("alt")),
        altEn: clean(formData.get("altEn")),
        category,
        originalName: file.name,
        createdBy: user.id,
      }).returning({ id: mediaAssets.id })
      mediaIds.push(asset.id)
      await logActivity(user.id, "uploaded", "media", String(asset.id), file.name)
    }

    if (!mediaIds.length) return { error: "Wybierz zdjęcia z biblioteki albo prześlij nowe." }

    const selectedAssets = await db.select().from(mediaAssets).where(inArray(mediaAssets.id, mediaIds))
    const assetsById = new Map(selectedAssets.map((asset) => [asset.id, asset]))
    const assets = mediaIds.map((id) => assetsById.get(id)).filter((asset): asset is typeof selectedAssets[number] => Boolean(asset))
    if (!assets.length) return { error: "Nie znaleziono zdjęć" }
    for (const [index, asset] of assets.entries()) {
      const common = { mediaId: asset.id, caption: clean(formData.get("caption")), captionEn: clean(formData.get("captionEn")), alt: clean(formData.get("alt")) || asset.alt, altEn: clean(formData.get("altEn")) || asset.altEn, sortOrder: (Number(formData.get("sortOrder")) || 0) + index }
      if (scope === "trip" && targetId > 0) await db.insert(tripGalleryItems).values({ tripId: targetId, ...common })
      else if (scope === "team" && targetId > 0) await db.insert(teamGalleryItems).values({ teamId: targetId, ...common }).onConflictDoNothing()
      else await db.insert(galleryItems).values({ title: common.caption || asset.originalName, titleEn: common.captionEn, city: clean(formData.get("city")), cityEn: clean(formData.get("cityEn")), image: `/api/media/${asset.id}`, mediaId: asset.id, alt: common.alt, altEn: common.altEn, sortOrder: common.sortOrder })
    }
    const entity = scope === "trip" ? "trip_gallery" : scope === "team" ? "team_gallery" : "gallery"
    await logActivity(user.id, "added", entity, mediaIds.join(",")); refreshPublic()
    return { success: true, message: `Dodano ${assets.length} ${assets.length === 1 ? "zdjęcie" : "zdjęcia"}.` }
  } catch {
    return { error: "Nie udało się dodać zdjęcia do galerii." }
  }
}

export async function setTripCover(formData: FormData) {
  const user = await requireAdmin()
  const tripId = Number(formData.get("tripId"))
  const mediaId = Number(formData.get("mediaId"))
  if (!Number.isInteger(tripId) || !Number.isInteger(mediaId)) throw new Error("Wybierz wyjazd i zdjęcie")
  const [asset] = await db.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
  if (!asset) throw new Error("Nie znaleziono zdjęcia")
  await db.update(trips).set({ image: `/api/media/${mediaId}`, coverMediaId: mediaId, updatedAt: new Date() }).where(eq(trips.id, tripId))
  await logActivity(user.id, "updated_cover", "trip", String(tripId), `Media #${mediaId}`)
  refreshPublic()
}

export type UpdateGalleryItemState = { error?: string; success?: boolean }

export async function updateGalleryItem(_: UpdateGalleryItemState, formData: FormData): Promise<UpdateGalleryItemState> {
  try {
    const user = await requireAdmin()
    const id = Number(formData.get("id"))
    if (!Number.isInteger(id) || id <= 0) return { error: "Nieprawidłowe zdjęcie galerii." }
    await db.update(galleryItems).set({
      title: clean(formData.get("title")),
      city: clean(formData.get("city")),
      titleEn: clean(formData.get("titleEn")),
      cityEn: clean(formData.get("cityEn")),
      alt: clean(formData.get("alt")),
      altEn: clean(formData.get("altEn")),
    }).where(eq(galleryItems.id, id))
    await logActivity(user.id, "updated", "gallery", String(id))
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się zapisać zmian zdjęcia." }
  }
}

export async function updateTripGalleryItem(_: UpdateGalleryItemState, formData: FormData): Promise<UpdateGalleryItemState> {
  try {
    const user = await requireAdmin()
    const id = Number(formData.get("id"))
    if (!Number.isInteger(id) || id <= 0) return { error: "Nieprawidłowe zdjęcie galerii." }
    await db.update(tripGalleryItems).set({
      caption: clean(formData.get("caption")).slice(0, 160),
      alt: clean(formData.get("alt")).slice(0, 240),
      captionEn: clean(formData.get("captionEn")).slice(0, 160),
      altEn: clean(formData.get("altEn")).slice(0, 240),
      sortOrder: Number(formData.get("sortOrder")) || 0,
      updatedAt: new Date(),
    }).where(eq(tripGalleryItems.id, id))
    await logActivity(user.id, "updated", "trip_gallery", String(id))
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się zapisać zmian zdjęcia." }
  }
}

export async function updateTeamGalleryItem(_: UpdateGalleryItemState, formData: FormData): Promise<UpdateGalleryItemState> {
  try {
    const user = await requireAdmin(); const id = Number(formData.get("id"))
    await db.update(teamGalleryItems).set({ caption: clean(formData.get("caption")).slice(0, 160), alt: clean(formData.get("alt")).slice(0, 240), captionEn: clean(formData.get("captionEn")).slice(0, 160), altEn: clean(formData.get("altEn")).slice(0, 240), sortOrder: Number(formData.get("sortOrder")) || 0, updatedAt: new Date() }).where(eq(teamGalleryItems.id, id))
    await logActivity(user.id, "updated", "team_gallery", String(id)); refreshPublic(); return { success: true }
  } catch { return { error: "Nie udało się zapisać zdjęcia drużyny." } }
}

export async function removeGalleryItem(formData: FormData) {
  const user = await requireAdmin(); const id = Number(formData.get("id")); const scope = clean(formData.get("scope"))
  if (scope === "trip") await db.delete(tripGalleryItems).where(eq(tripGalleryItems.id, id)); else if (scope === "team") await db.delete(teamGalleryItems).where(eq(teamGalleryItems.id, id)); else await db.delete(galleryItems).where(eq(galleryItems.id, id))
  await logActivity(user.id, "removed", `${scope}_gallery`, String(id)); refreshPublic()
}

export type SyncYouTubeState = { error?: string; success?: boolean }

/** Lets an admin trigger the daily YouTube cache refresh on demand instead of waiting for the nightly cron job. */
export async function syncYouTubeNow(_: SyncYouTubeState, _formData: FormData): Promise<SyncYouTubeState> {
  const user = await requireAdmin()
  try {
    await syncYouTubeVideos()
    await logActivity(user.id, "synced", "youtube", undefined, "Ręczne odświeżenie listy filmów")
    refreshPublic()
    return { success: true }
  } catch {
    return { error: "Nie udało się odświeżyć listy filmów. Sprawdź adres kanału YouTube w ustawieniach." }
    
  }
}
export async function addYouTubeVideoToHomepage(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowy film.")
  }

  const [video] = await db
    .select()
    .from(youtubeVideos)
    .where(eq(youtubeVideos.id, id))
    .limit(1)

  if (!video) {
    throw new Error("Nie znaleziono filmu.")
  }

  // Film jest już wybrany — nie zmieniamy jego kolejności.
  if (video.featured) {
    return
  }

  // Pobieramy ostatnią pozycję spośród filmów widocznych na stronie.
  const [lastVideo] = await db
    .select({ sortOrder: youtubeVideos.sortOrder })
    .from(youtubeVideos)
    .where(eq(youtubeVideos.featured, true))
    .orderBy(sql`${youtubeVideos.sortOrder} DESC`)
    .limit(1)

  const nextSortOrder = (lastVideo?.sortOrder ?? -1) + 1

  await db
    .update(youtubeVideos)
    .set({
      featured: true,
      sortOrder: nextSortOrder,
    })
    .where(eq(youtubeVideos.id, id))

  await logActivity(
    user.id,
    "featured",
    "youtube",
    String(id),
    video.title
  )

  refreshPublic()
}

export async function removeYouTubeVideoFromHomepage(formData: FormData) {
  const user = await requireAdmin()
  const id = Number(formData.get("id"))

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowy film.")
  }

  const [video] = await db
    .select()
    .from(youtubeVideos)
    .where(eq(youtubeVideos.id, id))
    .limit(1)

  if (!video) {
    throw new Error("Nie znaleziono filmu.")
  }

  await db
    .update(youtubeVideos)
    .set({
      featured: false,
      sortOrder: 0,
    })
    .where(eq(youtubeVideos.id, id))

  // Po usunięciu normalizujemy kolejność pozostałych filmów.
  const remainingVideos = await db
    .select({ id: youtubeVideos.id })
    .from(youtubeVideos)
    .where(eq(youtubeVideos.featured, true))
    .orderBy(asc(youtubeVideos.sortOrder), asc(youtubeVideos.id))

  for (const [index, item] of remainingVideos.entries()) {
    await db
      .update(youtubeVideos)
      .set({ sortOrder: index })
      .where(eq(youtubeVideos.id, item.id))
  }

  await logActivity(
    user.id,
    "unfeatured",
    "youtube",
    String(id),
    video.title
  )

  refreshPublic()
}

export async function reorderYouTubeVideos(formData: FormData) {
  const user = await requireAdmin()

  let items: { id: number; sortOrder: number }[]

  try {
    items = JSON.parse(String(formData.get("items") || "[]"))
  } catch {
    throw new Error("Nieprawidłowa kolejność filmów.")
  }

  if (!Array.isArray(items)) {
    throw new Error("Nieprawidłowa kolejność filmów.")
  }

  const normalizedItems = items
    .map((item, index) => ({
      id: Number(item.id),
      sortOrder: index,
    }))
    .filter((item) => Number.isInteger(item.id) && item.id > 0)

  if (normalizedItems.length !== items.length) {
    throw new Error("Nieprawidłowe dane filmów.")
  }

  // Zmieniamy kolejność wyłącznie filmów wybranych na stronę.
  for (const item of normalizedItems) {
    await db
      .update(youtubeVideos)
      .set({ sortOrder: item.sortOrder })
      .where(
        and(
          eq(youtubeVideos.id, item.id),
          eq(youtubeVideos.featured, true)
        )
      )
  }

  await logActivity(
    user.id,
    "reordered",
    "youtube",
    undefined,
    `Zmieniono kolejność ${normalizedItems.length} filmów`
  )

  refreshPublic()
}
export async function reorderGalleryItems(formData: FormData) {
  const user = await requireAdmin()

  const scope = clean(formData.get("scope"))
  const items = JSON.parse(String(formData.get("items") || "[]")) as {
    id: number
    sortOrder: number
  }[]

  if (!Array.isArray(items)) return

  if (scope === "trip") {
    for (const item of items) {
      await db
        .update(tripGalleryItems)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
        .where(eq(tripGalleryItems.id, item.id))
    }
  } else if (scope === "team") {
    for (const item of items) await db.update(teamGalleryItems).set({ sortOrder: item.sortOrder, updatedAt: new Date() }).where(eq(teamGalleryItems.id, item.id))
  } else {
    for (const item of items) {
      await db
        .update(galleryItems)
        .set({ sortOrder: item.sortOrder })
        .where(eq(galleryItems.id, item.id))
    }
  }

  await logActivity(
    user.id,
    "reordered",
    scope === "trip" ? "trip_gallery" : "gallery"
  )

  refreshPublic()
}
