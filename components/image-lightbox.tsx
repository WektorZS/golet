"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Image, {
  getImageProps,
} from "next/image"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react"

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

const LIGHTBOX_QUALITY = 90
const LIGHTBOX_SIZES = "100vw"

const preloadCache = new Map<
  string,
  HTMLImageElement
>()

function preloadLightboxImage(
  src: string,
  priority: "high" | "low" = "low",
) {
  if (
    typeof window === "undefined" ||
    !src
  ) {
    return
  }

  const cached =
    preloadCache.get(src)

  if (cached) {
    if (priority === "high") {
      cached.setAttribute(
        "fetchpriority",
        "high",
      )
    }

    return
  }

  const { props } = getImageProps({
    src,
    alt: "",
    fill: true,
    sizes: LIGHTBOX_SIZES,
    quality: LIGHTBOX_QUALITY,
  })

  const image =
    new window.Image()

  image.decoding = "async"

  image.sizes =
    props.sizes ??
    LIGHTBOX_SIZES

  if (props.srcSet) {
    image.srcset =
      props.srcSet
  }

  image.setAttribute(
    "fetchpriority",
    priority,
  )

  image.src = props.src

  preloadCache.set(
    src,
    image,
  )
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
  const pathname =
    usePathname()

  const isEn =
    localeFromPathname(
      pathname,
    ) === "en"

  const gallery = useMemo(
    () =>
      images &&
      images.length > 0
        ? images
        : [
            {
              src,
              alt,
              caption,
            },
          ],
    [
      images,
      src,
      alt,
      caption,
    ],
  )

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(initialIndex)

  const [
    isOpen,
    setIsOpen,
  ] = useState(false)

  const [
    touchStartX,
    setTouchStartX,
  ] = useState<
    number | null
  >(null)

  const triggerRef =
    useRef<HTMLButtonElement>(
      null,
    )

  const currentImage =
    gallery[currentIndex]

  const hasMultipleImages =
    gallery.length > 1

  const previousImage =
    () => {
      setCurrentIndex(
        (current) =>
          current === 0
            ? gallery.length - 1
            : current - 1,
      )
    }

  const nextImage = () => {
    setCurrentIndex(
      (current) =>
        current ===
        gallery.length - 1
          ? 0
          : current + 1,
    )
  }

  useEffect(() => {
    const trigger =
      triggerRef.current

    if (
      !trigger ||
      typeof IntersectionObserver ===
        "undefined"
    ) {
      return
    }

    let preloadTimer:
      | ReturnType<
          typeof setTimeout
        >
      | undefined

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry?.isIntersecting
          ) {
            return
          }

          preloadTimer =
            setTimeout(() => {
              preloadLightboxImage(
                src,
                priority
                  ? "high"
                  : "low",
              )
            }, 150)

          observer.disconnect()
        },
        {
          rootMargin:
            "300px 0px",
        },
      )

    observer.observe(trigger)

    return () => {
      observer.disconnect()

      if (preloadTimer) {
        clearTimeout(
          preloadTimer,
        )
      }
    }
  }, [src, priority])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    preloadLightboxImage(
      currentImage.src,
      "high",
    )

    if (
      !hasMultipleImages
    ) {
      return
    }

    const previousIndex =
      currentIndex === 0
        ? gallery.length - 1
        : currentIndex - 1

    const nextIndex =
      currentIndex ===
      gallery.length - 1
        ? 0
        : currentIndex + 1

    preloadLightboxImage(
      gallery[
        previousIndex
      ].src,
      "low",
    )

    preloadLightboxImage(
      gallery[nextIndex].src,
      "low",
    )
  }, [
    isOpen,
    currentIndex,
    currentImage.src,
    gallery,
    hasMultipleImages,
  ])

  useEffect(() => {
    if (
      !isOpen ||
      !hasMultipleImages
    ) {
      return
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "ArrowLeft"
      ) {
        event.preventDefault()
        event.stopPropagation()

        setCurrentIndex(
          (current) =>
            current === 0
              ? gallery.length - 1
              : current - 1,
        )
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault()
        event.stopPropagation()

        setCurrentIndex(
          (current) =>
            current ===
            gallery.length - 1
              ? 0
              : current + 1,
        )
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
      true,
    )

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
        true,
      )
    }
  }, [
    isOpen,
    hasMultipleImages,
    gallery.length,
  ])

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    setTouchStartX(
      event.touches[0]
        .clientX,
    )
  }

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      touchStartX ===
        null ||
      !hasMultipleImages
    ) {
      return
    }

    const touchEndX =
      event.changedTouches[0]
        .clientX

    const difference =
      touchStartX -
      touchEndX

    if (
      Math.abs(
        difference,
      ) > 50
    ) {
      if (
        difference > 0
      ) {
        nextImage()
      } else {
        previousImage()
      }
    }

    setTouchStartX(null)
  }

  const prepareCurrentImage =
    () => {
      preloadLightboxImage(
        src,
        "high",
      )
    }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)

        if (open) {
          setCurrentIndex(
            initialIndex,
          )

          preloadLightboxImage(
            src,
            "high",
          )
        }
      }}
    >
      <DialogTrigger
        render={
          <button
            ref={triggerRef}
            type="button"
            onMouseEnter={
              prepareCurrentImage
            }
            onFocus={
              prepareCurrentImage
            }
            onPointerDown={
              prepareCurrentImage
            }
            className="group relative block size-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={
              isEn
                ? `Enlarge photo: ${alt}`
                : `Powiększ zdjęcie: ${alt}`
            }
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
          <Maximize2
            className="size-4"
            aria-hidden="true"
          />
        </span>
      </DialogTrigger>

      <DialogContent
        className="!fixed !bottom-0 !left-0 !right-0 !top-20 !z-40 !m-0 !flex !h-[calc(100dvh-5rem)] !w-screen !max-w-none !translate-x-0 !translate-y-0 !flex-col !gap-0 !overflow-hidden !rounded-none !border-0 !bg-black !p-0 !text-white !shadow-none sm:!max-w-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {isEn
            ? "Photo preview"
            : "Podgląd zdjęcia"}
        </DialogTitle>

        <DialogDescription className="sr-only">
          {isEn
            ? "Expanded photo. Use the arrows or swipe to move between photos."
            : "Powiększone zdjęcie. Użyj strzałek, aby przechodzić między zdjęciami lub przesuń zdjęcie palcem."}
        </DialogDescription>

        <div
          className="relative size-full min-h-0 overflow-hidden bg-black"
          onTouchStart={
            handleTouchStart
          }
          onTouchEnd={
            handleTouchEnd
          }
        >
          <div
            key={`background-${currentImage.src}`}
            className="absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src={
                currentImage.src
              }
              alt=""
              fill
              sizes={
                LIGHTBOX_SIZES
              }
              quality={
                LIGHTBOX_QUALITY
              }
              className="scale-110 object-cover blur-3xl"
            />

            <div className="absolute inset-0 bg-black/55" />
          </div>

          <div className="absolute inset-0 z-10">
            <Image
              key={
                currentImage.src
              }
              src={
                currentImage.src
              }
              alt={
                currentImage.alt
              }
              fill
              sizes={
                LIGHTBOX_SIZES
              }
              quality={
                LIGHTBOX_QUALITY
              }
              loading="eager"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()

              setIsOpen(false)
            }}
            className="absolute right-3 top-3 z-50 flex size-11 items-center justify-center rounded-full bg-black/70 text-white shadow-xl backdrop-blur-md transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-black sm:right-5 sm:top-5 sm:size-12"
            aria-label={
              isEn
                ? "Close photo"
                : "Zamknij zdjęcie"
            }
          >
            <X
              className="size-5 sm:size-6"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()

                  previousImage()
                }}
                className="absolute left-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/85 sm:left-5 sm:size-12"
                aria-label={
                  isEn
                    ? "Previous photo"
                    : "Poprzednie zdjęcie"
                }
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()

                  nextImage()
                }}
                className="absolute right-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/85 sm:right-5 sm:size-12"
                aria-label={
                  isEn
                    ? "Next photo"
                    : "Następne zdjęcie"
                }
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>

              <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:bottom-5">
                {currentIndex + 1} /{" "}
                {gallery.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}