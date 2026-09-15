
"use server"

import { and, eq, gt, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/lib/db"
import {
  inquiries,
  inquiryAttempts,
} from "@/lib/db/schema"
import {
  GENERIC_ERROR,
  getClientIp,
  hmac,
} from "@/lib/security"
import { sendInquiryEmails } from "@/lib/email"

const nameRegex =
  /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+$/

const phoneRegex =
  /^\+?\d{7,15}$/

const cityRegex =
  /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+$/

const matchNameRegex =
  /^[\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%&+]+$/u

const messageRegex =
  /^[\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%]+$/u

const commonFields = {
  name: z
    .string()
    .trim()
    .min(2, "Imię i nazwisko jest za krótkie.")
    .max(100, "Imię i nazwisko jest za długie.")
    .regex(
      nameRegex,
      "Imię i nazwisko może zawierać tylko litery, spacje, myślniki i apostrofy."
    ),

  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .max(160, "Adres e-mail jest za długi.")
    .transform((value) =>
      value.toLowerCase()
    ),

  website: z
    .string()
    .max(200)
    .optional(),

  formLoadedAt: z.coerce
    .number()
    .optional(),

  privacyConsent: z
    .string({ error: "Zaznacz zgodę na przetwarzanie danych." })
    .refine((value) => value === "on", {
      message: "Zaznacz zgodę na przetwarzanie danych.",
    }),
}

const requiredPhone = z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "Numer telefonu powinien zawierać od 7 do 15 cyfr. Możesz użyć +48 lub innego kierunkowego."
    )

const optionalPhone = z
  .string()
  .trim()
  .refine((value) => value === "" || phoneRegex.test(value), {
    message: "Podaj poprawny numer telefonu albo pozostaw pole puste.",
  })

const inquirySchema = z.object({
  ...commonFields,
  phone: requiredPhone,

  matchName: z
    .string()
    .trim()
    .min(
      2,
      "Nazwa meczu jest za krótka."
    )
    .max(
      160,
      "Nazwa meczu jest za długa."
    )
    .regex(
      matchNameRegex,
      "Nazwa meczu zawiera niedozwolone znaki."
    ),

  departureCity: z
    .string()
    .trim()
    .min(
      2,
      "Podaj miasto wylotu."
    )
    .max(
      100,
      "Nazwa miasta jest za długa."
    )
    .regex(
      cityRegex,
      "Miasto może zawierać tylko litery, spacje, myślniki i apostrofy."
    ),

  travelers: z.coerce
    .number()
    .int(
      "Liczba osób musi być liczbą całkowitą."
    )
    .min(
      1,
      "Liczba osób musi wynosić co najmniej 1."
    )
    .max(
      99,
      "Maksymalna liczba osób to 99."
    ),

  message: z
    .string()
    .trim()
    .max(
      1000,
      "Wiadomość jest za długa."
    )
    .refine(
      (value) =>
        value === "" ||
        messageRegex.test(value),
      {
        message:
          "Wiadomość zawiera niedozwolone znaki.",
      }
    ),

})

const contactSchema = z.object({
  ...commonFields,
  formType: z.literal("contact"),
  phone: optionalPhone,
  inquiryType: z.enum([
    "trip",
    "booking",
    "group",
    "cooperation",
    "other",
  ]),
  subject: z
    .string()
    .trim()
    .min(2, "Temat jest za krótki.")
    .max(120, "Temat jest za długi."),
  message: z
    .string()
    .trim()
    .min(10, "Wiadomość powinna mieć co najmniej 10 znaków.")
    .max(1000, "Wiadomość jest za długa."),
})

export type InquiryState = {
  status:
    | "idle"
    | "success"
    | "error"
  message: string
  errors?: Record<string, string[] | undefined>
}

const COOLDOWN_MS = 60_000
const MAX_PER_IP_PER_DAY = 5
const MAX_PER_EMAIL_PER_DAY = 3
const MIN_FILL_TIME_MS = 2_500

