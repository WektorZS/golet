"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { inquiries } from "@/lib/db/schema"

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(160),
  phone: z.string().trim().min(7).max(30),
  matchName: z.string().trim().min(2).max(160),
  departureCity: z.string().trim().min(2).max(100),
  travelers: z.coerce.number().int().min(1).max(20),
  message: z.string().trim().max(1000),
})

export type InquiryState = { status: "idle" | "success" | "error"; message: string }

export async function createInquiry(_: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    matchName: formData.get("matchName"),
    departureCity: formData.get("departureCity"),
    travelers: formData.get("travelers"),
    message: formData.get("message") ?? "",
  })

  if (!parsed.success) {
    return { status: "error", message: "Sprawdź wymagane pola i spróbuj ponownie." }
  }

  try {
    await db.insert(inquiries).values(parsed.data)
    return { status: "success", message: "Dziękujemy. Odezwemy się z propozycją w ciągu 24 godzin." }
  } catch {
    return { status: "error", message: "Nie udało się wysłać zapytania. Spróbuj ponownie później." }
  }
}
