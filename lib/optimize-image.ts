import sharp from "sharp"

const MAX_INPUT_SIZE = 15 * 1024 * 1024
const MAX_DIMENSION = 1600
const MAX_TEAM_LOGO_DIMENSION = 128
const TEAM_LOGO_PADDING = 8
const MAX_INPUT_PIXELS = 40_000_000

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const

type AllowedImageType = (typeof allowedTypes)[number]

function detectImageType(bytes: Uint8Array): AllowedImageType | null {
  if (
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg"
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png"
  }

  if (
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp"
  }

  if (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    return "image/avif"
  }

  return null
}

type OptimizeOptions = {
  maxDimension?: number
  pathnamePrefix?: string
  teamLogo?: boolean
}

async function optimizeImage(file: File, options: OptimizeOptions = {}) {
  if (file.size === 0) {
    throw new Error("Wybierz plik")
  }

  if (file.size > MAX_INPUT_SIZE) {
    throw new Error("Zdjęcie może mieć maksymalnie 15 MB")
  }

  if (!allowedTypes.includes(file.type as AllowedImageType)) {
    throw new Error("Dozwolone formaty: JPEG, PNG, WebP i AVIF")
  }

  if (options.teamLogo && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Herb musi być plikiem JPG, PNG lub WebP")
  }

  const input = Buffer.from(await file.arrayBuffer())

  const detectedType = detectImageType(input.subarray(0, 16))

  if (!detectedType || detectedType !== file.type) {
    throw new Error("Zawartość zdjęcia nie zgadza się z jego formatem")
  }

  const image = sharp(input, {
    failOn: "warning",
    limitInputPixels: MAX_INPUT_PIXELS,
    sequentialRead: true,
  })

  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error("Nie udało się odczytać wymiarów zdjęcia")
  }

  let prepared = image.rotate()

  if (options.teamLogo) {
    const transparent = { r: 0, g: 0, b: 0, alpha: 0 }
    const trimOptions = detectedType === "image/jpeg"
      ? { background: "#ffffff", threshold: 12 }
      : { background: transparent, threshold: 8 }

    prepared = prepared
      .trim(trimOptions)
      .resize({
        width: MAX_TEAM_LOGO_DIMENSION - TEAM_LOGO_PADDING * 2,
        height: MAX_TEAM_LOGO_DIMENSION - TEAM_LOGO_PADDING * 2,
        fit: "contain",
        background: transparent,
        kernel: sharp.kernel.lanczos3,
      })
      .extend({
        top: TEAM_LOGO_PADDING,
        bottom: TEAM_LOGO_PADDING,
        left: TEAM_LOGO_PADDING,
        right: TEAM_LOGO_PADDING,
        background: transparent,
      })
  } else {
    prepared = prepared.resize({
      width: options.maxDimension ?? MAX_DIMENSION,
      height: options.maxDimension ?? MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
  }

  const { data, info } = await prepared
    .webp({
      quality: options.teamLogo ? 88 : 75,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer({
      resolveWithObject: true,
    })

  return {
    data,
    contentType: "image/webp" as const,
    size: data.byteLength,
    width: info.width,
    height: info.height,
    pathname: `${options.pathnamePrefix ?? "admin"}/${crypto.randomUUID()}.webp`,
  }
}

export function optimizeUploadedImage(file: File) {
  return optimizeImage(file)
}

export function optimizeTeamLogo(file: File) {
  return optimizeImage(file, {
    maxDimension: MAX_TEAM_LOGO_DIMENSION,
    pathnamePrefix: "admin/team-logos",
    teamLogo: true,
  })
}
