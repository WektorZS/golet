import type { Metadata } from "next"
import Image from "next/image"
import { Images } from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"
import { JsonLd } from "@/components/json-ld"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GalleryCarousel } from "@/components/gallery-carousel"

import {
  getPublishedGallery,
  getSiteContent,
} from "@/lib/content"
import { breadcrumbSchema, socialMetadata } from "@/lib/seo"

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

const galleryLayout = [
  "col-span-2 sm:col-span-6 lg:col-span-12 aspect-[16/7]",
  "col-span-1 sm:col-span-3 lg:col-span-4 aspect-[3/4]",
  "col-span-1 sm:col-span-3 lg:col-span-4 aspect-[3/4]",
  "col-span-2 sm:col-span-6 lg:col-span-4 aspect-[4/3]",
  "col-span-1 sm:col-span-3 lg:col-span-5 aspect-[4/5]",
  "col-span-1 sm:col-span-3 lg:col-span-7 aspect-[16/9]",
  "col-span-2 sm:col-span-6 lg:col-span-7 aspect-[16/9]",
  "col-span-1 sm:col-span-3 lg:col-span-5 aspect-[4/5]",
] as const

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
  const lightboxImages = gallery.map((item) => ({
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
  </div>
</section>
      </main>

      <SiteFooter content={content} />
    </>
  )
}