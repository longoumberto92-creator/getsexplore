export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-14 md:py-40">
      {/* ─── Background layers ─────────────────────────────────────────────── */}

      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #006D77 0%, #00505E 45%, #003D4F 100%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Large ghost ring — top right */}
      <svg
        className="pointer-events-none absolute -right-24 -top-24 opacity-[0.07]"
        width="520"
        height="520"
        viewBox="0 0 520 520"
        fill="none"
      >
        <circle cx="260" cy="260" r="240" stroke="white" strokeWidth="1" />
        <circle cx="260" cy="260" r="180" stroke="white" strokeWidth="0.6" />
        <circle cx="260" cy="260" r="120" stroke="white" strokeWidth="0.4" />
      </svg>

      {/* Small ghost ring — bottom left */}
      <svg
        className="pointer-events-none absolute -bottom-16 -left-16 opacity-[0.06]"
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r="120" stroke="white" strokeWidth="0.8" />
        <circle cx="140" cy="140" r="80" stroke="white" strokeWidth="0.5" />
      </svg>

      {/* Diagonal decorative lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="100%" x2="30%" y2="0" stroke="white" strokeWidth="1" />
        <line x1="70%" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" />
      </svg>

      {/* Coral accent glow — bottom centre */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(226,149,120,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Top light leak */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-px w-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />

      {/* ─── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">

        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-6" style={{ backgroundColor: "rgba(255,255,255,0.4)" }} />
          <span className="font-sans text-xs font-light uppercase tracking-[0.35em] text-white/50">
            Inizia ora
          </span>
          <div className="h-px w-6" style={{ backgroundColor: "rgba(255,255,255,0.4)" }} />
        </div>

        {/* Title */}
        <h2
          className="mb-6 font-serif font-light leading-[1.05] tracking-tight text-white"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
        >
          Inizia il tuo
          <br />
          <em className="not-italic" style={{ color: "#E29578" }}>
            prossimo viaggio
          </em>
        </h2>

        {/* Subtitle */}
        <p
          className="mb-12 max-w-xl font-sans text-base font-light leading-relaxed md:text-lg"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Smetti di perdere ore su Google. Lascia che GetSXplore ti racconti
          la tua prossima avventura.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/signup"
            className="cta-primary-btn flex items-center gap-2 rounded-full px-8 py-3.5 font-sans text-sm font-medium tracking-wider uppercase transition-all duration-300"
            style={{ backgroundColor: "#ffffff", color: "#003D4F" }}
          >
            Prova Gratis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="/prezzi"
            className="cta-secondary-btn flex items-center gap-2 rounded-full px-8 py-3.5 font-sans text-sm font-medium tracking-wider uppercase text-white transition-all duration-300"
            style={{ border: "1px solid rgba(255,255,255,0.35)" }}
          >
            Scopri i Prezzi
          </a>
        </div>

        {/* Fine print */}
        <p
          className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-xs font-light"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          <span>Nessuna carta di credito richiesta</span>
          <span
            className="hidden sm:inline"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            ·
          </span>
          <span>Primo itinerario gratuito</span>
        </p>

        {/* Decorative bottom ornament */}
        <div className="mt-16 flex items-center gap-3 opacity-30">
          <div className="h-px w-12" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88L5 0Z"
              fill="white"
            />
          </svg>
          <div className="h-px w-12" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
        </div>
      </div>
    </section>
  );
}
