import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImageLightbox } from "@/components/image-lightbox"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { getPublishedGallery, getSiteContent } from "@/lib/content"
import { SiteFooter } from "@/components/site-footer"
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
  const [gallery, content] = await Promise.all([
    getPublishedGallery(),
    getSiteContent(),
  ])

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
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b bg-foreground text-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
            <Button
              variant="ghost"
              className="text-background hover:bg-background/10 hover:text-background"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft data-icon="inline-start" />
              Strona główna
            </Button>

            <Link
              href="/"
              className="font-sans text-xl font-black uppercase"
            >
              Let&apos;s Gol{" "}
              <span className="text-primary">/ Galeria</span>
            </Link>
          </div>
        </header>

        {/* GALERIA */}
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Wspomnienia z trybun
            </p>

            <h1 className="text-balance font-sans text-4xl font-black uppercase md:text-6xl">
              {content.galleryTitle || "Galeria z wyjazdów"}
            </h1>

            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Wszystkie opublikowane zdjęcia z naszych piłkarskich podróży w
              jednym miejscu.
            </p>
          </div>

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

