"use server"

import { requireAdmin } from "@/lib/auth/require-admin"
import { translatePolishTexts } from "@/lib/google-translate"
import { sanitizeDescriptionHtml, stripHtml } from "@/lib/sanitize-html"

const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim()

export type TripTranslationFields = {
  titleEn: string
  cityEn: string
  countryEn: string
  descriptionEn: string
  includesEn: string
  itineraryEn: string
  hotelInfoEn: string
  flightInfoEn: string
  ticketCategoryEn: string
  seatingInfoEn: string
  hotelBoardEn: string
  roomTypeEn: string
  departureAirportsEn: string
  flightTypeEn: string
  baggageInfoEn: string
  faqEn: string
  seoTitleEn: string
  seoDescriptionEn: string
}

export type TranslateTripResult =
  | { success: true; fields: TripTranslationFields }
  | { success: false; error: string }

export type TranslateAdminFieldsResult =
  | { success: true; fields: Record<string, string> }
  | { success: false; error: string }

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean)
}

export async function translateAdminFieldsToEnglish(
  fields: Record<string, string>
): Promise<TranslateAdminFieldsResult> {
  await requireAdmin()

  try {
    const entries = Object.entries(fields).slice(0, 60)
    const characterCount = entries.reduce((sum, [, value]) => sum + String(value).length, 0)

    if (!entries.length || !entries.some(([, value]) => String(value).trim())) {
      return { success: false, error: "Najpierw uzupełnij przynajmniej jedno polskie pole." }
    }

    if (characterCount > 30_000) {
      return { success: false, error: "Jednorazowe tłumaczenie może obejmować maksymalnie 30 000 znaków." }
    }

    const translations = await translatePolishTexts(entries.map(([, value]) => String(value)))
    return {
      success: true,
      fields: Object.fromEntries(entries.map(([key], index) => [key, translations[index] || ""])),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nieznany błąd tłumaczenia."
    return { success: false, error: `Nie udało się przetłumaczyć treści. ${message}` }
  }
}

export async function translateTripToEnglish(formData: FormData): Promise<TranslateTripResult> {
  await requireAdmin()

  try {
    const title = clean(formData.get("title"))
    const description = clean(formData.get("description"))

    if (!title) {
      return { success: false, error: "Najpierw wpisz polski tytuł wyjazdu." }
    }

    const includes = splitLines(clean(formData.get("includes")))
    const itinerary = splitLines(clean(formData.get("itinerary")))
    const faqPairs = splitLines(clean(formData.get("faq"))).map((line) => {
      const separatorIndex = line.indexOf("|")
      return separatorIndex === -1
        ? [line, ""]
        : [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()]
    })

    const plainSources = [
      title,
      clean(formData.get("city")),
      clean(formData.get("country")),
      clean(formData.get("hotelInfo")),
      clean(formData.get("flightInfo")),
      clean(formData.get("ticketCategory")),
      clean(formData.get("seatingInfo")),
      clean(formData.get("hotelBoard")),
      clean(formData.get("roomType")),
      clean(formData.get("departureAirports")),
      clean(formData.get("flightType")),
      clean(formData.get("baggageInfo")),
      clean(formData.get("seoTitle")) || title,
      clean(formData.get("seoDescription")) || stripHtml(description).slice(0, 170),
      ...includes,
      ...itinerary,
      ...faqPairs.flat(),
    ]

    const [plainTranslations, descriptionTranslations] = await Promise.all([
      translatePolishTexts(plainSources),
      translatePolishTexts([description], "text/html"),
    ])

    let cursor = 0
    const take = () => plainTranslations[cursor++] || ""
    const fields: TripTranslationFields = {
      titleEn: take(),
      cityEn: take(),
      countryEn: take(),
      hotelInfoEn: take(),
      flightInfoEn: take(),
      ticketCategoryEn: take(),
      seatingInfoEn: take(),
      hotelBoardEn: take(),
      roomTypeEn: take(),
      departureAirportsEn: take(),
      flightTypeEn: take(),
      baggageInfoEn: take(),
      seoTitleEn: take().slice(0, 70),
      seoDescriptionEn: take().slice(0, 180),
      descriptionEn: sanitizeDescriptionHtml(descriptionTranslations[0] || ""),
      includesEn: includes.map(() => take()).join("\n"),
      itineraryEn: itinerary.map(() => take()).join("\n"),
      faqEn: faqPairs.map(() => {
        const question = take()
        const answer = take()
        return answer ? `${question} | ${answer}` : question
      }).join("\n"),
    }

    return { success: true, fields }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nieznany błąd tłumaczenia."
    return { success: false, error: `Nie udało się przetłumaczyć wyjazdu. ${message}` }
  }
}
