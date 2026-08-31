"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import {
  createInquiry,
  type InquiryState,
} from "@/app/actions/inquiries"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const initialState: InquiryState = {
  status: "idle",
  message: "",
}

const MESSAGE_MAX_LENGTH = 1000

export function InquiryForm({
  matchName = "",
}: {
  matchName?: string
}) {
  const [state, action, pending] = useActionState(
    createInquiry,
    initialState
  )

  const [formLoadedAt] = useState(() => Date.now())

  const [messageLength, setMessageLength] = useState(0)

  const hasSelectedTrip = Boolean(matchName.trim())

  const handleNameInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    event.currentTarget.value =
      event.currentTarget.value.replace(
        /[^A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]/g,
        ""
      )
  }

  const handlePhoneInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget

    // Pozwalamy na + tylko jako pierwszy znak.
    let value = input.value.replace(/[^\d+]/g, "")

    if (value.includes("+")) {
      value =
        (value.startsWith("+") ? "+" : "") +
        value.replace(/\+/g, "")
    }

    // Maksymalnie 15 cyfr + opcjonalny znak +
    const hasPlus = value.startsWith("+")
    const digits = value.replace(/\D/g, "").slice(0, 15)

    input.value = hasPlus
      ? `+${digits}`
      : digits
  }

  const handleMatchNameInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    event.currentTarget.value =
      event.currentTarget.value.replace(
        /[<>{}`[\]\\]/g,
        ""
      )
  }

  const handleDepartureCityInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    event.currentTarget.value =
      event.currentTarget.value.replace(
        /[^A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]/g,
        ""
      )
  }

  const handleMessageInput = (
    event: FormEvent<HTMLTextAreaElement>
  ) => {
    const input = event.currentTarget

    /*
     * Dozwolone:
     * - litery, również polskie i inne znaki Unicode
     * - cyfry
     * - spacje i białe znaki
     * - podstawowa interpunkcja
     *
     * Usuwamy znaki mogące być użyte w kodzie/znacznikach:
     * < > { } [ ] ` \ | oraz znaki sterujące.
     */
    const sanitized = input.value
      .replace(/[<>{}`[\]\\|]/g, "")
      .replace(
        /[^\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%]/gu,
        ""
      )
      .slice(0, MESSAGE_MAX_LENGTH)

    input.value = sanitized
    setMessageLength(sanitized.length)
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Honeypot antyspamowy */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <input
        type="hidden"
        name="formLoadedAt"
        value={formLoadedAt}
      />

      {hasSelectedTrip && (
        <input
          type="hidden"
          name="matchName"
          value={matchName}
        />
      )}

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        {/* IMIĘ I NAZWISKO */}
        <Field>
          <FieldLabel htmlFor="name">
            Imię i nazwisko
          </FieldLabel>

          <Input
            id="name"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Jan Kowalski"
            pattern="[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+"
            title="Wpisz imię i nazwisko używając liter, spacji, myślnika lub apostrofu."
            onInput={handleNameInput}
          />
        </Field>

        {/* TELEFON */}
        <Field>
          <FieldLabel htmlFor="phone">
            Telefon
          </FieldLabel>

          <Input
            id="phone"
            name="phone"
            required
            type="tel"
            inputMode="tel"
            maxLength={16}
            minLength={7}
            autoComplete="tel"
            placeholder="+48500000000"
            pattern="\+?[0-9]{7,15}"
            title="Numer telefonu powinien zawierać od 7 do 15 cyfr. Możesz użyć +48 lub innego kierunkowego."
            onInput={handlePhoneInput}
          />
        </Field>

        {/* E-MAIL */}
        <Field>
          <FieldLabel htmlFor="email">
            E-mail
          </FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="jan@example.com"
            pattern="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+"
            title="Wpisz poprawny adres e-mail, np. jan@example.com."
          />
        </Field>

        {/* MECZ */}
        {!hasSelectedTrip && (
          <Field>
            <FieldLabel htmlFor="matchName">
              Na jaki mecz?
            </FieldLabel>

            <Input
              id="matchName"
              name="matchName"
              required
              maxLength={160}
              placeholder="np. Barcelona - Real"
              onInput={handleMatchNameInput}
            />
          </Field>
        )}

        {/* MIASTO WYLOTU */}
        <Field>
          <FieldLabel htmlFor="departureCity">
            Skąd wylot?
          </FieldLabel>

          <Input
            id="departureCity"
            name="departureCity"
            required
            maxLength={100}
            autoComplete="address-level2"
            placeholder="Warszawa"
            pattern="[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÿ\s'-]+"
            title="Wpisz nazwę miasta używając liter, spacji, myślnika lub apostrofu."
            onInput={handleDepartureCityInput}
          />
        </Field>

        {/* LICZBA OSÓB */}
        <Field>
          <FieldLabel htmlFor="travelers">
            Liczba osób
          </FieldLabel>

          <Input
            id="travelers"
            name="travelers"
            type="number"
            inputMode="numeric"
            min="1"
            max="99"
            defaultValue="2"
            required
          />
        </Field>
      </FieldGroup>

      {/* DODATKOWE INFORMACJE */}
      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="message">
            Dodatkowe informacje
          </FieldLabel>

          <span
            className={`text-xs ${
              messageLength >= MESSAGE_MAX_LENGTH
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
            aria-live="polite"
          >
            {messageLength}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>

        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Termin, preferowany standard hotelu, specjalne potrzeby…"
          onInput={handleMessageInput}
        />
      </Field>

      {/* ZGODA */}
      <Field>
        <label
          htmlFor="privacyConsent"
          className="flex items-start gap-3 text-sm leading-relaxed"
        >
          <input
            id="privacyConsent"
            name="privacyConsent"
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0"
          />

          <span>
            Wyrażam zgodę na przetwarzanie podanych danych w celu
            przygotowania oferty i kontaktu w sprawie zapytania.
            Zapoznałem/am się z{" "}
            <Link
              href="/polityka-prywatnosci"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              polityką prywatności i cookies
            </Link>{" "}
            oraz{" "}
            <Link
              href="/warunki-uczestnictwa"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              warunkami uczestnictwa
            </Link>
            . *
          </span>
        </label>
      </Field>

      {/* KOMUNIKAT */}
      {state.message && (
        <div
          role="status"
          className={
            state.status === "success"
              ? "flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
              : "rounded-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-white"
          }
        >
          {state.status === "success" && (
            <CheckCircle2
              aria-hidden="true"
              className="size-4 shrink-0"
            />
          )}

          {state.message}
        </div>
      )}

      {/* PRZYCISK */}
      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-md font-bold uppercase"
        disabled={pending}
      >
        {pending
          ? "Wysyłanie…"
          : "Wyślij zapytanie"}

        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  )
}