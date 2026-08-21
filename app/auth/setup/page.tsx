import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { AdminSetupForm } from "@/components/admin-setup-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { isAdminEmail } from "@/lib/auth/admin"
import { getAuth, isAuthConfigured } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export default async function AdminSetupPage() {
  const configured = isAuthConfigured()
  if (configured) {
    const { data } = await getAuth().getSession()
    if (isAdminEmail(data?.user?.email)) redirect("/admin")
  }

  return <main className="flex min-h-screen items-center justify-center bg-foreground px-4 py-10 text-background">
    <div className="w-full max-w-md rounded-xl border border-background/15 bg-card p-7 text-card-foreground shadow-2xl md:p-9">
      <Button variant="ghost" className="mb-7" nativeButton={false} render={<Link href="/auth/sign-in" />}><ArrowLeft data-icon="inline-start" />Wróć do logowania</Button>
      <ShieldCheck className="text-primary" aria-hidden="true" />
      <h1 className="mt-4 font-sans text-3xl font-black uppercase">Ustaw hasło administratora</h1>
      <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">Wyślemy jednorazowy kod na Twój adres. Po jego wpisaniu ustawisz bezpieczne hasło i od razu wejdziesz do panelu.</p>
      {configured ? <AdminSetupForm /> : <Alert><AlertTitle>Brakuje sekretu sesji</AlertTitle><AlertDescription>Dodaj w Vars zmienną NEON_AUTH_COOKIE_SECRET o długości co najmniej 32 losowych znaków. Następnie odśwież tę stronę.</AlertDescription></Alert>}
    </div>
  </main>
}
