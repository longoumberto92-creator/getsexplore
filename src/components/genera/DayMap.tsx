"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { MapPlace } from "@/types/travel";

interface Props {
  places: MapPlace[];
}

const MAP_STYLE = [
  { elementType: "geometry",              stylers: [{ color: "#0d0d17" }] },
  { elementType: "labels.text.fill",      stylers: [{ color: "#8e8e9e" }] },
  { elementType: "labels.text.stroke",    stylers: [{ color: "#0d0d17" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#83C5BE" }] },
  { featureType: "road",         elementType: "geometry",         stylers: [{ color: "#1a1a2e" }] },
  { featureType: "road.highway", elementType: "geometry",         stylers: [{ color: "#2c3048" }] },
  { featureType: "water",        elementType: "geometry",         stylers: [{ color: "#0d1a26" }] },
  { featureType: "water",        elementType: "labels.text.fill", stylers: [{ color: "#3d4f6b" }] },
  { featureType: "poi",          stylers: [{ visibility: "off" }] },
  { featureType: "transit",      stylers: [{ visibility: "off" }] },
];

const TYPE_COLORS: Record<string, string> = {
  colazione:  "#E29578",
  attività:   "#006D77",
  pranzo:     "#83C5BE",
  pomeriggio: "#83C5BE",
  cena:       "#EF8C5F",
  sera:       "#9B72CF",
};

function markerColor(type: string): string {
  return TYPE_COLORS[type] ?? "#006D77";
}

function makeSvgMarker(num: number, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="9" fill="rgba(0,0,0,0.35)"/>
    <text x="14" y="19" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="white" text-anchor="middle">${num}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function DayMap({ places }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const sorted = [...places].sort((a, b) => a.order - b.order);

  const totalKm =
    sorted.length > 1
      ? sorted
          .slice(0, -1)
          .reduce((sum, p, i) => sum + haversineKm(p, sorted[i + 1]), 0)
      : 0;
  const walkMin = Math.round((totalKm / 5) * 60);

  useEffect(() => {
    if (!mapRef.current || sorted.length === 0) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    setOptions({ key: apiKey, v: "weekly" });

    (async () => {
      try {
        const [{ Map, Polyline }, { LatLngBounds }] = await Promise.all([
          importLibrary("maps"),
          importLibrary("core"),
        ]);

        if (!mapRef.current) return;

        // Compute bounds to fit all markers
        const bounds = new LatLngBounds();
        sorted.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));

        const map = new Map(mapRef.current, {
          center: bounds.getCenter(),
          zoom: 14,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          styles: MAP_STYLE as any,
          disableDefaultUI: true,
          zoomControl: true,
        });

        map.fitBounds(bounds, 40);

        // Use legacy Marker/InfoWindow from the global google namespace
        // (populated after importLibrary("maps"))
        const iw = new google.maps.InfoWindow();

        // Draw markers
        sorted.forEach((place) => {
          const color = markerColor(place.type);
          const marker = new google.maps.Marker({
            map,
            position: { lat: place.lat, lng: place.lng },
            icon: {
              url: makeSvgMarker(place.order, color),
              scaledSize: new google.maps.Size(28, 36),
              anchor: new google.maps.Point(14, 36),
            },
            title: place.name,
          });

          marker.addListener("click", () => {
            iw.setContent(`
              <div style="background:#0d0d17;color:rgba(255,255,255,0.85);padding:8px 12px;border-radius:8px;font-family:system-ui,sans-serif;max-width:220px;">
                <p style="margin:0 0 4px;font-weight:600;font-size:13px;color:${color};">${place.order}. ${place.name}</p>
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.55);line-height:1.5;">${place.description}</p>
              </div>
            `);
            iw.open(map, marker);
          });
        });

        // Draw polyline
        new Polyline({
          map,
          path: sorted.map((p) => ({ lat: p.lat, lng: p.lng })),
          strokeColor: "#006D77",
          strokeOpacity: 0.8,
          strokeWeight: 2.5,
          geodesic: true,
        });
      } catch {
        /* silently ignore map errors */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sorted.length === 0) return null;

  return (
    <div className="mt-5 mb-2">
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid rgba(0,109,119,0.2)" }}
      >
        <div ref={mapRef} className="h-52 w-full" />
      </div>
      {totalKm > 0.1 && (
        <div className="mt-2 flex items-center gap-2">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#006D77" strokeWidth="1.2" />
            <path d="M6 3v3l2 1.5" stroke="#006D77" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <p className="font-sans text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            ~{totalKm.toFixed(1)} km a piedi · {walkMin} min stimati
          </p>
        </div>
      )}
    </div>
  );
}
