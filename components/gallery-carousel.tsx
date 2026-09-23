"use client"

import Image from "next/image"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"

type GalleryCarouselItem = {
  id: number
  src: string
  alt: string
}

const AUTOPLAY_DURATION = 7000
const IMAGE_TRANSITION_DURATION = 700

export function GalleryCarousel({
  items,
}: {
  items: GalleryCarouselItem[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(
    null
  )
  const [transitionActive, setTransitionActive] = useState(false)

  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [progress, setProgress] = useState(0)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const [reducedMotion, setReducedMotion] = useState(false)

  const touchStartX = useRef<number | null>(null)

  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  const transitionTimeoutRef = useRef<number | null>(null)
  const progressFrameRef = useRef<number | null>(null)
  const autoplayStartedAtRef = useRef<number | null>(null)

  const itemCount = items.length

  const updateThumbnailOverflow = useCallback(() => {
    const container = thumbnailsRef.current

    if (!container) return

    const maxScroll =
      container.scrollWidth - container.clientWidth

    setCanScrollLeft(container.scrollLeft > 4)

    setCanScrollRight(
      maxScroll > 4 &&
        container.scrollLeft < maxScroll - 4
    )
  }, [])

  const changeImage = useCallback(
    (nextIndex: number) => {
      if (
        itemCount <= 1 ||
        nextIndex === activeIndex ||
        nextIndex < 0 ||
        nextIndex >= itemCount
      ) {
        return
      }

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(
          transitionTimeoutRef.current
        )
      }

      setPreviousIndex(activeIndex)
      setActiveIndex(nextIndex)
      setProgress(0)

      if (reducedMotion) {
        setPreviousIndex(null)
        setTransitionActive(false)
        return
      }

      setTransitionActive(false)

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTransitionActive(true)
        })
      })

      transitionTimeoutRef.current =
        window.setTimeout(() => {
          setPreviousIndex(null)
          setTransitionActive(false)
          transitionTimeoutRef.current = null
        }, IMAGE_TRANSITION_DURATION)
    },
    [
      activeIndex,
      itemCount,
      reducedMotion,
    ]
  )

  const previous = useCallback(() => {
    if (!itemCount) return

    changeImage(
      activeIndex === 0
        ? itemCount - 1
        : activeIndex - 1
    )
  }, [
    activeIndex,
    changeImage,
    itemCount,
  ])

  const next = useCallback(() => {
    if (!itemCount) return

    changeImage(
      activeIndex === itemCount - 1
        ? 0
        : activeIndex + 1
    )
  }, [
    activeIndex,
    changeImage,
    itemCount,
  ])

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )

    const updatePreference = () => {
      setReducedMotion(media.matches)
    }

    updatePreference()

    media.addEventListener(
      "change",
      updatePreference
    )

    return () => {
      media.removeEventListener(
        "change",
        updatePreference
      )
    }
  }, [])

  useEffect(() => {
    if (
      !autoplayEnabled ||
      reducedMotion ||
      itemCount <= 1
    ) {
      setProgress(0)
      return
    }

    autoplayStartedAtRef.current =
      performance.now()

    const updateProgress = (
      currentTime: number
    ) => {
      if (
        autoplayStartedAtRef.current === null
      ) {
        autoplayStartedAtRef.current =
          currentTime
      }

      const elapsed =
        currentTime -
        autoplayStartedAtRef.current

      const nextProgress = Math.min(
        (elapsed / AUTOPLAY_DURATION) * 100,
        100
      )

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        const nextIndex =
          activeIndex === itemCount - 1
            ? 0
            : activeIndex + 1

        changeImage(nextIndex)
        return
      }

      progressFrameRef.current =
        window.requestAnimationFrame(
          updateProgress
        )
    }

    progressFrameRef.current =
      window.requestAnimationFrame(
        updateProgress
      )

    return () => {
      if (
        progressFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          progressFrameRef.current
        )
      }

      progressFrameRef.current = null
    }
  }, [
    activeIndex,
    autoplayEnabled,
    changeImage,
    itemCount,
    reducedMotion,
  ])

  useEffect(() => {
    const container =
      thumbnailsRef.current

    const activeThumbnail =
      thumbnailRefs.current[activeIndex]

    if (
      !container ||
      !activeThumbnail
    ) {
      return
    }

    const target =
      activeThumbnail.offsetLeft -
      container.clientWidth / 2 +
      activeThumbnail.offsetWidth / 2

    const maxScroll =
      container.scrollWidth -
      container.clientWidth

    container.scrollTo({
      left: Math.max(
        0,
        Math.min(target, maxScroll)
      ),
      behavior: reducedMotion
        ? "auto"
        : "smooth",
    })
  }, [
    activeIndex,
    reducedMotion,
  ])

  useEffect(() => {
    const container =
      thumbnailsRef.current

    if (!container) return

    updateThumbnailOverflow()

    container.addEventListener(
      "scroll",
      updateThumbnailOverflow,
      {
        passive: true,
      }
    )

    window.addEventListener(
      "resize",
      updateThumbnailOverflow
    )

    return () => {
      container.removeEventListener(
        "scroll",
        updateThumbnailOverflow
      )

      window.removeEventListener(
        "resize",
        updateThumbnailOverflow
      )
    }
  }, [
    itemCount,
    updateThumbnailOverflow,
  ])

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return
      }

      if (event.key === "ArrowLeft") {
        previous()
      }

      if (event.key === "ArrowRight") {
        next()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      )
    }
  }, [
    next,
    previous,
  ])

  useEffect(() => {
    return () => {
      if (
        transitionTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          transitionTimeoutRef.current
        )
      }

      if (
        progressFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          progressFrameRef.current
        )
      }
    }
  }, [])

  const selectImage = (
    index: number
  ) => {
    changeImage(index)
  }

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current =
      event.touches[0].clientX
  }

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (
      touchStartX.current === null
    ) {
      return
    }

    const endX =
      event.changedTouches[0].clientX

    const distance =
      touchStartX.current - endX

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
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
    const container =
      thumbnailsRef.current

    if (!container) return

    const distance =
      container.clientWidth * 0.65

    container.scrollBy({
      left:
        direction === "left"
          ? -distance
          : distance,
      behavior: reducedMotion
        ? "auto"
        : "smooth",
    })
  }

  if (!itemCount) return null

  const currentItem =
    items[activeIndex]

  const previousItem =
    previousIndex !== null
      ? items[previousIndex]
      : null

  return (
    <div className="mx-auto max-w-7xl">
      <div
        className="group relative isolate overflow-hidden rounded-2xl bg-foreground shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-4/3 overflow-hidden bg-foreground sm:aspect-video lg:h-[68vh] lg:max-h-175 lg:aspect-auto">
          {previousItem && (
            <Image
              src={previousItem.src}
              alt=""
              fill
              aria-hidden="true"
              className="scale-110 object-cover blur-3xl"
              sizes="100vw"
              style={{
                opacity:
                  transitionActive
                    ? 0
                    : 0.28,
                transition: `opacity ${IMAGE_TRANSITION_DURATION}ms ease`,
              }}
            />
          )}

          <Image
            src={currentItem.src}
            alt=""
            fill
            aria-hidden="true"
            className="scale-110 object-cover blur-3xl"
            sizes="100vw"
            style={{
              opacity:
                previousItem &&
                !transitionActive
                  ? 0
                  : 0.28,
              transition: `opacity ${IMAGE_TRANSITION_DURATION}ms ease`,
            }}
          />

          <div className="absolute inset-0 z-1 bg-black/30" />

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
            <div className="relative size-full overflow-hidden">
              {previousItem && (
                <Image
                  src={previousItem.src}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 90vw"
                  style={{
                    opacity:
                      transitionActive
                        ? 0
                        : 1,
                    transform:
                      transitionActive
                        ? "scale(1.015)"
                        : "scale(1)",
                    transition: `opacity ${IMAGE_TRANSITION_DURATION}ms ease, transform ${IMAGE_TRANSITION_DURATION}ms ease`,
                  }}
                />
              )}

              <Image
                key={currentItem.src}
                src={currentItem.src}
                alt={currentItem.alt}
                fill
                priority
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 90vw"
                style={{
                  opacity:
                    previousItem &&
                    !transitionActive
                      ? 0
                      : 1,
                  transform:
                    previousItem &&
                    !transitionActive
                      ? "scale(1.015)"
                      : "scale(1)",
                  transition: `opacity ${IMAGE_TRANSITION_DURATION}ms ease, transform ${IMAGE_TRANSITION_DURATION}ms ease`,
                }}
              />
            </div>
          </ImageLightbox>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-black/45 to-transparent" />

          {itemCount > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                className="absolute left-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white shadow-xl backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:left-5 md:size-12"
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white shadow-xl backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:right-5 md:size-12"
                aria-label="Następne zdjęcie"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 z-20 w-36 -translate-x-1/2 overflow-hidden rounded-full border border-white/10 bg-black/55 text-white shadow-xl backdrop-blur-xl md:bottom-5">
                <div className="flex h-10 items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setAutoplayEnabled(
                        (current) => !current
                      )
                    }
                    className="flex size-10 shrink-0 items-center justify-center border-r border-white/10 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    aria-label={
                      autoplayEnabled
                        ? "Zatrzymaj automatyczne przewijanie"
                        : "Włącz automatyczne przewijanie"
                    }
                  >
                    {autoplayEnabled ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="ml-0.5 size-3.5" />
                    )}
                  </button>

                  <div className="flex min-w-0 flex-1 items-center justify-center gap-1 font-mono text-[11px] font-bold tracking-wide">
                    <span>
                      {String(
                        activeIndex + 1
                      ).padStart(2, "0")}
                    </span>

                    <span className="text-white/35">
                      /
                    </span>

                    <span className="text-white/55">
                      {String(
                        itemCount
                      ).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="h-0.5 bg-white/10">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: autoplayEnabled
                        ? `${progress}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {itemCount > 1 && (
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              scrollThumbnails("left")
            }
            disabled={!canScrollLeft}
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground shadow-sm transition hover:border-foreground/20 hover:bg-secondary disabled:pointer-events-none disabled:opacity-25 md:flex"
            aria-label="Przewiń miniatury w lewo"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div
  ref={thumbnailsRef}
  className="flex gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  style={{
    WebkitMaskImage:
      canScrollLeft && canScrollRight
        ? "linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%)"
        : canScrollLeft
          ? "linear-gradient(to right, transparent 0, black 36px, black 100%)"
          : canScrollRight
            ? "linear-gradient(to right, black 0, black calc(100% - 36px), transparent 100%)"
            : "none",
    maskImage:
      canScrollLeft && canScrollRight
        ? "linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%)"
        : canScrollLeft
          ? "linear-gradient(to right, transparent 0, black 36px, black 100%)"
          : canScrollRight
            ? "linear-gradient(to right, black 0, black calc(100% - 36px), transparent 100%)"
            : "none",
  }}
>
              {items.map(
                (item, index) => {
                  const isActive =
                    index === activeIndex

                  return (
                    <button
                      key={item.id}
                      ref={(element) => {
                        thumbnailRefs.current[
                          index
                        ] = element
                      }}
                      type="button"
                      onClick={() =>
                        selectImage(index)
                      }
                      className={`group/thumb relative aspect-4/3 w-27 shrink-0 overflow-hidden rounded-xl bg-foreground transition duration-300 md:w-34 lg:w-36 ${
                        isActive
                          ? "-translate-y-0.5 ring-2 ring-primary ring-offset-2 ring-offset-section-light"
                          : "opacity-55 hover:-translate-y-0.5 hover:opacity-100"
                      }`}
                      aria-current={
                        isActive
                          ? "true"
                          : undefined
                      }
                      aria-label={`Pokaż zdjęcie ${
                        index + 1
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        className={`object-cover object-center transition duration-500 ${
                          isActive
                            ? "scale-100"
                            : "scale-105 group-hover/thumb:scale-100"
                        }`}
                        sizes="144px"
                      />

                      <div
                        className={`absolute inset-0 transition ${
                          isActive
                            ? "bg-transparent"
                            : "bg-black/10 group-hover/thumb:bg-transparent"
                        }`}
                      />
                    </button>
                  )
                }
              )}
            </div>

        
          </div>

          <button
            type="button"
            onClick={() =>
              scrollThumbnails("right")
            }
            disabled={!canScrollRight}
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground shadow-sm transition hover:border-foreground/20 hover:bg-secondary disabled:pointer-events-none disabled:opacity-25 md:flex"
            aria-label="Przewiń miniatury w prawo"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}