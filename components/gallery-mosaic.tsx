"use client"

import {
  useState,
  type SyntheticEvent,
} from "react"
import Image from "next/image"

import { ImageLightbox } from "@/components/image-lightbox"

type ImageShape =
  | "portrait"
  | "square"
  | "landscape"
  | "panorama"

type ImageMetrics = {
  shape: ImageShape
  ratio: number
}

export type GalleryMosaicItem = {
  id: string
  src: string
  alt: string
}

type IndexedGalleryItem = GalleryMosaicItem & {
  originalIndex: number
}

const DEFAULT_METRICS: ImageMetrics = {
  shape: "landscape",
  ratio: 1.5,
}

function detectImageMetrics(
  width: number,
  height: number,
): ImageMetrics {
  if (!width || !height) {
    return DEFAULT_METRICS
  }

  const ratio = width / height

  if (ratio >= 1.9) {
    return {
      shape: "panorama",
      ratio,
    }
  }

  if (ratio >= 1.15) {
    return {
      shape: "landscape",
      ratio,
    }
  }

  if (ratio <= 0.8) {
    return {
      shape: "portrait",
      ratio,
    }
  }

  return {
    shape: "square",
    ratio,
  }
}

function getGroupClass(count: number) {
  if (count === 4) {
    return "grid h-96 grid-cols-2 grid-rows-6 gap-0 sm:h-128 lg:h-80 lg:grid-cols-12 lg:grid-rows-4"
  }

  if (count === 3) {
    return "grid h-80 grid-cols-2 grid-rows-4 gap-0 sm:h-96 lg:h-72 lg:grid-cols-12 lg:grid-rows-4"
  }

  if (count === 2) {
    return "grid h-52 grid-cols-2 grid-rows-1 gap-0 sm:h-72 lg:h-64 lg:grid-cols-12 lg:grid-rows-4"
  }

  return "grid h-56 grid-cols-1 grid-rows-1 gap-0 sm:h-80 lg:h-64 lg:grid-cols-12 lg:grid-rows-4"
}

function getMobileTileClass(
  count: number,
  index: number,
) {
  if (count === 4) {
    const classes = [
      "col-start-1 col-span-2 row-start-1 row-span-2",
      "col-start-1 col-span-1 row-start-3 row-span-2",
      "col-start-2 col-span-1 row-start-3 row-span-2",
      "col-start-1 col-span-2 row-start-5 row-span-2",
    ]

    return classes[index]
  }

  if (count === 3) {
    const classes = [
      "col-start-1 col-span-2 row-start-1 row-span-2",
      "col-start-1 col-span-1 row-start-3 row-span-2",
      "col-start-2 col-span-1 row-start-3 row-span-2",
    ]

    return classes[index]
  }

  if (count === 2) {
    return index === 0
      ? "col-start-1 col-span-1 row-start-1"
      : "col-start-2 col-span-1 row-start-1"
  }

  return "col-start-1 col-span-1 row-start-1"
}

function getMetrics(
  item: IndexedGalleryItem,
  metrics: Record<string, ImageMetrics>,
) {
  return metrics[item.id] ?? DEFAULT_METRICS
}

