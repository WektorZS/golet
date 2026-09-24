"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { localeFromPathname } from "@/lib/i18n"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
type LightboxImage = {
  src: string
  alt: string
  caption?: string
}

export function ImageLightbox({
  src,
  alt,
  caption,
  images,
  initialIndex = 0,
  children,
  priority = false,
}: {
  src: string
  alt: string
  caption?: string
  images?: LightboxImage[]
  initialIndex?: number
  children?: React.ReactNode
  priority?: boolean
}) {
  const isEn = localeFromPathname(usePathname()) === "en"
  const gallery =
    images && images.length > 0
      ? images
      : [{ src, alt, caption }]

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isOpen, setIsOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const currentImage = gallery[currentIndex]
  const hasMultipleImages = gallery.length > 1


const previousImage = () => {
  setCurrentIndex((current) =>
    current === 0 ? gallery.length - 1 : current - 1
  )
}

const nextImage = () => {
  setCurrentIndex((current) =>
    current === gallery.length - 1 ? 0 : current + 1
  )
}

useEffect(() => {
  if (!isOpen || !hasMultipleImages) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      event.stopPropagation()

      setCurrentIndex((current) =>
        current === 0 ? gallery.length - 1 : current - 1
      )
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      event.stopPropagation()

      setCurrentIndex((current) =>
        current === gallery.length - 1 ? 0 : current + 1
      )
    }
  }

  document.addEventListener("keydown", handleKeyDown, true)

  return () => {
    document.removeEventListener("keydown", handleKeyDown, true)
  }
}, [isOpen, hasMultipleImages, gallery.length])


  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || !hasMultipleImages) return

    const touchEndX = event.changedTouches[0].clientX
    const difference = touchStartX - touchEndX

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextImage()
      } else {
        previousImage()
      }
    }

    setTouchStartX(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) setCurrentIndex(initialIndex)
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="group relative block size-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={isEn ? `Enlarge photo: ${alt}` : `Powiększ zdjęcie: ${alt}`}
          />
        }
      >
        {children || (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority={priority}
          />
        )}

        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-foreground/75 text-background opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </DialogTrigger>

      <DialogContent
        ref={contentRef}
        className="top-[calc(50%+2.5rem)] flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-2 overflow-hidden bg-foreground p-2 text-background sm:w-[calc(100vw-2rem)] sm:max-w-6xl"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          {isEn ? "Photo preview" : "Podgląd zdjęcia"}
        </DialogTitle>

        <DialogDescription className="sr-only">
          {isEn ? "Expanded photo. Use the arrows or swipe to move between photos." : "Powiększone zdjęcie. Użyj strzałek, aby przechodzić między zdjęciami lub przesuń zdjęcie palcem."}
        </DialogDescription>

        <div
          className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt}
            width={1600}
            height={1200}
            sizes="calc(100vw - 1rem)"
            className="max-h-full max-w-full object-contain"
            priority
          />

          {hasMultipleImages && (
            <>
              <button
  type="button"
  onClick={(event) => {
    event.preventDefault()
    event.stopPropagation()
    previousImage()
  }}
  className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-opacity hover:bg-background sm:left-3"
  aria-label={isEn ? "Previous photo" : "Poprzednie zdjęcie"}
>
  <ChevronLeft className="size-5" />
</button>

             <button
  type="button"
  onClick={(event) => {
    event.preventDefault()
    event.stopPropagation()
    nextImage()
  }}
  className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-opacity hover:bg-background sm:right-3"
  aria-label={isEn ? "Next photo" : "Następne zdjęcie"}
>
  <ChevronRight className="size-5" />
</button>

              <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {currentIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

      
      </DialogContent>
    </Dialog>
  )
}
