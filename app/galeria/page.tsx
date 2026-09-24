import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, Images } from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"
import { JsonLd } from "@/components/json-ld"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

import {
  getPublishedGallery,
  getSiteContent,
} from "@/lib/content"
import {
  breadcrumbSchema,
  localizedAlternates,
  socialMetadata,
} from "@/lib/seo"
import { getRequestLocale } from "@/lib/i18n-request"
import { localizedSetting } from "@/lib/i18n-content"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"

export const dynamic = "force-dynamic"

const FACEBOOK_URL =
  "https://facebook.com/profile.php?id=61573517165441"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy(
    "gallery",
    locale,
  )

  const path = routeFor(locale, "/galeria")

  return {
    title,
    description,
    alternates: localizedAlternates(
      "/galeria",
      locale,
    ),
    ...socialMetadata(
      title,
      description,
      path,
      locale,
    ),
  }
}

function getMosaicGroupClass(count: number) {
  if (count === 4) {
    return "grid h-128 grid-cols-2 grid-rows-6 gap-0 sm:h-144 lg:h-160 lg:grid-cols-12 lg:grid-rows-6"
  }

  if (count === 3) {
    return "grid h-96 grid-cols-2 grid-rows-4 gap-0 sm:h-112 lg:h-128 lg:grid-cols-12 lg:grid-rows-4"
  }

  if (count === 2) {
    return "grid h-64 grid-cols-2 grid-rows-1 gap-0 sm:h-80 lg:h-96 lg:grid-cols-12"
  }

  return "grid h-72 grid-cols-1 grid-rows-1 gap-0 sm:h-96 lg:h-120 lg:grid-cols-12"
}

function getMosaicTileClass(
  count: number,
  index: number,
  reverse: boolean,
) {
  if (count === 4) {
    const mobile = [
      "col-start-1 col-span-2 row-start-1 row-span-2",
      "col-start-1 col-span-1 row-start-3 row-span-2",
      "col-start-2 col-span-1 row-start-3 row-span-2",
      "col-start-1 col-span-2 row-start-5 row-span-2",
    ]

    const desktopDefault = [
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-6",
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-3",
      "lg:col-start-7 lg:col-span-3 lg:row-start-4 lg:row-span-3",
      "lg:col-start-10 lg:col-span-3 lg:row-start-4 lg:row-span-3",
    ]

    const desktopReverse = [
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-6",
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-3",
      "lg:col-start-1 lg:col-span-3 lg:row-start-4 lg:row-span-3",
      "lg:col-start-4 lg:col-span-3 lg:row-start-4 lg:row-span-3",
    ]

    return `${mobile[index]} ${
      reverse
        ? desktopReverse[index]
        : desktopDefault[index]
    }`
  }

  if (count === 3) {
    const mobile = [
      "col-start-1 col-span-2 row-start-1 row-span-2",
      "col-start-1 col-span-1 row-start-3 row-span-2",
      "col-start-2 col-span-1 row-start-3 row-span-2",
    ]

    const desktopDefault = [
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-4",
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2",
      "lg:col-start-7 lg:col-span-6 lg:row-start-3 lg:row-span-2",
    ]

    const desktopReverse = [
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-4",
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2",
      "lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-2",
    ]

    return `${mobile[index]} ${
      reverse
        ? desktopReverse[index]
        : desktopDefault[index]
    }`
  }

  if (count === 2) {
    return index === 0
      ? "col-start-1 col-span-1 row-start-1 lg:col-start-1 lg:col-span-6"
      : "col-start-2 col-span-1 row-start-1 lg:col-start-7 lg:col-span-6"
  }

  return "col-start-1 col-span-1 row-start-1 lg:col-span-12"
}

