import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { breadcrumbSchema, localizedAlternates, socialMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Warunki uczestnictwa",
  description:
    "Warunki uczestnictwa w wyjazdach organizowanych przez Let's Gol na wydarzenia sportowe w Polsce i Europie.",
  alternates: localizedAlternates("/warunki-uczestnictwa", "pl"),
  ...socialMetadata(
    "Warunki uczestnictwa | Let's Gol",
    "Zasady rezerwacji, płatności i udziału w wyjazdach organizowanych przez Let's Gol.",
    "/warunki-uczestnictwa"
  ),
}

const organizer = {
  name: "LB Coaching Łukasz Borger",
  nip: "8512915273",
  regon: "520474445",
  ewidencjaNumber: "42848",
  email: "kontakt.letsgol@gmail.com",
  phone: "+48 501 465 318",
  phoneHref: "+48501465318",
}

function TermsSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-40">
      <div className="flex items-start gap-4">
        <span className="mt-1 font-mono text-xs font-black text-amber-800">
          {String(number).padStart(2, "0")}
        </span>

        <h2 className="font-sans text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>

      <div className="mt-5 space-y-4 pl-8 text-sm leading-7 text-muted-foreground md:pl-10 md:text-base">
        {children}
      </div>
    </section>
  )
}

export default function WarunkiUczestnictwaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              {
                name: "Strona główna",
                path: "/",
              },
              {
                name: "Warunki uczestnictwa",
                path: "/warunki-uczestnictwa",
              },
            ]),
          ],
        }}
      />

      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-foreground pt-20 text-background">
        <Image
          src="/images/hero-stadium.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/55" />

        <div className="relative mx-auto grid min-h-140 max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.5fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-on-dark">
              Informacje dla podróżnych
            </p>

            <h1 className="mt-6 text-balance font-sans text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              Warunki uczestnictwa
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
              Zasady rezerwacji, płatności, organizacji oraz udziału
              w wyjazdach organizowanych przez Let&apos;s Gol.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6">
            <Scale
              className="size-6 text-primary"
              aria-hidden="true"
            />

            <p className="mt-4 font-sans text-2xl font-black uppercase">
              Zasady Twojego wyjazdu
            </p>

            <p className="mt-2 text-sm leading-6 text-background/60">
              Szczegóły konkretnego wyjazdu, zakres świadczeń,
              cena oraz warunki płatności są każdorazowo określane
              w ofercie i zawieranej umowie.
            </p>
          </div>
        </div>
      </section>

  

      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <aside className="rounded-xl border border-primary/40 bg-primary/8 p-6 md:p-7">
          <div className="flex gap-4">
            <ShieldCheck
              className="mt-1 size-6 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div>
              <h2 className="font-sans text-xl font-black uppercase">
                Organizator turystyki
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Wyjazdy oferowane pod marką Let&apos;s Gol – Wyjazdy na
                mecze organizowane są przez LB Coaching Łukasz Borger,
                wpisanego do rejestru organizatorów turystyki pod numerem
                ewidencyjnym 42848.
              </p>
            </div>
          </div>
        </aside>

        <div className="mt-16 space-y-16">
          <TermsSection
            id="organizator"
            number={1}
            title="Organizator"
          >
            <p>
              Organizatorem wyjazdów oferowanych pod marką{" "}
              <strong className="text-foreground">
                Let&apos;s Gol – Wyjazdy na mecze
              </strong>{" "}
              jest{" "}
              <strong className="text-foreground">
                {organizer.name}
              </strong>
              , NIP:{" "}
              <strong className="text-foreground">
                {organizer.nip}
              </strong>
              , REGON:{" "}
              <strong className="text-foreground">
                {organizer.regon}
              </strong>
              , wpisany do rejestru organizatorów turystyki.
            </p>

            <p>
              Numer ewidencyjny organizatora:{" "}
              <strong className="text-foreground">
                {organizer.ewidencjaNumber}
              </strong>
              .
            </p>

            <p>
              Organizator posiada wymagane prawem zabezpieczenie
              finansowe na wypadek niewypłacalności.
            </p>
          </TermsSection>

          <TermsSection
            id="rezerwacja"
            number={2}
            title="Rezerwacja i zawarcie umowy"
          >
            <p>
              Rezerwacja wyjazdu następuje po uzgodnieniu jego szczegółów
              oraz zaakceptowaniu przedstawionej oferty.
            </p>

            <p>
              Klient otrzymuje umowę określającą w szczególności termin
              i miejsce wyjazdu, wydarzenie sportowe, zakres świadczeń,
              cenę oraz zasady płatności.
            </p>

            <p>
              W przypadku rezerwacji grupowej jedna osoba może występować
              jako Przedstawiciel Grupy i kontaktować się z Organizatorem
              w imieniu pozostałych uczestników.
            </p>
          </TermsSection>

          <TermsSection
            id="zakres-wyjazdu"
            number={3}
            title="Zakres wyjazdu"
          >
            <p>
              Dokładny zakres świadczeń każdorazowo określa oferta oraz
              umowa dotycząca konkretnego wyjazdu.
            </p>

            <p>
              W zależności od oferty pakiet może obejmować m.in. transport
              lotniczy, zakwaterowanie, bilet na mecz, ubezpieczenie
              turystyczne, transfery lub komunikację lokalną, wspólne
              zwiedzanie, plan podróży oraz opiekę koordynatora
              Let&apos;s Gol.
            </p>

            <p>
              Świadczenia niewymienione w ofercie lub umowie nie są objęte
              ceną wyjazdu.
            </p>
          </TermsSection>

          <TermsSection
            id="platnosci"
            number={4}
            title="Cena i płatności"
          >
            <p>
              Cena wyjazdu oraz wysokość i terminy poszczególnych płatności
              wskazane są w umowie.
            </p>

            <p>
              Rezerwacja zostaje potwierdzona po spełnieniu warunków
              wskazanych w umowie, w tym dokonaniu wymaganej płatności.
            </p>

            <p>
              Brak płatności w ustalonym terminie może skutkować
              konsekwencjami określonymi w zawartej umowie.
            </p>
          </TermsSection>

          <TermsSection
            id="bilety"
            number={5}
            title="Bilety na mecz"
          >
            <p>
              Jeżeli bilet na mecz jest elementem pakietu, Let&apos;s Gol
              zapewnia bilet w kategorii określonej w ofercie lub umowie.
            </p>

            <p>
              Dokładne miejsce na stadionie może być uzależnione od sposobu
              dystrybucji biletów przez klub lub operatora biletowego.
            </p>

            <p>
              Bilet może zostać przekazany w formie elektronicznej,
              poprzez oficjalną aplikację klubu lub w inny sposób wymagany
              przez organizatora wydarzenia.
            </p>

            <p>
              Uczestnik zobowiązany jest przestrzegać regulaminu stadionu
              oraz zasad organizatora wydarzenia.
            </p>
          </TermsSection>

          <TermsSection
            id="termin-meczu"
            number={6}
            title="Termin meczu"
          >
            <p>
              Terminy i godziny wydarzeń sportowych ustalane są przez
              kluby, ligi, federacje lub inne uprawnione podmioty i mogą
              ulec zmianie.
            </p>

            <p>
              W przypadku zmiany terminu lub godziny meczu Let&apos;s Gol
              informuje uczestników oraz, w miarę możliwości, odpowiednio
              dostosowuje organizację wyjazdu.
            </p>

            <p>
              Jeżeli zmiana wpływa istotnie na warunki imprezy turystycznej,
              dalsze postępowanie odbywa się zgodnie z zawartą umową oraz
              obowiązującymi przepisami.
            </p>
          </TermsSection>

          <TermsSection
            id="transport"
            number={7}
            title="Transport"
          >
            <p>
              Godziny lotów i numery rejsów mogą zostać zmienione przez
              przewoźnika.
            </p>

            <p>
              Uczestnik zobowiązany jest do przestrzegania zasad
              przewoźnika dotyczących m.in. odprawy, bagażu, dokumentów
              podróży i bezpieczeństwa.
            </p>

            <p>
              Aktualne informacje organizacyjne dotyczące podróży
              przekazywane są uczestnikom przed wyjazdem.
            </p>
          </TermsSection>

          <TermsSection
            id="zakwaterowanie"
            number={8}
            title="Zakwaterowanie"
          >
            <p>
              Standard zakwaterowania oraz zakres świadczeń hotelowych
              określone są w ofercie lub umowie.
            </p>

            <p>
              Uczestnik zobowiązany jest przestrzegać regulaminu obiektu
              i odpowiada za szkody wyrządzone z własnej winy.
            </p>
          </TermsSection>

          <TermsSection
            id="dokumenty-podrozy"
            number={9}
            title="Dokumenty podróży"
          >
            <p>
              Każdy uczestnik odpowiada za posiadanie ważnego dowodu
              osobistego lub paszportu oraz innych dokumentów wymaganych
              podczas podróży.
            </p>

            <p>
              Dane przekazane Let&apos;s Gol powinny być zgodne
              z dokumentem, którym uczestnik będzie posługiwał się
              podczas podróży.
            </p>
          </TermsSection>

          <TermsSection
            id="zmiana-uczestnika"
            number={10}
            title="Zmiana uczestnika"
          >
            <p>
              Możliwość przepisania wyjazdu na inną osobę należy
              każdorazowo uzgodnić z Let&apos;s Gol.
            </p>

            <p>
              Jeżeli zmiana jest możliwa, uczestnik może zostać obciążony
              rzeczywistymi kosztami związanymi np. ze zmianą danych
              w rezerwacji lotniczej, hotelowej lub biletowej.
            </p>
          </TermsSection>

          <TermsSection
            id="rezygnacja"
            number={11}
            title="Rezygnacja z wyjazdu"
          >
            <p>
              Klient może zrezygnować z udziału przed rozpoczęciem wyjazdu.
            </p>

            <p>
              Rozliczenie dokonanych wpłat oraz ewentualnych kosztów
              rezygnacji odbywa się zgodnie z zawartą umową oraz
              obowiązującymi przepisami.
            </p>

            <p>
              W przypadku usług, które zostały już zakupione lub
              zarezerwowane dla konkretnego uczestnika, możliwość ich
              odzyskania lub zmiany może zależeć od warunków przewoźnika,
              hotelu, klubu lub innego usługodawcy.
            </p>
          </TermsSection>

          <TermsSection
            id="obowiazki"
            number={12}
            title="Obowiązki uczestnika"
          >
            <p>
              Uczestnik zobowiązany jest w szczególności do przestrzegania
              regulaminów przewoźników, hoteli i stadionów, stosowania się
              do informacji organizacyjnych przekazywanych przez
              Let&apos;s Gol oraz zachowania umożliwiającego bezpieczną
              realizację wyjazdu.
            </p>

            <p>
              Uczestnik odpowiada za szkody wyrządzone ze swojej winy.
            </p>
          </TermsSection>

          <TermsSection
            id="opieka"
            number={13}
            title="Opieka podczas wyjazdu"
          >
            <p>
              Opieka podczas wyjazdu może mieć charakter opieki na miejscu
              lub opieki zdalnej Organizatora – w zależności od wykupionego
              pakietu.
            </p>

            <p>
              W przypadku opieki na miejscu uczestnicy otrzymują przed
              podróżą dane kontaktowe koordynatora odpowiedzialnego za
              grupę, który pomaga w sprawach organizacyjnych związanych
              z realizacją programu wyjazdu.
            </p>

            <p>
              W przypadku opieki zdalnej Organizator pozostaje do
              dyspozycji uczestników na odległość i udziela wsparcia
              organizacyjnego w zakresie wynikającym z wykupionego pakietu.
            </p>
          </TermsSection>

          <TermsSection
            id="reklamacje"
            number={14}
            title="Reklamacje"
          >
            <p>
              Wszelkie problemy związane z realizacją świadczeń należy
              w miarę możliwości zgłaszać niezwłocznie podczas wyjazdu,
              aby Let&apos;s Gol miał możliwość podjęcia odpowiednich
              działań.
            </p>

            <p>
              Reklamacje można również kierować na adres:
            </p>

            <a
              href={`mailto:${organizer.email}`}
              className="inline-flex items-center gap-2 font-semibold text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary"
            >
              <Mail
                className="size-4 text-primary"
                aria-hidden="true"
              />
              {organizer.email}
            </a>
          </TermsSection>

          <TermsSection
            id="postanowienia-koncowe"
            number={15}
            title="Postanowienia końcowe"
          >
            <p>
              Szczegółowe warunki konkretnego wyjazdu określa zawarta
              z klientem umowa.
            </p>

            <p>
              W sprawach nieuregulowanych zastosowanie mają obowiązujące
              przepisy prawa, w szczególności przepisy dotyczące imprez
              turystycznych.
            </p>
          </TermsSection>
        </div>

        <section className="mt-16 rounded-xl border bg-card p-6 md:p-8">
          <div className="flex gap-4">
            <Scale
              className="mt-1 size-6 shrink-0 text-primary"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Kontakt z organizatorem
              </p>

              <h2 className="mt-2 font-sans text-xl font-black uppercase">
                Let&apos;s Gol – Wyjazdy na mecze
              </h2>

              <p className="mt-1 font-semibold text-foreground">
                {organizer.name}
              </p>

              <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Dane firmy
                  </p>

                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p>NIP: {organizer.nip}</p>
                    <p>REGON: {organizer.regon}</p>
                    <p>
                      Numer ewidencyjny:{" "}
                      <strong className="text-foreground">
                        {organizer.ewidencjaNumber}
                      </strong>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Kontakt
                  </p>

                  <div className="mt-2 space-y-2">
                    <a
                      href={`tel:${organizer.phoneHref}`}
                      className="flex w-fit items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      <Phone
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      {organizer.phone}
                    </a>

                    <a
                      href={`mailto:${organizer.email}`}
                      className="flex w-fit items-center gap-2 break-all font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      <Mail
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {organizer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-3 rounded-lg bg-muted p-4 text-xs leading-5 text-muted-foreground">
            <ShieldCheck
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />

            <p>
              Szczegółowe warunki konkretnego wyjazdu, zakres świadczeń,
              cena oraz terminy płatności określa oferta i zawarta
              z klientem umowa.
            </p>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2
              className="size-4 text-primary"
              aria-hidden="true"
            />
            Ostatnia aktualizacja: 20 września 2026 r.
          </p>
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            href="/polityka-prywatnosci"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText
              className="size-4"
              aria-hidden="true"
            />
            Zobacz także Politykę prywatności
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
