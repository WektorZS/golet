"use client"

import { useActionState } from "react"
import { KeyRound, Mail } from "lucide-react"
import { finishAdminSetup, requestAdminSetupCode } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AdminSetupForm() {
  const [requestState, requestAction, requesting] = useActionState(requestAdminSetupCode, null)
  const [finishState, finishAction, finishing] = useActionState(finishAdminSetup, null)

  if (requestState?.sent) {
    return <form action={finishAction} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="otp">Kod z wiadomości e-mail</FieldLabel>
          <Input id="otp" name="otp" inputMode="numeric" autoComplete="one-time-code" minLength={6} required />
          <FieldDescription>Wpisz kod wysłany na skonfigurowany adres administratora.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Nowe hasło</FieldLabel>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required />
          <FieldDescription>Minimum 12 znaków.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Powtórz hasło</FieldLabel>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required />
        </Field>
      </FieldGroup>
      {finishState?.error && <p className="text-sm text-destructive" role="alert">{finishState.error}</p>}
      <Button type="submit" size="lg" disabled={finishing}><KeyRound data-icon="inline-start" />{finishing ? "Ustawianie hasła…" : "Ustaw hasło i zaloguj się"}</Button>
    </form>
  }

  return <form action={requestAction} className="flex flex-col gap-5">
    <div className="rounded-lg border bg-secondary p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Konto administratora</p>
      <p className="mt-1 text-sm text-muted-foreground">Kod zostanie wysłany na bezpiecznie skonfigurowany adres.</p>
    </div>
    {requestState?.error && <p className="text-sm text-destructive" role="alert">{requestState.error}</p>}
    <Button type="submit" size="lg" disabled={requesting}><Mail data-icon="inline-start" />{requesting ? "Wysyłanie kodu…" : "Wyślij kod ustawienia hasła"}</Button>
  </form>
}
