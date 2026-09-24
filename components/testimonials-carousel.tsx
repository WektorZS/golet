"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Star,
  X,
} from "lucide-react"

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Testimonial = {
  id: number
  author: string
  tripName: string
  content: string
  rating: number
}

type TestimonialsCarouselProps = {
  testimonials: Testimonial[]
  locale?: "pl" | "en"
}

function TestimonialCard({
  item,
  isActive,
  onOpen,
  locale,
}: {
  item: Testimonial
  isActive: boolean
  onOpen: () => void
  locale: "pl" | "en"
}) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const fullTextRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const visible = textRef.current
    const full = fullTextRef.current

    if (!visible || !full) return

    const checkTruncation = () => {
      const visibleHeight = visible.getBoundingClientRect().height
      const fullHeight = full.getBoundingClientRect().height

      setIsTruncated(fullHeight > visibleHeight + 2)
    }

    const frame = requestAnimationFrame(checkTruncation)

    const observer = new ResizeObserver(checkTruncation)

    observer.observe(visible)
    observer.observe(full)

    window.addEventListener("resize", checkTruncation)

    document.fonts?.ready.then(checkTruncation)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", checkTruncation)
    }
  }, [item.content])

  return (
    <blockquote
      className={`group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-500 sm:min-h-[300px] sm:p-6 md:min-h-[330px] md:p-8 ${
        isActive
          ? "border-primary/40 bg-white/[0.07] shadow-[0_24px_70px_rgba(0,0,0,0.35),0_0_0_1px_rgba(244,185,30,0.08)]"
          : "border-white/[0.08] bg-white/[0.035]"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-[2px] bg-primary transition-all duration-500 ${
          isActive ? "w-16" : "w-10"
        }`}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 top-1 select-none font-serif text-[100px] font-black leading-none text-white/[0.035]"
      >
        “
      </span>

      <div className="relative flex flex-1 flex-col justify-center">
        <div className="flex gap-1 text-primary">
          <span className="sr-only">
            {locale === "en" ? `Rating ${item.rating} out of 5` : `Ocena ${item.rating} na 5`}
          </span>

          {Array.from({
            length: item.rating,
          }).map((_, index) => (
            <Star
              key={index}
              className="size-4"
              fill="currentColor"
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="relative mt-6">
          <p
            ref={textRef}
            className="line-clamp-5 text-[14px] font-medium leading-6 text-background/85 sm:line-clamp-4 sm:text-[15px] sm:leading-7 md:text-base"
          >
            „{item.content}”
          </p>

          <p
            ref={fullTextRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 -z-10 w-full text-[14px] font-medium leading-6 opacity-0 sm:text-[15px] sm:leading-7 md:text-base"
          >
            „{item.content}”
          </p>

          {isTruncated && (
            <button
              type="button"
              onClick={onOpen}
              className="group/more mt-4 inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary/80"
            >
              {locale === "en" ? "Read more" : "Zobacz więcej"}

              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/more:translate-x-1" />
            </button>
          )}
        </div>
      </div>

      <footer className="relative mt-7 border-t border-white/[0.08] pt-5">
        {item.author && (
          <p className="text-sm font-bold text-background">
            {item.author}
          </p>
        )}

        {item.tripName && (
          <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-background/60">
            {item.tripName}
          </p>
        )}
      </footer>
    </blockquote>
  )
}

export function TestimonialsCarousel({
  testimonials,
  locale = "pl",
}: TestimonialsCarouselProps) {
  const [selected, setSelected] = useState<Testimonial | null>(null)
  const [typedText, setTypedText] = useState("")
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)

  const modalScrollRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const [modalCanScroll, setModalCanScroll] = useState(false)
  const [modalAtBottom, setModalAtBottom] = useState(false)

  const items = testimonials.slice(0, 6)

  const openTestimonial = (item: Testimonial) => {
    openerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    setTypedText("")
    setModalCanScroll(false)
    setModalAtBottom(false)
    setSelected(item)
  }

  const closeTestimonial = useCallback(() => {
    setSelected(null)
    requestAnimationFrame(() => openerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!api) return

    const updateActiveSlide = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    updateActiveSlide()

    api.on("select", updateActiveSlide)
    api.on("reInit", updateActiveSlide)

    return () => {
      api.off("select", updateActiveSlide)
      api.off("reInit", updateActiveSlide)
    }
  }, [api])

  useEffect(() => {
    if (!selected) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setTypedText(selected.content))
      return () => cancelAnimationFrame(frame)
    }

    let index = 0

    const interval = window.setInterval(() => {
      index += 1

      setTypedText(
        selected.content.slice(0, index)
      )

      if (index >= selected.content.length) {
        window.clearInterval(interval)
      }
    }, 12)

    return () => {
      window.clearInterval(interval)
    }
  }, [selected])

  useEffect(() => {
    if (!selected) return

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeTestimonial()
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []
        )
        if (!focusable.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = "hidden"
    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLButtonElement>(`[aria-label="${locale === "en" ? "Close review" : "Zamknij opinię"}"]`)?.focus()
    })

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [selected, closeTestimonial, locale])

  useEffect(() => {
    if (!selected) return

    const element = modalScrollRef.current

    if (!element) return

    const checkScroll = () => {
      const canScroll =
        element.scrollHeight >
        element.clientHeight + 4

      const atBottom =
        element.scrollTop +
          element.clientHeight >=
        element.scrollHeight - 8

      setModalCanScroll(canScroll)
      setModalAtBottom(atBottom)
    }

    const frame =
      requestAnimationFrame(checkScroll)

    const observer =
      new ResizeObserver(checkScroll)

    observer.observe(element)

    element.addEventListener(
      "scroll",
      checkScroll
    )

    return () => {
      cancelAnimationFrame(frame)

      observer.disconnect()

      element.removeEventListener(
        "scroll",
        checkScroll
      )
    }
  }, [selected, typedText])

  if (items.length === 0) return null

  return (
    <>
      <Carousel
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
        }}
        setApi={setApi}
        className="mt-12 w-full"
      >
        <div
          className="
            relative overflow-hidden
            [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]
            [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]
          "
        >
          <CarouselContent className="py-5">
            {items.map((item, index) => {
              const isActive =
                index === activeIndex

              return (
                <CarouselItem
                  key={item.id}
                  className="basis-[94%] sm:basis-[76%] md:basis-[64%] lg:basis-[52%] xl:basis-[42%]"
                >
                  <div
                    className={`relative h-full transition-all duration-500 ease-out ${
                      isActive
                        ? "z-20 scale-100 opacity-100"
                        : "z-10 scale-[0.88] opacity-30"
                    }`}
                  >
                    <TestimonialCard
                      item={item}
                      isActive={isActive}
                      onOpen={() => openTestimonial(item)}
                      locale={locale}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <CarouselPrevious aria-label={locale === "en" ? "Previous review" : "Poprzednia opinia"} className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground" />

      <div className="flex items-center">
  {items.map((item, index) => {
    const isActive = index === activeIndex

    return (
      <button
        key={item.id}
        type="button"
        aria-label={locale === "en" ? `Go to review ${index + 1}` : `Przejdź do opinii ${index + 1}`}
        aria-current={isActive ? "true" : undefined}
        onClick={() => api?.scrollTo(index)}
        className="group flex size-11 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className={`block h-1.5 rounded-full transition-all duration-300 ${
            isActive
              ? "w-7 bg-primary"
              : "w-1.5 bg-white/30 group-hover:bg-white/50"
          }`}
        />
      </button>
    )
  })}
</div>

          <CarouselNext aria-label={locale === "en" ? "Next review" : "Następna opinia"} className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground" />
        </div>
      </Carousel>

      {selected && (
        <div
          ref={dialogRef}
          className="
            fixed inset-x-0 bottom-0 top-[80px] z-[100]
            bg-black/80 backdrop-blur-md
            md:top-[76px] md:flex md:items-center md:justify-center md:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeTestimonial()
            }
          }}
        >
          <div
            ref={modalScrollRef}
            className="
              relative h-full w-full overflow-y-auto
              bg-[#111315]
              md:h-auto
              md:max-h-[calc(100dvh-116px)]
              md:max-w-5xl
              md:rounded-2xl
              md:border md:border-white/10
              md:shadow-2xl
            "
          >
            <div className="sticky left-0 top-0 z-30 hidden h-[3px] w-full bg-primary md:block" />

            <div className="sticky top-0 z-40 h-0">
              <button
                type="button"
                onClick={() =>
                  closeTestimonial()
                }
                aria-label={locale === "en" ? "Close review" : "Zamknij opinię"}
                className="
                  absolute right-4 top-4
                  flex size-10 items-center justify-center
                  rounded-full border border-white/10
                  bg-[#1a1d20]/95 text-white
                  shadow-lg backdrop-blur
                  transition-colors
                  hover:border-primary hover:bg-primary hover:text-black
                  md:right-6 md:top-6
                "
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 pb-8 pt-7 sm:px-6 md:p-10">
              <div className="flex gap-1 text-primary">
                {Array.from({
                  length: selected.rating,
                }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-5"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                {locale === "en" ? "Traveller review" : "Opinia klienta"}
              </p>

              <h3
                id="testimonial-modal-title"
                className="mt-4 max-w-2xl pr-14 font-sans text-3xl font-black uppercase leading-[1] tracking-tight text-white sm:text-4xl md:pr-0 md:text-5xl"
              >
                {selected.author ||
                  (locale === "en" ? "Let's Gol traveller" : "Klient Let’s Gol")}
              </h3>

              {selected.tripName && (
                <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  {selected.tripName}
                </p>
              )}

              <div className="my-7 h-px bg-white/10 md:my-9" />

              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-1 -top-8 select-none font-serif text-[90px] font-black leading-none text-white/[0.03] md:-right-2 md:-top-10 md:text-[110px]"
                >
                  “
                </span>

                <div className="relative max-w-2xl">
                  <p
                    aria-hidden="true"
                    className="invisible whitespace-pre-line text-[15px] font-medium leading-7 md:text-base md:leading-8"
                  >
                    „{selected.content}”
                  </p>

                  <p className="sr-only">„{selected.content}”</p>

                  <p aria-hidden="true" className="absolute inset-0 whitespace-pre-line text-[15px] font-medium leading-7 text-white/80 md:text-base md:leading-8">
                    „{typedText}

                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-primary"
                    />

                    {typedText.length ===
                    selected.content.length
                      ? "”"
                      : ""}
                  </p>
                </div>
              </div>

              <div
                className="
                  sticky bottom-0 z-30
                  -mx-5 mt-8
                  border-t border-white/10
                  bg-[#111315]/95
                  px-5 py-4
                  backdrop-blur
                  sm:-mx-6 sm:px-6
                  md:static md:mx-0 md:mt-9
                  md:bg-transparent md:px-0 md:pb-0 md:pt-6
                "
              >
                <div className="flex min-h-6 items-center justify-between gap-4">
                  {modalCanScroll &&
                  !modalAtBottom ? (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/45 md:hidden">
                      {locale === "en" ? "Scroll to continue reading" : "Przewiń, aby czytać dalej"}

                      <span className="animate-bounce text-primary">
                        ↓
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      closeTestimonial()
                    }
                    className="ml-auto text-[11px] font-black uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-70"
                  >
                    {locale === "en" ? "Close" : "Zamknij"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
