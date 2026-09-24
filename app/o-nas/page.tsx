import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  getPublishedGallery,
  getSiteContent,
  type SiteContent,
} from "@/lib/content"
import { breadcrumbSchema, localizedAlternates, socialMetadata } from "@/lib/seo"
import { AboutStorySlider } from "@/components/about-story-slider"
import { getRequestLocale } from "@/lib/i18n-request"
import { routeFor } from "@/lib/i18n"
import { getSeoCopy } from "@/lib/seo-copy"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const { title, description } = getSeoCopy("about", locale)
  return { title, description, alternates: localizedAlternates("/o-nas", locale), ...socialMetadata(title, description, routeFor(locale, "/o-nas"), locale) }
}

export default async function AboutPage() {
  const locale = await getRequestLocale()
  const isEn = locale === "en"
  const t = (pl: string, en: string) => isEn ? en : pl
  const [content, gallery] = process.env.DATABASE_URL
    ? await Promise.all([
        getSiteContent().catch(() => ({} as SiteContent)),
        getPublishedGallery(locale).catch(() => []),
      ])
    : ([{} as SiteContent, []] as const)

  const galleryImages = gallery.slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              {
                name: t("Strona główna", "Home"),
                path: routeFor(locale, "/"),
              },
              {
                name: t("O nas", "About us"),
                path: routeFor(locale, "/o-nas"),
              },
            ]),
            {
              "@type": "AboutPage",
              name: t("O Let's Gol", "About Let's Gol"),
              url: `https://letsgol.eu${routeFor(locale, "/o-nas")}`,
              inLanguage: isEn ? "en-GB" : "pl-PL",
              description:
                t("Historia Łukasza i Mateusza, których przyjaźń, piłka nożna i wspólne podróże dały początek Let's Gol.", "The story of Lukasz and Mateusz, whose friendship, football and shared travels became Let's Gol."),
              mainEntity: {
                "@id": "https://letsgol.eu/#organization",
              },
            },
          ],
        }}
      />

      <SiteHeader />

     <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-foreground pt-20 text-white lg:min-h-[100svh]">
  <div className="absolute inset-x-0 bottom-0 top-20">
    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie-mobile.webp"
      alt={t("Łukasz i Mateusz na trybunach stadionu w Barcelonie", "Lukasz and Mateusz in the stands at a stadium in Barcelona")}
      fill
      priority
      quality={90}
      className="object-cover object-[33%_35%] md:hidden"
      sizes="100vw"
    />

    <Image
      src="/images/o-nas/lukasz-mateusz-na-stadionie.webp"
      alt={t("Łukasz i Mateusz na trybunach stadionu w Barcelonie", "Lukasz and Mateusz in the stands at a stadium in Barcelona")}
      fill
      priority
      className="hidden object-cover object-[50%_100%] md:block"
      sizes="100vw"
    />

    <div className="absolute inset-0 bg-black/20" />

    

    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black via-black/65 to-transparent" />
  </div>

  <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 md:px-6 md:pb-20 lg:pb-24">
    <p className="eyebrow eyebrow-on-dark">
      {t("Nasza historia", "Our story")}
    </p>

    <h1 className="mt-5 max-w-5xl text-balance font-sans text-4xl font-black uppercase leading-[1.2] tracking-normal sm:text-6xl lg:text-6xl lg:leading-none">
      {t("Zaczęło się od przyjaźni i wspólnej pasji", "It started with friendship and a shared passion")}
    </h1>

    <div className="mt-6 flex max-w-3xl flex-col gap-6 border-l-4 border-primary pl-5 md:flex-row md:items-end md:justify-between md:pl-7">
      <p className="text-lg leading-8 text-white/85 md:text-xl">
        {t("Kiedyś jeździliśmy na mecze, spełniając własne marzenia. Dziś zabieramy Was, żebyście mogli spełniać swoje.", "We once travelled to matches to fulfil our own dreams. Today, we take you along so you can fulfil yours.")}
      </p>
    </div>
  </div>
</section>

      <section id="nasza-historia" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t("Blisko 20 lat razem", "Almost 20 years together")}</p>
           <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  {t('Znamy się jak "łyse konie"', "We know each other inside out")}
