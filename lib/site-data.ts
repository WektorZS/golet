import type { SiteContent } from "@/lib/content"

export const defaultContact = {
  phone: "+48 501 465 318",
  phoneHref: "tel:+48501465318",
  whatsappHref: "https://wa.me/48501465318",
  email: "kontakt.letsgol@gmail.com",
} as const

export const companyDetails = {
  name: "LB Coaching Łukasz Borger",
  streetAddress: "ul. Stefana Roweckiego 1/2",
  postalCode: "72-010",
  city: "Police",
  address: "ul. Stefana Roweckiego 1/2, 72-010 Police",
  nip: "8512915273",
  regon: "520474445",
  googleProfile: "https://share.google/kRvcJRnquoIaDz3YT",
} as const

export const socialProfiles = [
  {
    name: "Facebook",
    href: "https://facebook.com/profile.php?id=61573517165441",
    icon: "/icons/social/facebook.svg",
    description: "Aktualności, relacje i informacje o nowych wyjazdach.",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/letsgol_wyjazdynamecze",
    icon: "/icons/social/instagram.svg",
    description: "Zdjęcia ze stadionów, miast i wspólnych podróży.",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@letsgol.wyjazdynamecze",
    icon: "/icons/social/tiktok.svg",
    description: "Krótkie materiały prosto z meczowych wyjazdów.",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@LetsGolWyjazdynamecze",
    icon: "/icons/social/youtube.webp",
    description: "Dłuższe relacje i atmosfera piłkarskich podróży.",
  },
] as const

export function getContactDetails(content: SiteContent = {}) {
  const phone = content.contactPhone || defaultContact.phone
  const phoneDigits = phone.replace(/\D/g, "")

  return {
    phone,
    phoneHref: `tel:${phone.replace(/[^+\d]/g, "")}`,
    whatsappHref: `https://wa.me/${phoneDigits}`,
    email: content.contactEmail || defaultContact.email,
  }
}
