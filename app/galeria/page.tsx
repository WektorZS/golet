
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImageLightbox } from "@/components/image-lightbox"
import { Button } from "@/components/ui/button"
import { getPublishedGallery, getSiteContent } from "@/lib/content"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeria z wyjazdów | Let's Gol",
  description:
    "Zobacz zdjęcia z piłkarskich wyjazdów organizowanych przez Let's Gol.",
}

export default async function GalleryPage() {
  const [gallery, content] = await Promise.all([
    getPublishedGallery(),
    getSiteContent(),
  ])

  // Cała lista zdjęć przekazywana do lightboxa
  const lightboxImages = gallery.map((item) => ({
    src: item.mediaId ? `/api/media/${item.mediaId}` : item.image,
    alt: item.alt || item.title || "Zdjęcie z wyjazdu Let's Gol",
    caption: [item.title, item.city].filter(Boolean).join(" · "),
  }))

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background text-foreground">
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
          <header className="flex flex-col items-start gap-4">
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft data-icon="inline-start" />
              Wróć na stronę główną
            </Button>

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
          </header>

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

