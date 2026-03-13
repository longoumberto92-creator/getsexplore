"use client";

import Image from "next/image";
import { useTravelContext } from "@/context/TravelContext";
import { DESTINATIONS, getDestPhotoUrl } from "@/data/destinations";

export default function DestinationsGrid() {
  const { setInputValue } = useTravelContext();

  function handleSelect(name: string) {
    setInputValue(name);
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      className="relative px-6 py-20 md:px-14 md:py-28"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,109,119,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8" style={{ backgroundColor: "#006D77" }} />
              <span
                className="font-sans text-xs font-light uppercase tracking-[0.35em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Le nostre destinazioni
              </span>
            </div>
            <h2 className="font-serif text-3xl font-light italic text-white/90 md:text-4xl lg:text-5xl">
              Dove siamo esperti
            </h2>
          </div>
          <p
            className="mt-3 max-w-xs font-sans text-sm font-light leading-relaxed md:mt-0 md:text-right"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Clicca su una destinazione per esplorare il tuo itinerario
          </p>
        </div>

        {/* Scrollable strip */}
        <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-4 md:-mx-14 md:px-14">
          {DESTINATIONS.map(({ name, country, tag, photoId }) => (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              className="dest-chip group shrink-0 w-36 md:w-44 text-left focus:outline-none"
              aria-label={`Esplora ${name}`}
            >
              {/* Image */}
              <div className="relative mb-3 overflow-hidden rounded-2xl" style={{ aspectRatio: "1/1" }}>
                <Image
                  src={getDestPhotoUrl(photoId)}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.1) 60%)",
                  }}
                />
                {/* Teal ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 1.5px #006D77" }}
                />
                {/* Coral dot top-right */}
                <div
                  className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: "#E29578" }}
                />
              </div>

              {/* Label */}
              <p className="font-serif text-base font-light text-white/85 group-hover:text-white transition-colors duration-200">
                {name}
              </p>
              <p
                className="mt-0.5 font-sans text-[10px] font-light uppercase tracking-widest"
                style={{ color: "#006D77" }}
              >
                {tag}
              </p>
            </button>
          ))}
        </div>

        {/* Fade-out right edge hint */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 md:hidden"
          style={{
            background: "linear-gradient(to left, #0A0A0F, transparent)",
          }}
        />
      </div>
    </section>
  );
}
