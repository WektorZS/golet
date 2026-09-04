
"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

const slides = [
  { src: "/images/hero-stadium.webp", position: "object-center" },
  { src: "/images/barcelona-trip.webp", position: "object-center" },
  { src: "/images/madrid-trip.webp", position: "object-center" },
] as const

const fallbackEyebrow =
  "Mecz zaczyna się dużo wcześniej niż pierwszy gwizdek"

const rotatingPhrases = [
  "Największe stadiony Europy są bliżej, niż myślisz",
  "Ty przeżywasz mecz. My organizujemy resztę",
] as const

const SLIDE_DURATION = 7000
const TRANSITION_DURATION = 1600
const TYPE_SPEED = 52
const DELETE_SPEED = 32
const PHRASE_PAUSE = 1800
const DELETE_PAUSE = 250

function useAnimationPreferences() {
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches)
    }

    updateMotionPreference()

    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference)
    }
  }, [])

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible")
    }

    updateVisibility()

    document.addEventListener("visibilitychange", updateVisibility)

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility)
    }
  }, [])

  return {
    isPageVisible,
    reducedMotion,
  }
}

export function HeroBackgroundSlider() {
  const [activeSlide, setActiveSlide] = useState(0)

  const { isPageVisible, reducedMotion } = useAnimationPreferences()

  useEffect(() => {
    if (reducedMotion || !isPageVisible || slides.length <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, SLIDE_DURATION)

    return () => {
      window.clearInterval(interval)
    }
  }, [isPageVisible, reducedMotion])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {slides.map((slide, index) => {
        const isActive = reducedMotion
          ? index === 0
          : index === activeSlide

        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className={`object-cover ${slide.position} ${
              reducedMotion
                ? ""
                : `transition-[opacity,transform] duration-[${TRANSITION_DURATION}ms] ease-in-out`
            } ${
              isActive
                ? "scale-100 opacity-100"
                : "scale-[1.025] opacity-0"
            } motion-reduce:transition-none`}
          />
        )
      })}
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
          eyebrow?.trim() || fallbackEyebrow,
          ...rotatingPhrases,
        ])
      ),
    [eyebrow]
  )

  const { isPageVisible, reducedMotion } =
    useAnimationPreferences()

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typedText, setTypedText] = useState(phrases[0])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Przy ograniczonym ruchu pokazujemy pełny, statyczny tekst.
    if (reducedMotion) {
      setPhraseIndex(0)
      setTypedText(phrases[0])
      setIsDeleting(false)
      return
    }

    // Nie wykonujemy animacji, gdy karta przeglądarki jest ukryta.
    if (!isPageVisible) {
      return
    }

    const phrase = phrases[phraseIndex]

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED

    if (!isDeleting && typedText === phrase) {
      delay = PHRASE_PAUSE
    }

    if (isDeleting && typedText === "") {
      delay = DELETE_PAUSE
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === phrase) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && typedText === "") {
        setIsDeleting(false)
        setPhraseIndex(
          (current) => (current + 1) % phrases.length
        )
        return
      }

      const nextLength = typedText.length + (isDeleting ? -1 : 1)

      setTypedText(phrase.slice(0, nextLength))
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
    <p
      className="min-h-10 max-w-2xl font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary sm:min-h-5 sm:tracking-[0.25em]"
      aria-label={phrases[phraseIndex]}
    >
      {/* Pełny tekst dostępny dla czytników ekranu */}
      <span className="sr-only">
        {phrases[phraseIndex]}
      </span>

      {/* Wizualny typewriter */}
      <span aria-hidden="true">
        {typedText}

        {!reducedMotion && (
          <span
            className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] animate-pulse bg-primary motion-reduce:hidden"
          />
        )}
      </span>
    </p>
  )
}
