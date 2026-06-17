"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export function LocationPickerMap({ lat, lng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet is client-only
    import("leaflet").then((L) => {
      // Fix default icon paths (Next.js / webpack strips them)
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;
          background:#ff2d87;
          border:3px solid #0a0a0a;
          border-radius:50%;
          box-shadow:4px 4px 0 0 #0a0a0a;
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const map = L.map(containerRef.current!, { zoomControl: true }).setView([lat, lng], 12);
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const p = marker.getLatLng();
        onChange(Math.round(p.lat * 1e6) / 1e6, Math.round(p.lng * 1e6) / 1e6);
      });

      map.on("click", (e) => {
        const p = e.latlng;
        marker.setLatLng(p);
        onChange(Math.round(p.lat * 1e6) / 1e6, Math.round(p.lng * 1e6) / 1e6);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only run once on mount — the marker syncs via the onChange callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep marker in sync if lat/lng change externally (e.g. geocoding from city field)
  useEffect(() => {
    markerRef.current?.setLatLng([lat, lng]);
    mapRef.current?.setView([lat, lng], mapRef.current.getZoom());
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full border-4 border-ink shadow-graffiti"
      style={{ zIndex: 0 }}
    />
  );
}
