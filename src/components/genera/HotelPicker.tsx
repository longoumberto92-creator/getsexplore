"use client";

import { useEffect, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { Zone, PlaceHotel } from "@/types/travel";

interface Props {
  zone: Zone;
  spending: number;
  onHotelSelect: (hotel: PlaceHotel) => void;
}

function priceLabel(level: number): string {
  return "€".repeat(Math.max(1, level));
}

function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "");
}

function targetPriceLevel(spending: number): number {
  if (spending <= 2) return 1;
  if (spending === 3) return 2;
  return 3;
}

export default function HotelPicker({ zone, spending, onHotelSelect }: Props) {
  const [hotels, setHotels]   = useState<PlaceHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY non configurata");
      setLoading(false);
      return;
    }

    setOptions({ key: apiKey, v: "weekly" });

    const target = targetPriceLevel(spending);

    (async () => {
      try {
        const [{ PlacesService, PlacesServiceStatus }, { LatLng }] = await Promise.all([
          importLibrary("places"),
          importLibrary("core"),
        ]);

        const dummy   = document.createElement("div");
        const service = new PlacesService(dummy);

        service.nearbySearch(
          {
            location: new LatLng(zone.center.lat, zone.center.lng),
            radius: 1200,
            type: "lodging",
          },
          (results, status) => {
            if (status !== PlacesServiceStatus.OK || !results) {
              setError("Nessun hotel trovato in questa zona. Prova a tornare indietro e scegliere una zona diversa.");
              setLoading(false);
              return;
            }

            interface Ranked extends PlaceHotel { priceDiff: number }

            const ranked: Ranked[] = results
              .filter((p) => (p.rating ?? 0) >= 4.0 && p.place_id)
              .map((p) => ({
                placeId:          p.place_id!,
                name:             p.name ?? "Hotel",
                rating:           p.rating ?? 4,
                userRatingsTotal: p.user_ratings_total ?? 0,
                priceLevel:       p.price_level ?? 2,
                vicinity:         p.vicinity ?? zone.name,
                photoUrl:         p.photos?.[0]?.getUrl({ maxWidth: 600 }) ?? null,
                priceDiff:        Math.abs((p.price_level ?? 2) - target),
              }));

            const top4: PlaceHotel[] = ranked
              .sort((a, b) => a.priceDiff - b.priceDiff || b.rating - a.rating)
              .slice(0, 4)
              .map(({ priceDiff: _, ...h }) => h);

            if (top4.length === 0) {
              setError("Nessun hotel con rating sufficiente in questa zona.");
              setLoading(false);
              return;
            }

            setHotels(top4);
            setLoading(false);
          }
        );
      } catch {
        setError("Impossibile caricare Google Places");
        setLoading(false);
      }
    })();
  }, [zone, spending]);

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 py-12">
        <div className="inline-flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
              style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
        <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Cerco hotel nella zona...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mt-6 rounded-xl px-6 py-4"
        style={{ backgroundColor: "rgba(226,149,120,0.08)", border: "1px solid rgba(226,149,120,0.2)" }}
      >
        <p className="font-sans text-sm" style={{ color: "#E29578" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {hotels.map((hotel) => (
        <button
          key={hotel.placeId}
          onClick={() => onHotelSelect(hotel)}
          className="group flex gap-4 overflow-hidden rounded-2xl text-left transition-all duration-300"
          style={{
            backgroundColor: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(0,109,119,0.18)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#006D77";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,109,119,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,109,119,0.18)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.025)";
          }}
        >
          {/* Photo */}
          <div className="h-28 w-28 shrink-0 overflow-hidden bg-white/5 sm:h-32 sm:w-32">
            {hotel.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hotel.photoUrl}
                alt={hotel.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-2xl" style={{ color: "rgba(255,255,255,0.1)" }}>✦</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-center py-4 pr-4">
            <p className="font-serif text-base font-light text-white/85">{hotel.name}</p>
            <p className="mt-0.5 font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {hotel.vicinity}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span className="font-sans text-xs" style={{ color: "#E29578" }}>
                {ratingStars(hotel.rating)} {hotel.rating.toFixed(1)}
              </span>
              {hotel.userRatingsTotal > 0 && (
                <span className="font-sans text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  ({hotel.userRatingsTotal.toLocaleString()} rec.)
                </span>
              )}
              {hotel.priceLevel > 0 && (
                <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {priceLabel(hotel.priceLevel)}
                </span>
              )}
            </div>

            <p
              className="mt-2 font-sans text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: "#006D77" }}
            >
              Scegli questo hotel →
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
