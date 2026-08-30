"use server"

import { createHash, createHmac, timingSafeEqual } from "crypto"
import { and, eq, gt, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/lib/db"
import { inquiries, inquiryAttempts } from "@/lib/db/schema"
import { GENERIC_ERROR, getClientIp, hmac } from "@/lib/security"

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .email()
    .max(160)
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(
      /^[0-9+()\-\s.]+$/,
      "Nieprawidłowy numer telefonu"
    ),

  matchName: z
    .string()
    .trim()
    .min(2)
    .max(160),

  departureCity: z
    .string()
    .trim()
    .min(2)
    .max(100),

  travelers: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(20),

  message: z
    .string()
    .trim()
    .max(1000),

  website: z
    .string()
    .max(200)
    .optional(),

  formLoadedAt: z
    .coerce
    .number()
    .optional(),

  privacyConsent: z
    .literal("on"),

  challenge: z
    .string()
    .min(20)
    .max(500),

  proof: z
    .string()
    .regex(/^\d+$/)
    .max(12),
})

export type InquiryState = {
  status: "idle" | "success" | "error"
  message: string
}

const COOLDOWN_MS = 60_000

const MAX_PER_IP_PER_DAY = 5
const MAX_PER_EMAIL_PER_DAY = 3

const MIN_FILL_TIME_MS = 2_500
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000

const CHALLENGE_MAX_AGE_MS = 10 * 60 * 1000

/*
 * Im więcej zer, tym trudniejsze zadanie.
 *
 * 4 = około 65 tys. prób średnio
 * 5 = około 1 mln
 *
 * 4 jest dobrym kompromisem dla normalnego telefonu/komputera.
 */
const POW_DIFFICULTY = 4

const getChallengeSecret = () => {
  const secret = process.env.INQUIRY_CHALLENGE_SECRET

  if (!secret) {
    throw new Error(
      "Brak INQUIRY_CHALLENGE_SECRET w zmiennych środowiskowych."
    )
  }

  return secret
}

function createChallenge() {
  const timestamp = Date.now()

  const random = cryptoRandom()

  const payload = `${timestamp}.${random}`

  const signature = createHmac(
    "sha256",
    getChallengeSecret()
  )
    .update(payload)
    .digest("hex")

  return `${payload}.${signature}`
}

function cryptoRandom() {
  return createHash("sha256")
    .update(
      `${Date.now()}-${Math.random()}-${process.pid ?? "server"}`
    )
    .digest("hex")
}

function verifyChallenge(challenge: string) {
  const parts = challenge.split(".")

  if (parts.length !== 3) {
    return false
  }

  const [timestampRaw, random, signature] = parts

  if (
    !timestampRaw ||
    !random ||
    !signature
  ) {
    return false
  }

  const timestamp = Number(timestampRaw)

  if (!Number.isFinite(timestamp)) {
    return false
  }

  const age = Date.now() - timestamp

  if (
    age < 0 ||
    age > CHALLENGE_MAX_AGE_MS
  ) {
    return false
  }

  const payload = `${timestamp}.${random}`

  const expected = createHmac(
    "sha256",
    getChallengeSecret()
  )
    .update(payload)
    .digest("hex")

  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  } catch {
    return false
  }
}

function verifyProof(
  challenge: string,
  proof: string
) {
  const hash = createHash("sha256")
    .update(`${challenge}:${proof}`)
    .digest("hex")

  return hash.startsWith(
    "0".repeat(POW_DIFFICULTY)
  )
}

/*
 * Pobranie nowego zadania dla przeglądarki.
 *
 * To nie jest sekret.
 * Sekretem pozostaje INQUIRY_CHALLENGE_SECRET na serwerze.
 */
export async function getInquiryChallenge() {
  try {
    return {
      challenge: createChallenge(),
      difficulty: POW_DIFFICULTY,
    }
  } catch {
    return {
      challenge: "",
      difficulty: POW_DIFFICULTY,
    }
  }
}

