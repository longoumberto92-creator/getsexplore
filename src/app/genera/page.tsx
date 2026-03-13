"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Zone, PlaceHotel } from "@/types/travel";

// Dynamic imports to avoid SSR issues with Google Maps
const ZoneMap     = dynamic(() => import("@/components/genera/ZoneMap"),     { ssr: false });
const HotelPicker = dynamic(() => import("@/components/genera/HotelPicker"), { ssr: false });

// ─── Constants ───────────────────────────────────────────────────────────────

const STYLES = [
  { value: "avventura", label: "Avventura" },
  { value: "lusso",     label: "Lusso" },
  { value: "cultura",   label: "Cultura" },
  { value: "cibo",      label: "Cibo & Cucina" },
  { value: "natura",    label: "Natura" },
  { value: "relax",     label: "Relax" },
  { value: "nightlife", label: "Nightlife" },
  { value: "shopping",  label: "Shopping" },
  { value: "arte",      label: "Arte" },
  { value: "offbeat",   label: "Off the beaten path" },
];

const SPENDING_OPTIONS = [
  { value: 1, euros: "€",     label: "Budget" },
  { value: 2, euros: "€€",    label: "Economico" },
  { value: 3, euros: "€€€",   label: "Mid-range" },
  { value: 4, euros: "€€€€",  label: "Premium" },
  { value: 5, euros: "€€€€€", label: "Lusso" },
];

