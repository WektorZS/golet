import { GoogleAuth } from "google-auth-library"

type ServiceAccountCredentials = {
  project_id: string
  client_email: string
  private_key: string
}

type TranslateResponse = {
  translations?: Array<{ translatedText?: string }>
  error?: { message?: string }
}

function getCredentials(): ServiceAccountCredentials {
  const rawCredentials = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON

  if (!rawCredentials) {
    throw new Error("Brakuje zmiennej GOOGLE_CLOUD_CREDENTIALS_JSON w konfiguracji serwera.")
  }

  let credentials: Partial<ServiceAccountCredentials>

  try {
    credentials = JSON.parse(rawCredentials.trim()) as Partial<ServiceAccountCredentials>
  } catch {
    throw new Error("Zmienna GOOGLE_CLOUD_CREDENTIALS_JSON nie zawiera prawidłowego pliku JSON.")
  }

  if (!credentials.project_id || !credentials.client_email || !credentials.private_key) {
    throw new Error("Dane konta usługi Google Cloud są niekompletne.")
  }

  return {
    project_id: credentials.project_id,
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, "\n"),
  }
}

export async function translatePolishTexts(
  contents: string[],
  mimeType: "text/plain" | "text/html" = "text/plain"
) {
  const translated = Array.from({ length: contents.length }, () => "")
  const populated = contents
    .map((value, index) => ({ value: value.trim(), index }))
    .filter((item) => item.value)

  if (!populated.length) return translated

  const characterCount = populated.reduce((sum, item) => sum + item.value.length, 0)
  if (characterCount > 30_000) {
    throw new Error("Jednorazowe tłumaczenie może obejmować maksymalnie 30 000 znaków.")
  }

  const credentials = getCredentials()
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-translation"],
  })
  const client = await auth.getClient()
  const accessToken = await client.getAccessToken()
  const token = typeof accessToken === "string" ? accessToken : accessToken.token

  if (!token) {
    throw new Error("Google Cloud nie zwrócił tokenu dostępu.")
  }

  const response = await fetch(
    `https://translation.googleapis.com/v3/projects/${encodeURIComponent(credentials.project_id)}/locations/global:translateText`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: populated.map((item) => item.value),
        mimeType,
        sourceLanguageCode: "pl",
        targetLanguageCode: "en",
      }),
      cache: "no-store",
    }
  )

  const data = (await response.json()) as TranslateResponse

  if (!response.ok) {
    throw new Error(data.error?.message || "Google Cloud Translation odrzucił żądanie.")
  }

  if (!data.translations || data.translations.length !== populated.length) {
    throw new Error("Google Cloud zwrócił niepełne tłumaczenie.")
  }

  populated.forEach((item, index) => {
    translated[item.index] = data.translations?.[index]?.translatedText?.trim() || ""
  })

  return translated
}
