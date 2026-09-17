import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
const INQUIRY_NOTIFICATION_EMAIL =
  process.env.INQUIRY_NOTIFICATION_EMAIL

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

if (!INQUIRY_NOTIFICATION_EMAIL) {
  throw new Error("Brak INQUIRY_NOTIFICATION_EMAIL")
}
  const name = escapeHtml(inquiry.name)
  const email = escapeHtml(inquiry.email)
  const phone = escapeHtml(inquiry.phone)
  const matchName = escapeHtml(inquiry.matchName)
  const departureCity = escapeHtml(inquiry.departureCity)
  const message = escapeHtml(
    inquiry.message || "Brak dodatkowych informacji."
  )

  const clientResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    replyTo: process.env.RESEND_REPLY_TO_EMAIL,
    subject: "Otrzymaliśmy Twoje zapytanie - Let's Gol",
    html: `
      <div style="margin:0;padding:32px 16px;background:#f3f3f3;font-family:Arial,Helvetica,sans-serif;color:#111;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

          <div style="background:#111111;padding:32px 24px;text-align:center;">
            <img
              src="https://golet.vercel.app/logoemail.png"
              alt="Let's Gol"
              width="90"
              style="display:block;margin:0 auto 14px;width:90px;height:auto;"
            />

            <div style="font-size:27px;line-height:1.1;font-weight:800;color:#f4b91e;letter-spacing:-0.5px;">
              Let's Gol
            </div>

            <div style="margin-top:6px;color:#999999;font-size:13px;letter-spacing:0.5px;">
              Wyjazdy na mecze
            </div>
          </div>

          <div style="padding:34px 30px 30px;">

            <div style="display:inline-block;margin-bottom:14px;padding:6px 10px;background:#fff7df;border-radius:6px;color:#9b7300;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
              Zapytanie otrzymane
            </div>

            <h1 style="margin:0 0 14px;font-size:25px;line-height:1.25;font-weight:800;color:#111111;">
              Dziękujemy za kontakt, ${name}!
            </h1>

            <p style="margin:0;font-size:15px;line-height:1.7;color:#555555;">
              Otrzymaliśmy Twoje zapytanie dotyczące wyjazdu na mecz. Poniżej znajdziesz podsumowanie przesłanych informacji.
            </p>

            <div style="height:1px;margin:28px 0;background:#eeeeee;"></div>

            <div style="margin:0 0 24px;">
              <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:1px;">
                Szczegóły wyjazdu
              </div>

              <div style="border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Mecz
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${matchName}
                  </div>
                </div>

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Skąd wylot
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${departureCity}
                  </div>
                </div>

                <div style="padding:16px 18px;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Liczba osób
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${inquiry.travelers}
                  </div>
                </div>

              </div>
            </div>

            <div style="padding:18px 20px;background:#111111;border-radius:12px;">
              <div style="margin-bottom:6px;font-size:12px;font-weight:700;color:#f4b91e;text-transform:uppercase;letter-spacing:0.8px;">
                Co dalej?
              </div>

              <div style="font-size:14px;line-height:1.65;color:#eeeeee;">
                Skontaktujemy się z Tobą w ciągu 24 godzin i przygotujemy propozycję wyjazdu dopasowaną do Twoich oczekiwań.
              </div>
            </div>

            <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#777777;">
              Jeśli chcesz przekazać nam dodatkowe informacje, możesz odpowiedzieć bezpośrednio na tę wiadomość.
            </p>

            <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#111111;">
              Pozdrawiamy,<br />
              <strong>Zespół Let's Gol</strong>
            </p>

          </div>

          <div style="padding:18px 30px;background:#fafafa;border-top:1px solid #eeeeee;text-align:center;">
            <div style="font-size:11px;color:#999999;line-height:1.6;">
              Let's Gol · Wyjazdy na mecze
            </div>
          </div>

        </div>
      </div>
    `,
  })

  if (clientResult.error) {
    throw new Error(clientResult.error.message)
  }

  const adminResult = await resend.emails.send({
  from: FROM_EMAIL,
  to: INQUIRY_NOTIFICATION_EMAIL,
  replyTo: inquiry.email,
    subject: `🔔 Nowe zapytanie od ${inquiry.name}`,
    html: `
      <div style="margin:0;padding:32px 16px;background:#f3f3f3;font-family:Arial,Helvetica,sans-serif;color:#111;">
        <div style="max-width:700px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

          <div style="background:#111111;padding:30px 24px;text-align:center;">
            <img
              src="https://golet.vercel.app/logoemail.png"
              alt="Let's Gol"
              width="90"
              style="display:block;margin:0 auto 14px;width:90px;height:auto;"
            />

            <div style="font-size:27px;line-height:1.1;font-weight:800;color:#f4b91e;letter-spacing:-0.5px;">
              Let's Gol
            </div>

            <div style="margin-top:6px;color:#999999;font-size:13px;letter-spacing:0.5px;">
              Nowe zapytanie klienta
            </div>
          </div>

          <div style="padding:34px 30px 30px;">

            <div style="display:inline-block;margin-bottom:14px;padding:6px 10px;background:#fff7df;border-radius:6px;color:#9b7300;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
              Nowy lead
            </div>

            <h1 style="margin:0 0 10px;font-size:25px;line-height:1.25;font-weight:800;color:#111111;">
              🔔 Nowe zapytanie
            </h1>

            <p style="margin:0;font-size:15px;line-height:1.7;color:#666666;">
              Klient właśnie wysłał nowe zapytanie poprzez formularz na stronie Let's Gol.
            </p>

            <div style="height:1px;margin:28px 0;background:#eeeeee;"></div>

            <div style="margin-bottom:28px;">
              <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:1px;">
                Dane klienta
              </div>

              <div style="border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Imię i nazwisko
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${name}
                  </div>
                </div>

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    E-mail
                  </div>
                  <div style="font-size:15px;font-weight:700;">
                    <a
                      href="mailto:${email}"
                      style="color:#111111;text-decoration:underline;text-decoration-color:#f4b91e;text-underline-offset:3px;"
                    >
                      ${email}
                    </a>
                  </div>
                </div>

                <div style="padding:16px 18px;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Telefon
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    <a
                      href="tel:${phone.replace(/[^+\d]/g, "")}"
                      style="color:#111111;text-decoration:none;"
                    >
                      ${phone}
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div style="margin-bottom:28px;">
              <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:1px;">
                Szczegóły wyjazdu
              </div>

              <div style="border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Mecz
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${matchName}
                  </div>
                </div>

                <div style="padding:16px 18px;border-bottom:1px solid #eeeeee;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Skąd wylot
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${departureCity}
                  </div>
                </div>

                <div style="padding:16px 18px;">
                  <div style="margin-bottom:4px;font-size:12px;color:#888888;">
                    Liczba osób
                  </div>
                  <div style="font-size:15px;font-weight:700;color:#111111;">
                    ${inquiry.travelers}
                  </div>
                </div>

              </div>
            </div>

            <div>
              <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:1px;">
                Wiadomość klienta
              </div>

              <div style="padding:20px;background:#f7f7f7;border-left:3px solid #f4b91e;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#333333;white-space:pre-wrap;">
                ${message}
              </div>
            </div>

            <div style="margin-top:28px;padding:18px 20px;background:#111111;border-radius:12px;">
              <div style="font-size:13px;line-height:1.6;color:#eeeeee;">
                Możesz odpowiedzieć bezpośrednio na tę wiadomość, aby skontaktować się z klientem.
              </div>
            </div>

          </div>

          <div style="padding:18px 30px;background:#fafafa;border-top:1px solid #eeeeee;text-align:center;">
            <div style="font-size:11px;color:#999999;line-height:1.6;">
              Let's Gol · Panel zapytań
            </div>
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