<div
  className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  aria-labelledby="cookie-consent-title"
>
  <section className="w-full max-w-xl rounded-xl border border-white/10 bg-card p-6 text-card-foreground shadow-2xl md:p-8">
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Cookie
            className="size-6 text-black"
            aria-hidden="true"
          />
        </span>

        <h2
          id="cookie-consent-title"
          className="font-sans text-2xl font-black uppercase"
        >
          Witaj w Let&apos;s Gol!
        </h2>
      </div>

      <p className="text-base font-semibold leading-relaxed">
        Zanim ruszysz z nami na stadion, wybierz,
        jak możemy korzystać z cookies.
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Niezbędne cookies są wymagane do prawidłowego
        działania strony i zapewnienia jej podstawowej
        funkcjonalności.
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Jeśli wyrazisz zgodę na analitykę, będziemy
        zbierać anonimowe informacje o tym, jak
        użytkownicy korzystają z naszej strony.
        Dzięki temu możemy analizować liczbę odwiedzin,
        źródła ruchu oraz popularność poszczególnych
        podstron.
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Analityka pomaga nam również poprawiać działanie
        i funkcjonalność serwisu.
      </p>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={() => choose("rejected")}
          className="w-full sm:w-auto"
        >
          Tylko niezbędne
        </Button>

        <Button
          size="lg"
          onClick={() => choose("accepted")}
          className="w-full sm:w-auto"
        >
          Akceptuję analitykę
        </Button>
      </div>
    </div>
  </section>
</div>