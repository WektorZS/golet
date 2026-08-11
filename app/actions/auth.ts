"use server"

import { redirect } from "next/navigation"
import { getAdminEmail, isAdminEmail } from "@/lib/auth/admin"
import { requireAdmin } from "@/lib/auth/require-admin"
import { getAuth, resetPasswordWithOtp } from "@/lib/auth/server"

export type AuthState = { error?: string; sent?: boolean } | null

export async function signInAdmin(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Podaj e-mail i hasło." }
  if (!isAdminEmail(email)) return { error: "To konto nie ma dostępu do panelu administratora." }
  const { error } = await getAuth().signIn.email({ email, password })
  if (error) return { error: error.message || "Nie udało się zalogować." }
  redirect("/admin")
}

export async function requestAdminSetupCode(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (email !== getAdminEmail()) return { error: "Nieprawidłowe konto administratora." }
  const { error } = await getAuth().emailOtp.sendVerificationOtp({
    email,
    type: "forget-password",
  })
  if (error) return { error: error.message || "Nie udało się wysłać kodu." }
  return { sent: true }
}

export async function finishAdminSetup(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const otp = String(formData.get("otp") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (email !== getAdminEmail()) return { error: "Nieprawidłowe konto administratora." }
  if (!otp) return { error: "Wpisz kod z wiadomości e-mail." }
  if (password.length < 12) return { error: "Hasło musi mieć co najmniej 12 znaków." }
  if (password !== confirmPassword) return { error: "Podane hasła nie są takie same." }

  const { error } = await resetPasswordWithOtp({ email, otp, password })
  if (error) return { error }

  const signInResult = await getAuth().signIn.email({ email, password })
  if (signInResult.error) redirect("/auth/sign-in?setup=success")
  redirect("/admin")
}

export type ChangePasswordState = { error?: string; success?: boolean }

export async function changeAdminPassword(_: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  await requireAdmin()
  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  if (newPassword.length < 12) return { error: "Nowe hasło musi mieć co najmniej 12 znaków." }
  if (newPassword !== confirmPassword) return { error: "Nowe hasła nie są takie same." }

  try {
    const result = await getAuth().changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: formData.get("revokeOtherSessions") === "on",
    })
    if (result.error) return { error: result.error.message || "Nie udało się zmienić hasła. Sprawdź aktualne hasło." }
    return { success: true }
  } catch {
    return { error: "Nie udało się zmienić hasła. Sprawdź aktualne hasło." }
  }
}

export async function signOutAdmin() {
  await getAuth().signOut()
  redirect("/auth/sign-in")
}
