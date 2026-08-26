import type { Metadata, Viewport } from "next"
import { Geist, Oswald } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CookieConsent } from "@/components/cookie-consent"
import { FloatingContact } from "@/components/floating-contact"
import "./globals.css"

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
})

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Let’s Gol",
  ...(siteUrl && {
    url: siteUrl.toString(),
    logo: new URL("/logo.webp", siteUrl).toString(),
  }),
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
  ...(siteUrl && {
    metadataBase: siteUrl,
  }),

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
