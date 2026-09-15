import type { Metadata } from "next"
import { ImageLightbox } from "@/components/image-lightbox"
import { JsonLd } from "@/components/json-ld"
import { getPublishedGallery, getSiteContent } from "@/lib/content"
import type { SiteContent } from "@/lib/content"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { breadcrumbSchema } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeria z wyjazdów",
  description:
    "Zobacz zdjęcia z piłkarskich wyjazdów organizowanych przez Let's Gol.",
  alternates: { canonical: "/galeria" },
  openGraph: {
    title: "Galeria z wyjazdów Let’s Gol",
    description: "Zobacz stadiony, miasta i emocje z piłkarskich podróży Let’s Gol.",
    url: "/galeria",
    images: [{ url: "/images/og-image.webp", width: 1200, height: 630, alt: "Galeria wyjazdów Let’s Gol" }],
  },
}

export default async function GalleryPage() {
  const [gallery, content] = process.env.DATABASE_URL
    ? await Promise.all([
        getPublishedGallery().catch(() => []),
        getSiteContent().catch(() => ({} as SiteContent)),
      ])
    : [[], {} as SiteContent]

  const lightboxImages = gallery.map((item) => ({
    src: item.mediaId ? `/api/media/${item.mediaId}` : item.image,
    alt: item.alt || item.title || "Zdjęcie z wyjazdu Let's Gol",
    caption: [item.title, item.city].filter(Boolean).join(" · "),
  }))

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Strona główna", path: "/" },
              { name: "Galeria", path: "/galeria" },
            ]),
            {
              "@type": "ImageGallery",
              name: content.galleryTitle || "Galeria z wyjazdów",
              url: "https://letsgol.eu/galeria",
              image: lightboxImages.map((item) => ({
                "@type": "ImageObject",
                contentUrl: new URL(item.src, "https://letsgol.eu").toString(),
                caption: item.caption,
              })),
            },
          ],
        }} />
        <SiteHeader />

        <section className="bg-foreground pt-20 text-background">
          <div className="site-container py-14 md:py-18">
            <p className="eyebrow eyebrow-on-dark">Wspomnienia z trybun</p>
            <h1 className="mt-5 text-balance font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
              {content.galleryTitle || "Galeria z wyjazdów"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-background/65 md:text-lg">
              Stadiony, miasta i emocje z naszych piłkarskich podróży.
            </p>
          </div>
        </section>

        {/* GALERIA */}
        <section className="site-container section-space flex flex-col gap-8">
          {gallery.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <figure
                  key={item.id}
                  className="group overflow-hidden rounded-xl border bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
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
                      {item.title && <strong>{item.title}</strong>}

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
        </section>
      </main>

      <SiteFooter content={content} />
    </>
  )
}

