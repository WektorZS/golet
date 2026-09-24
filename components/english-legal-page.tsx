import Link from "next/link"
import { FileText, ShieldCheck } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { breadcrumbSchema } from "@/lib/seo"

type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

const privacySections: LegalSection[] = [
  { title: "Data controller", paragraphs: ["The controller of personal data is LB Coaching Lukasz Borger, operating under the Let's Gol brand, ul. Stefana Roweckiego 1/2, 72-010 Police, Poland, tax identification number NIP 8512915273. You can contact us at kontakt.letsgol@gmail.com or +48 501 465 318."] },
  { title: "What data we process", items: ["Identification and contact details provided in enquiry, booking and contact forms", "Information needed to prepare and perform a travel contract, including traveller details and selected services", "Correspondence, complaint and payment information", "Technical information such as IP address, device data and cookie identifiers where permitted"] },
  { title: "Purposes and legal grounds", items: ["Answering enquiries and preparing an offer - actions requested before entering into a contract", "Concluding and performing a travel contract - performance of a contract", "Accounting, tax and tour operator obligations - compliance with legal obligations", "Handling complaints and defending claims - our legitimate interest", "Optional analytics - your consent, which can be withdrawn at any time"] },
  { title: "Recipients of data", paragraphs: ["We disclose data only where necessary to provide the selected services or meet legal requirements. Recipients may include airlines and other carriers, hotels, ticket suppliers, insurers, payment and accounting providers, email and IT service providers, professional advisers and public authorities where required by law."] },
  { title: "International transfers", paragraphs: ["Some suppliers may process data outside the European Economic Area, for example when a carrier, hotel or technology provider is located elsewhere. Where required, we use a lawful transfer mechanism, including an adequacy decision or standard contractual clauses."] },
  { title: "How long we keep data", paragraphs: ["We retain data for the time needed to answer an enquiry or perform a contract, and then for the periods required by tax, accounting and tourism law or until relevant claims expire. Data processed on the basis of consent is retained until consent is withdrawn or the purpose ends."] },
  { title: "Your rights", items: ["Access your personal data and receive a copy", "Correct inaccurate or incomplete data", "Request erasure or restriction where the law allows", "Object to processing based on legitimate interests", "Receive portable data where applicable", "Withdraw consent without affecting earlier lawful processing", "Lodge a complaint with the President of the Polish Personal Data Protection Office"] },
  { title: "Cookies", paragraphs: ["The website uses essential cookies required for security, forms and saved preferences. Optional analytics cookies are used only after consent. You can accept, reject or change optional cookie settings through the privacy control available on the website. Browser settings can also remove or block cookies, although this may affect essential functions."] },
  { title: "Automated decisions and security", paragraphs: ["We do not use personal data to make decisions that produce legal or similarly significant effects solely by automated means. We use appropriate organisational and technical measures to protect data against loss, unauthorised access and misuse."] },
  { title: "Changes to this policy", paragraphs: ["We may update this policy when our services, legal obligations or technology change. The current version is always available on this page. Last updated: September 2026."] },
]

