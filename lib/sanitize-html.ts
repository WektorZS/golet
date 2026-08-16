import sanitizeHtml from "sanitize-html"

/**
 * Allowlist for trip description formatting. Deliberately narrow: safe text formatting
 * only (bold, italic, lists, paragraphs, links) — no images, scripts, styles, or iframes.
 * This implementation is server-native and does not instantiate JSDOM in Vercel functions.
 */
const ALLOWED_TAGS = ["p", "strong", "em", "ul", "ol", "li", "a", "br"]

/** Strips all markup for contexts that need plain text: meta descriptions, JSON-LD and previews. */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim()
}

export function sanitizeDescriptionHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href ?? "",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  })
}
