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

