import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, KeyRound } from "lucide-react"
import { AdminLoginForm } from "@/components/admin-login-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getAuth, isAuthConfigured } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export default async function SignInPage() {
  const configured = isAuthConfigured()
  if (configured) {
    const { data } = await getAuth().getSession()
    if (data?.user) redirect("/admin")
  }

  return <main className="flex min-h-screen items-center justify-center bg-foreground px-4 text-background">
    <div className="w-full max-w-md rounded-xl border border-background/15 bg-card p-7 text-card-foreground shadow-2xl md:p-9">
      <Button variant="ghost" className="mb-7" nativeButton={false} render={<Link href="/" />}><ArrowLeft data-icon="inline-start" />Wróć na stronę</Button>
      <KeyRound className="text-primary" aria-hidden="true" />
      <h1 className="mt-4 font-sans text-3xl font-black uppercase">Panel administratora</h1>
      <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">Zaloguj się, aby zarządzać wyjazdami i zapytaniami klientów.</p>
      {configured ? <><AdminLoginForm /><p className="mt-5 text-center text-sm text-muted-foreground">Pierwsze logowanie? <Link href="/auth/setup" className="font-semibold text-foreground underline underline-offset-4">Ustaw hasło administratora</Link></p></> : <Alert><AlertTitle>Ostatni krok konfiguracji</AlertTitle><AlertDescription>Panel jest gotowy, ale logowanie pozostaje wyłączone, ponieważ pominięto ustawienie zmiennej NEON_AUTH_COOKIE_SECRET. Dodaj losowy sekret o długości co najmniej 32 znaków w Vars, aby aktywować bezpieczne sesje.</AlertDescription></Alert>}
    </div>
  </main>
}