export async function createInquiry(
  _: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    matchName: formData.get("matchName"),
    departureCity: formData.get("departureCity"),
    travelers: formData.get("travelers"),
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
    formLoadedAt:
      formData.get("formLoadedAt") ?? undefined,
    privacyConsent:
      formData.get("privacyConsent"),

    challenge: formData.get("challenge"),
    proof: formData.get("proof"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Sprawdź wymagane pola i spróbuj ponownie.",
    }
  }

  /*
   * HONEYPOT
   *
   * Normalny użytkownik nigdy nie powinien
   * wypełnić tego pola.
   */
  if (parsed.data.website) {
    return {
      status: "success",
      message:
        "Dziękujemy. Odezwiemy się z propozycją w ciągu 24 godzin.",
    }
  }

  /*
   * Sprawdzenie wieku formularza.
   */
  const formLoadedAt =
    parsed.data.formLoadedAt

  if (!formLoadedAt) {
    return {
      status: "error",
      message:
        "Nie udało się zweryfikować formularza. Odśwież stronę i spróbuj ponownie.",
    }
  }

  const formAge =
    Date.now() - formLoadedAt

  if (
    formAge < MIN_FILL_TIME_MS
  ) {
    return {
      status: "error",
      message:
        "Formularz wysłano zbyt szybko. Spróbuj ponownie.",
    }
  }

  if (
    formAge > MAX_FORM_AGE_MS
  ) {
    return {
      status: "error",
      message:
        "Formularz wygasł. Odśwież stronę i spróbuj ponownie.",
    }
  }

  /*
   * PROOF OF WORK
   *
   * Przeglądarka musi wykonać obliczenie SHA-256.
   * Bot może to oczywiście zrobić, ale masowe wysyłanie
   * formularzy staje się dużo droższe obliczeniowo.
   */
  if (
    !verifyChallenge(
      parsed.data.challenge
    )
  ) {
    return {
      status: "error",
      message:
        "Weryfikacja formularza nie powiodła się. Odśwież stronę i spróbuj ponownie.",
    }
  }

  if (
    !verifyProof(
      parsed.data.challenge,
      parsed.data.proof
    )
  ) {
    return {
      status: "error",
      message:
        "Nie udało się zweryfikować formularza. Spróbuj ponownie.",
    }
  }

  /*
   * Dodatkowa kontrola źródła żądania.
   *
   * Nie traktujemy jej jako głównej ochrony,
   * ponieważ nie każdy poprawny request musi mieć
   * komplet nagłówków Origin/Referer.
   */
  const requestHeaders = await headers()

  const origin =
    requestHeaders.get("origin")

  const host =
    requestHeaders.get("host")

  if (origin && host) {
    try {
      const originUrl = new URL(origin)

      if (
        originUrl.host !== host
      ) {
        return {
          status: "error",
          message:
            "Nieprawidłowe źródło żądania.",
        }
      }
    } catch {
      return {
        status: "error",
        message:
          "Nieprawidłowe żądanie.",
      }
    }
  }

  const ipHash = hmac(
    getClientIp(requestHeaders)
  )

  const emailHash = hmac(
    parsed.data.email
  )

  const contentHash = hmac(
    `${parsed.data.email}|${parsed.data.matchName}|${parsed.data.message}`
  )

  const oneDayAgo = new Date(
    Date.now() -
      24 * 60 * 60 * 1000
  )

  const cooldownSince = new Date(
    Date.now() - COOLDOWN_MS
  )

  try {
    const [
      recentByIp,
      recentByEmail,
      sameContent,
    ] = await Promise.all([
      db
        .select({
          count:
            sql<number>`count(*)`,
        })
        .from(inquiryAttempts)
        .where(
          and(
            eq(
              inquiryAttempts.ipHash,
              ipHash
            ),
            eq(
              inquiryAttempts.accepted,
              true
            ),
            gt(
              inquiryAttempts.createdAt,
              oneDayAgo
            )
          )
        ),

      db
        .select({
          count:
            sql<number>`count(*)`,
        })
        .from(inquiryAttempts)
        .where(
          and(
            eq(
              inquiryAttempts.emailHash,
              emailHash
            ),
            eq(
              inquiryAttempts.accepted,
              true
            ),
            gt(
              inquiryAttempts.createdAt,
              oneDayAgo
            )
          )
        ),

      db
        .select({
          count:
            sql<number>`count(*)`,
        })
        .from(inquiryAttempts)
        .where(
          and(
            eq(
              inquiryAttempts.contentHash,
              contentHash
            ),
            gt(
              inquiryAttempts.createdAt,
              cooldownSince
            )
          )
        ),
    ])

    if (
      Number(
        sameContent[0]?.count ?? 0
      ) > 0
    ) {
      return {
        status: "error",
        message:
          "To zapytanie zostało już wysłane. Odpowiemy wkrótce.",
      }
    }

    if (
      Number(
        recentByIp[0]?.count ?? 0
      ) >= MAX_PER_IP_PER_DAY ||
      Number(
        recentByEmail[0]?.count ?? 0
      ) >= MAX_PER_EMAIL_PER_DAY
    ) {
      await db
        .insert(inquiryAttempts)
        .values({
          ipHash,
          emailHash,
          contentHash,
          accepted: false,
        })

      return {
        status: "error",
        message:
          "Osiągnięto dzienny limit zapytań. Spróbuj ponownie później.",
      }
    }

    const {
      website,
      formLoadedAt: _formLoadedAt,
      privacyConsent: _privacyConsent,
      challenge: _challenge,
      proof: _proof,
      ...values
    } = parsed.data

    await db
      .insert(inquiries)
      .values({
        ...values,
        consentAcceptedAt:
          new Date(),
      })

    await db
      .insert(inquiryAttempts)
      .values({
        ipHash,
        emailHash,
        contentHash,
        accepted: true,
      })

    return {
      status: "success",
      message:
        "Dziękujemy. Odezwiemy się z propozycją w ciągu 24 godzin.",
    }
  } catch {
    return {
      status: "error",
      message: GENERIC_ERROR,
    }
  }
}