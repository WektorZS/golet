"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
} from "lucide-react"

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
const OTHER_MATCH_VALUE = "__other__"

type InquiryTrip = {
  id: number
  title: string
  date: string | null
}

const inputClassName =
  "h-11 rounded-lg border-white/25 bg-white/[0.015] px-3.5 text-sm text-white transition-all duration-200 placeholder:text-white/25 hover:border-white/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"

function formatTripDate(date: string | null) {
  if (!date) {
    return ""
  }

  const [year, month, day] = date.split("-")

  if (!year || !month || !day) {
    return ""
  }

  return `${day}.${month}.${year}`
}

export function InquiryForm({
  matchName = "",
  trips = [],
}: {
  matchName?: string
  trips?: InquiryTrip[]
}) {
  const [state, action, pending] = useActionState(
    createInquiry,
    initialState
  )

  const [formLoadedAt] = useState(() => Date.now())
  const [messageLength, setMessageLength] = useState(0)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState("")
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false)
const matchDropdownRef = useRef<HTMLDivElement>(null)

  const hasSelectedTrip = Boolean(matchName.trim())
  const isOtherMatch = selectedMatch === OTHER_MATCH_VALUE
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      matchDropdownRef.current &&
      !matchDropdownRef.current.contains(event.target as Node)
    ) {
      setMatchDropdownOpen(false)
    }
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMatchDropdownOpen(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  document.addEventListener("keydown", handleEscape)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
    document.removeEventListener("keydown", handleEscape)
  }
}, [])

const selectedTrip = trips.find(
  (trip) => trip.title === selectedMatch
)

