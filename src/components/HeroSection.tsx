"use client";

import { useEffect, useRef, useState } from "react";
import { useTravelContext } from "@/context/TravelContext";
import { getHeroPhotoUrl } from "@/data/destinations";
import DestinationInput from "@/components/DestinationInput";

export default function HeroSection() {
  const { inputValue } = useTravelContext();

  // Double-buffer crossfade: layers[0] and layers[1] alternate
  const [layers, setLayers] = useState<[string | null, string | null]>([null, null]);
  const [active, setActive] = useState<0 | 1>(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newUrl = getHeroPhotoUrl(inputValue);
      if (newUrl === currentUrlRef.current) return;
      currentUrlRef.current = newUrl;

      const next = active === 0 ? 1 : 0;

      if (!newUrl) {
        // Fade out everything: clear both layers after transition
        setActive(next);
        setLayers([null, null]);
        return;
      }

      // Preload image, then crossfade in
      const img = new window.Image();
      img.src = newUrl;
      const show = () => {
        setLayers((prev) => {
          const updated = [...prev] as [string | null, string | null];
          updated[next] = newUrl;
          return updated;
        });
        setActive(next);
      };
      img.onload = show;
      // Fallback if image fails or takes too long
      img.onerror = show;
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputValue, active]);

  return (
    <main
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* ─── Background image layers (crossfade) ──────────────────────────── */}
      {([0, 1] as const).map((i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: layers[i] ? `url(${layers[i]})` : "none",
            opacity: layers[i] && i === active ? 1 : 0,
            transition: "opacity 0.8s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay — always on, extra dark when no image */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: "linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.72) 60%, #0A0A0F 100%)",
          zIndex: 1,
          opacity: layers[active] ? 1 : 0,
        }}
      />

      {/* ─── Static ambient layers (shown when no image) ──────────────────── */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 55% at 50% 105%, #006D7730 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 40% at 10% 75%, #E2957818 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(10,10,15,0.6) 0%, transparent 30%, transparent 70%, rgba(10,10,15,0.6) 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to top, #0A0A0F 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div
        className="relative flex w-full max-w-3xl flex-col items-center text-center"
        style={{ zIndex: 2, animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
          <span
            className="font-sans text-xs font-light uppercase tracking-[0.35em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
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
            color: "rgba(255,255,255,0.42)",
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

      {/* Scroll hint */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 2, animation: "fade-in 1.5s 1.2s ease both" }}
      >
        <span
          className="font-sans text-[10px] uppercase tracking-[0.35em]"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Scopri
        </span>
        <div
          className="h-10 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }}
        />
      </div>
    </main>
  );
}
