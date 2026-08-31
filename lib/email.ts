import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export type InquiryEmailData = {
  name: string
  email: string
  phone: string
  matchName: string
  departureCity: string
  travelers: number
  message: string
}

export async function sendInquiryEmails(
  inquiry: InquiryEmailData
) {
  if (!FROM_EMAIL) {
    throw new Error("Brak RESEND_FROM_EMAIL")
  }

  if (!ADMIN_EMAIL) {
    throw new Error("Brak ADMIN_EMAIL")
  }

  const name = escapeHtml(inquiry.name)
  const email = escapeHtml(inquiry.email)
  const phone = escapeHtml(inquiry.phone)
  const matchName = escapeHtml(inquiry.matchName)
  const departureCity = escapeHtml(
    inquiry.departureCity
  )
  const message = escapeHtml(
    inquiry.message || "Brak dodatkowych informacji."
  )

  // E-mail do klienta
  const clientResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    replyTo: ADMIN_EMAIL,
    subject: "Otrzymaliśmy Twoje zapytanie - Let's Gol",
    html: `
      <div style="margin:0;padding:30px 15px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111;">
        <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;">

          <div style="background:#111;padding:25px;text-align:center;">
  <img
    src="https://golet.vercel.app/images/logo.webp"
    alt="Let's Gol"
    width="100"
    style="display:block;margin:0 auto 12px;width:100px;height:auto;"
  />

  <div style="font-size:26px;font-weight:800;color:#f4b91e;">
    Let's Gol
  </div>

  <div style="margin-top:4px;color:#aaa;font-size:13px;">
    Wyjazdy na mecze
  </div>
</div>

          <div style="padding:30px;">
            <h1 style="margin:0 0 18px;font-size:24px;">
              Dziękujemy za kontakt, ${name}!
            </h1>

            <p style="font-size:16px;line-height:1.6;">
              Otrzymaliśmy Twoje zapytanie dotyczące
              wyjazdu na mecz.
            </p>

            <div style="margin:24px 0;padding:20px;background:#f7f7f7;border-radius:10px;">
              <p style="margin:0 0 10px;">
                <strong>Mecz:</strong> ${matchName}
              </p>

              <p style="margin:0 0 10px;">
                <strong>Skąd wylot:</strong> ${departureCity}
              </p>

              <p style="margin:0;">
                <strong>Liczba osób:</strong> ${inquiry.travelers}
              </p>
            </div>

            <p style="font-size:16px;line-height:1.6;">
              Twoje zapytanie zostało przyjęte.
              Skontaktujemy się z Tobą w ciągu 24 godzin
              i przygotujemy propozycję wyjazdu.
            </p>

            <p style="margin-top:25px;font-size:14px;color:#666;line-height:1.6;">
              Jeśli chcesz przekazać nam dodatkowe informacje,
              możesz odpowiedzieć bezpośrednio na tę wiadomość.
            </p>

            <p style="margin-top:30px;">
              Pozdrawiamy,<br />
              <strong>Zespół Let's Gol</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  })

  if (clientResult.error) {
    throw new Error(clientResult.error.message)
  }

  // E-mail do administratora
  const adminResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    replyTo: inquiry.email,
    subject: `🔔 Nowe zapytanie od ${inquiry.name}`,
    html: `
      <div style="margin:0;padding:30px 15px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111;">
        <div style="max-width:700px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;">

          <div style="background:#111;padding:25px;text-align:center;">
  <img
    src="https://golet.vercel.app/images/logo.webp"
    alt="Let's Gol"
    width="100"
    style="display:block;margin:0 auto 12px;width:100px;height:auto;"
  />

  <div style="font-size:26px;font-weight:800;color:#f4b91e;">
    Let's Gol
  </div>

  <div style="margin-top:4px;color:#aaa;font-size:13px;">
    Nowe zapytanie klienta
  </div>
</div>
          <div style="padding:30px;">

            <h1 style="margin:0 0 8px;font-size:24px;">
              🔔 Nowe zapytanie
            </h1>

            <p style="color:#666;margin-bottom:28px;">
              Klient właśnie wysłał nowe zapytanie
              poprzez formularz na stronie.
            </p>

            <h2 style="font-size:18px;">
              Dane klienta
            </h2>

            <div style="padding:18px;background:#f7f7f7;border-radius:10px;line-height:1.8;">
              <strong>Imię i nazwisko:</strong><br />
              ${name}<br /><br />

              <strong>E-mail:</strong><br />
              <a href="mailto:${email}">
                ${email}
              </a><br /><br />

              <strong>Telefon:</strong><br />
              ${phone}
            </div>

            <h2 style="font-size:18px;margin-top:28px;">
              Szczegóły wyjazdu
            </h2>

            <div style="padding:18px;background:#f7f7f7;border-radius:10px;line-height:1.8;">
              <strong>Mecz:</strong><br />
              ${matchName}<br /><br />

              <strong>Skąd wylot:</strong><br />
              ${departureCity}<br /><br />

              <strong>Liczba osób:</strong><br />
              ${inquiry.travelers}
            </div>

            <h2 style="font-size:18px;margin-top:28px;">
              Wiadomość klienta
            </h2>

            <div style="padding:18px;background:#f7f7f7;border-radius:10px;white-space:pre-wrap;line-height:1.6;">
              ${message}
            </div>

            <p style="margin-top:30px;color:#666;font-size:13px;">
              Możesz odpowiedzieć bezpośrednio na tę wiadomość,
              aby skontaktować się z klientem.
            </p>

          </div>
        </div>
      </div>
    `,
  })

  if (adminResult.error) {
    throw new Error(adminResult.error.message)
  }

  return {
    clientEmailId: clientResult.data?.id,
    adminEmailId: adminResult.data?.id,
  }
}