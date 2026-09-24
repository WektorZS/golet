import type { Metadata } from "next"
import { seoCopy } from "@/lib/seo-copy"

export const metadata: Metadata = {
  title: {
    default: seoCopy.home.en.title,
    template: "%s - Let’s Gol",
  },
  description: seoCopy.home.en.description,
  openGraph: {
    siteName: "Let’s Gol",
    locale: "en_GB",
    alternateLocale: ["pl_PL"],
    type: "website",
  },
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children
}
