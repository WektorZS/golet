const fallbackSiteUrl = "https://letsgol.pl"

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl
)

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString()
}
