"use server"

import { cookies } from "next/headers"

import { isLocale, type Locale } from "@/lib/i18n"

export async function setLocalePreference(locale: Locale) {
  if (!isLocale(locale)) return

  const cookieStore = await cookies()
  cookieStore.set("locale", locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}
