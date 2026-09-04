"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

const slides = [
  { src: "/images/hero-stadium.webp", position: "object-center" },
  { src: "/images/barcelona-trip.webp", position: "object-center" },
  { src: "/images/madrid-trip.webp", position: "object-center" },
] as const

const fallbackEyebrow = "Nie oglądaj wielkich meczów tylko na ekranie"
const rotatingPhrases = [
  "Poczuj atmosferę stadionu na własnej skórze",
  "Są mecze, które trzeba przeżyć na żywo",
] as const

function useAnimationPreferences() {
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)
    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden)
    updateVisibility()
    document.addEventListener("visibilitychange", updateVisibility)
    return () => document.removeEventListener("visibilitychange", updateVisibility)
  }, [])

  return { isPageVisible, reducedMotion }
}

export function HeroBackgroundSlider() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isEnhanced, setIsEnhanced] = useState(false)
  const { isPageVisible, reducedMotion } = useAnimationPreferences()

  useEffect(() => {
    if (reducedMotion) return

    const timer = window.setTimeout(() => setIsEnhanced(true), 1200)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    if (!isEnhanced || !isPageVisible || reducedMotion) return

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 7000)

    return () => window.clearInterval(interval)
  }, [isEnhanced, isPageVisible, reducedMotion])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((slide, index) => {
        if (index > 0 && !isEnhanced) return null

        const isActive = reducedMotion ? index === 0 : index === activeSlide

        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="100vw"
            className={`object-cover ${slide.position} transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
  isActive ? "opacity-100" : "opacity-0"
}`}
          />
        )
      })}
    </div>
  )
}

export function HeroTypewriter({ eyebrow }: { eyebrow?: string }) {
  const phrases = useMemo(
    () => Array.from(new Set([eyebrow || fallbackEyebrow, ...rotatingPhrases])),
    [eyebrow]
  )
  const { isPageVisible, reducedMotion } = useAnimationPreferences()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (reducedMotion) {
      setTypedText(phrases[0])
      setPhraseIndex(0)
      setIsDeleting(false)
      return
    }

    if (!isPageVisible) return

    const phrase = phrases[phraseIndex]
    let delay = isDeleting ? 15 : 62

    if (!isDeleting && typedText === phrase) delay = 1800
    if (isDeleting && typedText === "") delay = 250

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === phrase) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && typedText === "") {
        setIsDeleting(false)
        setPhraseIndex((current) => (current + 1) % phrases.length)
        return
      }

      setTypedText(
        phrase.slice(0, typedText.length + (isDeleting ? -1 : 1))
      )
    }, delay)

    return () => window.clearTimeout(timer)
  }, [isDeleting, isPageVisible, phraseIndex, phrases, reducedMotion, typedText])

  return (
    <p className="min-h-10 max-w-2xl font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary sm:min-h-5 sm:tracking-[0.25em]">
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true">
        {typedText}
        <span className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] animate-pulse bg-primary motion-reduce:hidden" />
      </span>
    </p>
  )
}
