
import type { Metadata, Viewport } from "next"
import { Geist, Oswald } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CookieConsent } from "@/components/cookie-consent"
import { FloatingContact } from "@/components/floating-contact"
import { absoluteUrl, siteUrl } from "@/lib/site"
import "./globals.css"

const geist = Geist({
  subsets: ["latin-ext"],
  variable: "--font-geist",
  display: "swap",
  preload: true,
})

const oswald = Oswald({
  subsets: ["latin-ext"],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
})

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": absoluteUrl("/#organization"),
  name: "Let’s Gol",
  url: absoluteUrl(),
  logo: absoluteUrl("/logo.webp"),
  email: "kontakt.letsgol@gmail.com",
  telephone: "+48501465318",
  sameAs: [
    "https://facebook.com/profile.php?id=61573517165441",
    "https://instagram.com/letsgol_wyjazdynamecze",
    "https://youtube.com/@LetsGolWyjazdynamecze",
    "https://tiktok.com/@letsgol.wyjazdynamecze",
  ],
}

export const metadata: Metadata = {
  metadataBase: siteUrl,

  alternates: {
    canonical: "/",
  },

  title: {
    default: "Let’s Gol - wyjazdy na mecze w Europie",
    template: "%s | Let’s Gol",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(
              /</g,
              "\\u003c"
            ),
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