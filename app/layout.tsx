import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Oswald } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FloatingContact } from "@/components/floating-contact"
import "./globals.css"

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist" })
const oswald = Oswald({ subsets: ["latin", "latin-ext"], variable: "--font-oswald" })

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Let’s Gol",
  url: "https://letsgol.pl",
  logo: "https://letsgol.pl/logo.webp",
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
  metadataBase: new URL("https://letsgol.pl"),
  title: { default: "Let’s Gol - wyjazdy na mecze w Europie", template: "%s | Let’s Gol" },
  description: "Kompleksowe wyjazdy na największe mecze w Europie. Bilety, lot, hotel i opieka koordynatora w jednym pakiecie.",
  openGraph: { title: "Let’s Gol - wyjazdy na mecze", description: "Ty wybierasz mecz. My organizujemy całą podróż.", locale: "pl_PL", type: "website", images: ["/images/hero-stadium.png"] },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = { colorScheme: "light", themeColor: "#080A0D", userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl" className={`light bg-background ${geist.variable} ${oswald.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} /><TooltipProvider>{children}<FloatingContact /></TooltipProvider><Toaster richColors />{process.env.NODE_ENV === "production" && <Analytics />}</body></html>
}
