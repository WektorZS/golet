import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Oswald } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FloatingContact } from "@/components/floating-contact"
import "./globals.css"

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist" })
const oswald = Oswald({ subsets: ["latin", "latin-ext"], variable: "--font-oswald" })

export const metadata: Metadata = {
  metadataBase: new URL("https://letsgol.pl"),
  title: { default: "Let’s Gol — wyjazdy na mecze w Europie", template: "%s | Let’s Gol" },
  description: "Kompleksowe wyjazdy na największe mecze w Europie. Bilety, lot, hotel i opieka koordynatora w jednym pakiecie.",
  openGraph: { title: "Let’s Gol — wyjazdy na mecze", description: "Ty wybierasz mecz. My organizujemy całą podróż.", locale: "pl_PL", type: "website", images: ["/images/hero-stadium.png"] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { colorScheme: "light", themeColor: "#080A0D", userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl" className={`light bg-background ${geist.variable} ${oswald.variable}`}><body><TooltipProvider>{children}<FloatingContact /></TooltipProvider><Toaster richColors />{process.env.NODE_ENV === "production" && <Analytics />}</body></html>
}
