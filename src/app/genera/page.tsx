"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const STYLES = [
  { value: "cultura",  label: "Cultura & Storia" },
  { value: "cibo",     label: "Gastronomia & Cibo" },
  { value: "natura",   label: "Natura & Paesaggi" },
  { value: "avventura",label: "Avventura" },
  { value: "lusso",    label: "Lusso & Relax" },
];

const DAY_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10];

// Minimal markdown renderer: handles ## headings and --- separators
function renderItinerary(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      // Day heading
      const [dayPart, ...rest] = line.replace("## ", "").split("—");
      elements.push(
        <h3
          key={i}
          className="mt-10 mb-3 font-serif text-2xl font-light text-white/90 md:text-3xl"
        >
          <span style={{ color: "#006D77" }}>{dayPart.trim()}</span>
          {rest.length > 0 && (
            <span style={{ color: "#E29578" }}>{" — " + rest.join("—").trim()}</span>
          )}
        </h3>
      );
    } else if (line.trim() === "---") {
      elements.push(
        <div
          key={i}
          className="my-8 flex items-center gap-4"
        >
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
          <span style={{ color: "#E29578", opacity: 0.6 }}>✦</span>
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />);
    } else {
      elements.push(
        <p
          key={i}
          className="font-sans text-base font-light leading-[1.85]"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {line}
        </p>
      );
    }
  });

  return elements;
}

function GeneraContent() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get("destinazione") ?? "");
  const [style, setStyle]             = useState("cultura");
  const [days, setDays]               = useState(5);
  const [itinerary, setItinerary]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-submit if destination comes pre-filled from URL
  useEffect(() => {
    const dest = searchParams.get("destinazione");
    if (dest) setDestination(dest);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setError(null);
    setItinerary("");

    // Scroll to results after a brief moment
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, style, days }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Errore nella generazione");
      }

      if (!res.body) throw new Error("Nessuna risposta ricevuta");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setItinerary((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  const hasResult = itinerary.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0F" }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, #006D7722 0%, transparent 60%)",
        }}
      />

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 md:px-14"
        style={{ backgroundColor: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <Link href="/" className="flex items-baseline gap-0">
          <span className="font-serif text-xl font-light tracking-wide text-white/80">Gets</span>
          <span className="font-serif text-xl font-semibold italic" style={{ color: "#E29578" }}>X</span>
          <span className="font-serif text-xl font-light tracking-wide text-white/80">plore</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Come funziona", href: "/#come-funziona" },
            { label: "Blog", href: "/blog" },
            { label: "Accedi", href: "/login" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-sans text-sm font-light uppercase tracking-widest transition-colors duration-200"
              style={{ color: href === "/genera" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="rounded-full px-5 py-2 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:brightness-110"
            style={{ backgroundColor: "#006D77" }}
          >
            Inizia
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16 md:px-8">

        {/* Page header */}
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <div className="h-px w-8" style={{ backgroundColor: "#006D77" }} />
            <span className="font-sans text-xs font-light uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.3)" }}>
              AI Travel Planner
            </span>
            <div className="h-px w-8" style={{ backgroundColor: "#006D77" }} />
          </div>
          <h1 className="font-serif text-4xl font-light italic text-white/90 md:text-5xl">
            Genera il tuo itinerario
          </h1>
          <p className="mt-4 font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            Descrivi dove vuoi andare e ricevi una guida narrativa immersiva.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(0,109,119,0.2)" }}
          >
            {/* Destination */}
            <div className="mb-7">
              <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                Destinazione
              </label>
              <div
                className="flex items-center gap-3 border-b pb-2.5 transition-colors"
                style={{ borderColor: destination ? "#006D77" : "rgba(255,255,255,0.12)" }}
              >
                <span className="font-serif text-base" style={{ color: destination ? "#E29578" : "rgba(255,255,255,0.2)" }}>✦</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Tokyo, Giordania, Bali..."
                  required
                  className="w-full bg-transparent font-serif text-lg font-light text-white/85 outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Style + Days row */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2">
              {/* Style */}
              <div>
                <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Stile di viaggio
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {STYLES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStyle(value)}
                      className="rounded-full px-3.5 py-1.5 font-sans text-xs font-light transition-all duration-200"
                      style={{
                        border: style === value ? "1px solid #006D77" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: style === value ? "rgba(0,109,119,0.18)" : "transparent",
                        color: style === value ? "#a8d8dc" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Durata
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {DAY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className="h-9 w-9 rounded-full font-sans text-sm font-light transition-all duration-200"
                      style={{
                        border: days === d ? "1px solid #006D77" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: days === d ? "rgba(0,109,119,0.18)" : "transparent",
                        color: days === d ? "#a8d8dc" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 font-sans text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>giorni</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !destination.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-full py-4 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: loading ? "#004F57" : "#006D77" }}
            >
              {loading ? (
                <>
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                        style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
                      />
                    ))}
                  </span>
                  Sto creando il tuo itinerario...
                </>
              ) : (
                <>
                  Genera Itinerario
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl px-6 py-4" style={{ backgroundColor: "rgba(226,149,120,0.08)", border: "1px solid rgba(226,149,120,0.2)" }}>
            <p className="font-sans text-sm" style={{ color: "#E29578" }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {(hasResult || loading) && (
          <div ref={resultRef} className="mt-14">
            {/* Result header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
              <span className="font-sans text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Il tuo itinerario
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
            </div>

            {/* Itinerary text */}
            <div className="relative">
              {renderItinerary(itinerary)}

              {/* Blinking cursor while streaming */}
              {loading && (
                <span
                  className="inline-block h-4 w-0.5 bg-teal align-middle"
                  style={{ animation: "cursor-blink 1s step-end infinite", backgroundColor: "#006D77", marginLeft: "2px" }}
                />
              )}
            </div>

            {/* Done state */}
            {!loading && hasResult && (
              <div className="mt-14 flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-3 opacity-40">
                  <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
                  <span className="font-serif text-base" style={{ color: "#E29578" }}>✦</span>
                  <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
                </div>
                <button
                  onClick={() => { setItinerary(""); setDestination(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="font-sans text-xs uppercase tracking-widest transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#006D77")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  Genera un altro itinerario →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function GeneraPage() {
  return (
    <Suspense>
      <GeneraContent />
    </Suspense>
  );
}
