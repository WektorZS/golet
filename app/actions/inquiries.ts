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

/*
 * IMIĘ I NAZWISKO
 *
 * Dozwolone:
 * - litery łacińskie
 * - polskie znaki
 * - inne znaki z zakresu À-ÿ
 * - spacje
 * - myślnik
 * - apostrof
 */
const nameRegex =
  /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+$/

/*
 * TELEFON
 *
 * Opcjonalny + na początku.
 * Następnie od 7 do 15 cyfr.
 *
 * Przykłady:
 * 500000000
 * +48500000000
 * +49123456789
 * +447123456789
 */
const phoneRegex =
  /^\+?\d{7,15}$/

/*
 * MIASTO
 */
const cityRegex =
  /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+$/

/*
 * NAZWA MECZU
 *
 * Pozwalamy na normalny tekst potrzebny do wpisania
 * nazw drużyn i meczu, ale blokujemy znaki typowe
 * dla HTML, kodu i konstrukcji mogących być problematyczne.
 */
const matchNameRegex =
  /^[\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%&+]+$/u

/*
 * DODATKOWE INFORMACJE
 *
 * Dozwolone:
 * - litery Unicode, również polskie i inne języki
 * - cyfry
 * - spacje
 * - podstawowa interpunkcja
 *
 * Blokowane:
 * < > { } [ ] ` \ |
 *
 * Dzięki temu użytkownik może normalnie napisać np.:
 *
 * "Interesuje mnie hotel 4-gwiazdkowy.
 * Wylot najlepiej z Warszawy! Czy można dostać
 * pokój 2-osobowy?"
 */
const messageRegex =
  /^[\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%]+$/u

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Imię i nazwisko jest za krótkie.")
    .max(
      100,
      "Imię i nazwisko jest za długie."
    )
    .regex(
      nameRegex,
      "Imię i nazwisko może zawierać tylko litery, spacje, myślniki i apostrofy."
    ),

  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .max(
      160,
      "Adres e-mail jest za długi."
    )
    .transform((value) =>
      value.toLowerCase()
    ),

  phone: z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "Numer telefonu powinien zawierać od 7 do 15 cyfr. Możesz użyć +48 lub innego kierunkowego."
    ),

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

  website: z
    .string()
    .max(200)
    .optional(),

  formLoadedAt: z.coerce
    .number()
    .optional(),

  privacyConsent:
    z.literal("on"),
})

export type InquiryState = {
  status:
    | "idle"
    | "success"
    | "error"
  message: string
}

const COOLDOWN_MS = 60_000

// Maksymalnie 5 zaakceptowanych zapytań
// z jednego adresu IP w ciągu 24 godzin.
const MAX_PER_IP_PER_DAY = 5

// Maksymalnie 3 zaakceptowane zapytania
// z jednego adresu e-mail w ciągu 24 godzin.
const MAX_PER_EMAIL_PER_DAY = 3

// Formularz nie może zostać wysłany
// szybciej niż 2,5 sekundy po załadowaniu.
const MIN_FILL_TIME_MS = 2_500

export async function createInquiry(
  _: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const parsed =
    inquirySchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      matchName: formData.get("matchName"),
      departureCity:
        formData.get("departureCity"),
      travelers: formData.get("travelers"),
      message:
        formData.get("message") ?? "",
      website:
        formData.get("website") ?? "",
      formLoadedAt:
        formData.get("formLoadedAt") ??
        undefined,
      privacyConsent:
        formData.get("privacyConsent"),
    })

  /*
   * Wszystkie dane muszą przejść walidację.
   */
  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Sprawdź poprawność wszystkich pól formularza i spróbuj ponownie.",
    }
  }

  /*
   * HONEYPOT
   *
   * Normalny użytkownik nigdy nie powinien
   * wypełnić tego ukrytego pola.
   */
  if (parsed.data.website) {
    return {
      status: "success",
      message:
        "Dziękujemy. Odezwiemy się z propozycją w ciągu 24 godzin.",
    }
  }

  /*
   * OCHRONA PRZED BOTAMI WYSYŁAJĄCYMI
   * FORMULARZ NATYCHMIAST PO JEGO OTWARCIU.
   */
  if (
    parsed.data.formLoadedAt &&
    Date.now() -
        parsed.data.formLoadedAt <
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

  /*
   * IP nie jest przechowywane bezpośrednio.
   * Tworzony jest hash/HMAC.
   */
  const ipHash = hmac(
    getClientIp(requestHeaders)
  )

  /*
   * E-mail również jest hashowany.
   */
  const emailHash = hmac(
    parsed.data.email
  )

  /*
   * Hash treści służy do wykrywania
   * ponownego wysłania tego samego zapytania.
   */
  const contentHash = hmac(
    `${parsed.data.email}|${parsed.data.matchName}|${parsed.data.message}`
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
    /*
     * Sprawdzamy jednocześnie:
     *
     * 1. Ile zaakceptowanych zapytań
     *    wysłano z tego IP w ostatnich 24 h.
     *
     * 2. Ile zaakceptowanych zapytań
     *    wysłano z tego e-maila w ostatnich 24 h.
     *
     * 3. Czy identyczne zapytanie
     *    było wysłane w ostatniej minucie.
     */
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

    /*
     * TEN SAM CONTENT W OSTATNIEJ MINUCIE
     */
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

    /*
     * LIMIT ANTYSPAMOWY
     *
     * 5 zapytań / IP / 24h
     * LUB
     * 3 zapytania / e-mail / 24h
     */
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

    /*
     * Pola techniczne nie są zapisywane
     * jako część zapytania.
     */
    const {
      website,
      formLoadedAt,
      privacyConsent,
      ...values
    } = parsed.data

    /*
     * ZAPIS ZAPYTANIA
     */
    await db
      .insert(inquiries)
      .values({
        ...values,
        consentAcceptedAt:
          new Date(),
      })

    /*
     * Zapisujemy zaakceptowaną próbę
     * do systemu antyspamowego.
     */
    await db
      .insert(inquiryAttempts)
      .values({
        ipHash,
        emailHash,
        contentHash,
        accepted: true,
      })

    /*
     * Wysyłka e-maili nie blokuje
     * zapisania zapytania.
     */
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