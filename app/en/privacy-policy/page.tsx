import type { Metadata } from "next"
import { EnglishLegalPage } from "@/components/english-legal-page"
import { localizedAlternates, socialMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Privacy and cookie policy",
  description: "How Let's Gol processes personal data and uses essential and optional cookies.",
  alternates: localizedAlternates("/polityka-prywatnosci", "en"),
  ...socialMetadata("Privacy and cookie policy", "How Let's Gol processes personal data and uses cookies.", "/en/privacy-policy", "en"),
}

export default function PrivacyPolicyPage() {
  return <EnglishLegalPage kind="privacy" />
}
