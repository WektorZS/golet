"use server"

import { redirect } from "next/navigation"

import {
  getAdminEmail,
  isAdminEmail,
} from "@/lib/auth/admin"

import { requireAdmin } from "@/lib/auth/require-admin"

import {
  getAuth,
  resetPasswordWithOtp,
} from "@/lib/auth/server"

export type AuthState = {
  error?: string
  sent?: boolean
  email?: string
} | null


export async function signInAdmin(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase()

  const password = String(
    formData.get("password") ?? ""
  )

  if (!email || !password) {
    return {
      error: "Podaj e-mail i hasło.",
    }
  }

  if (!isAdminEmail(email)) {
    return {
      error:
        "To konto nie ma dostępu do panelu administratora.",
    }
  }

  try {
    const { error } =
      await getAuth().signIn.email({
        email,
        password,
      })

    if (error) {
      return {
        error:
          "Nieprawidłowy e-mail lub hasło.",
      }
    }
  } catch {
    return {
      error:
        "Nie udało się zalogować. Spróbuj ponownie.",
    }
  }

  redirect("/admin")
}

export async function requestAdminSetupCode(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase()

  const adminEmail = getAdminEmail()
    .trim()
    .toLowerCase()

  if (!email) {
    return {
      error: "Podaj adres e-mail administratora.",
    }
  }

  if (email !== adminEmail) {
  return {
    error:
      "Jeśli podany adres jest uprawniony, otrzymasz wiadomość e-mail.",
  }
}
  try {
    const { error } =
      await getAuth().emailOtp.sendVerificationOtp({
        email: adminEmail,
        type: "forget-password",
      })

    if (error) {
      return {
        error:
          "Nie udało się wysłać kodu. Spróbuj ponownie.",
      }
    }

    return {
      sent: true,
      email: adminEmail,
    }
  } catch {
    return {
      error:
        "Nie udało się wysłać kodu. Spróbuj ponownie.",
    }
  }
}


export async function finishAdminSetup(
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = getAdminEmail()

  const otp = String(
    formData.get("otp") ?? ""
  ).trim()

  const password = String(
    formData.get("password") ?? ""
  )

  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  )

  if (!otp) {
    return {
      error:
        "Wpisz kod otrzymany w wiadomości e-mail.",
    }
  }

  if (otp.length < 4) {
    return {
      error: "Kod jest nieprawidłowy.",
    }
  }

  if (password.length < 12) {
    return {
      error:
        "Hasło musi mieć co najmniej 12 znaków.",
    }
  }

  if (password !== confirmPassword) {
    return {
      error:
        "Podane hasła nie są takie same.",
    }
  }

  try {
    const { error } =
      await resetPasswordWithOtp({
        email,
        otp,
        password,
      })

    if (error) {
      return {
        error:
          "Kod jest nieprawidłowy lub wygasł. Spróbuj ponownie.",
      }
    }
  } catch {
    return {
      error:
        "Nie udało się ustawić hasła. Spróbuj ponownie.",
    }
  }


  try {
    const signInResult =
      await getAuth().signIn.email({
        email,
        password,
      })

    if (signInResult.error) {
      redirect(
        "/auth/sign-in?setup=success"
      )
    }
  } catch {
    redirect(
      "/auth/sign-in?setup=success"
    )
  }

  redirect("/admin")
}

export type ChangePasswordState = {
  error?: string
  success?: boolean
}


export async function changeAdminPassword(
  _: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {

  await requireAdmin()

  const currentPassword = String(
    formData.get("currentPassword") ?? ""
  )

  const newPassword = String(
    formData.get("newPassword") ?? ""
  )

  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  )


  if (!currentPassword) {
    return {
      error:
        "Wpisz aktualne hasło.",
    }
  }


  if (newPassword.length < 12) {
    return {
      error:
        "Nowe hasło musi mieć co najmniej 12 znaków.",
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      error:
        "Nowe hasła nie są takie same.",
    }
  }


  if (newPassword === currentPassword) {
    return {
      error:
        "Nowe hasło musi różnić się od aktualnego.",
    }
  }

  try {
    const result =
      await getAuth().changePassword({
        currentPassword,
        newPassword,


        revokeOtherSessions:
          formData.get(
            "revokeOtherSessions"
          ) === "on",
      })

    if (result.error) {
      return {
        error:
          "Nie udało się zmienić hasła. Sprawdź aktualne hasło.",
      }
    }

    return {
      success: true,
    }
  } catch {
    return {
      error:
        "Nie udało się zmienić hasła. Sprawdź aktualne hasło.",
    }
  }
}


export async function signOutAdmin() {

  await getAuth().signOut()

  redirect("/auth/sign-in")
}
