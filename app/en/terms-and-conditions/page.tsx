import type { Metadata } from "next"
import { EnglishLegalPage } from "@/components/english-legal-page"
import { localizedAlternates, socialMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "Terms that apply when booking and taking part in a Let's Gol football trip.",
  alternates: localizedAlternates("/warunki-uczestnictwa", "en"),
  ...socialMetadata("Terms and conditions", "Terms that apply to Let's Gol football match trips.", "/en/terms-and-conditions", "en"),
}

export default function TermsAndConditionsPage() {
  return <EnglishLegalPage kind="terms" />
}