const selectedTripLabel = selectedTrip
  ? `${selectedTrip.title}${
      formatTripDate(selectedTrip.date)
        ? ` - ${formatTripDate(selectedTrip.date)}`
        : ""
    }`
  : isOtherMatch
    ? "Inny mecz"
    : "Wybierz mecz"
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

    let value = input.value.replace(/[^\d+]/g, "")

    if (value.includes("+")) {
      value =
        (value.startsWith("+") ? "+" : "") +
        value.replace(/\+/g, "")
    }

    const hasPlus = value.startsWith("+")
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 15)

    input.value = hasPlus
      ? `+${digits}`
      : digits
  }

  const handleMatchNameInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    event.currentTarget.value =
      event.currentTarget.value.replace(
        /[<>{}\[\]\\`|]/g,
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

    const sanitized = input.value
      .replace(/[<>{}\[\]\\`|]/g, "")
      .replace(
        /[^\p{L}\p{N}\s.,!?;:()"'’\-–—…\/%]/gu,
        ""
      )
      .slice(0, MESSAGE_MAX_LENGTH)

    input.value = sanitized
    setMessageLength(sanitized.length)
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-5"
    >
      {/* HONEYPOT */}
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

      {/* Mecz przekazany z konkretnego wyjazdu */}
      {hasSelectedTrip && (
        <input
          type="hidden"
          name="matchName"
          value={matchName}
        />
      )}

      <FieldGroup className="grid gap-x-4 gap-y-4 md:grid-cols-2">
        <Field>
          <FieldLabel
            htmlFor="name"
            className="text-sm font-semibold text-white"
          >
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
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="phone"
            className="text-sm font-semibold text-white"
          >
            Numer telefonu
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
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="email"
            className="text-sm font-semibold text-white"
          >
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
            className={inputClassName}
          />
        </Field>

        {!hasSelectedTrip && (
  <Field>
    <FieldLabel
      htmlFor="matchSelection"
      className="text-sm font-semibold text-white"
    >
      Na jaki mecz?
    </FieldLabel>

    <div
      ref={matchDropdownRef}
      className="relative"
    >
      <button
        id="matchSelection"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={matchDropdownOpen}
        onClick={() =>
          setMatchDropdownOpen((open) => !open)
        }
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-lg border bg-white/[0.015] px-3.5 text-left text-sm outline-none transition-all duration-200 ${
          matchDropdownOpen
            ? "border-primary ring-2 ring-primary/15"
            : "border-white/25 hover:border-white/40"
        }`}
      >
        <span
          className={`min-w-0 truncate ${
            selectedMatch
              ? "text-white"
              : "text-white/40"
          }`}
        >
          {selectedTripLabel}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-white/50 transition-transform duration-200 ${
            matchDropdownOpen
              ? "rotate-180 text-primary"
              : ""
          }`}
        />
      </button>

      {matchDropdownOpen && (
        <div
          role="listbox"
          aria-labelledby="matchSelection"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-white/15 bg-[#151515] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
        >
          <div className="max-h-64 overflow-y-auto">
            {trips.map((trip) => {
              const formattedDate = formatTripDate(
                trip.date
              )

              const active =
                selectedMatch === trip.title

              return (
                <button
                  key={trip.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedMatch(trip.title)
                    setMatchDropdownOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-primary/20 text-primary"
                      : "text-white/80 hover:bg-primary/15 hover:text-primary"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {trip.title}
                  </span>

                  {formattedDate && (
                    <span className="shrink-0 font-mono text-xs text-white/40">
  {formattedDate}
</span>
                  )}
                </button>
              )
            })}

            {trips.length > 0 && (
              <div className="my-1.5 border-t border-white/10" />
            )}

            <button
              type="button"
              role="option"
              aria-selected={isOtherMatch}
              onClick={() => {
                setSelectedMatch(OTHER_MATCH_VALUE)
                setMatchDropdownOpen(false)
              }}
              className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isOtherMatch
                  ? "bg-primary/20 text-primary"
                  : "text-white/80 hover:bg-primary/15 hover:text-primary"
              }`}
            >
              Inny mecz
            </button>
          </div>
        </div>
      )}
    </div>
  </Field>
)}

        <Field>
          <FieldLabel
            htmlFor="departureCity"
            className="text-sm font-semibold text-white"
          >
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
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="travelers"
            className="text-sm font-semibold text-white"
          >
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
            className={inputClassName}
          />
        </Field>
      </FieldGroup>

      {/* Wybrany gotowy wyjazd */}
      {!hasSelectedTrip && selectedMatch && !isOtherMatch && (
        <input
          type="hidden"
          name="matchName"
          value={selectedMatch}
        />
      )}

      {/* Ręczne wpisanie meczu */}
      {!hasSelectedTrip && isOtherMatch && (
        <Field>
          <FieldLabel
            htmlFor="matchName"
            className="text-sm font-semibold text-white"
          >
            Jaki mecz?
          </FieldLabel>

          <Input
            id="matchName"
            name="matchName"
            required
            maxLength={160}
            placeholder="np. Arsenal - Liverpool"
            onInput={handleMatchNameInput}
            className={inputClassName}
            autoFocus
          />
        </Field>
      )}

      {/* DODATKOWE INFORMACJE */}
      <Field>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel
            htmlFor="message"
            className="text-sm font-semibold text-white"
          >
            Dodatkowe informacje
          </FieldLabel>

          <span
            className={`font-mono text-[11px] ${
              messageLength >= MESSAGE_MAX_LENGTH
                ? "text-red-400"
                : "text-white/40"
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
          className="min-h-[112px] resize-none rounded-lg border-white/25 bg-white/[0.015] px-3.5 py-3 text-sm text-white transition-all duration-200 placeholder:text-white/25 hover:border-white/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
        />
      </Field>

      {/* ZGODA */}
      <Field>
        <label
          htmlFor="privacyConsent"
          className="group flex cursor-pointer items-start gap-3.5"
        >
          <span className="relative mt-0.5 flex size-[18px] shrink-0">
            <input
              id="privacyConsent"
              name="privacyConsent"
              type="checkbox"
              required
              checked={privacyConsent}
              onChange={(event) =>
                setPrivacyConsent(event.target.checked)
              }
              className="peer absolute inset-0 cursor-pointer opacity-0"
            />

            <span className="flex size-[18px] items-center justify-center rounded-[4px] border border-white/40 bg-transparent transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
              <Check
                className={`size-3.5 stroke-[3] text-black transition-opacity ${
                  privacyConsent
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                aria-hidden="true"
              />
            </span>
          </span>

          <span className="text-[13px] leading-relaxed text-white/70 transition-colors group-hover:text-white/80">
            Wyrażam zgodę na przetwarzanie podanych danych w celu
            przygotowania oferty i kontaktu w sprawie zapytania.
            Zapoznałem/am się z{" "}
            <Link
              href="/polityka-prywatnosci"
              className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              polityką prywatności i cookies
            </Link>{" "}
            oraz{" "}
            <Link
              href="/warunki-uczestnictwa"
              className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              warunkami uczestnictwa
            </Link>
            . <span className="text-primary">*</span>
          </span>
        </label>
      </Field>

      {/* KOMUNIKAT */}
      {state.message && (
        <div
          role="status"
          className={
            state.status === "success"
              ? "flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary"
              : "rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-white"
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
        className="group h-12 w-full rounded-lg font-bold uppercase tracking-[0.02em] shadow-none transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(250,190,20,0.12)] active:translate-y-0"
        disabled={pending}
      >
        {pending
          ? "Wysyłanie…"
          : "Wyślij zapytanie"}

        <ArrowRight
          className="transition-transform duration-200 group-hover:translate-x-1"
          data-icon="inline-end"
        />
      </Button>
    </form>
  )
}