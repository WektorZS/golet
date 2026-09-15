export const packageFeatures = [
  { key: "ticket", label: "Bilet na mecz" },
  { key: "flight", label: "Przelot" },
  { key: "hotel", label: "Hotel" },
  { key: "transfers", label: "Transfery lotniskowe" },
  { key: "baggage", label: "Bagaż" },
  { key: "breakfast", label: "Śniadania" },
  { key: "insurance", label: "Ubezpieczenie" },
  { key: "coordinator", label: "Opieka koordynatora" },
  { key: "sightseeing", label: "Zwiedzanie" },
  { key: "local_transport", label: "Transport lokalny" },
] as const

export const packageVariantOptions = [
  { key: "ticket", label: "Sam bilet na mecz", shortLabel: "Bilet" },
  { key: "ticket_flight", label: "Bilet + lot", shortLabel: "Bilet + lot" },
  { key: "ticket_hotel", label: "Bilet + hotel", shortLabel: "Bilet + hotel" },
  { key: "full", label: "Pełny pakiet: bilet + lot + hotel", shortLabel: "Pełny pakiet" },
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

export function packageSummary(items: string[] | null | undefined) {
  const values = parsePackageItems(items)
  if (values.ticket === "included" && values.flight === "included" && values.hotel === "included") return "Pełny pakiet"
  if (values.ticket === "included" && values.hotel === "included") return "Bilet + hotel"
  if (values.ticket === "included" && values.flight === "included") return "Bilet + przelot"
  if (values.ticket === "included") return "Pakiet meczowy"
  return "Pakiet dopasowany"
}

export function inferPackageVariantKey(items: string[] | null | undefined): PackageVariantKey {
  const values = parsePackageItems(items)
  if (values.flight !== "excluded" && values.hotel !== "excluded") return "full"
  if (values.flight !== "excluded") return "ticket_flight"
  if (values.hotel !== "excluded") return "ticket_hotel"
  return "ticket"
}

export function getPackageVariants(variants: string[] | null | undefined, items?: string[] | null) {
  const keys = variants?.filter((key): key is PackageVariantKey => packageVariantOptions.some((option) => option.key === key)) || []
  const resolved = keys.length ? keys : [inferPackageVariantKey(items)]
  return packageVariantOptions.filter((option) => resolved.includes(option.key))
}