function getDesktopLayoutForFour(
  group: IndexedGalleryItem[],
  metrics: Record<string, ImageMetrics>,
  reverse: boolean,
) {
  const sortedByRatio = [...group].sort(
    (a, b) =>
      getMetrics(a, metrics).ratio -
      getMetrics(b, metrics).ratio,
  )

  const narrowest = sortedByRatio[0]
  const widest =
    sortedByRatio[sortedByRatio.length - 1]

  const narrowestRatio =
    getMetrics(narrowest, metrics).ratio

  const widestRatio =
    getMetrics(widest, metrics).ratio

  const layout: Record<string, string> = {}

  if (widestRatio >= 1.9) {
    const remaining = group.filter(
      (item) => item.id !== widest.id,
    )

    layout[widest.id] = reverse
      ? "lg:col-start-1 lg:col-span-12 lg:row-start-3 lg:row-span-2"
      : "lg:col-start-1 lg:col-span-12 lg:row-start-1 lg:row-span-2"

    const rowStart = reverse ? 1 : 3

    layout[remaining[0].id] =
      `lg:col-start-1 lg:col-span-4 lg:row-start-${rowStart} lg:row-span-2`

    layout[remaining[1].id] =
      `lg:col-start-5 lg:col-span-4 lg:row-start-${rowStart} lg:row-span-2`

    layout[remaining[2].id] =
      `lg:col-start-9 lg:col-span-4 lg:row-start-${rowStart} lg:row-span-2`

    return layout
  }

  if (narrowestRatio <= 0.8) {
    const remaining = group.filter(
      (item) => item.id !== narrowest.id,
    )

    const remainingSorted = [...remaining].sort(
      (a, b) =>
        getMetrics(b, metrics).ratio -
        getMetrics(a, metrics).ratio,
    )

    const widestRemaining = remainingSorted[0]

    const smallItems = remaining.filter(
      (item) => item.id !== widestRemaining.id,
    )

    if (reverse) {
      layout[narrowest.id] =
        "lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-4"

      layout[smallItems[0].id] =
        "lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2"

      layout[smallItems[1].id] =
        "lg:col-start-5 lg:col-span-4 lg:row-start-1 lg:row-span-2"

      layout[widestRemaining.id] =
        "lg:col-start-1 lg:col-span-8 lg:row-start-3 lg:row-span-2"
    } else {
      layout[narrowest.id] =
        "lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-4"

      layout[smallItems[0].id] =
        "lg:col-start-5 lg:col-span-4 lg:row-start-1 lg:row-span-2"

      layout[smallItems[1].id] =
        "lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-2"

      layout[widestRemaining.id] =
        "lg:col-start-5 lg:col-span-8 lg:row-start-3 lg:row-span-2"
    }

    return layout
  }

  const slots = reverse
    ? [
        "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2",
        "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2",
        "lg:col-start-7 lg:col-span-6 lg:row-start-3 lg:row-span-2",
        "lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-2",
      ]
    : [
        "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2",
        "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2",
        "lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-2",
        "lg:col-start-7 lg:col-span-6 lg:row-start-3 lg:row-span-2",
      ]

  group.forEach((item, index) => {
    layout[item.id] = slots[index]
  })

  return layout
}

function getDesktopLayoutForThree(
  group: IndexedGalleryItem[],
  metrics: Record<string, ImageMetrics>,
  reverse: boolean,
) {
  const sortedByRatio = [...group].sort(
    (a, b) =>
      getMetrics(a, metrics).ratio -
      getMetrics(b, metrics).ratio,
  )

  const narrowest = sortedByRatio[0]
  const widest =
    sortedByRatio[sortedByRatio.length - 1]

  const widestRatio =
    getMetrics(widest, metrics).ratio

  const layout: Record<string, string> = {}

  if (widestRatio >= 1.9) {
    const remaining = group.filter(
      (item) => item.id !== widest.id,
    )

    layout[widest.id] = reverse
      ? "lg:col-start-1 lg:col-span-12 lg:row-start-3 lg:row-span-2"
      : "lg:col-start-1 lg:col-span-12 lg:row-start-1 lg:row-span-2"

    const rowStart = reverse ? 1 : 3

    layout[remaining[0].id] =
      `lg:col-start-1 lg:col-span-6 lg:row-start-${rowStart} lg:row-span-2`

    layout[remaining[1].id] =
      `lg:col-start-7 lg:col-span-6 lg:row-start-${rowStart} lg:row-span-2`

    return layout
  }

  const remaining = group.filter(
    (item) => item.id !== narrowest.id,
  )

  if (reverse) {
    layout[narrowest.id] =
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-4"

    layout[remaining[0].id] =
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2"

    layout[remaining[1].id] =
      "lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-2"
  } else {
    layout[narrowest.id] =
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-4"

    layout[remaining[0].id] =
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2"

    layout[remaining[1].id] =
      "lg:col-start-7 lg:col-span-6 lg:row-start-3 lg:row-span-2"
  }

  return layout
}

function getDesktopLayoutForTwo(
  group: IndexedGalleryItem[],
  metrics: Record<string, ImageMetrics>,
) {
  const firstMetrics = getMetrics(
    group[0],
    metrics,
  )

  const secondMetrics = getMetrics(
    group[1],
    metrics,
  )

  const shouldStack =
    firstMetrics.shape === "panorama" ||
    secondMetrics.shape === "panorama"

  if (shouldStack) {
    return {
      [group[0].id]:
        "lg:col-start-1 lg:col-span-12 lg:row-start-1 lg:row-span-2",
      [group[1].id]:
        "lg:col-start-1 lg:col-span-12 lg:row-start-3 lg:row-span-2",
    }
  }

  return {
    [group[0].id]:
      "lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-4",
    [group[1].id]:
      "lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-4",
  }
}

