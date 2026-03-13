"use client";

import { useEffect, useRef, useState } from "react";
import DestinationInput from "@/components/DestinationInput";

const SLIDES = [
  { url: "https://images.unsplash.com/photo-1529268209110-88f8a3462b43?w=1920&q=80&auto=format&fit=crop", caption: "Heart Reef, Australia" },
  { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80&auto=format&fit=crop", caption: "Fushimi Inari, Kyoto" },
  { url: "https://images.unsplash.com/photo-1517821099606-cef63a9bcda6?w=1920&q=80&auto=format&fit=crop", caption: "Sahara, Marocco" },
  { url: "https://images.unsplash.com/photo-1537996134470-1b5b91f91b1d?w=1920&q=80&auto=format&fit=crop", caption: "Tegalalang, Bali" },
  { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80&auto=format&fit=crop", caption: "Santorini, Grecia" },
  { url: "https://images.unsplash.com/photo-1548786811-f89e8d8d1c3e?w=1920&q=80&auto=format&fit=crop", caption: "Petra, Giordania" },
];

const INTERVAL_MS   = 5000;
const FADE_DURATION = 1500; // ms — matches CSS transition

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  // Track which slides are preloaded to avoid showing broken images
  const [ready, setReady] = useState<Set<number>>(new Set([0]));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload all slides on mount
  useEffect(() => {
    SLIDES.forEach((slide, i) => {
      if (i === 0) return; // first slide assumed ready immediately
      const img = new window.Image();
      img.src = slide.url;
      img.onload = () => setReady((prev) => new Set([...prev, i]));
    });
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <main
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* ─── Slideshow layers ─────────────────────────────────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: ready.has(i) ? `url(${slide.url})` : "none",
            opacity: i === activeIdx ? 1 : 0,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay — 0.5 opacity over the image */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, rgba(10,10,15,0.6) 55%, #0A0A0F 100%)",
          zIndex: 1,
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          zIndex: 1,
        }}
      />

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div
        className="relative flex w-full max-w-3xl flex-col items-center text-center"
        style={{ zIndex: 2, animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
          <span
            className="font-sans text-xs font-light uppercase tracking-[0.35em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Travel Companion AI
          </span>
          <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
        </div>

        <h1 className="mb-6 font-serif text-5xl font-light leading-[1.1] tracking-tight text-white/90 md:text-7xl lg:text-[80px]">
          Il tuo prossimo viaggio,{" "}
          <em className="not-italic" style={{ color: "#E29578" }}>raccontato</em>
          <br className="hidden md:block" />
          {" "}come una storia.
        </h1>

        <p
          className="mb-14 max-w-lg font-sans text-base font-light leading-relaxed md:text-lg"
          style={{
            color: "rgba(255,255,255,0.5)",
            animation: "fade-up 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          Scrivi dove vuoi andare e GetSXplore costruisce per te un itinerario
          narrativo — luoghi, ritmo, atmosfera.
        </p>

        <div
          className="w-full"
          style={{ animation: "fade-up 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <DestinationInput />
        </div>
      </div>

      {/* Slide caption — bottom left */}
      <div
        className="absolute bottom-12 left-8 md:left-14"
        style={{ zIndex: 2, animation: "fade-in 1.5s 1.2s ease both" }}
      >
        <p
          className="font-sans text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {SLIDES[activeIdx].caption}
        </p>
      </div>

      {/* Slide dots — bottom centre */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ zIndex: 2, animation: "fade-in 1.5s 1.2s ease both" }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === activeIdx ? "20px" : "6px",
              height: "6px",
              backgroundColor: i === activeIdx ? "#006D77" : "rgba(255,255,255,0.25)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
