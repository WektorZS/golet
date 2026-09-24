import "server-only"

import { headers } from "next/headers"

import {
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n"

export async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers()

  const value =
    headersList.get("x-letsgol-locale")

  return isLocale(value)
    ? value
    : defaultLocale
}