"use client";

import { useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { useTravelContext } from "@/context/TravelContext";

const PLACEHOLDERS = [
  "Tokyo in primavera...",
  "Marocco, tra spezie e silenzio...",
  "Islanda sotto l'aurora boreale...",
  "Kyoto, tra templi e cerimonie del tè...",
  "Patagonia, ai confini del mondo...",
  "Lisbona, luce e malinconia...",
];

const TYPING_SPEED = 60;
const PAUSE_FULL   = 2200;
const ERASE_SPEED  = 30;

export default function DestinationInput() {
  const { inputValue, setInputValue } = useTravelContext();

  const displayRef = useRef("");
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  const indexRef = useRef(0);
  const charRef  = useRef(0);
  const phaseRef = useRef<"type" | "pause" | "erase">("type");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const current = PLACEHOLDERS[indexRef.current];
      if (phaseRef.current === "type") {
        charRef.current++;
        displayRef.current = current.slice(0, charRef.current);
        forceRender();
        if (charRef.current >= current.length) {
          phaseRef.current = "pause";
          timerRef.current = setTimeout(tick, PAUSE_FULL);
          return;
        }
        timerRef.current = setTimeout(tick, TYPING_SPEED);
      } else if (phaseRef.current === "pause") {
        phaseRef.current = "erase";
        timerRef.current = setTimeout(tick, ERASE_SPEED);
      } else {
        charRef.current--;
        displayRef.current = current.slice(0, charRef.current);
        forceRender();
        if (charRef.current <= 0) {
          indexRef.current = (indexRef.current + 1) % PLACEHOLDERS.length;
          phaseRef.current = "type";
          timerRef.current = setTimeout(tick, 400);
          return;
        }
        timerRef.current = setTimeout(tick, ERASE_SPEED);
      }
    }
    timerRef.current = setTimeout(tick, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const hasInput = inputValue.length > 0;

  return (
    <div className="relative w-full max-w-xl">
      {/* Input row */}
      <div
        className="flex items-center gap-3 border-b pb-3 transition-colors duration-300"
        style={{ borderColor: hasInput ? "#006D77" : "rgba(255,255,255,0.2)" }}
      >
        <span
          className="shrink-0 font-serif text-lg leading-none transition-colors duration-300"
          style={{ color: hasInput ? "#E29578" : "rgba(255,255,255,0.25)" }}
        >
          ✦
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={!hasInput ? displayRef.current : ""}
          className="w-full bg-transparent font-serif text-lg font-light text-white/90 outline-none placeholder:text-white/30 md:text-xl"
          aria-label="Dove vuoi andare?"
        />
        <button
          type="button"
          className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
          style={{
            backgroundColor: hasInput ? "#006D77" : "transparent",
            border: hasInput ? "none" : "1px solid rgba(255,255,255,0.15)",
          }}
          aria-label="Esplora"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke={hasInput ? "#fff" : "rgba(255,255,255,0.4)"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Hint / CTA — toggles with fade + slide */}
      <div className="relative mt-4 h-8">
        {/* Hint text — visible when empty */}
        <p
          className="absolute inset-0 font-sans text-xs uppercase tracking-widest transition-all duration-300"
          style={{
            color: "rgba(255,255,255,0.25)",
            opacity: hasInput ? 0 : 1,
            transform: hasInput ? "translateY(-4px)" : "translateY(0)",
            pointerEvents: "none",
          }}
        >
          Scrivi una destinazione, un&apos;emozione, un sogno
        </p>

        {/* CTA button — visible when typing */}
        <Link
          href={`/genera?destinazione=${encodeURIComponent(inputValue)}`}
          className="absolute inset-0 flex items-center gap-2 font-sans text-sm font-medium transition-all duration-300"
          style={{
            color: "#006D77",
            opacity: hasInput ? 1 : 0,
            transform: hasInput ? "translateY(0)" : "translateY(4px)",
            pointerEvents: hasInput ? "auto" : "none",
          }}
        >
          Scopri il tuo viaggio
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
