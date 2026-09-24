import type { Metadata } from "next"
import { EnglishLegalPage } from "@/components/english-legal-page"
import { localizedAlternates, socialMetadata } from "@/lib/seo"
import { seoCopy } from "@/lib/seo-copy"

const seo = seoCopy.privacy.en

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: localizedAlternates("/polityka-prywatnosci", "en"),
  ...socialMetadata(seo.title, seo.description, "/en/privacy-policy", "en"),
}

export default function PrivacyPolicyPage() {
  return <EnglishLegalPage kind="privacy" />
}
