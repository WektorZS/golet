"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  Star,
  X,
} from "lucide-react"

import {
  Carousel,
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
  if (!selected) {
    setTypedText("")
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
          align: "start",
          loop: true,
        }}
        className="mt-12 w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item) => {
            const isLong = item.content.length > 220

            return (
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <blockquote className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.045] p-6 transition-all duration-300 hover:border-primary/35 hover:bg-white/[0.065] md:p-7">
                  <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary transition-all duration-500 group-hover:w-full" />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 top-1 select-none font-serif text-[90px] font-black leading-none text-white/[0.035]"
                  >
                    “
                  </span>

                  <div className="relative flex gap-1 text-primary">
                    <span className="sr-only">
                      Ocena {item.rating} na 5
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

                  <div className="relative mt-6 flex-1">
                    <p className="line-clamp-4 text-[15px] font-medium leading-7 text-background/85">
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
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <div className="mt-8 flex items-center justify-center gap-3">
          <CarouselPrevious className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background hover:border-primary hover:bg-primary hover:text-primary-foreground" />

          <CarouselNext className="static size-11 translate-x-0 translate-y-0 border-white/15 bg-white/[0.05] text-background hover:border-primary hover:bg-primary hover:text-primary-foreground" />
        </div>
      </Carousel>

      {selected && (
        <div
  className="fixed inset-x-0 bottom-0 top-[76px] z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null)
            }
          }}
        >
          <div className="relative max-h-[90svh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111315] shadow-2xl">
            <div className="absolute left-0 top-0 h-[3px] w-full bg-primary" />

            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Zamknij opinię"
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:border-primary hover:bg-primary hover:text-black md:right-6 md:top-6"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 pt-16 md:p-10 md:pt-10">
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
                className="mt-4 max-w-2xl font-sans text-3xl font-black uppercase leading-[1] tracking-tight text-white md:text-5xl"
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
  className="pointer-events-none absolute -right-2 -top-10 select-none font-serif text-[110px] font-black leading-none text-white/[0.03]"
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
      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-primary animate-pulse"
    />
    {typedText.length === selected.content.length ? "”" : ""}
  </p>
</div>
              </div>

              <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">

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
      )}
    </>
  )
}