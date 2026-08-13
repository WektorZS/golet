"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { sanitizeDescriptionHtml } from "@/lib/sanitize-html"

/**
 * Rich text editor for trip descriptions, restricted to safe formatting only:
 * bold, italic, bullet/numbered lists, paragraphs, and links. No images, headings,
 * tables, or raw HTML input — this keeps the allowed feature set matched 1:1 with
 * the server-side sanitizer allowlist in lib/sanitize-html.ts.
 *
 * Renders a hidden input carrying the sanitized HTML so it submits with the
 * surrounding <form action={saveTrip}> like any other field.
 */
export function DescriptionEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, horizontalRule: false }),
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: { class: "min-h-32 rounded-b-lg border border-t-0 bg-background px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline" },
    },
  })

  // Keep the hidden input's value (sanitized) in sync so the form always submits clean HTML.
  useEffect(() => {
    if (!editor) return
    const input = document.getElementById(`${name}-hidden`) as HTMLInputElement | null
    const sync = () => { if (input) input.value = sanitizeDescriptionHtml(editor.getHTML()) }
    sync()
    editor.on("update", sync)
    return () => { editor.off("update", sync) }
  }, [editor, name])

  const setLink = () => {
    if (!editor) return
    const url = window.prompt("Adres linku (https://...)")
    if (url === null) return
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Opis</Label>
      <div className="rounded-lg border">
        <div className="flex items-center gap-1 border-b bg-secondary/40 p-1.5">
          <Button type="button" variant={editor?.isActive("bold") ? "secondary" : "ghost"} size="icon" className="size-8" onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Pogrubienie"><Bold className="size-4" /></Button>
          <Button type="button" variant={editor?.isActive("italic") ? "secondary" : "ghost"} size="icon" className="size-8" onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Kursywa"><Italic className="size-4" /></Button>
          <Button type="button" variant={editor?.isActive("bulletList") ? "secondary" : "ghost"} size="icon" className="size-8" onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Lista punktowana"><List className="size-4" /></Button>
          <Button type="button" variant={editor?.isActive("orderedList") ? "secondary" : "ghost"} size="icon" className="size-8" onClick={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Lista numerowana"><ListOrdered className="size-4" /></Button>
          <Button type="button" variant={editor?.isActive("link") ? "secondary" : "ghost"} size="icon" className="size-8" onClick={setLink} aria-label="Wstaw link"><LinkIcon className="size-4" /></Button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" id={`${name}-hidden`} name={name} defaultValue={defaultValue ? sanitizeDescriptionHtml(defaultValue) : ""} />
    </div>
  )
}