function getDesktopLayout(
  group: IndexedGalleryItem[],
  metrics: Record<string, ImageMetrics>,
  reverse: boolean,
) {
  if (group.length === 4) {
    return getDesktopLayoutForFour(
      group,
      metrics,
      reverse,
    )
  }

  if (group.length === 3) {
    return getDesktopLayoutForThree(
      group,
      metrics,
      reverse,
    )
  }

  if (group.length === 2) {
    return getDesktopLayoutForTwo(
      group,
      metrics,
    )
  }

  return {
    [group[0].id]:
      "lg:col-start-1 lg:col-span-12 lg:row-start-1 lg:row-span-4",
  }
}

function getMobileSize(
  count: number,
  index: number,
) {
  if (count === 4) {
    return [
      "100vw",
      "50vw",
      "50vw",
      "100vw",
    ][index]
  }

  if (count === 3) {
    return [
      "100vw",
      "50vw",
      "50vw",
    ][index]
  }

  if (count === 2) {
    return "50vw"
  }

  return "100vw"
}

function getImageSizes(
  count: number,
  index: number,
) {
  return `(max-width: 1023px) ${getMobileSize(
    count,
    index,
  )}, 50vw`
}

export function GalleryMosaic({
  items,
}: {
  items: GalleryMosaicItem[]
}) {
  const [metrics, setMetrics] = useState<
    Record<string, ImageMetrics>
  >({})

  const indexedItems: IndexedGalleryItem[] =
    items.map((item, index) => ({
      ...item,
      originalIndex: index,
    }))

  const lightboxImages = items.map(
    ({ src, alt }) => ({
      src,
      alt,
    }),
  )

  const groups = Array.from(
    {
      length: Math.ceil(
        indexedItems.length / 4,
      ),
    },
    (_, groupIndex) =>
      indexedItems.slice(
        groupIndex * 4,
        groupIndex * 4 + 4,
      ),
  )

  const handleImageLoad = (
    id: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget

    const nextMetrics =
      detectImageMetrics(
        image.naturalWidth,
        image.naturalHeight,
      )

    setMetrics((current) => {
      const previous =
        current[id]

      if (
        previous?.shape ===
          nextMetrics.shape &&
        previous?.ratio ===
          nextMetrics.ratio
      ) {
        return current
      }

      return {
        ...current,
        [id]: nextMetrics,
      }
    })
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-0 lg:max-w-5xl lg:px-6 xl:max-w-6xl">
      <div className="overflow-hidden rounded-xl sm:rounded-none lg:rounded-xl">
        {groups.map(
          (group, groupIndex) => {
            const reverse =
              groupIndex % 2 === 1

            const desktopLayout =
              getDesktopLayout(
                group,
                metrics,
                reverse,
              )

            return (
              <div
                key={
                  group[0]?.id ??
                  groupIndex
                }
                className={getGroupClass(
                  group.length,
                )}
              >
                {group.map(
                  (
                    item,
                    localIndex,
                  ) => {
                    return (
                      <figure
                        key={
                          item.id
                        }
                        className={`${getMobileTileClass(
                          group.length,
                          localIndex,
                        )} ${
                          desktopLayout[
                            item.id
                          ]
                        } group relative isolate m-0 overflow-hidden bg-black`}
                      >
                        <ImageLightbox
                          src={
                            item.src
                          }
                          alt={
                            item.alt
                          }
                          images={
                            lightboxImages
                          }
                          initialIndex={
                            item.originalIndex
                          }
                          priority={
                            item.originalIndex <
                            4
                          }
                        >
                          <Image
                            src={
                              item.src
                            }
                            alt={
                              item.alt
                            }
                            fill
                            priority={
                              item.originalIndex <
                              4
                            }
                            sizes={getImageSizes(
                              group.length,
                              localIndex,
                            )}
                            onLoad={(
                              event,
                            ) =>
                              handleImageLoad(
                                item.id,
                                event,
                              )
                            }
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
    </div>
  )
}