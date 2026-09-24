import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Let’s Gol - football match trips across Europe",
    template: "%s - Let’s Gol",
  },
  description:
    "Complete football match trips across Europe with tickets, flights, hotels and on-site support.",
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
