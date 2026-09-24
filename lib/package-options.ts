import type { Locale } from "@/lib/i18n"

export const packageFeatures = [
  { key: "ticket", label: "Bilet na mecz", labelEn: "Match ticket" },
  { key: "flight", label: "Przelot", labelEn: "Flights" },
  { key: "hotel", label: "Hotel", labelEn: "Hotel" },
  { key: "transfers", label: "Transfery lotniskowe", labelEn: "Airport transfers" },
  { key: "baggage", label: "Bagaż", labelEn: "Baggage" },
  { key: "breakfast", label: "Śniadania", labelEn: "Breakfast" },
  { key: "insurance", label: "Ubezpieczenie", labelEn: "Travel insurance" },
  { key: "coordinator", label: "Opieka koordynatora", labelEn: "Coordinator support" },
  { key: "sightseeing", label: "Zwiedzanie", labelEn: "Sightseeing" },
  { key: "local_transport", label: "Transport lokalny", labelEn: "Local transport" },
] as const

export const packageVariantOptions = [
  { key: "full", label: "Pełny pakiet: bilet + lot + hotel", shortLabel: "Pełny pakiet", labelEn: "Full package: ticket + flight + hotel", shortLabelEn: "Full package" },
  { key: "ticket", label: "Sam bilet na mecz", shortLabel: "Bilet", labelEn: "Match ticket only", shortLabelEn: "Ticket" },
  { key: "ticket_flight", label: "Bilet + lot", shortLabel: "Bilet + lot", labelEn: "Ticket + flight", shortLabelEn: "Ticket + flight" },
  { key: "ticket_hotel", label: "Bilet + hotel", shortLabel: "Bilet + hotel", labelEn: "Ticket + hotel", shortLabelEn: "Ticket + hotel" },
] as const

export type PackageVariantKey = (typeof packageVariantOptions)[number]["key"]

export type PackageFeatureKey = (typeof packageFeatures)[number]["key"]
export type PackageFeatureStatus = "included" | "optional" | "excluded"

const defaultPackage: Record<PackageFeatureKey, PackageFeatureStatus> = {
  ticket: "included",
  flight: "included",
  hotel: "included",
  transfers: "included",
  baggage: "included",
  breakfast: "optional",
  insurance: "included",
  coordinator: "included",
  sightseeing: "excluded",
  local_transport: "included",
}

export function parsePackageItems(items: string[] | null | undefined) {
  const result = { ...defaultPackage }
  for (const item of items || []) {
    const [key, status] = item.split("|")
    if (packageFeatures.some((feature) => feature.key === key) && ["included", "optional", "excluded"].includes(status)) {
      result[key as PackageFeatureKey] = status as PackageFeatureStatus
    }
  }
  return result
}

export function packageSummary(items: string[] | null | undefined, locale: Locale = "pl") {
  const values = parsePackageItems(items)
  if (values.ticket === "included" && values.flight === "included" && values.hotel === "included") return locale === "en" ? "Full package" : "Pełny pakiet"
  if (values.ticket === "included" && values.hotel === "included") return locale === "en" ? "Ticket + hotel" : "Bilet + hotel"
  if (values.ticket === "included" && values.flight === "included") return locale === "en" ? "Ticket + flight" : "Bilet + przelot"
  if (values.ticket === "included") return locale === "en" ? "Match package" : "Pakiet meczowy"
  return locale === "en" ? "Tailored package" : "Pakiet dopasowany"
}

export function inferPackageVariantKey(items: string[] | null | undefined): PackageVariantKey {
  const values = parsePackageItems(items)
  if (values.flight !== "excluded" && values.hotel !== "excluded") return "full"
  if (values.flight !== "excluded") return "ticket_flight"
  if (values.hotel !== "excluded") return "ticket_hotel"
  return "ticket"
}

export function getPackageVariants(variants: string[] | null | undefined, items?: string[] | null, locale: Locale = "pl") {
  const keys = variants?.filter((key): key is PackageVariantKey => packageVariantOptions.some((option) => option.key === key)) || []
  const resolved = keys.length ? keys : [inferPackageVariantKey(items)]
  return packageVariantOptions
    .filter((option) => resolved.includes(option.key))
    .map((option) => ({
      ...option,
      label: locale === "en" ? option.labelEn : option.label,
      shortLabel: locale === "en" ? option.shortLabelEn : option.shortLabel,
    }))
}

export function getPackageFeatures(locale: Locale = "pl") {
  return packageFeatures.map((feature) => ({
    ...feature,
    label: locale === "en" ? feature.labelEn : feature.label,
  }))
}
