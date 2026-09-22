"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"

type GalleryCarouselItem = {
  id: number
  src: string
  alt: string
}

export function GalleryCarousel({
  items,
}: {
  items: GalleryCarouselItem[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (!items.length) return null

  const currentItem = items[activeIndex]

useEffect(() => {
  const container = thumbnailsRef.current
  const activeThumbnail = thumbnailRefs.current[activeIndex]

  if (!container || !activeThumbnail) return

  const target =
    activeThumbnail.offsetLeft -
    container.clientWidth / 2 +
    activeThumbnail.offsetWidth / 2

  const maxScroll =
    container.scrollWidth - container.clientWidth

  container.scrollTo({
    left: Math.max(0, Math.min(target, maxScroll)),
    behavior: "smooth",
  })
}, [activeIndex])

  const previous = () => {
    setActiveIndex((current) =>
      current === 0 ? items.length - 1 : current - 1
    )
  }

  const next = () => {
    setActiveIndex((current) =>
      current === items.length - 1 ? 0 : current + 1
    )
  }

  const selectImage = (index: number) => {
    setActiveIndex(index)
  }

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0].clientX
    const difference = touchStartX.current - touchEndX

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        next()
      } else {
        previous()
      }
    }

    touchStartX.current = null
  }

  const scrollThumbnails = (
    direction: "left" | "right"
  ) => {
    thumbnailsRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div
        className="group relative overflow-hidden rounded-2xl bg-foreground"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-4/3 bg-foreground md:aspect-video md:min-h-125">
          <ImageLightbox
            src={currentItem.src}
            alt={currentItem.alt}
            images={items.map((item) => ({
              src: item.src,
              alt: item.alt,
            }))}
            initialIndex={activeIndex}
            priority
          >
            <Image
  key={currentItem.src}
  src={currentItem.src}
  alt={currentItem.alt}
  fill
  priority
  className="object-contain object-center transition-transform duration-700 ease-out md:object-cover md:object-bottom md:group-hover:scale-[1.015]"
  sizes="(max-width: 768px) 100vw, 80vw"
/>
          </ImageLightbox>
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              className="absolute left-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-md transition hover:bg-background md:left-5 md:size-12"
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-md transition hover:bg-background md:right-5 md:size-12"
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {activeIndex + 1} / {items.length}
            </div>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="relative mt-4">
          <div
            ref={thumbnailsRef}
            className="flex snap-x gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    thumbnailRefs.current[index] = element
                  }}
                  type="button"
                  onClick={() => selectImage(index)}
                  className={`relative aspect-4/3 w-28 shrink-0 snap-center overflow-hidden rounded-lg transition md:w-36 ${
                    isActive
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "opacity-65 hover:opacity-100"
                  }`}
                  aria-label={`Pokaż zdjęcie ${index + 1}`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover object-bottom"
                    sizes="144px"
                  />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbnails("left")}
            className="absolute -left-3 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg md:flex"
            aria-label="Przewiń miniatury w lewo"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollThumbnails("right")}
            className="absolute -right-3 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg md:flex"
            aria-label="Przewiń miniatury w prawo"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}