</h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7 lg:pt-3">
            <p>
             {t("Łączy nas wieloletnia przyjaźń, piłka nożna i pasja do podróżowania. Przez lata odwiedziliśmy dziesiątki stadionów, przeżyliśmy setki piłkarskich emocji i przekonaliśmy się, że najlepsze wspomnienia powstają wtedy, kiedy dzieli się je z innymi.", "We are connected by a long friendship, football and a passion for travel. Over the years, we have visited dozens of stadiums and learned that the best memories are the ones shared with others.")}
            </p>
            <p>
              {t("Lubimy dobrą atmosferę, poznawanie nowych miejsc i ludzi. Każdy wyjazd traktujemy jak kolejną historię, którą warto zapamiętać.", "We enjoy a great atmosphere, new places and meeting people. Every trip is another story worth remembering.")}
            </p>
            <p className="font-sans text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              {t("I właśnie z tej pasji powstało Let's Gol.", "That passion is how Let's Gol was born.")}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-secondary/55 py-16 md:py-24">
  <div className="mx-auto max-w-7xl px-4 md:px-6">
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
      <div className="lg:col-span-7">
        <p className="eyebrow">{t("Zaczęło się od marzenia", "It started with a dream")}</p>

        <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
          {t("Dziś spełniamy je razem z Wami", "Today, we fulfil it together with you")}
        </h2>
      </div>

      <div className="lg:col-span-5 lg:pb-1">
        <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {t("Piłka i wspólne wyjazdy były z nami na długo przed powstaniem Let's Gol. Zmieniło się jedno - dziś te emocje przeżywamy razem z Wami.", "Football and shared trips were part of our lives long before Let's Gol. One thing has changed - today, we experience those emotions together with you.")}
        </p>
      </div>
    </div>

    <div className="mt-10 md:mt-14">
      <AboutStorySlider locale={locale} />
    </div>

    <div className="mt-8 grid gap-6 border-t border-foreground/15 pt-7 md:grid-cols-2 md:gap-12">
      <div>
        <p className="font-sans text-xl font-black uppercase md:text-2xl">
          {t("Zaczęło się dużo wcześniej", "It began much earlier")}
        </p>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
          {t("Pierwsze mecze, stadiony i wspólne podróże. Bez planu na firmę, po prostu z zajawki, która została z nami na lata.", "First matches, stadiums and shared journeys. There was no business plan, just an enthusiasm that stayed with us for years.")}
        </p>
      </div>

      <div className="md:text-right">
        <p className="font-sans text-xl font-black uppercase md:text-2xl">
          {t("Dzisiaj robimy to dalej", "We are still doing it today")}
        </p>

        <p className="mt-3 ml-auto max-w-lg text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
          {t("Nadal jeździmy na stadiony. Tyle że dziś wykorzystujemy własne doświadczenie, żeby zabierać tam również innych kibiców.", "We still travel to stadiums. Today, we use our experience to take other supporters there too.")}
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t("Po co powstało Let's Gol?", "Why did we create Let's Gol?")}</p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  {t("Żebyście mogli przeżywać mecz, a nie organizację", "So you can experience the match, not the logistics")}
</h2>
          </div>

          <div className="space-y-7 text-base leading-8 text-muted-foreground md:text-lg lg:col-span-7">
            <p>
              {t("Wiemy, ile emocji daje wyjazd na mecz ukochanej drużyny. Wiemy też, ile czasu i nerwów potrafi kosztować jego organizacja. Dlatego stworzyliśmy Let's Gol - żebyście mogli skupić się na tym, co najważniejsze: emocjach, atmosferze stadionu i spełnianiu piłkarskich marzeń.", "We know the emotion of seeing your favourite team live. We also know how much time and stress the planning can take. We created Let's Gol so you can focus on the atmosphere, the match and making football dreams come true.")}
            </p>
            <p className="font-sans text-3xl font-black uppercase text-foreground md:text-4xl">
              {t("Od tego jesteśmy my.", "That is what we are here for.")}
            </p>
            <p>
              {t("Zadbamy o Wasz wyjazd od A do Z. Przelot, nocleg, bilety i wszystkie najważniejsze szczegóły. Od pierwszych przygotowań aż po ostatni gwizdek, ciągle jesteśmy z Wami. Let's Gol pilnuje szczegółów - Ty tylko przeżywasz mecz.", "We look after the journey from start to finish: flights, accommodation, tickets and every essential detail. From the first preparations to the final whistle, our team is with you. Let's Gol handles the details so you can experience the match.")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-foreground py-16 text-background md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="eyebrow eyebrow-on-dark">{t("Nasza zasada", "Our principle")}</p>
          <blockquote className="mt-7 max-w-5xl text-balance font-sans text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            {t("Tak, jak sami chcielibyśmy pojechać na mecz.", "The way we would want to travel ourselves.")}
          </blockquote>
          <p className="mt-8 max-w-2xl text-base leading-7 text-background/65 md:text-lg">
            {t("Nie proponujemy Wam niczego, czego sami byśmy nie wybrali. Prosta zasada, której trzymamy się przy każdym wyjeździe.", "We never offer something we would not choose ourselves. It is a simple rule we follow on every trip.")}
          </p>
        </div>
      </section>

      <section className="bg-secondary/35 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow={t("Poznajcie nas", "Meet us")}
            title={t("Dwie twarze Let's Gol", "The two faces of Let's Gol")}
            intro={t("Dwie osoby, różne zadania, jeden wspólny cel - zabierać Was tam, gdzie piłkarskie emocje przeżywa się naprawdę. Każdy z nas odpowiada za inną część wyjazdu, a razem tworzymy Let's Gol.", "Two people, different responsibilities and one shared goal: taking you where football is truly experienced. Each of us handles a different part of the journey, and together we are Let's Gol.")}
            align="left"
          />

          <div className="mt-12 border-y border-foreground/20">
            <article className="grid gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-16">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted lg:col-span-5">
                <Image
                  src="/images/o-nas/mateusz-wspolzalozyciel.webp"
                  alt={t("Mateusz, współzałożyciel i główny koordynator wyjazdów Let's Gol", "Mateusz, Let's Gol co-founder and lead trip coordinator")}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="flex flex-col justify-center lg:col-span-7">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {t("Współzałożyciel Let's Gol", "Co-founder of Let's Gol")}
                </p>
                <h3 className="mt-2 font-sans text-5xl font-black uppercase leading-none md:text-7xl">
                  Mateusz
                </h3>
               <p className="mt-4 font-sans text-xl font-black uppercase leading-tight text-amber-800 md:text-2xl">
  {t("Główny koordynator wyjazdów", "Lead trip coordinator")}
</p>

<div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
  <p>
    {t("Do tańca i do różańca. Gdy trzeba coś załatwić, znaleźć rozwiązanie albo szybko zareagować - Mateusz prawdopodobnie już to robi.", "Adaptable, practical and always ready to act. When something needs arranging or a quick solution is required, Mateusz is probably already handling it.")}
  </p>

  <p>
    {t("Podczas wyjazdów odpowiada przede wszystkim za Was na miejscu, organizację, wspólne zwiedzanie, dobrą atmosferę i to, żebyście mogli skupić się na tym, po co przyjechaliście: emocjach i spełnianiu piłkarskich marzeń.", "On each trip, he looks after travellers on site, coordinates the programme and helps create the atmosphere so you can focus on the reason you came: football and the match-day experience.")}
  </p>

  <p>
    {t("Szczególne miejsce zajmuje u niego Barcelona. Po latach regularnych podróży zna ją od podszewki i chętnie pokaże Wam miejsca, których nie znajdziecie w pierwszym lepszym przewodniku.", "Barcelona holds a special place for him. After years of regular visits, he knows it inside out and enjoys showing travellers places beyond the standard guidebooks.")}
  </p>

  <p className="font-bold text-foreground">
    {t("Jego zadanie? Sprawić, żeby wyjazd, na który czekaliście miesiącami, stał się wspomnieniem, do którego będziecie wracać przez lata.", "His goal is to turn the trip you have waited months for into a memory you will return to for years.")}
  </p>
</div>
              </div>
            </article>

            <article className="grid gap-8 border-t border-foreground/20 py-10 md:py-14 lg:grid-cols-12 lg:gap-16">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted lg:order-2 lg:col-span-5">
                <Image
                  src="/images/o-nas/lukasz-wspolzalozyciel.webp"
                  alt={t("Łukasz, współzałożyciel i dyrektor organizacyjny Let's Gol", "Lukasz, Let's Gol co-founder and operations director")}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="flex flex-col justify-center lg:order-1 lg:col-span-7">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {t("Współzałożyciel Let's Gol", "Co-founder of Let's Gol")}
                </p>
                <h3 className="mt-2 font-sans text-5xl font-black uppercase leading-none md:text-7xl">
                  Łukasz
                </h3>
                <p className="mt-4 font-sans text-xl font-black uppercase leading-tight text-amber-800 md:text-2xl">
                  {t("Dyrektor organizacyjny", "Operations director")}
                </p>

                <div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
                <p>
  {t("Jeśli Mateusz dba o to, żebyście przeżywali wyjazd, Łukasz dba o to, żeby wszystko, co do niego prowadzi, było dopięte na ostatni guzik.", "While Mateusz looks after the experience itself, Lukasz makes sure everything leading up to it is thoroughly prepared.")}
</p>

<p>
  {t("To on odpowiada za loty, sprawdzone noclegi, bilety, miejsca na stadionie i wszystkie szczegóły, które zamieniają plan wyjazdu w spełnione piłkarskie marzenie.", "He is responsible for flights, trusted accommodation, tickets, stadium seating and the details that turn a plan into a football experience.")}
</p>

<p className="font-bold text-foreground">
  {t("Krótko mówiąc: zanim Wy zaczniecie odliczać dni do wyjazdu, Łukasz już pilnuje, żeby wszystko było gotowe.", "Before you start counting down the days, Lukasz is already making sure everything is ready.")}
</p>

<p>
  {t("A kiedy przychodzi dzień meczu, nie zostaje za biurkiem. Regularnie rusza z nami na stadiony Europy i razem z Mateuszem jest do Waszej dyspozycji również na miejscu.", "When match day comes, he does not stay behind a desk. He regularly joins trips across Europe and supports travellers on site alongside Mateusz.")}
</p>

<p className="font-bold text-foreground">
  {t("Jego zadanie? Dopiąć każdy szczegół, żeby między Wami a wymarzonym meczem zostało już tylko odliczanie dni do wyjazdu.", "His goal is to complete every detail so that all you have left to do is count down to the match.")}
</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-black uppercase tracking-widest">
              Łukasz + Mateusz = Let&apos;s Gol
            </p>
            <h2 className="mt-5 text-balance font-sans text-4xl font-black uppercase leading-[1.1] tracking-tight md:text-6xl md:leading-[1.1]">
  {t("Dwa różne charaktery. Jedna wspólna zajawka.", "Two different personalities. One shared passion.")}
</h2>
          </div>

          <div className="lg:col-span-7">
            <p className="font-sans text-3xl font-black uppercase leading-tight md:text-5xl">
              {t("Piłka. Podróże. Ludzie. Emocje.", "Football. Travel. People. Emotion.")}
            </p>
            <div className="mt-8 space-y-5 text-base leading-8 md:text-lg">
              <p>
                {t("Nie chcemy być firmą, która tylko sprzeda Ci wyjazd i powie do zobaczenia. Chcemy, żebyś po powrocie pomyślał:", "We do not want to be a company that simply sells you a trip. We want you to return home thinking:")}
              </p>
              <blockquote className="border-l-4 border-foreground pl-5 font-sans text-3xl font-black uppercase leading-tight md:text-4xl">
                {t("To było coś więcej niż mecz.", "That was more than a match.")}
              </blockquote>
              <p>{t("Bo właśnie takie wyjazdy lubimy najbardziej.", "Those are the trips we value most.")}</p>
            </div>
          </div>
        </div>
      </section>

      {galleryImages.length ? (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={t("Dalszy ciąg historii", "The story continues")}
                title={t("Teraz przeżywamy to razem", "Now we experience it together")}
                intro={t("Stadiony, miasta i ludzie, z którymi dzielimy kolejne piłkarskie podróże.", "Stadiums, cities and people with whom we share each new football journey.")}
                align="left"
              />
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href={routeFor(locale, "/galeria")} />}
              >
                {t("Zobacz całą galerię", "View the full gallery")}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-12">
              {galleryImages.map((item, index) => (
                <figure
                  key={item.id}
                  className={`relative min-h-72 overflow-hidden rounded-xl bg-muted ${
                    index === 0 ? "md:col-span-6" : "md:col-span-3"
                  }`}
                >
                  <Image
                    src={
                      item.mediaId
                        ? `/api/media/${item.mediaId}`
                        : item.image
                    }
                    alt={
                      item.alt ||
                      item.title ||
                      t("Zdjęcie z wyjazdu Let's Gol", "Photo from a Let's Gol trip")
                    }
                    fill
                    className="object-cover"
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/75 to-transparent" />
                  {item.title || item.city ? (
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold text-white">
                      {[item.title, item.city].filter(Boolean).join(" · ")}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-foreground py-14 text-background md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-on-dark">
              {t("Napiszmy kolejny rozdział razem", "Let us write the next chapter together")}
            </p>
            <h2 className="mt-4 text-balance font-sans text-4xl font-black uppercase leading-none md:text-6xl">
              {t("Jaki mecz chodzi Ci po głowie?", "Which match is on your mind?")}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-12 gap-3 bg-primary px-6 text-primary-foreground hover:bg-primary/85"
              nativeButton={false}
              render={<Link href={routeFor(locale, "/wyjazdy")} />}
            >
              {t("Zobacz wyjazdy", "View trips")}
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-background/30 bg-transparent px-6 text-background hover:bg-background hover:text-foreground"
              nativeButton={false}
              render={<button type="button" data-open-floating-contact />}
            >
              {t("Skontaktuj się", "Contact us")}
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  )
}
