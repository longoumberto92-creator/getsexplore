"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { Zone } from "@/types/travel";

const ZONE_COLORS = ["#006D77", "#E29578", "#83C5BE", "#EF8C5F"];

const MAP_STYLE = [
  { elementType: "geometry",              stylers: [{ color: "#0d0d17" }] },
  { elementType: "labels.text.fill",      stylers: [{ color: "#8e8e9e" }] },
  { elementType: "labels.text.stroke",    stylers: [{ color: "#0d0d17" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#83C5BE" }] },
  { featureType: "road",          elementType: "geometry",         stylers: [{ color: "#1a1a2e" }] },
  { featureType: "road.highway",  elementType: "geometry",         stylers: [{ color: "#2c3048" }] },
  { featureType: "water",         elementType: "geometry",         stylers: [{ color: "#0d1a26" }] },
  { featureType: "water",         elementType: "labels.text.fill", stylers: [{ color: "#3d4f6b" }] },
  { featureType: "poi",           stylers: [{ visibility: "off" }] },
  { featureType: "transit",       stylers: [{ visibility: "off" }] },
];

interface Props {
  destination: string;
  styles: string[];
  spending: number;
  days: number;
  onZoneSelect: (zone: Zone) => void;
}

export default function ZoneMap({ destination, styles, spending, days, onZoneSelect }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const circlesRef  = useRef<google.maps.Circle[]>([]);

  const [zones, setZones]             = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [mapsLoaded, setMapsLoaded]   = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // 1. Fetch zones from Claude
  useEffect(() => {
    fetch("/api/generate-zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, styles, spending, days }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Errore caricamento zone");
        return r.json();
      })
      .then((data: Zone[]) => {
        setZones(data);
        setZonesLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setZonesLoading(false);
      });
  }, [destination, styles, spending, days]);

  // 2. Load Google Maps once zones are ready
  useEffect(() => {
    if (zones.length === 0 || !mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY non configurata");
      return;
    }

    setOptions({ key: apiKey, v: "weekly" });

    (async () => {
      try {
        const [{ Map, Circle }, { Geocoder }] = await Promise.all([
          importLibrary("maps"),
          importLibrary("geocoding"),
        ]);

        if (!mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: zones[0].center,
          zoom: 13,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          styles: MAP_STYLE as any,
          disableDefaultUI: true,
          zoomControl: true,
        });

        mapInstance.current = map;

        // Geocode destination for accurate center
        const geocoder = new Geocoder();
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            map.setCenter(results[0].geometry.location);
          }
        });

        // Draw zone circles
        circlesRef.current.forEach((c) => c.setMap(null));
        circlesRef.current = [];

        zones.forEach((zone, idx) => {
          const color = ZONE_COLORS[idx % ZONE_COLORS.length];

          const circle = new Circle({
            map,
            center: zone.center,
            radius: zone.radius,
            fillColor: color,
            fillOpacity: 0.2,
            strokeColor: color,
            strokeOpacity: 0.7,
            strokeWeight: 2,
            clickable: true,
          });

          circle.addListener("click", () => selectZone(zone, idx));
          circlesRef.current.push(circle);
        });

        setMapsLoaded(true);
      } catch {
        setError("Impossibile caricare Google Maps");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones, destination]);

  function selectZone(zone: Zone, idx: number) {
    setSelectedZone(zone);
    mapInstance.current?.panTo(zone.center);
    mapInstance.current?.setZoom(14);
    circlesRef.current.forEach((c, i) => {
      c.setOptions({
        fillOpacity:   i === idx ? 0.4 : 0.1,
        strokeOpacity: i === idx ? 1.0 : 0.3,
      });
    });
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

  const isLoading = zonesLoading || (!mapsLoaded && zones.length > 0);

  return (
    <div>
      {/* Map */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ border: "1px solid rgba(0,109,119,0.2)" }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ backgroundColor: "rgba(10,10,15,0.85)" }}
          >
            <div className="text-center">
              <div className="inline-flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                    style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
              <p className="mt-3 font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {zonesLoading ? "Analizzo la destinazione..." : "Carico la mappa..."}
              </p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="h-72 w-full md:h-96" />
      </div>

      {/* Zone list */}
      {mapsLoaded && zones.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {zones.map((zone, idx) => {
            const color    = ZONE_COLORS[idx % ZONE_COLORS.length];
            const isActive = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => selectZone(zone, idx)}
                className="flex items-start gap-3 rounded-xl p-4 text-left transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "rgba(0,109,119,0.08)" : "rgba(255,255,255,0.02)",
                  border: isActive ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <div>
                  <p className="font-serif text-base font-light" style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)" }}>
                    {zone.name}
                  </p>
                  <p className="mt-0.5 font-sans text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {zone.atmosphere}
                  </p>
                  {isActive && (
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {zone.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* CTA */}
      {selectedZone && (
        <button
          onClick={() => onZoneSelect(selectedZone)}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full py-4 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:brightness-110"
          style={{ backgroundColor: "#006D77" }}
        >
          Scegli {selectedZone.name}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
