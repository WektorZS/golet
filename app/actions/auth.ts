"use server"

import { redirect } from "next/navigation"
import { getAuth } from "@/lib/auth/server"

export type AuthState = { error: string } | null

export async function signInAdmin(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Podaj e-mail i hasło." }
  const { error } = await getAuth().signIn.email({ email, password })
  if (error) return { error: error.message || "Nie udało się zalogować." }
  redirect("/admin")
}

export async function signOutAdmin() {
  await getAuth().signOut()
  redirect("/auth/sign-in")
}
