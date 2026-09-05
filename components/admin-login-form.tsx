"use client"

import { useActionState } from "react"
import { LockKeyhole } from "lucide-react"
import { signInAdmin } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, null)
  return <form action={action} className="flex flex-col gap-5">
    <FieldGroup>
      <Field><FieldLabel htmlFor="email">E-mail</FieldLabel><Input
  id="admin-email"
  name="email"
  type="email"
  autoComplete="username"
  inputMode="email"
  required
/></Field>
      <Field><FieldLabel htmlFor="password">Hasło</FieldLabel><Input id="password" name="password" type="password" autoComplete="current-password" required /></Field>
    </FieldGroup>
    {state?.error && <p className="text-sm text-destructive" role="alert">{state.error}</p>}
    <Button type="submit" size="lg" disabled={pending}><LockKeyhole data-icon="inline-start" />{pending ? "Logowanie…" : "Zaloguj do panelu"}</Button>
  </form>
}
