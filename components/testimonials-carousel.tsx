"use client"

import { useEffect, useState } from "react"
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
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [selected, setSelected] = useState<Testimonial | null>(null)
  const [typedText, setTypedText] = useState("")
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)

  const items = testimonials.length
    ? testimonials.slice(0, 6)
    : [
        {
          id: -1,
          author: "Kamil",
          tripName: "Barcelona",
          content:
            "Pierwszy wyjazd z Let’s Gol i na pewno nie ostatni. Wszystko dopięte, świetny hotel i koordynator zawsze pod telefonem. Polecam!",
          rating: 5,
        },
      ]

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
    if (!selected) {
      setTypedText("")
      return
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) {
      setTypedText(selected.content)
      return
    }

    let index = 0

    const interval = window.setInterval(() => {
      index += 1
      setTypedText(selected.content.slice(0, index))

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null)
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selected])

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
              const isActive = index === activeIndex
              const isLong = item.content.length > 140

              return (
                <CarouselItem
                  key={item.id}
                  className="basis-[88%] sm:basis-[72%] md:basis-[64%] lg:basis-[52%] xl:basis-[42%]"
                >
                  <div
                    className={`relative h-full transition-all duration-500 ease-out ${
                      isActive
                        ? "z-20 scale-100 opacity-100"
                        : "z-10 scale-[0.88] opacity-30"
                    }`}
                  >
                    <blockquote
                      className={`group relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 md:min-h-[330px] md:p-8 ${
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

                      <div className="relative flex gap-1 text-primary">
                        <span className="sr-only">
                          Ocena {item.rating} na 5
                        </span>

                        {Array.from({
                          length: item.rating,
                        }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="size-4"
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      <div className="relative mt-6 flex-1">
                        <p className="line-clamp-4 text-[15px] font-medium leading-7 text-background/85 md:text-base">
                          „{item.content}”
                        </p>

                        {isLong && (
                          <button
                            type="button"
                            onClick={() => setSelected(item)}
                            className="group/more mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary/80"
                          >
                            Zobacz więcej

                            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/more:translate-x-1" />
                          </button>
                        )}
                      </div>

                      <footer className="relative mt-7 border-t border-white/[0.08] pt-5">
                        {item.author && (
                          <p className="text-sm font-bold text-background">
                            {item.author}
                          </p>
                        )}

                        {item.tripName && (
                          <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-background/45">
                            {item.tripName}
                          </p>
                        )}
                      </footer>
                    </blockquote>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <CarouselPrevious className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground" />

          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Przejdź do opinii ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-7 bg-primary"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <CarouselNext className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground" />
        </div>
      </Carousel>

      {selected && (
        <div
          className="
            fixed inset-x-0 bottom-0 top-[64px] z-[100]
            overflow-y-auto bg-black/80 p-3 backdrop-blur-md
            sm:p-4
            md:top-[76px] md:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null)
            }
          }}
        >
          <div className="flex min-h-full items-start justify-center md:items-center">
            <div
              className="
                relative w-full max-w-5xl
                max-h-[calc(100dvh-88px)]
                overflow-y-auto
                rounded-2xl border border-white/10
                bg-[#111315]
                shadow-2xl
                md:max-h-[calc(100dvh-116px)]
              "
            >
              <div className="sticky left-0 top-0 z-20 h-[3px] w-full bg-primary" />

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Zamknij opinię"
                className="
                  sticky right-4 top-4 z-30 ml-auto mr-4 mt-3
                  flex size-10 items-center justify-center
                  rounded-full border border-white/10
                  bg-[#1a1d20]/95 text-white backdrop-blur
                  transition-colors
                  hover:border-primary hover:bg-primary hover:text-black
                  md:mr-6
                "
              >
                <X className="size-5" />
              </button>

              <div className="-mt-10 p-5 pt-14 sm:p-6 sm:pt-14 md:p-10 md:pt-10">
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
                  Opinia klienta
                </p>

                <h3
                  id="testimonial-modal-title"
                  className="mt-4 max-w-2xl font-sans text-3xl font-black uppercase leading-[1] tracking-tight text-white sm:text-4xl md:text-5xl"
                >
                  {selected.author || "Klient Let’s Gol"}
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

                    <p className="absolute inset-0 whitespace-pre-line text-[15px] font-medium leading-7 text-white/80 md:text-base md:leading-8">
                      „{typedText}
                      <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-primary"
                      />
                      {typedText.length === selected.content.length
                        ? "”"
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-9 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-[11px] font-black uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-70"
                  >
                    Zamknij
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