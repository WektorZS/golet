import type { Metadata, Viewport } from "next"
import { Geist, Oswald } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CookieConsent } from "@/components/cookie-consent"
import { FloatingContact } from "@/components/floating-contact"
import { JsonLd } from "@/components/json-ld"
import { absoluteUrl, siteUrl } from "@/lib/site"
import "./globals.css"

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
})

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
})

const organizationSchema = {
  "@type": "TravelAgency",
  "@id": absoluteUrl("/#organization"),
  name: "Let’s Gol",
  alternateName: "Let's Gol",
  legalName: "LB Coaching Łukasz Borger",
  url: absoluteUrl(),
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/icon.svg"),
    contentUrl: absoluteUrl("/icon.svg"),
    width: 916,
    height: 888,
  },
  email: "kontakt.letsgol@gmail.com",
  telephone: "+48501465318",
  taxID: "8512915273",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Stefana Roweckiego 1/2",
    postalCode: "72-010",
    addressLocality: "Police",
    addressCountry: "PL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+48501465318",
    email: "kontakt.letsgol@gmail.com",
    contactType: "customer service",
    availableLanguage: ["pl"],
  },
  sameAs: [
    "https://facebook.com/profile.php?id=61573517165441",
    "https://instagram.com/letsgol_wyjazdynamecze",
    "https://youtube.com/@LetsGolWyjazdynamecze",
    "https://tiktok.com/@letsgol.wyjazdynamecze",
  ],
}

const websiteSchema = {
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: absoluteUrl(),
  name: "Let’s Gol",
  alternateName: "Let's Gol",
  publisher: { "@id": absoluteUrl("/#organization") },
  inLanguage: "pl-PL",
}

export const metadata: Metadata = {
  metadataBase: siteUrl,
  alternates: {
    canonical: "/",
  },

  title: {
    default: "Let’s Gol - wyjazdy na mecze w Europie",
    template: "%s - Let’s Gol",
  },

  description:
    "Kompleksowe wyjazdy na największe mecze w Europie. Bilety, lot, hotel i opieka koordynatora w jednym pakiecie.",

  openGraph: {
    title: "Let’s Gol - wyjazdy na mecze",
    description: "Ty wybierasz mecz. My organizujemy całą podróż.",
    siteName: "Let’s Gol",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Let’s Gol - wyjazdy na mecze",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Let’s Gol - wyjazdy na mecze",
    description: "Ty wybierasz mecz. My organizujemy całą podróż.",
    images: ["/images/og-image.webp"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#080A0D",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className={`light bg-background ${geist.variable} ${oswald.variable}`}
    >
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [organizationSchema, websiteSchema] }} />

        <TooltipProvider>
          {children}
          <FloatingContact />
        </TooltipProvider>

        <Toaster richColors />
        <CookieConsent />
      </body>
    </html>
  )
}

