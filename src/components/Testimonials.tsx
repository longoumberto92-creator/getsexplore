const testimonials = [
  {
    initials: "GM",
    name: "Giulia M.",
    from: "Roma",
    destination: "Tokyo",
    avatarColor: "#006D77",
    quote:
      "Ho scoperto una Tokyo che non avrei mai trovato su Google. Ogni giorno aveva il suo ritmo, la sua luce. Non una guida — un racconto.",
  },
  {
    initials: "MB",
    name: "Marco B.",
    from: "Milano",
    destination: "Kyoto",
    avatarColor: "#2A4A4C",
    quote:
      "La guida sembrava scritta da qualcuno che amasse quella città come amo la mia. I posti consigliati erano segreti — nel senso più bello.",
  },
  {
    initials: "SL",
    name: "Sara & Luca",
    from: "Firenze",
    destination: "Marrakech",
    avatarColor: "#3D2E28",
    quote:
      "Il riad era un segreto custodito da chi ci abita da sempre. La cena nel deserto, al tramonto, è stata la scena più bella della nostra vita.",
  },
];

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden px-6 py-28 md:px-14 md:py-36"
      style={{ backgroundColor: "#0E0E16" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,109,119,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(226,149,120,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px w-8" style={{ backgroundColor: "#E29578" }} />
            <span
              className="font-sans text-xs font-light uppercase tracking-[0.35em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Storie reali
            </span>
            <div className="h-px w-8" style={{ backgroundColor: "#E29578" }} />
          </div>
          <h2 className="font-serif text-4xl font-light italic text-white/90 md:text-5xl lg:text-6xl">
            Chi ha già viaggiato
            <br className="hidden md:block" />
            <span style={{ color: "#E29578" }}> con GetSXplore</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map(({ initials, name, from, destination, avatarColor, quote }) => (
            <figure
              key={name}
              className="testimonial-card relative flex flex-col rounded-xl p-8 transition-all duration-500"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Opening quote mark */}
              <span
                className="pointer-events-none absolute right-7 top-5 select-none font-serif font-light leading-none"
                style={{ fontSize: "7rem", color: "#006D77", opacity: 0.12 }}
              >
                &ldquo;
              </span>

              {/* Quote */}
              <blockquote className="relative z-10 mb-8 flex-1">
                <p
                  className="font-serif text-lg font-light italic leading-relaxed text-white/80 md:text-xl"
                  style={{ lineHeight: 1.6 }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>

              {/* Thin separator */}
              <div
                className="mb-6 h-px w-full"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              />

              {/* Author */}
              <figcaption className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span className="font-sans text-xs font-medium uppercase tracking-wider text-white/80">
                    {initials}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-medium text-white/85">{name}</p>
                  <p
                    className="mt-0.5 flex items-center gap-1.5 font-sans text-xs font-light"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {from}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                      <path
                        d="M2 6h8M6.5 3l3 3-3 3"
                        stroke="#006D77"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ color: "#006D77" }}>{destination}</span>
                  </p>
                </div>

                {/* Coral star */}
                <span
                  className="shrink-0 font-serif text-base leading-none"
                  style={{ color: "#E29578", opacity: 0.7 }}
                >
                  ✦
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
