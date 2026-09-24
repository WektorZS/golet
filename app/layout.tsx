import type {
  Metadata,
  Viewport,
} from "next"
import {
  Geist,
  Oswald,
} from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CookieConsent } from "@/components/cookie-consent"
import { FloatingContact } from "@/components/floating-contact"
import { JsonLd } from "@/components/json-ld"

import {
  absoluteUrl,
  siteUrl,
} from "@/lib/site"
import { getRequestLocale } from "@/lib/i18n-request"
import { getSeoCopy } from "@/lib/seo-copy"
import { brandedTitle } from "@/lib/seo"

import "./globals.css"

const geist = Geist({
  subsets: [
    "latin",
    "latin-ext",
  ],
  variable: "--font-geist",
})

const oswald = Oswald({
  subsets: [
    "latin",
    "latin-ext",
  ],
  variable: "--font-oswald",
})

const organizationSchema = {
  "@type": "TravelAgency",
  "@id": absoluteUrl(
    "/#organization"
  ),

  name: "Let’s Gol",
  alternateName: "Let's Gol",
  legalName:
    "LB Coaching Łukasz Borger",

  url: absoluteUrl(),

  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(
      "/icon.svg"
    ),
    contentUrl: absoluteUrl(
      "/icon.svg"
    ),
    width: 916,
    height: 888,
  },

  email:
    "kontakt.letsgol@gmail.com",

  telephone:
    "+48501465318",

  taxID:
    "8512915273",

  address: {
    "@type":
      "PostalAddress",

    streetAddress:
      "ul. Stefana Roweckiego 1/2",

    postalCode:
      "72-010",

    addressLocality:
      "Police",

    addressCountry:
      "PL",
  },

  contactPoint: {
    "@type":
      "ContactPoint",

    telephone:
      "+48501465318",

    email:
      "kontakt.letsgol@gmail.com",

    contactType:
      "customer service",

    availableLanguage: [
      "pl",
      "en",
    ],
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

  "@id": absoluteUrl(
    "/#website"
  ),

  url: absoluteUrl(),

  name: "Let’s Gol",

  alternateName:
    "Let's Gol",

  publisher: {
    "@id": absoluteUrl(
      "/#organization"
    ),
  },

  inLanguage: [
    "pl-PL",
    "en-GB",
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const locale =
    await getRequestLocale()

  const seo =
    getSeoCopy(
      "home",
      locale
    )

  return {
    metadataBase: siteUrl,

    title: {
      default:
        brandedTitle(
          seo.title
        ),

      template:
        "%s | Let’s Gol",
    },

    description:
      seo.description,

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },

    icons: {
      icon: [
        {
          url: "/icon.svg",
          type:
            "image/svg+xml",
        },
      ],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#080A0D",
  userScalable: true,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale =
    await getRequestLocale()

  return (
    <html
      lang={locale}
      className={`light bg-background ${geist.variable} ${oswald.variable}`}
    >
      <body>
        <JsonLd
          data={{
            "@context":
              "https://schema.org",

            "@graph": [
              organizationSchema,
              websiteSchema,
            ],
          }}
        />

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