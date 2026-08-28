"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ImageLightbox({ src, alt, caption, children, priority = false }: {
  src: string
  alt: string
  caption?: string
  children?: React.ReactNode
  priority?: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="group relative block size-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Powiększ zdjęcie: ${alt}`}
          />
        }
      >
        {children || (
          <Image src={src} alt={alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" priority={priority} />
        )}
        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-foreground/75 text-background opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] gap-3 overflow-hidden bg-foreground p-2 text-background sm:max-w-6xl" showCloseButton>
        <DialogTitle className="sr-only">Podgląd zdjęcia</DialogTitle>
        <DialogDescription className="sr-only">Powiększone zdjęcie. Naciśnij Escape lub przycisk zamknięcia, aby zamknąć podgląd.</DialogDescription>
        <div className="relative h-[min(80dvh,900px)] w-full overflow-hidden rounded-lg">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" priority />
        </div>
        {caption ? <p className="px-2 pb-1 text-sm text-background/80">{caption}</p> : null}
      </DialogContent>
    </Dialog>
  )
}
