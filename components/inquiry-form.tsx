"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { createInquiry, type InquiryState } from "@/app/actions/inquiries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: InquiryState = { status: "idle", message: "" }

export function InquiryForm() {
  const [state, action, pending] = useActionState(createInquiry, initialState)
  const [formLoadedAt] = useState(() => Date.now())

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Honeypot: hidden from real users via CSS + tabIndex, but bots that fill every field will trip it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0" aria-hidden="true" />
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} />
      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field><FieldLabel htmlFor="name">Imię i nazwisko</FieldLabel><Input id="name" name="name" required autoComplete="name" placeholder="Jan Kowalski" /></Field>
        <Field><FieldLabel htmlFor="phone">Telefon</FieldLabel><Input id="phone" name="phone" required autoComplete="tel" placeholder="+48 500 000 000" /></Field>
        <Field><FieldLabel htmlFor="email">E-mail</FieldLabel><Input id="email" name="email" type="email" required autoComplete="email" placeholder="jan@example.com" /></Field>
        <Field><FieldLabel htmlFor="matchName">Na jaki mecz?</FieldLabel><Input id="matchName" name="matchName" required placeholder="np. Barcelona - Real" /></Field>
        <Field><FieldLabel htmlFor="departureCity">Skąd wylot?</FieldLabel><Input id="departureCity" name="departureCity" required placeholder="Warszawa" /></Field>
        <Field><FieldLabel htmlFor="travelers">Liczba osób</FieldLabel><Input id="travelers" name="travelers" type="number" min="1" max="20" defaultValue="2" required /></Field>
      </FieldGroup>
      <Field><FieldLabel htmlFor="message">Dodatkowe informacje</FieldLabel><Textarea id="message" name="message" rows={4} placeholder="Termin, preferowany standard hotelu, specjalne potrzeby…" /></Field>
      <Field><label htmlFor="privacyConsent" className="flex items-start gap-3 text-sm leading-relaxed"><input id="privacyConsent" name="privacyConsent" type="checkbox" required className="mt-1 size-4 shrink-0" /><span>Wyrażam zgodę na przetwarzanie podanych danych w celu przygotowania oferty i kontaktu w sprawie zapytania. Zapoznałem/am się z <Link href="/polityka-prywatnosci" className="font-medium underline underline-offset-4">polityką prywatności</Link>. *</span></label></Field>
      {state.message && <p role="status" className={state.status === "success" ? "flex items-center gap-2 text-sm text-primary" : "text-sm text-destructive"}>{state.status === "success" && <CheckCircle2 aria-hidden="true" />}{state.message}</p>}
      <Button type="submit" size="lg" className="h-12 w-full rounded-md font-bold uppercase" disabled={pending}>
        {pending ? "Wysyłanie…" : "Wyślij zapytanie"}<ArrowRight data-icon="inline-end" />
      </Button>
      <p className="text-xs leading-relaxed text-background/55">Wysyłając formularz, akceptujesz kontakt w sprawie przygotowania oferty. Nie wysyłamy spamu.</p>
    </form>
  )
}
