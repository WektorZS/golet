export const siteUrl = new URL("https://letsgol.eu")

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString()
}
