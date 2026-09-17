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
import { breadcrumbSchema } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeria z wyjazdów",
  description:
    "Zobacz zdjęcia z piłkarskich wyjazdów organizowanych przez Let's Gol.",
  alternates: {
    canonical: "/galeria",
  },
  openGraph: {
    title: "Galeria z wyjazdów Let’s Gol",
    description:
      "Zobacz stadiony, miasta i emocje z piłkarskich podróży Let’s Gol.",
    url: "/galeria",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Galeria wyjazdów Let’s Gol",
      },
    ],
  },
}

export default async function GalleryPage() {
  const [gallery, content] = await Promise.all([
    getPublishedGallery(),
    getSiteContent(),
  ])

  const lightboxImages = gallery.map((item) => ({
    src: item.mediaId
      ? `/api/media/${item.mediaId}`
      : item.image,
    alt:
      item.alt ||
      item.title ||
      "Zdjęcie z wyjazdu Let's Gol",
    caption: [item.title, item.city]
      .filter(Boolean)
      .join(" · "),
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
                image: lightboxImages.map((item) => ({
                  "@type": "ImageObject",
                  contentUrl: new URL(
                    item.src,
                    "https://letsgol.eu"
                  ).toString(),
                  caption: item.caption,
                })),
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

        <section className="px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            {gallery.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, index) => (
                  <figure
                    key={item.id}
                    className="group overflow-hidden rounded-xl border bg-card"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <ImageLightbox
                        src={
                          item.mediaId
                            ? `/api/media/${item.mediaId}`
                            : item.image
                        }
                        alt={
                          item.alt ||
                          item.title ||
                          "Zdjęcie z wyjazdu Let's Gol"
                        }
                        caption={[item.title, item.city]
                          .filter(Boolean)
                          .join(" · ")}
                        images={lightboxImages}
                        initialIndex={index}
                        priority={index < 3}
                      />
                    </div>

                    {(item.title || item.city) && (
                      <figcaption className="flex flex-col gap-1 p-4">
                        {item.title && (
                          <strong>{item.title}</strong>
                        )}

                        {item.city && (
                          <span className="text-sm text-muted-foreground">
                            {item.city}
                          </span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border p-8 text-center text-muted-foreground">
                Galeria zostanie uzupełniona wkrótce.
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter content={content} />
    </>
  )
}