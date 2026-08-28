"use client"


import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
  const gallery =
    images && images.length > 0
      ? images
      : [{ src, alt, caption }]

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const currentImage = gallery[currentIndex]
  const hasMultipleImages = gallery.length > 1

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

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
    if (!hasMultipleImages) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        previousImage()
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [hasMultipleImages, gallery.length])

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || !hasMultipleImages) return

    const touchEndX = event.changedTouches[0].clientX
    const difference = touchStartX - touchEndX

    // Minimalna odległość przesunięcia, żeby zmiana zdjęcia się uruchomiła
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
        className="top-[calc(50%+2.5rem)] max-h-[calc(100dvh-6rem)] max-w-[calc(100vw-2rem)] gap-3 overflow-hidden bg-foreground p-2 text-background sm:max-w-6xl"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          Podgląd zdjęcia
        </DialogTitle>

        <DialogDescription className="sr-only">
          Powiększone zdjęcie. Użyj strzałek lub przesuń zdjęcie, aby
          przejść do kolejnego.
        </DialogDescription>

        <div
          className="relative h-[min(80dvh,900px)] w-full overflow-hidden rounded-lg touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />

          {hasMultipleImages && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={previousImage}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft className="size-5" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={nextImage}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Następne zdjęcie"
              >
                <ChevronRight className="size-5" />
              </Button>

              <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {currentIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        {currentImage.caption ? (
          <p className="px-2 pb-1 text-sm text-background/80">
            {currentImage.caption}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}