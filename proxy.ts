import { NextResponse, type NextRequest } from "next/server"

import {
  defaultLocale,
  type Locale,
} from "@/lib/i18n"

function localeFromRequest(
  request: NextRequest
): Locale {
  const pathname = request.nextUrl.pathname

  if (
    pathname === "/en" ||
    pathname.startsWith("/en/")
  ) {
    return "en"
  }

  return defaultLocale
}

export function proxy(
  request: NextRequest
) {
  const savedLocale =
    request.cookies.get("locale")?.value

  if (
    request.nextUrl.pathname === "/" &&
    savedLocale === "en"
  ) {
    return NextResponse.redirect(
      new URL("/en", request.url)
    )
  }

  const locale =
    localeFromRequest(request)

  const requestHeaders =
    new Headers(request.headers)

  requestHeaders.set(
    "x-letsgol-locale",
    locale
  )

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}