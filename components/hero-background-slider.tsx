"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

const slides = [
  {
    src: "/images/hero-stadium.webp",
    mobileSrc: "/images/hero-stadium.webp",

    mobileX: 55,
    mobileY: -6,
    mobileScale: 1.15,

    desktopX: 50,
    desktopY: 50,
    desktopScale: 1,
  },
  {
    src: "/images/madryt-hero.webp",
    mobileSrc: "/images/madryt-hero-mobile.webp",

    mobileX: 50,
    mobileY: -10,
    mobileScale: 1,

    desktopX: 50,
    desktopY: 100,
    desktopScale: 1,
  },
  {
    src: "/images/barcelonavsreal-hero.webp",
    mobileSrc: "/images/barcelonavsreal-hero-mobile.webp",

    mobileX: 40,
    mobileY: -10,
    mobileScale: 1,

    desktopX: 50,
    desktopY: 50,
    desktopScale: 1,
  },
  {
    src: "/images/san-siro.webp",
    mobileSrc: "/images/san-siro-mobile.webp",

    mobileX: 15,
    mobileY: -20,
    mobileScale: 1,

    desktopX: 50,
    desktopY: 100,
    desktopScale: 1,
  },
] as const

const fallbackEyebrow =
  "Nie oglądaj wielkich meczów tylko na ekranie"

const rotatingPhrases = [
  "Poczuj atmosferę stadionu na własnej skórze",
  "Są mecze, które trzeba przeżyć na żywo",
] as const

function useAnimationPreferences() {
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches)
    }

    updateMotionPreference()

    mediaQuery.addEventListener(
      "change",
      updateMotionPreference
    )

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMotionPreference
      )
    }
  }, [])

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(!document.hidden)
    }

    updateVisibility()

    document.addEventListener(
      "visibilitychange",
      updateVisibility
    )

    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      )
    }
  }, [])

  return {
    isPageVisible,
    reducedMotion,
  }
}

export function HeroBackgroundSlider() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isEnhanced, setIsEnhanced] = useState(false)

  const {
    isPageVisible,
    reducedMotion,
  } = useAnimationPreferences()

  useEffect(() => {
    if (reducedMotion) return

    const timer = window.setTimeout(() => {
      setIsEnhanced(true)
    }, 1200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (
      !isEnhanced ||
      !isPageVisible ||
      reducedMotion
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveSlide(
        (current) =>
          (current + 1) % slides.length
      )
    }, 4000)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    isEnhanced,
    isPageVisible,
    reducedMotion,
  ])

  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
    >
      {slides.map((slide, index) => {
        if (
          index > 0 &&
          !isEnhanced
        ) {
          return null
        }

        const isActive =
          reducedMotion
            ? index === 0
            : index === activeSlide

        return (
          <div
            key={slide.src}
            className="absolute inset-0"
          >
            <Image
              src={slide.mobileSrc}
              alt=""
              fill
              priority={index === 0}
              fetchPriority={
                index === 0
                  ? "high"
                  : "auto"
              }
              sizes="100vw"
              style={{
                objectPosition: `${slide.mobileX}% 50%`,
                transform: `translateY(${slide.mobileY}%) scale(${slide.mobileScale})`,
              }}
              className={`object-cover transition-opacity duration-[1600ms] ease-in-out md:hidden motion-reduce:transition-none ${
                isActive
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />

            <Image
  src={slide.src}
  alt=""
  fill
  priority={index === 0}
  fetchPriority={index === 0 ? "high" : "auto"}
  sizes="100vw"
  style={{
    objectPosition: `${slide.desktopX}% ${slide.desktopY}%`,
    transform: `scale(${slide.desktopScale})`,
    transformOrigin: `${slide.desktopX}% ${slide.desktopY}%`,
  }}
  className={`hidden object-cover transition-opacity duration-[1600ms] ease-in-out md:block motion-reduce:transition-none ${
    isActive ? "opacity-100" : "opacity-0"
  }`}
/>
          </div>
        )
      })}

      <div className="absolute inset-0 bg-black/40 md:bg-transparent" />
    </div>
  )
}

export function HeroTypewriter({
  eyebrow,
}: {
  eyebrow?: string
}) {
  const phrases = useMemo(
    () =>
      Array.from(
        new Set([
          eyebrow ||
            fallbackEyebrow,
          ...rotatingPhrases,
        ])
      ),
    [eyebrow]
  )

  const {
    isPageVisible,
    reducedMotion,
  } = useAnimationPreferences()

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (
      reducedMotion ||
      !isPageVisible
    ) {
      return
    }

    const phrase =
      phrases[phraseIndex]

    let delay =
      isDeleting ? 15 : 62

    if (
      !isDeleting &&
      typedText === phrase
    ) {
      delay = 1800
    }

    if (
      isDeleting &&
      typedText === ""
    ) {
      delay = 250
    }

    const timer =
      window.setTimeout(() => {
        if (
          !isDeleting &&
          typedText === phrase
        ) {
          setIsDeleting(true)
          return
        }

        if (
          isDeleting &&
          typedText === ""
        ) {
          setIsDeleting(false)

          setPhraseIndex(
            (current) =>
              (current + 1) %
              phrases.length
          )

          return
        }

        setTypedText(
          phrase.slice(
            0,
            typedText.length +
              (isDeleting ? -1 : 1)
          )
        )
      }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    isDeleting,
    isPageVisible,
    phraseIndex,
    phrases,
    reducedMotion,
    typedText,
  ])

  return (
    <p className="min-h-10 max-w-2xl font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary sm:min-h-5 sm:tracking-[0.25em]">
      <span className="sr-only">
        {phrases[0]}
      </span>

      <span aria-hidden="true">
        {reducedMotion
          ? phrases[0]
          : typedText}

        <span className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] animate-pulse bg-primary motion-reduce:hidden" />
      </span>
    </p>
  )
}