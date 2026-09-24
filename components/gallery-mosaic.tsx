"use client"

import {
  useState,
  type CSSProperties,
  type SyntheticEvent,
} from "react"
import Image from "next/image"

import { ImageLightbox } from "@/components/image-lightbox"

export type GalleryMosaicItem = {
  id: string
  src: string
  alt: string
}

type IndexedGalleryItem = GalleryMosaicItem & {
  originalIndex: number
}

const DEFAULT_RATIO = 1.5

function getMobileGroupClass(count: number) {
  if (count === 4) {
    return "grid h-96 grid-cols-2 grid-rows-6 gap-1.5 sm:h-128"
  }

  if (count === 3) {
    return "grid h-80 grid-cols-2 grid-rows-4 gap-1.5 sm:h-96"
  }

  if (count === 2) {
    return "grid h-52 grid-cols-2 grid-rows-1 gap-1.5 sm:h-72"
  }

  return "grid h-56 grid-cols-1 grid-rows-1 gap-1.5 sm:h-80"
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

function getGroupStyle(
  group: IndexedGalleryItem[],
  ratios: Record<string, number>,
): CSSProperties {
  const groupRatios = group.map(
    (item) =>
      ratios[item.id] ??
      DEFAULT_RATIO,
  )

  const totalRatio =
    groupRatios.reduce(
      (sum, ratio) =>
        sum + ratio,
      0,
    )

  const columns =
    groupRatios
      .map(
        (ratio) =>
          `${ratio}fr`,
      )
      .join(" ")

  return {
    "--desktop-columns":
      columns,
    "--desktop-aspect": `${totalRatio} / 1`,
  } as CSSProperties
}

export function GalleryMosaic({
  items,
}: {
  items: GalleryMosaicItem[]
}) {
  const [
    ratios,
    setRatios,
  ] = useState<
    Record<string, number>
  >({})

  const indexedItems:
    IndexedGalleryItem[] =
    items.map(
      (item, index) => ({
        ...item,
        originalIndex:
          index,
      }),
    )

  const lightboxImages =
    items.map(
      ({ src, alt }) => ({
        src,
        alt,
      }),
    )

  const groups =
    Array.from(
      {
        length:
          Math.ceil(
            indexedItems.length /
              4,
          ),
      },
      (_, groupIndex) =>
        indexedItems.slice(
          groupIndex * 4,
          groupIndex * 4 +
            4,
        ),
    )

  const handleImageLoad = (
    id: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image =
      event.currentTarget

    if (
      !image.naturalWidth ||
      !image.naturalHeight
    ) {
      return
    }

    const ratio =
      Math.round(
        (image.naturalWidth /
          image.naturalHeight) *
          1000,
      ) / 1000

    setRatios(
      (current) => {
        const previous =
          current[id]

        if (
          previous &&
          Math.abs(
            previous -
              ratio,
          ) < 0.001
        ) {
          return current
        }

        return {
          ...current,
          [id]: ratio,
        }
      },
    )
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-0 lg:max-w-5xl lg:px-6 xl:max-w-6xl">
      <div className="flex flex-col gap-1.5 overflow-hidden rounded-xl bg-section-light p-1.5 sm:rounded-none lg:rounded-xl">
        {groups.map(
          (
            group,
            groupIndex,
          ) => {
            const groupStyle =
              getGroupStyle(
                group,
                ratios,
              )

            return (
              <div
                key={
                  group[0]
                    ?.id ??
                  groupIndex
                }
                style={
                  groupStyle
                }
                className={`${getMobileGroupClass(
                  group.length,
                )} lg:h-auto lg:grid-rows-1 lg:[aspect-ratio:var(--desktop-aspect)] lg:[grid-template-columns:var(--desktop-columns)]`}
              >
                {group.map(
                  (
                    item,
                    localIndex,
                  ) => (
                    <figure
                      key={
                        item.id
                      }
                      className={`${getMobileTileClass(
                        group.length,
                        localIndex,
                      )} group relative isolate m-0 overflow-hidden bg-black lg:col-auto lg:row-auto lg:col-span-1 lg:row-span-1`}
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
                  ),
                )}
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}