export async function createInquiry(
  _: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const commonData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      website:
        formData.get("website") ?? "",
      formLoadedAt:
        formData.get("formLoadedAt") ??
        undefined,
      privacyConsent:
        formData.get("privacyConsent"),
  }

  let values: {
    name: string
    email: string
    phone: string
    matchName: string
    departureCity: string
    travelers: number
    message: string
  }
  let website = ""
  let formLoadedAt: number | undefined

  if (formData.get("formType") === "contact") {
    const parsed = contactSchema.safeParse({
      ...commonData,
      formType: "contact",
      inquiryType: formData.get("inquiryType"),
      subject: formData.get("subject"),
      message: formData.get("message") ?? "",
    })

    if (!parsed.success) {
      return {
        status: "error",
        message: "Sprawdź oznaczone pola i spróbuj ponownie.",
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const inquiryLabels = {
      trip: "Pytanie o wyjazd",
      booking: "Rezerwacja",
      group: "Oferta dla grupy",
      cooperation: "Współpraca",
      other: "Inne",
    } as const

    values = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      matchName: `${inquiryLabels[parsed.data.inquiryType]}: ${parsed.data.subject}`.slice(0, 160),
      departureCity: "Nie dotyczy",
      travelers: 1,
      message: parsed.data.message,
    }
    website = parsed.data.website || ""
    formLoadedAt = parsed.data.formLoadedAt
  } else {
    const parsed = inquirySchema.safeParse({
      ...commonData,
      matchName: formData.get("matchName"),
      departureCity: formData.get("departureCity"),
      travelers: formData.get("travelers"),
      message: formData.get("message") ?? "",
    })

    if (!parsed.success) {
      return {
        status: "error",
        message: "Sprawdź poprawność wszystkich pól formularza i spróbuj ponownie.",
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const {
      website: parsedWebsite,
      formLoadedAt: parsedFormLoadedAt,
      privacyConsent: _privacyConsent,
      ...parsedValues
    } = parsed.data

    values = parsedValues
    website = parsedWebsite || ""
    formLoadedAt = parsedFormLoadedAt
  }

  if (website) {
    return {
      status: "success",
      message:
        "Dziękujemy. Odezwiemy się z propozycją w ciągu 24 godzin.",
    }
  }

  if (
    formLoadedAt &&
    Date.now() -
        formLoadedAt <
      MIN_FILL_TIME_MS
  ) {
    return {
      status: "error",
      message:
        "Formularz wysłano zbyt szybko. Spróbuj ponownie za chwilę.",
    }
  }

  const requestHeaders =
    await headers()

  const ipHash = hmac(
    getClientIp(requestHeaders)
  )

  const emailHash = hmac(
    values.email
  )

  const contentHash = hmac(
    `${values.email}|${values.matchName}|${values.message}`
  )

  const oneDayAgo = new Date(
    Date.now() -
      24 * 60 * 60 * 1000
  )

  const cooldownSince = new Date(
    Date.now() -
      COOLDOWN_MS
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
          "Ochrona przed spamem: osiągnięto dzienny limit zapytań. Spróbuj ponownie jutro.",
      }
    }

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

    try {
      await sendInquiryEmails({
        name: values.name,
        email: values.email,
        phone: values.phone,
        matchName:
          values.matchName,
        departureCity:
          values.departureCity,
        travelers:
          values.travelers,
        message:
          values.message,
      })
    } catch (error) {
      console.error(
        "Nie udało się wysłać wiadomości e-mail dla zapytania:",
        error
      )
    }

    return {
      status: "success",
      message:
        "Dziękujemy. Odezwiemy się z propozycją w ciągu 24 godzin.",
    }
  } catch (error) {
    console.error(
      "Błąd podczas zapisywania zapytania:",
      error
    )

    return {
      status: "error",
      message: GENERIC_ERROR,
    }
  }
}