function getMosaicSizes(
  count: number,
  index: number,
) {
  if (count === 4) {
    const sizes = [
      "(max-width: 1023px) 100vw, 50vw",
      "(max-width: 1023px) 50vw, 50vw",
      "(max-width: 1023px) 50vw, 25vw",
      "(max-width: 1023px) 100vw, 25vw",
    ]

    return sizes[index]
  }

  if (count === 3) {
    const sizes = [
      "(max-width: 1023px) 100vw, 50vw",
      "(max-width: 1023px) 50vw, 50vw",
      "(max-width: 1023px) 50vw, 50vw",
    ]

    return sizes[index]
  }

  if (count === 2) {
    return "50vw"
  }

  return "100vw"
}

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
      (isEn
        ? "Photo from a Let's Gol trip"
        : "Zdjęcie z wyjazdu Let's Gol"),
  }))

  const galleryEntries = gallery.map(
    (item, index) => ({
      item,
      index,
    }),
  )

  const galleryGroups = Array.from(
    {
      length: Math.ceil(
        galleryEntries.length / 4,
      ),
    },
    (_, index) =>
      galleryEntries.slice(
        index * 4,
        index * 4 + 4,
      ),
  )

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbSchema([
                {
                  name: isEn
                    ? "Home"
                    : "Strona główna",
                  path: routeFor(
                    locale,
                    "/",
                  ),
                },
                {
                  name: isEn
                    ? "Gallery"
                    : "Galeria",
                  path,
                },
              ]),
              {
                "@type": "ImageGallery",
                name: localizedSetting(
                  content,
                  "galleryTitle",
                  locale,
                  isEn
                    ? "Football trip gallery"
                    : "Galeria z wyjazdów",
                ),
                url: `https://letsgol.eu${path}`,
                inLanguage: isEn
                  ? "en-GB"
                  : "pl-PL",
                image: gallery.map(
                  (item) => {
                    const src =
                      item.mediaId
                        ? `/api/media/${item.mediaId}`
                        : item.image

                    return {
                      "@type": "ImageObject",
                      contentUrl: new URL(
                        src,
                        "https://letsgol.eu",
                      ).toString(),
                      caption: [
                        item.title,
                        item.city,
                      ]
                        .filter(Boolean)
                        .join(" · "),
                    }
                  },
                ),
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
                {isEn
                  ? "Gallery"
                  : "Galeria"}
              </p>

              <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {localizedSetting(
                  content,
                  "galleryTitle",
                  locale,
                  isEn
                    ? "Football trip gallery"
                    : "Galeria z wyjazdów",
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
                {isEn ? (
                  "Stadiums, cities and match-day emotion from our football journeys. Explore photos from Let's Gol trips."
                ) : (
                  <>
                    Stadiony, miasta i emocje
                    z naszych piłkarskich
                    podróży. Zobacz zdjęcia
                    z wyjazdów Let&apos;s
                    Gol.
                  </>
                )}
              </p>
            </div>

            <div className="border-l-2 border-primary pl-6">
              <Images
                className="size-6 text-primary"
                aria-hidden="true"
              />

              <p className="mt-4 font-sans text-2xl font-black uppercase">
                {isEn
                  ? "Memories from the stands"
                  : "Wspomnienia z trybun"}
              </p>

              <p className="mt-2 text-sm leading-6 text-background/60">
                {isEn
                  ? "Matches, stadiums and places we have experienced together with our travellers."
                  : "Mecze, stadiony i miejsca, które odwiedziliśmy razem z uczestnikami naszych wyjazdów."}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-foreground">
          {gallery.length ? (
            <div className="w-full">
              {galleryGroups.map(
                (group, groupIndex) => {
                  const reverse =
                    groupIndex % 2 === 1

                  return (
                    <div
                      key={
                        group[0]?.item.id ??
                        groupIndex
                      }
                      className={getMosaicGroupClass(
                        group.length,
                      )}
                    >
                      {group.map(
                        (
                          { item, index },
                          localIndex,
                        ) => {
                          const src =
                            item.mediaId
                              ? `/api/media/${item.mediaId}`
                              : item.image

                          const alt =
                            item.alt ||
                            item.title ||
                            (isEn
                              ? "Photo from a Let's Gol trip"
                              : "Zdjęcie z wyjazdu Let's Gol")

                          return (
                            <figure
                              key={item.id}
                              className={`group relative isolate m-0 overflow-hidden bg-foreground ${getMosaicTileClass(
                                group.length,
                                localIndex,
                                reverse,
                              )}`}
                            >
                              <ImageLightbox
                                src={src}
                                alt={alt}
                                images={
                                  lightboxImages
                                }
                                initialIndex={
                                  index
                                }
                                priority={
                                  index < 4
                                }
                              >
                                <Image
                                  src={src}
                                  alt={alt}
                                  fill
                                  sizes={getMosaicSizes(
                                    group.length,
                                    localIndex,
                                  )}
                                  className="cursor-zoom-in object-cover brightness-100 transition-[transform,filter] duration-700 ease-out lg:brightness-70 lg:group-hover:scale-105 lg:group-hover:brightness-100"
                                />
                              </ImageLightbox>
                            </figure>
                          )
                        },
                      )}
                    </div>
                  )
                },
              )}
            </div>
          ) : (
            <div className="bg-section-light px-4 py-24 text-center md:px-6">
              <Images
                className="mx-auto size-8 text-muted-foreground/40"
                aria-hidden="true"
              />

              <p className="mt-4 text-muted-foreground">
                {isEn
                  ? "More photos will be added soon."
                  : "Galeria zostanie uzupełniona wkrótce."}
              </p>
            </div>
          )}
        </section>

        <section className="bg-section-light">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 md:px-6 md:py-18 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">
                {isEn
                  ? "More from our trips"
                  : "Więcej z naszych wyjazdów"}
              </p>

              <h2 className="mt-5 text-balance font-sans text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {isEn
                  ? "More photos on Facebook"
                  : "Więcej zdjęć na Facebooku"}
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {isEn
                  ? "The gallery does not end here. See more photos, match-day reports and moments from our trips on Facebook."
                  : "Na tej galerii się nie kończy. Więcej zdjęć, relacji meczowych i momentów z naszych wyjazdów znajdziesz na naszym Facebooku."}
              </p>
            </div>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-lg bg-foreground px-6 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-primary hover:text-black"
            >
              <Image
                src="/icons/social/facebook.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />

              <span>
                {isEn
                  ? "See us on Facebook"
                  : "Zobacz nas na Facebooku"}
              </span>

              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter content={content} />
    </>
  )
}