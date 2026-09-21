"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeftRight } from "lucide-react"

export function AboutStorySlider() {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative">
      <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-foreground shadow-2xl md:aspect-video">
        <Image
          src="/images/o-nas/lukasz-mateusz-archiwum.webp"
          alt="Łukasz i Mateusz jako młodzi kibice FC Barcelony"
          fill
          className="object-cover object-[60%_10%]"
          sizes="(max-width: 768px) 100vw, 1280px"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 0 0 ${position}%)`,
          }}
        >
          <Image
            src="/images/o-nas/lukasz-mateusz-na-stadionie-mobile.webp"
            alt="Łukasz i Mateusz współcześnie na stadionie FC Barcelony"
            fill
            className="object-cover object-[43%_35%] md:hidden"
            sizes="100vw"
          />

          <Image
            src="/images/o-nas/lukasz-mateusz-nowe.webp"
            alt="Łukasz i Mateusz współcześnie na stadionie FC Barcelony"
            fill
            quality={100}
            className="hidden object-cover object-center md:block"
            sizes="1280px"
          />

          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 md:p-6">
          <span className="rounded-full bg-black/65 px-4 py-2 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm">
            Kiedyś
          </span>

          <span className="rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-foreground">
            Dzisiaj
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-t from-black/60 to-transparent" />

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white"
          style={{
            left: `${position}%`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl md:size-14">
            <ArrowLeftRight className="size-5 md:size-6" />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Porównaj zdjęcie kiedyś i dzisiaj"
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-md md:text-sm">
            <ArrowLeftRight className="size-4" />
            Przesuń, żeby zobaczyć historię
          </div>
        </div>
      </div>
    </div>
  )
}