const DAY_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const STEP_LABELS = ["Destinazione", "Zona", "Hotel", "Itinerario"];

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-12 flex items-center justify-center">
      {STEP_LABELS.map((label, i) => {
        const n       = i + 1;
        const active  = current === n;
        const done    = current > n;
        return (
          <div key={n} className="flex items-center">
            {i > 0 && (
              <div
                className="h-px w-8 transition-all duration-500 md:w-12"
                style={{ backgroundColor: done ? "#006D77" : "rgba(255,255,255,0.08)" }}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full font-sans text-xs font-medium transition-all duration-300"
                style={{
                  backgroundColor: active ? "#006D77" : done ? "rgba(0,109,119,0.25)" : "transparent",
                  border:          active ? "none" : done ? "1px solid rgba(0,109,119,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color:           active || done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span
                className="hidden font-sans text-[10px] uppercase tracking-wider sm:block"
                style={{ color: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Markdown renderer ───────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderItinerary(text: string) {
  const lines    = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      const [dayPart, ...rest] = line.replace("## ", "").split("—");
      elements.push(
        <h3 key={i} className="mt-12 mb-3 font-serif text-2xl font-light text-white/90 md:text-3xl">
          <span style={{ color: "#006D77" }}>{dayPart.trim()}</span>
          {rest.length > 0 && (
            <span style={{ color: "#E29578" }}>{" — " + rest.join("—").trim()}</span>
          )}
        </h3>
      );
    } else if (line.trim() === "---") {
      elements.push(
        <div key={i} className="my-10 flex items-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
          <span style={{ color: "#E29578", opacity: 0.6 }}>✦</span>
          <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
        </div>
      );
    } else if (/^- [🌅🍽🌆🌙]/.test(line)) {
      elements.push(
        <p key={i} className="mt-5 mb-1 font-sans text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#006D77" }}>
          {line.slice(2)}
        </p>
      );
    } else if (line.startsWith("  - ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-0.5">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "#E29578" }} />
          <p className="font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {renderInline(line.slice(4))}
          </p>
        </div>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-0.5">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
          <p className="font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {renderInline(line.slice(2))}
          </p>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="font-sans text-base font-light leading-[1.85]" style={{ color: "rgba(255,255,255,0.65)" }}>
          {renderInline(line)}
        </p>
      );
    }
  });

  return elements;
}

// ─── Main component ──────────────────────────────────────────────────────────

function GeneraContent() {
  const searchParams = useSearchParams();

  // Step: 1=form, 2=zone, 3=hotel, 4=itinerary
  const [step, setStep]   = useState(1);

  // Step 1 form
  const [destination, setDestination] = useState(searchParams.get("destinazione") ?? "");
  const [styles, setStyles]           = useState<string[]>([]);
  const [spending, setSpending]       = useState(3);
  const [days, setDays]               = useState(5);

  // Step 2 result
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Step 3 result
  const [selectedHotel, setSelectedHotel] = useState<PlaceHotel | null>(null);

  // Itinerary
  const [itinerary, setItinerary] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const topRef       = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dest = searchParams.get("destinazione");
    if (dest) setDestination(dest);
  }, [searchParams]);

  function toggleStyle(value: string) {
    setStyles((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) return;
    setStep(2);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function handleZoneSelect(zone: Zone) {
    setSelectedZone(zone);
    setStep(3);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function handleHotelSelect(hotel: PlaceHotel) {
    setSelectedHotel(hotel);
    setStep(4);
    setStreaming(true);
    setError(null);
    setItinerary("");

    setTimeout(() => itineraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          styles,
          spending,
          days,
          zone:  selectedZone,
          hotel: { name: hotel.name, vicinity: hotel.vicinity },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Errore nella generazione");
      }

      if (!res.body) throw new Error("Nessuna risposta ricevuta");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setItinerary((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setStreaming(false);
    }
  }

  function resetAll() {
    setStep(1);
    setDestination("");
    setStyles([]);
    setSpending(3);
    setDays(5);
    setSelectedZone(null);
    setSelectedHotel(null);
    setItinerary("");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0F" }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, #006D7722 0%, transparent 60%)" }}
      />

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 md:px-14"
        style={{
          backgroundColor: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
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
              style={{ color: "rgba(255,255,255,0.4)" }}
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
        <div ref={topRef} />

        {/* Page header */}
        <div className="mb-10 text-center">
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
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* ── STEP 1: FORM ─────────────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div
              className="rounded-2xl p-8 md:p-10"
              style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(0,109,119,0.2)" }}
            >
              {/* Destination */}
              <div className="mb-8">
                <label className="mb-2 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Destinazione
                </label>
                <div
                  className="flex items-center gap-3 border-b pb-2.5"
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

              {/* Style pills */}
              <div className="mb-8">
                <label className="mb-3 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Stile di viaggio
                  <span className="ml-2 normal-case tracking-normal" style={{ color: "rgba(255,255,255,0.2)" }}>(multi-selezione)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(({ value, label }) => {
                    const active = styles.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleStyle(value)}
                        className="rounded-full px-3.5 py-1.5 font-sans text-xs font-light transition-all duration-200"
                        style={{
                          border: active ? "1px solid #006D77" : "1px solid rgba(255,255,255,0.1)",
                          backgroundColor: active ? "rgba(0,109,119,0.18)" : "transparent",
                          color: active ? "#a8d8dc" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spending + Days */}
              <div className="mb-8 grid gap-7 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Budget
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {SPENDING_OPTIONS.map(({ value, euros, label }) => {
                      const active = spending === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSpending(value)}
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200"
                          style={{
                            border: active ? "1px solid #006D77" : "1px solid rgba(255,255,255,0.06)",
                            backgroundColor: active ? "rgba(0,109,119,0.12)" : "transparent",
                          }}
                        >
                          <span className="font-mono text-sm" style={{ color: active ? "#E29578" : "rgba(255,255,255,0.25)", minWidth: "52px" }}>
                            {euros}
                          </span>
                          <span className="font-sans text-xs" style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block font-sans text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Durata
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                  <p className="mt-2 font-sans text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>giorni</p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!destination.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-full py-4 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 hover:brightness-110"
                style={{ backgroundColor: "#006D77" }}
              >
                Continua
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: ZONE MAP ─────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="font-serif text-2xl font-light italic text-white/80">
                Scegli la zona di {destination}
              </h2>
              <p className="mt-2 font-sans text-sm font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                Clicca una zona sulla mappa o selezionala dalla lista
              </p>
            </div>

            <ZoneMap
              destination={destination}
              styles={styles}
              spending={spending}
              days={days}
              onZoneSelect={handleZoneSelect}
            />

            <button
              onClick={() => setStep(1)}
              className="mt-6 font-sans text-xs uppercase tracking-widest transition-colors"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#E29578")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)")}
            >
              ← Torna alle preferenze
            </button>
          </div>
        )}

        {/* ── STEP 3: HOTEL PICKER ─────────────────────────────────────── */}
        {step === 3 && selectedZone && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="font-serif text-2xl font-light italic text-white/80">
                Hotel a {selectedZone.name}
              </h2>
              <p className="mt-2 font-sans text-sm font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                Rating ≥ 4.0 · Filtrati per il tuo budget
              </p>
            </div>

            <HotelPicker
              zone={selectedZone}
              spending={spending}
              onHotelSelect={handleHotelSelect}
            />

            <button
              onClick={() => setStep(2)}
              className="mt-8 font-sans text-xs uppercase tracking-widest transition-colors"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#E29578")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)")}
            >
              ← Cambia zona
            </button>
          </div>
        )}

        {/* ── STEP 4: ITINERARY ────────────────────────────────────────── */}
        {step === 4 && (
          <div ref={itineraryRef}>
            {/* Context summary */}
            {selectedZone && selectedHotel && (
              <div
                className="mb-10 flex flex-wrap items-center gap-4 rounded-xl px-5 py-4"
                style={{ backgroundColor: "rgba(0,109,119,0.06)", border: "1px solid rgba(0,109,119,0.18)" }}
              >
                <div className="flex-1">
                  <p className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "#006D77" }}>
                    Il tuo viaggio
                  </p>
                  <p className="mt-0.5 font-serif text-base text-white/80">
                    {destination} · {selectedZone.name}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {selectedHotel.name} · {days} giorni · {"€".repeat(spending)}
                  </p>
                </div>
              </div>
            )}

            {/* Itinerary header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
              <span className="font-sans text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Il tuo itinerario
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,109,119,0.3)" }} />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl px-6 py-4" style={{ backgroundColor: "rgba(226,149,120,0.08)", border: "1px solid rgba(226,149,120,0.2)" }}>
                <p className="font-sans text-sm" style={{ color: "#E29578" }}>{error}</p>
              </div>
            )}

            {/* Content */}
            <div className="relative">
              {renderItinerary(itinerary)}
              {streaming && (
                <span
                  className="inline-block h-4 w-0.5 align-middle"
                  style={{ animation: "cursor-blink 1s step-end infinite", backgroundColor: "#006D77", marginLeft: "2px" }}
                />
              )}
            </div>

            {/* Done */}
            {!streaming && itinerary.length > 0 && (
              <div className="mt-14 flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-3 opacity-40">
                  <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
                  <span className="font-serif text-base" style={{ color: "#E29578" }}>✦</span>
                  <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
                </div>
                <button
                  onClick={resetAll}
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
