import type { Metadata } from "next"
import Image from "next/image"
import { Images } from "lucide-react"

import { GalleryCarousel } from "@/components/gallery-carousel"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

import {
  getPublishedGallery,
  getSiteContent,
} from "@/lib/content"
import {
  breadcrumbSchema,
  socialMetadata,
} from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeria z wyjazdów",
  description:
    "Zobacz zdjęcia z piłkarskich wyjazdów organizowanych przez Let's Gol.",
  alternates: {
    canonical: "/galeria",
  },
  ...socialMetadata(
    "Galeria z wyjazdów Let’s Gol",
    "Zobacz stadiony, miasta i emocje z piłkarskich podróży Let’s Gol.",
    "/galeria"
  ),
}

function FacebookIcon({
  className = "",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.972h-1.513c-1.49 0-1.956.93-1.956 1.887v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  )
}

function InstagramIcon({
  className = "",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.197-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  )
}

export default async function GalleryPage() {
  const [gallery, content] = await Promise.all([
    getPublishedGallery(),
    getSiteContent(),
  ])

  const carouselItems = gallery.map((item) => ({
    id: item.id,
    src: item.mediaId
      ? `/api/media/${item.mediaId}`
      : item.image,
    alt:
      item.alt ||
      item.title ||
      "Zdjęcie z wyjazdu Let's Gol",
  }))

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbSchema([
                {
                  name: "Strona główna",
                  path: "/",
                },
                {
                  name: "Galeria",
                  path: "/galeria",
                },
              ]),
              {
                "@type": "ImageGallery",
                name:
                  content.galleryTitle ||
                  "Galeria z wyjazdów",
                url: "https://letsgol.eu/galeria",
                image: gallery.map((item) => {
                  const src = item.mediaId
                    ? `/api/media/${item.mediaId}`
                    : item.image

                  return {
                    "@type": "ImageObject",
                    contentUrl: new URL(
                      src,
                      "https://letsgol.eu"
                    ).toString(),
                    caption: [item.title, item.city]
                      .filter(Boolean)
                      .join(" · "),
                  }
                }),
              },
            ],
          }}
        />

        <SiteHeader />

        <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
          <Image
            src="/images/about-us.webp"
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />

          <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
            <div className="max-w-4xl">
              <p className="eyebrow eyebrow-on-dark">
                Galeria
              </p>

              <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
                {content.galleryTitle ||
                  "Galeria z wyjazdów"}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
                Stadiony, miasta i emocje z naszych
                piłkarskich podróży. Zobacz zdjęcia z
                wyjazdów Let&apos;s Gol.
              </p>
            </div>

            <div className="border-l-2 border-primary pl-6">
              <Images
                className="size-6 text-primary"
                aria-hidden="true"
              />

              <p className="mt-4 font-sans text-2xl font-black uppercase">
                Wspomnienia z trybun
              </p>

              <p className="mt-2 text-sm leading-6 text-background/60">
                Mecze, stadiony i miejsca, które odwiedziliśmy
                razem z uczestnikami naszych wyjazdów.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-section-light px-4 py-16 md:px-6 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-40 top-10 size-105 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute -left-40 bottom-0 size-105 rounded-full bg-black/2.5 blur-[120px]" />
          </div>

          <div className="relative">
            {carouselItems.length ? (
              <GalleryCarousel items={carouselItems} />
            ) : (
              <div className="mx-auto max-w-7xl py-20 text-center">
                <Images
                  className="mx-auto size-8 text-muted-foreground/40"
                  aria-hidden="true"
                />

                <p className="mt-4 text-muted-foreground">
                  Galeria zostanie uzupełniona wkrótce.
                </p>
              </div>
            )}

            <div className="mx-auto mt-12 max-w-7xl border-t border-foreground/10 pt-8 md:mt-16 md:pt-10">
              <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                <div>
                  <p className="font-sans text-xl font-black uppercase tracking-tight md:text-2xl">
                    Więcej zdjęć i relacji?
                  </p>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                    Więcej zdjęć i relacji z naszych wyjazdów
                    znajdziesz w naszych social mediach.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <a
                    href="https://www.facebook.com/profile.php?id=61573517165441"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-bold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <FacebookIcon className="size-4" />
                    Facebook
                  </a>

                  <a
                    href="https://www.instagram.com/letsgol_wyjazdynamecze"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/15 bg-background px-5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <InstagramIcon className="size-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter content={content} />
    </>
  )
}