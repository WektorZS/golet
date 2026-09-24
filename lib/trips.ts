import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
} from "drizzle-orm"

import { db } from "@/lib/db"
import {
  teamGalleryItems,
  teams,
  tripGalleryItems,
  trips,
} from "@/lib/db/schema"
import { ensureTripColumns } from "@/lib/db/ensure-trip-columns"
import { type Locale } from "@/lib/i18n"
import { localizeTrip } from "@/lib/i18n-content"

export type Trip = typeof trips.$inferSelect & {
  thumbnailImage?: string
}

async function resolveTripImages(
  rows: Trip[],
  locale: Locale
) {
  const teamIds = [
    ...new Set(
      rows
        .flatMap((trip) => [
          trip.homeTeamId,
          trip.awayTeamId,
        ])
        .filter(
          (id): id is number =>
            Boolean(id)
        )
    ),
  ]

  const teamRows = teamIds.length
    ? await db
        .select({
          id: teams.id,
          tripImageMediaId:
            teams.tripImageMediaId,
          tripThumbnailMediaId:
            teams.tripThumbnailMediaId,
          nameEn: teams.nameEn,
          cityEn: teams.cityEn,
          countryEn: teams.countryEn,
          stadiumEn: teams.stadiumEn,
        })
        .from(teams)
        .where(
          inArray(
            teams.id,
            teamIds
          )
        )
    : []

  const teamById = new Map(
    teamRows.map((team) => [
      team.id,
      team,
    ])
  )

  return rows.map((trip) => {
    const homeTeam = trip.homeTeamId
      ? teamById.get(trip.homeTeamId)
      : undefined

    const awayTeam = trip.awayTeamId
      ? teamById.get(trip.awayTeamId)
      : undefined

    const inheritedMediaId =
      homeTeam?.tripImageMediaId

    const mediaId =
      trip.coverMediaId ||
      inheritedMediaId

    const thumbnailMediaId =
      trip.thumbnailMediaId ||
      homeTeam?.tripThumbnailMediaId ||
      mediaId

    const imageResolved = {
      ...trip,

      ...(mediaId
        ? {
            image: `/api/media/${mediaId}`,
          }
        : {}),

      thumbnailImage:
        thumbnailMediaId
          ? `/api/media/${thumbnailMediaId}`
          : trip.image,
    }

    if (locale === "pl") {
      return imageResolved
    }

    return {
      ...imageResolved,

      homeTeam:
        homeTeam?.nameEn ||
        trip.homeTeam,

      awayTeam:
        awayTeam?.nameEn ||
        trip.awayTeam,

      cityEn:
        trip.cityEn ||
        homeTeam?.cityEn ||
        "",

      countryEn:
        trip.countryEn ||
        homeTeam?.countryEn ||
        "",

      stadium:
        homeTeam?.stadiumEn ||
        trip.stadium,
    }
  })
}

function getTodayPoland() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date())
}

export async function getPublishedTrips(
  locale: Locale = "pl"
) {
  await ensureTripColumns()

  const today = getTodayPoland()

  const rows = await db
    .select()
    .from(trips)
    .where(
      and(
        eq(
          trips.status,
          "published"
        ),
        gte(
          trips.startDate,
          today
        )
      )
    )
    .orderBy(
      desc(trips.featured),
      asc(trips.sortOrder),
      asc(trips.startDate)
    )

  const resolved =
    await resolveTripImages(
      rows,
      locale
    )

  return resolved.map((trip) =>
    localizeTrip(
      trip,
      locale
    )
  )
}

export async function getTripBySlug(
  slug: string,
  locale: Locale = "pl"
) {
  await ensureTripColumns()

  const today = getTodayPoland()

  const [trip] = await db
    .select()
    .from(trips)
    .where(
      and(
        eq(
          trips.slug,
          slug
        ),
        eq(
          trips.status,
          "published"
        ),
        gte(
          trips.startDate,
          today
        )
      )
    )
    .limit(1)

  if (!trip) {
    return null
  }

  const [resolved] =
    await resolveTripImages(
      [trip],
      locale
    )

  return localizeTrip(
    resolved,
    locale
  )
}

export async function getTripGallery(
  tripId: number,
  homeTeamId?: number | null,
  awayTeamId?: number | null,
  locale: Locale = "pl"
) {
  await ensureTripColumns()

  const teamIds = [
    homeTeamId,
    awayTeamId,
  ].filter(
    (id): id is number =>
      Boolean(id)
  )

  const [
    homeGallery,
    awayGallery,
    manualGallery,
  ] = await Promise.all([
    teamIds[0]
      ? db
          .select()
          .from(teamGalleryItems)
          .where(
            and(
              eq(
                teamGalleryItems.teamId,
                teamIds[0]
              ),
              eq(
                teamGalleryItems.status,
                "published"
              )
            )
          )
          .orderBy(
            asc(
              teamGalleryItems.sortOrder
            ),
            asc(
              teamGalleryItems.id
            )
          )
      : [],

    teamIds[1] &&
    teamIds[1] !== teamIds[0]
      ? db
          .select()
          .from(teamGalleryItems)
          .where(
            and(
              eq(
                teamGalleryItems.teamId,
                teamIds[1]
              ),
              eq(
                teamGalleryItems.status,
                "published"
              )
            )
          )
          .orderBy(
            asc(
              teamGalleryItems.sortOrder
            ),
            asc(
              teamGalleryItems.id
            )
          )
      : [],

    db
      .select()
      .from(tripGalleryItems)
      .where(
        and(
          eq(
            tripGalleryItems.tripId,
            tripId
          ),
          eq(
            tripGalleryItems.status,
            "published"
          )
        )
      )
      .orderBy(
        asc(
          tripGalleryItems.sortOrder
        ),
        asc(
          tripGalleryItems.id
        )
      ),
  ])

  const seen =
    new Set<number>()

  return [
    ...homeGallery,
    ...awayGallery,
    ...manualGallery,
  ]
    .filter((item) => {
      if (
        seen.has(item.mediaId)
      ) {
        return false
      }

      seen.add(item.mediaId)

      return true
    })
    .map(
      (item, index) => ({
        ...item,

        caption:
          locale === "en"
            ? item.captionEn ||
              item.caption
            : item.caption,

        alt:
          locale === "en"
            ? item.altEn ||
              item.alt
            : item.alt,

        id: `${
          "teamId" in item
            ? "team"
            : "trip"
        }-${item.id}-${index}`,
      })
    )
}