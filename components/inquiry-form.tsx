"use client"

import Link from "next/link"
import {
  useActionState,
  useEffect,
  useState,
} from "react"

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

import {
  createInquiry,
  getInquiryChallenge,
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

export function InquiryForm() {
  const [
    state,
    action,
    pending,
  ] = useActionState(
    createInquiry,
    initialState
  )

  const [
    formLoadedAt,
  ] = useState(() => Date.now())

  const [
    challenge,
    setChallenge,
  ] = useState("")

  const [
    proof,
    setProof,
  ] = useState("")

  const [
    challengeLoading,
    setChallengeLoading,
  ] = useState(true)

  const [
    solving,
    setSolving,
  ] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadChallenge() {
      setChallengeLoading(true)

      try {
        const result =
          await getInquiryChallenge()

        if (cancelled) return

        if (!result.challenge) {
          setChallenge("")
          return
        }

        setChallenge(
          result.challenge
        )
      } finally {
        if (!cancelled) {
          setChallengeLoading(false)
        }
      }
    }

    loadChallenge()

    return () => {
      cancelled = true
    }
  }, [])

  async function sha256(
    value: string
  ) {
    const data =
      new TextEncoder().encode(
        value
      )

    const hashBuffer =
      await crypto.subtle.digest(
        "SHA-256",
        data
      )

    const hashArray =
      Array.from(
        new Uint8Array(
          hashBuffer
        )
      )

    return hashArray
      .map((byte) =>
        byte
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  }

  async function solveProof(
    currentChallenge: string
  ) {
    const difficulty = 4
    const target =
      "0".repeat(difficulty)

    let nonce = 0

    /*
     * Co jakiś czas oddajemy kontrolę
     * przeglądarce, żeby nie blokować UI.
     */
    while (true) {
      const hash =
        await sha256(
          `${currentChallenge}:${nonce}`
        )

      if (
        hash.startsWith(target)
      ) {
        return String(nonce)
      }

      nonce++

      if (
        nonce % 500 === 0
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(resolve, 0)
        )
      }
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      challengeLoading ||
      !challenge
    ) {
      return
    }

    setSolving(true)

    try {
      const solvedProof =
        await solveProof(
          challenge
        )

      setProof(
        solvedProof
      )

      /*
       * requestSubmit uruchamia ponownie
       * natywną walidację formularza,
       * ale teraz mamy już proof.
       */
      const form =
        event.currentTarget

      /*
       * Tworzymy ukryte pole dopiero
       * po rozwiązaniu zadania.
       */
      let proofInput =
        form.elements.namedItem(
          "proof"
        ) as HTMLInputElement | null

      if (!proofInput) {
        proofInput =
          document.createElement(
            "input"
          )

        proofInput.type = "hidden"
        proofInput.name = "proof"

        form.appendChild(
          proofInput
        )
      }

      proofInput.value =
        solvedProof

      form.requestSubmit()
    } finally {
      setSolving(false)
    }
  }

  const isSubmitting =
    pending || solving

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />

      {/* Czas załadowania formularza */}
      <input
        type="hidden"
        name="formLoadedAt"
        value={formLoadedAt}
      />

      {/* Podpisany challenge */}
      <input
        type="hidden"
        name="challenge"
        value={challenge}
      />

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">
            Imię i nazwisko
          </FieldLabel>

          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Jan Kowalski"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">
            Telefon
          </FieldLabel>

          <Input
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            maxLength={30}
            inputMode="tel"
            placeholder="+48 500 000 000"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">
            E-mail
          </FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={160}
            placeholder="jan@example.com"
          />
        </Field>

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
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="departureCity">
            Skąd wylot?
          </FieldLabel>

          <Input
            id="departureCity"
            name="departureCity"
            required
            maxLength={100}
            placeholder="Warszawa"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="travelers">
            Liczba osób
          </FieldLabel>

          <Input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            max="20"
            defaultValue="2"
            required
          />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="message">
          Dodatkowe informacje
        </FieldLabel>

        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Termin, preferowany standard hotelu, specjalne potrzeby…"
        />
      </Field>

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
            Wyrażam zgodę na przetwarzanie
            podanych danych w celu
            przygotowania oferty i kontaktu
            w sprawie zapytania. Zapoznałem/am
            się z{" "}
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

      {state.message && (
        <p
          role="status"
          className={
            state.status === "success"
              ? "flex items-center gap-2 text-sm text-primary"
              : "text-sm text-destructive"
          }
        >
          {state.status === "success" && (
            <CheckCircle2
              aria-hidden="true"
            />
          )}

          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-md font-bold uppercase"
        disabled={
          isSubmitting ||
          challengeLoading ||
          !challenge
        }
      >
        {solving
          ? "Sprawdzam…"
          : pending
            ? "Wysyłanie…"
            : "Wyślij zapytanie"}

        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  )
}