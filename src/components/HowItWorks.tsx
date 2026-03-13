const steps = [
  {
    n: "01",
    title: "Raccontaci il tuo stile",
    body: "Descrivi come viaggi, cosa ami, quanto tempo hai. Niente form noiosi — solo una conversazione.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="4.5" stroke="#E29578" strokeWidth="1.5" />
        <path
          d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9"
          stroke="#E29578"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    n: "02",
    title: "L'AI ricerca per te",
    body: "Analizziamo Instagram, TikTok e blog locali per trovare i posti giusti — non le solite guide turistiche.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="12" cy="12" r="6.5" stroke="#E29578" strokeWidth="1.5" />
        <path
          d="M17 17l5.5 5.5"
          stroke="#E29578"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 12h6M12 9v6"
          stroke="#E29578"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Ricevi la tua guida",
    body: "Un itinerario digitale immersivo e una guida cartacea curata, spedita a casa prima della partenza.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M5 7.5C5 6.12 6.12 5 7.5 5H14v18H7.5A2.5 2.5 0 015 20.5V7.5z"
          stroke="#E29578"
          strokeWidth="1.5"
        />
        <path
          d="M14 5h6.5A2.5 2.5 0 0123 7.5V20.5A2.5 2.5 0 0120.5 23H14V5z"
          stroke="#E29578"
          strokeWidth="1.5"
        />
        <path
          d="M14 5v18"
          stroke="#E29578"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M8 10h4M8 13.5h4" stroke="#E29578" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 10h4M16 13.5h4" stroke="#E29578" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="come-funziona"
      className="relative overflow-hidden px-6 py-28 md:px-14 md:py-36"
      style={{ backgroundColor: "#0E0E16" }}
    >
      {/* Faint teal glow top-left */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full"
        style={{
          background: "radial-gradient(circle, #006D7718 0%, transparent 70%)",
        }}
      />
      {/* Faint coral glow bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full"
        style={{
          background: "radial-gradient(circle, #E2957812 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-8" style={{ backgroundColor: "#006D77" }} />
            <span
              className="font-sans text-xs font-light uppercase tracking-[0.35em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Il processo
            </span>
            <div className="h-px w-8" style={{ backgroundColor: "#006D77" }} />
          </div>
          <h2
            className="font-serif text-4xl font-light italic text-white/90 md:text-5xl lg:text-6xl"
          >
            Come funziona
          </h2>
          <p
            className="mt-4 max-w-sm font-sans text-sm font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Tre passi per trasformare un'idea in un viaggio su misura.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ n, title, body, icon }) => (
            <article
              key={n}
              className="step-card group relative flex flex-col overflow-hidden rounded-xl p-8"
            >
              {/* Ghost number — top right */}
              <span
                className="step-ghost-number pointer-events-none absolute -right-2 -top-4 select-none font-serif font-light leading-none transition-opacity duration-500"
                style={{
                  fontSize: "clamp(6rem, 10vw, 9rem)",
                  color: "#006D77",
                  opacity: 0.07,
                }}
              >
                {n}
              </span>

              {/* Icon */}
              <div className="mb-7 w-fit">{icon}</div>

              {/* Coral step label */}
              <span
                className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color: "#E29578" }}
              >
                Step {n}
              </span>

              {/* Title */}
              <h3
                className="mb-4 font-serif text-2xl font-light text-white/90 md:text-[1.6rem]"
                style={{ lineHeight: 1.2 }}
              >
                {title}
              </h3>

              {/* Body */}
              <p
                className="font-sans text-sm font-light leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {body}
              </p>

              {/* Bottom accent line */}
              <div className="mt-auto pt-8">
                <div
                  className="step-accent-line h-px w-8 transition-all duration-500"
                  style={{ backgroundColor: "#006D77" }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Connector dots between cards — desktop only */}
        <div className="mt-8 hidden items-center justify-center gap-2 md:flex">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: i === 1 ? "#E29578" : "rgba(0,109,119,0.4)" }}
              />
              {i < 2 && (
                <div
                  className="h-px w-24"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,109,119,0.3), rgba(0,109,119,0.1))",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
