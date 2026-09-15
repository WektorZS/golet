"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, Check, CheckCircle2 } from "lucide-react"

import { createInquiry, type InquiryState } from "@/app/actions/inquiries"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialState: InquiryState = { status: "idle", message: "" }
const inputClassName =
  "h-12 rounded-lg border-white/20 bg-white/[0.04] px-4 text-white placeholder:text-white/30 hover:border-white/35 focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:border-red-400"

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null

  return (
    <p id={id} className="mt-1 text-sm text-red-300">
      {errors[0]}
    </p>
  )
}

export function ContactForm() {
  const [state, action, pending] = useActionState(createInquiry, initialState)
  const [formLoadedAt] = useState(() => Date.now())
  const [consent, setConsent] = useState(false)
  const [messageLength, setMessageLength] = useState(0)

  if (state.status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-xl border border-primary/30 bg-primary/10 p-7 md:p-10" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-sans text-3xl font-black uppercase text-white">Wiadomość wysłana</h2>
        <p className="mt-3 max-w-lg leading-7 text-white/70">{state.message}</p>
      </div>
    )
  }

  const errors = state.errors || {}

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="formType" value="contact" />
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="contact-name" className="text-white">Imię i nazwisko</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClassName}
            placeholder="Jan Kowalski"
          />
          <FieldError id="contact-name-error" errors={errors.name} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email" className="text-white">E-mail</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClassName}
            placeholder="jan@example.com"
          />
          <FieldError id="contact-email-error" errors={errors.email} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-phone" className="text-white">
            Telefon <span className="font-normal text-white/45">opcjonalnie</span>
          </FieldLabel>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={16}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={inputClassName}
            placeholder="+48500000000"
          />
          <FieldError id="contact-phone-error" errors={errors.phone} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-type" className="text-white">Typ zapytania</FieldLabel>
          <select
            id="contact-type"
            name="inquiryType"
            defaultValue="trip"
            className={`${inputClassName} w-full appearance-none pr-10`}
            aria-invalid={Boolean(errors.inquiryType)}
          >
            <option value="trip" className="bg-foreground">Pytanie o wyjazd</option>
            <option value="booking" className="bg-foreground">Rezerwacja</option>
            <option value="group" className="bg-foreground">Oferta dla grupy</option>
            <option value="cooperation" className="bg-foreground">Współpraca</option>
            <option value="other" className="bg-foreground">Inne</option>
          </select>
          <FieldError id="contact-type-error" errors={errors.inquiryType} />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="contact-subject" className="text-white">Temat</FieldLabel>
        <Input
          id="contact-subject"
          name="subject"
          maxLength={120}
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          className={inputClassName}
          placeholder="Którego wyjazdu dotyczy wiadomość?"
        />
        <FieldError id="contact-subject-error" errors={errors.subject} />
      </Field>

      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="contact-message" className="text-white">Wiadomość</FieldLabel>
          <span className="font-mono text-[11px] text-white/45" aria-live="polite">
            {messageLength}/1000
          </span>
        </div>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          minLength={10}
          maxLength={1000}
          required
          onChange={(event) => setMessageLength(event.target.value.length)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="min-h-36 resize-y rounded-lg border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 hover:border-white/35 focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:border-red-400"
          placeholder="Napisz, w czym możemy pomóc. Im więcej szczegółów podasz, tym konkretniej odpowiemy."
        />
        <FieldError id="contact-message-error" errors={errors.message} />
      </Field>

      <Field>
        <label htmlFor="contact-consent" className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/65">
          <span className="relative mt-1 flex size-[18px] shrink-0">
            <input
              id="contact-consent"
              name="privacyConsent"
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              aria-invalid={Boolean(errors.privacyConsent)}
              aria-describedby={errors.privacyConsent ? "contact-consent-error" : undefined}
              className="peer absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="flex size-[18px] items-center justify-center rounded border border-white/40 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
              <Check className={`size-3.5 text-black ${consent ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
            </span>
          </span>
          <span>
            Zgadzam się na przetwarzanie danych w celu obsługi zapytania. Zapoznałem się z{" "}
            <Link href="/polityka-prywatnosci" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:text-primary">
              polityką prywatności
            </Link>
            .
          </span>
        </label>
        <FieldError id="contact-consent-error" errors={errors.privacyConsent} />
      </Field>

      {state.status === "error" ? (
        <p className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-12 w-full px-6 font-bold uppercase sm:w-auto" disabled={pending}>
        {pending ? "Wysyłanie..." : "Wyślij wiadomość"}
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  )
}
