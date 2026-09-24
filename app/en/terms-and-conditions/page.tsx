import type { Metadata } from "next"
import { EnglishLegalPage } from "@/components/english-legal-page"
import { localizedAlternates, socialMetadata } from "@/lib/seo"
import { seoCopy } from "@/lib/seo-copy"

const seo = seoCopy.terms.en

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: localizedAlternates("/warunki-uczestnictwa", "en"),
  ...socialMetadata(seo.title, seo.description, "/en/terms-and-conditions", "en"),
}

export default function TermsAndConditionsPage() {
  return <EnglishLegalPage kind="terms" />
}
