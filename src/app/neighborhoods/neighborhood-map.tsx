"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect } from "react";

export type NeighborhoodPin = {
  key: string;
  neighborhood: string;
  city: string;
  country: string;
  flag: string;
  pieceCount: number;
  artistCount: number;
  lat: number;
  lng: number;
};

// Cluster marker: a graffiti sticker with the neighborhood name + count label
function makeNeighborhoodIcon(neighborhood: string, count: number) {
  const short = neighborhood.length > 12 ? neighborhood.slice(0, 11) + "…" : neighborhood;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: #ff2d87;
        border: 3px solid #0a0a0a;
        box-shadow: 4px 4px 0 0 #0a0a0a;
        padding: 4px 8px;
        transform: rotate(-2deg);
        white-space: nowrap;
        cursor: pointer;
        max-width: 140px;
      ">
        <div style="font-family: Bangers, Impact, sans-serif; font-size: 13px; letter-spacing: 0.05em; color: #fef9e7; line-height: 1.2;">
          ${short.toUpperCase()}
        </div>
        <div style="font-family: Bangers, Impact, sans-serif; font-size: 11px; color: #c6ff00; letter-spacing: 0.05em;">
          ${count} ${count === 1 ? "PIECE" : "PIECES"}
        </div>
      </div>
    `,
    iconAnchor: [0, 0],
  });
}

// Fly-to controller: on first render zoom to fit all pins
function FitBounds({ pins }: { pins: NeighborhoodPin[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = pins.filter((p) => p.lat !== 0 || p.lng !== 0);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function NeighborhoodMap({ pins }: { pins: NeighborhoodPin[] }) {
  const valid = pins.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && (p.lat !== 0 || p.lng !== 0));

  return (
    <div className="border-4 border-paper shadow-graffiti-lg">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={18}
        className="h-[75vh] w-full"
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds pins={valid} />
        {valid.map((p) => (
          <Marker
            key={p.key}
            position={[p.lat, p.lng]}
            icon={makeNeighborhoodIcon(p.neighborhood, p.pieceCount)}
          >
            <Popup minWidth={200}>
              <div className="text-ink">
                <p
                  style={{
                    fontFamily: "Bangers, Impact, sans-serif",
                    fontSize: "20px",
                    letterSpacing: "0.05em",
                    lineHeight: 1.2,
                    marginBottom: "2px",
                  }}
                >
                  {p.neighborhood.toUpperCase()}
                </p>
                <p style={{ fontSize: "13px", marginBottom: "2px" }}>
                  {p.city}, {p.country} {p.flag}
                </p>
                <p style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
                  {p.pieceCount} piece{p.pieceCount === 1 ? "" : "s"} ·{" "}
                  {p.artistCount} artist{p.artistCount === 1 ? "" : "s"}
                </p>
                <Link
                  href={`/browse?loc=${encodeURIComponent(p.neighborhood)}`}
                  style={{
                    display: "inline-block",
                    background: "#ff2d87",
                    color: "#fef9e7",
                    padding: "4px 10px",
                    fontFamily: "Bangers, Impact, sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    border: "2px solid #0a0a0a",
                    boxShadow: "3px 3px 0 0 #0a0a0a",
                    textDecoration: "none",
                  }}
                >
                  BROWSE ART HERE →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
