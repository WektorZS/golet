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

export type GalleryMosaicItem = {
  id: string
  src: string
  alt: string
}

function detectImageShape(
  width: number,
  height: number,
): ImageShape {
  if (!width || !height) {
    return "landscape"
  }

  const ratio = width / height

  if (ratio >= 1.9) {
    return "panorama"
  }

  if (ratio >= 1.15) {
    return "landscape"
  }

  if (ratio <= 0.8) {
    return "portrait"
  }

  return "square"
}

function getMobileGroupClass(count: number) {
  if (count === 4) {
    return "grid h-96 grid-cols-2 grid-rows-6 gap-0 sm:h-128"
  }

  if (count === 3) {
    return "grid h-80 grid-cols-2 grid-rows-4 gap-0 sm:h-96"
  }

  if (count === 2) {
    return "grid h-52 grid-cols-2 grid-rows-1 gap-0 sm:h-72"
  }

  return "grid h-56 grid-cols-1 grid-rows-1 gap-0 sm:h-80"
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

function getDesktopTileClass(
  shape: ImageShape,
  index: number,
) {
  switch (shape) {
    case "portrait":
      return "lg:col-span-3 lg:row-span-4"

    case "square":
      return "lg:col-span-3 lg:row-span-3"

    case "panorama":
      return index % 2 === 0
        ? "lg:col-span-8 lg:row-span-2"
        : "lg:col-span-9 lg:row-span-2"

    case "landscape":
    default:
      return index % 3 === 0
        ? "lg:col-span-6 lg:row-span-3"
        : "lg:col-span-5 lg:row-span-3"
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

function getDesktopSize(shape: ImageShape) {
  switch (shape) {
    case "portrait":
    case "square":
      return "25vw"

    case "panorama":
      return "70vw"

    case "landscape":
    default:
      return "50vw"
  }
}

function getImageSizes(
  count: number,
  index: number,
  shape: ImageShape,
) {
  return `(max-width: 1023px) ${getMobileSize(
    count,
    index,
  )}, ${getDesktopSize(shape)}`
}

export function GalleryMosaic({
  items,
}: {
  items: GalleryMosaicItem[]
}) {
  const [shapes, setShapes] = useState<
    Record<string, ImageShape>
  >({})

  const lightboxImages = items.map(
    ({ src, alt }) => ({
      src,
      alt,
    }),
  )

  const groups = Array.from(
    {
      length: Math.ceil(items.length / 4),
    },
    (_, groupIndex) =>
      items.slice(
        groupIndex * 4,
        groupIndex * 4 + 4,
      ),
  )

  const handleImageLoad = (
    id: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget

    const shape = detectImageShape(
      image.naturalWidth,
      image.naturalHeight,
    )

    setShapes((current) => {
      if (current[id] === shape) {
        return current
      }

      return {
        ...current,
        [id]: shape,
      }
    })
  }

  let globalIndex = 0

  return (
    <div className="mx-auto w-full px-4 sm:px-0 lg:max-w-5xl lg:px-6 xl:max-w-6xl">
      <div className="overflow-hidden rounded-xl sm:rounded-none lg:grid lg:grid-flow-row-dense lg:grid-cols-12 lg:auto-rows-[96px] xl:auto-rows-[104px]">
        {groups.map(
          (group, groupIndex) => (
            <div
              key={
                group[0]?.id ??
                groupIndex
              }
              className={`${getMobileGroupClass(
                group.length,
              )} lg:contents`}
            >
              {group.map(
                (item, localIndex) => {
                  const itemIndex =
                    globalIndex++

                  const shape =
                    shapes[item.id] ??
                    "landscape"

                  return (
                    <figure
                      key={item.id}
                      className={`${getMobileTileClass(
                        group.length,
                        localIndex,
                      )} ${getDesktopTileClass(
                        shape,
                        itemIndex,
                      )} group relative isolate m-0 overflow-hidden bg-section-light lg:col-start-auto lg:row-start-auto`}
                    >
                      <ImageLightbox
                        src={item.src}
                        alt={item.alt}
                        images={
                          lightboxImages
                        }
                        initialIndex={
                          itemIndex
                        }
                        priority={
                          itemIndex < 4
                        }
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          priority={
                            itemIndex < 4
                          }
                          sizes={getImageSizes(
                            group.length,
                            localIndex,
                            shape,
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
          ),
        )}
      </div>
    </div>
  )
}