import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/require-admin"
import { db } from "@/lib/db"
import { inquiries } from "@/lib/db/schema"

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`

export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt))
  const header = ["ID", "Data", "Imię", "E-mail", "Telefon", "Mecz", "Miasto wylotu", "Liczba osób", "Wiadomość", "Status", "Notatka"]
  const body = rows.map((row) => [row.id, row.createdAt.toISOString(), row.name, row.email, row.phone, row.matchName, row.departureCity, row.travelers, row.message, row.status, row.adminNote].map(csv).join(";"))
  const content = `\uFEFF${header.map(csv).join(";")}\n${body.join("\n")}`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zapytania-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  })
}
