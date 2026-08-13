import DOMPurify from "isomorphic-dompurify"

/**
 * Allowlist for trip description formatting. Deliberately narrow: safe text formatting
 * only (bold, italic, lists, paragraphs, links) — no images, scripts, styles, or iframes.
 * Used both when saving admin input and when rendering it publicly, so stored HTML is
 * sanitized twice: defense in depth against any future editor change or direct DB edits.
 */
const ALLOWED_TAGS = ["p", "strong", "em", "ul", "ol", "li", "a", "br"]
const ALLOWED_ATTR = ["href", "target", "rel"]

/** Strips all markup for contexts that need plain text: <meta> descriptions, JSON-LD, previews. */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).replace(/\s+/g, " ").trim()
}

export function sanitizeDescriptionHtml(dirty: string): string {
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
  // Normalize every <a> to only carry a safe href plus a forced-safe target/rel,
  // regardless of what attributes the editor or a direct DB edit produced.
  return clean.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>/g, (_match, href) => `<a href="${href}" target="_blank" rel="noopener noreferrer">`)
}
