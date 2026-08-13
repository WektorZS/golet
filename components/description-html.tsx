import { sanitizeDescriptionHtml } from "@/lib/sanitize-html"

/**
 * Renders trip description HTML. Sanitizes again at render time (in addition to the
 * sanitization already applied when the admin saved it) so display is safe even if the
 * database value was ever edited directly or the stored format predates the sanitizer.
 */
export function DescriptionHtml({ html, className }: { html: string; className?: string }) {
  const safe = sanitizeDescriptionHtml(html)
  if (!safe.trim()) return null
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />
}
