import type { Metadata } from "next"
import Image from "next/image"
import { Images } from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"
import { JsonLd } from "@/components/json-ld"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

import {
  getPublishedGallery,
  getSiteContent,
} from "@/lib/content"
import { breadcrumbSchema, localizedAlternates, socialMetadata } from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { localizedSetting } from "@/lib/i18n-content"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy("gallery", locale)
  const path = routeFor(locale, "/galeria")
  return { title, description, alternates: localizedAlternates("/galeria", locale), ...socialMetadata(title, description, path, locale) }
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
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const path = routeFor(locale, "/galeria")
  const [gallery, content] = await Promise.all([
    getPublishedGallery(locale),
    getSiteContent(),
  ])

  const lightboxImages = gallery.map((item) => ({
    src: item.mediaId
      ? `/api/media/${item.mediaId}`
      : item.image,
    alt:
      item.alt ||
      item.title ||
      (isEn ? "Photo from a Let's Gol trip" : "Zdjęcie z wyjazdu Let's Gol"),
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
                  name: isEn ? "Home" : "Strona główna",
                  path: routeFor(locale, "/"),
                },
                {
                  name: isEn ? "Gallery" : "Galeria",
                  path,
                },
              ]),
              {
                "@type": "ImageGallery",
                name:
                  localizedSetting(content, "galleryTitle", locale, isEn ? "Football trip gallery" : "Galeria z wyjazdów"),
                url: `https://letsgol.eu${path}`,
                inLanguage: isEn ? "en-GB" : "pl-PL",
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
                {isEn ? "Gallery" : "Galeria"}
              </p>

              <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
                {localizedSetting(content, "galleryTitle", locale, isEn ? "Football trip gallery" : "Galeria z wyjazdów")}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
                {isEn ? "Stadiums, cities and match-day emotion from our football journeys. Explore photos from Let's Gol trips." : <>Stadiony, miasta i emocje z naszych piłkarskich podróży. Zobacz zdjęcia z wyjazdów Let&apos;s Gol.</>}
              </p>
            </div>

            <div className="border-l-2 border-primary pl-6">
              <Images
                className="size-6 text-primary"
                aria-hidden="true"
              />

              <p className="mt-4 font-sans text-2xl font-black uppercase">
                {isEn ? "Memories from the stands" : "Wspomnienia z trybun"}
              </p>

              <p className="mt-2 text-sm leading-6 text-background/60">
                {isEn ? "Matches, stadiums and places we have experienced together with our travellers." : "Mecze, stadiony i miejsca, które odwiedziliśmy razem z uczestnikami naszych wyjazdów."}
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-section-light px-4 py-16 md:px-6 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-40 top-20 size-105 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute -left-40 bottom-20 size-105 rounded-full bg-black/2.5 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {gallery.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 lg:grid-cols-12 lg:gap-4">
                {gallery.map((item, index) => {
                  const src = item.mediaId
                    ? `/api/media/${item.mediaId}`
                    : item.image

                  const layoutClass =
                    galleryLayout[index % galleryLayout.length]

                  return (
                    <figure
                      key={item.id}
                      className={`group relative overflow-hidden rounded-xl bg-muted ${layoutClass}`}
                    >
                      <ImageLightbox
                        src={src}
                        alt={
                          item.alt ||
                          item.title ||
                          (isEn ? "Photo from a Let's Gol trip" : "Zdjęcie z wyjazdu Let's Gol")
                        }
                        images={lightboxImages}
                        initialIndex={index}
                        priority={index < 3}
                      >
                        <Image
                          src={src}
                          alt={
                            item.alt ||
                            item.title ||
                            (isEn ? "Photo from a Let's Gol trip" : "Zdjęcie z wyjazdu Let's Gol")
                          }
                          fill
                          className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </ImageLightbox>
                    </figure>
                  )
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Images
                  className="mx-auto size-8 text-muted-foreground/40"
                  aria-hidden="true"
                />

                <p className="mt-4 text-muted-foreground">
                  {isEn ? "More photos will be added soon." : "Galeria zostanie uzupełniona wkrótce."}
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
