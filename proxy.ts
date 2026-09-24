import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/" && request.cookies.get("locale")?.value === "en") {
    return NextResponse.redirect(new URL("/en", request.url))
  }

  const locale =
    request.nextUrl.pathname === "/en" ||
    request.nextUrl.pathname.startsWith("/en/")
      ? "en"
      : "pl"
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-letsgol-locale", locale)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|.*\\..*).*)"],
}
