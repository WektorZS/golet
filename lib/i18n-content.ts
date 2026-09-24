import type { Locale } from "@/lib/i18n"
import type { Trip } from "@/lib/trips"

export function localizedSetting(
  content: Record<string, string>,
  key: string,
  locale: Locale,
  fallback: string
) {
  if (locale === "en") return content[`${key}En`] || fallback
  return content[key] || fallback
}

export function localizeTrip(trip: Trip, locale: Locale): Trip {
  if (locale === "pl") return trip

  const neutralTitle = [trip.homeTeam, trip.awayTeam].filter(Boolean).join(" vs ")

  return {
    ...trip,
    title: trip.titleEn || neutralTitle || "Football match trip",
    city: trip.cityEn || trip.city,
    country: trip.countryEn || trip.country,
    description:
      trip.descriptionEn ||
      `<p>Experience ${neutralTitle || "a top European football match"} with a complete travel package prepared by Let's Gol.</p>`,
    includes: trip.includesEn,
    itinerary: trip.itineraryEn,
    hotelInfo: trip.hotelInfoEn,
    flightInfo: trip.flightInfoEn,
    faq: trip.faqEn,
    hotelBoard: trip.hotelBoardEn,
    roomType: trip.roomTypeEn,
    departureAirports: trip.departureAirportsEn,
    flightType: trip.flightTypeEn,
    baggageInfo: trip.baggageInfoEn,
    ticketCategory: trip.ticketCategoryEn,
    seatingInfo: trip.seatingInfoEn,
    seoTitle: trip.seoTitleEn || trip.titleEn || neutralTitle,
    seoDescription:
      trip.seoDescriptionEn ||
      `Book a complete football match trip to ${trip.cityEn || trip.city} with Let's Gol.`,
  }
}

export function galleryAlt(
  locale: Locale,
  context: string,
  index: number,
  explicit?: string | null
) {
  if (explicit?.trim()) return explicit.trim()
  return locale === "en"
    ? `${context} - photo ${index + 1}`
    : `${context} - zdjęcie ${index + 1}`
}