const termsSections: LegalSection[] = [
  { title: "Tour operator", paragraphs: ["Trips offered under the Let's Gol brand are organised by LB Coaching Lukasz Borger, NIP 8512915273, REGON 520474445. The organiser is entered in the Polish Central Register of Tour Operators under number 42848 and holds the financial security required by law."] },
  { title: "Scope and contract documents", paragraphs: ["These terms apply to package travel and other travel services offered by Let's Gol. The individual offer, booking confirmation, contract, programme and any additional agreed conditions form part of the contract. If an individual contract provision differs from these general terms, the individual provision takes precedence."] },
  { title: "Booking", items: ["Before booking, the traveller receives the main features of the trip, total price, payment schedule and relevant cancellation information", "A booking becomes binding when the contract is concluded or when the organiser confirms it in the agreed form", "The person booking for a group confirms that they are authorised to provide the other travellers' details and communicate information to them", "Travellers must provide accurate details and promptly report any changes"] },
  { title: "Price and payment", paragraphs: ["The price, deposit and balance due date are shown in the offer or contract. Additional services requested after booking may increase the price. Any statutory price increase is made only on the grounds and within the limits allowed by applicable package travel law, with the corresponding right to a price reduction where relevant."] },
  { title: "Match tickets and fixture changes", paragraphs: ["Ticket category and delivery method are specified in the offer. Clubs, leagues and competition organisers may change match dates, kick-off times, venues, ticket formats or admission rules. Such decisions are outside the organiser's control. We inform travellers of confirmed changes and adjust travel arrangements where possible. A material change is handled under the contract and applicable law."] },
  { title: "Travel documents and traveller duties", items: ["Each traveller must hold valid identity and travel documents and comply with entry, carrier, venue and safety rules", "The traveller must arrive at agreed meeting points and departures on time", "The organiser must be informed promptly about any lack of conformity so it can be addressed during the trip", "A traveller may be responsible for losses caused by providing incorrect information or seriously breaching the rules"] },
  { title: "Changes and cancellation by the traveller", paragraphs: ["A traveller may cancel before departure. The organiser may deduct an appropriate and justifiable cancellation fee reflecting the time of cancellation and non-refundable costs, as described in the contract or calculated on request. A traveller may transfer the booking to another eligible person where the statutory notice and cost conditions are met."] },
  { title: "Changes or cancellation by the organiser", paragraphs: ["We may make minor changes and will inform travellers clearly. If a proposed change significantly affects the main characteristics of the trip or increases the price beyond the statutory threshold, the traveller receives the choices required by law. The organiser may cancel in cases permitted by law, including insufficient participant numbers notified within the agreed deadline or unavoidable and extraordinary circumstances."] },
  { title: "Support and responsibility", paragraphs: ["Depending on the package, support may be provided by an on-site coordinator or remotely. The organiser is responsible for the proper performance of included travel services as required by applicable law. Where a service does not conform to the contract, the traveller should contact us without undue delay so that an appropriate remedy can be arranged."] },
  { title: "Complaints", paragraphs: ["Complaints should describe the issue, the requested remedy and the booking details. They can be sent to kontakt.letsgol@gmail.com or to the organiser's postal address. We recommend reporting problems during the trip whenever possible, as this gives us the opportunity to resolve them promptly."] },
  { title: "Unavoidable and extraordinary circumstances", paragraphs: ["Rights and obligations arising from events outside the parties' control, including their effect on cancellation, refunds or assistance, are governed by the contract and applicable package travel law."] },
  { title: "Final provisions", paragraphs: ["Polish law applies without limiting any mandatory consumer protection available to the traveller. Consumer disputes may also be submitted to an authorised alternative dispute resolution body where applicable. These English terms are a translation for convenience. If a discrepancy arises, the Polish contract documents control to the extent permitted by law. Last updated: September 2026."] },
]

export function EnglishLegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy"
  const title = privacy ? "Privacy and cookie policy" : "Terms and conditions"
  const intro = privacy
    ? "How Let's Gol processes personal data and uses cookies."
    : "The rules that apply when booking and taking part in a Let's Gol football trip."
  const sections = privacy ? privacySections : termsSections
  const path = privacy ? "/en/privacy-policy" : "/en/terms-and-conditions"
  const otherPath = privacy ? "/en/terms-and-conditions" : "/en/privacy-policy"
  const OtherIcon = privacy ? FileText : ShieldCheck

  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Home", path: "/en" }, { name: title, path }]), { "@type": "WebPage", name: title, url: `https://letsgol.eu${path}`, inLanguage: "en-GB" }] }} />
      <SiteHeader />
      <section className="bg-foreground px-4 pb-16 pt-36 text-background md:px-6 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow-on-dark">Legal information</p>
          <h1 className="mt-6 max-w-5xl text-balance font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">{intro}</p>
        </div>
      </section>
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Document sections" className="surface-card p-4">
              {sections.map((section, index) => <a className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-secondary" href={`#legal-${index + 1}`} key={section.title}>{String(index + 1).padStart(2, "0")} {section.title}</a>)}
            </nav>
          </aside>
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section className="scroll-mt-28 border-b border-foreground/10 pb-10" id={`legal-${index + 1}`} key={section.title}>
                <p className="font-mono text-xs font-black text-amber-800">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-sans text-3xl font-black uppercase leading-tight">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p className="mt-5 max-w-3xl leading-8 text-muted-foreground" key={paragraph}>{paragraph}</p>)}
                {section.items ? <ul className="mt-5 max-w-3xl space-y-3 text-muted-foreground">{section.items.map((item) => <li className="flex gap-3 leading-7" key={item}><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul> : null}
              </section>
            ))}
            <div className="surface-card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4"><OtherIcon className="size-6 text-primary" /><p className="font-bold">{privacy ? "Read the terms and conditions" : "Read the privacy and cookie policy"}</p></div>
              <Button nativeButton={false} render={<Link href={otherPath} />}>Open document</Button>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
