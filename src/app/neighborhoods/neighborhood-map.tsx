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

// Classic teardrop pin — blue for the logged-in user's hood, red for everyone else
function makePinIcon(isUser: boolean) {
  const fill = isUser ? "#1565C0" : "#D32F2F";
  const stroke = isUser ? "#0D47A1" : "#B71C1C";
  const glow = isUser ? "rgba(21,101,192,0.35)" : "rgba(211,47,47,0.35)";
  const size = isUser ? 40 : 34;
  const anchor = isUser ? 20 : 17;

  return L.divIcon({
    className: "",
    html: `
      <div style="width:${size}px; height:${size}px; filter: drop-shadow(0 4px 8px ${glow});">
        <svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.3)}">
          <path d="M20 0 C9 0 0 9 0 20 C0 34 20 52 20 52 C20 52 40 34 40 20 C40 9 31 0 20 0Z"
                fill="${fill}" stroke="${stroke}" stroke-width="2"/>
          <circle cx="20" cy="19" r="8" fill="white" opacity="0.9"/>
          ${isUser ? `<circle cx="20" cy="19" r="4" fill="${fill}"/>` : `<circle cx="20" cy="19" r="3" fill="${fill}"/>`}
        </svg>
      </div>
    `,
    iconSize: [size, Math.round(size * 1.3)],
    iconAnchor: [anchor, Math.round(size * 1.3)],
    popupAnchor: [0, -Math.round(size * 1.3)],
  });
}

// Zoom controller: open centred on the user's pin if available, else fit all
function InitialView({
  pins,
  userKey,
}: {
  pins: NeighborhoodPin[];
  userKey: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    const valid = pins.filter((p) => p.lat !== 0 || p.lng !== 0);
    if (valid.length === 0) return;

    const userPin = userKey ? valid.find((p) => p.key === userKey) : null;

    if (userPin) {
      // Start on the user's neighborhood at a street level, then let them zoom out
      map.setView([userPin.lat, userPin.lng], 13);
    } else {
      // Not signed in or no pin — fit all
      const bounds = L.latLngBounds(valid.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function NeighborhoodMap({
  pins,
  userKey,
}: {
  pins: NeighborhoodPin[];
  userKey: string | null;
}) {
  const valid = pins.filter(
    (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && (p.lat !== 0 || p.lng !== 0),
  );

  return (
    <div className="overflow-hidden border-4 border-paper shadow-graffiti-lg">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-b-2 border-paper/20 bg-paper px-4 py-2 text-ink">
        <div className="flex items-center gap-2">
          <svg width="14" height="18" viewBox="0 0 40 52">
            <path d="M20 0 C9 0 0 9 0 20 C0 34 20 52 20 52 C20 52 40 34 40 20 C40 9 31 0 20 0Z" fill="#1565C0" stroke="#0D47A1" strokeWidth="2"/>
            <circle cx="20" cy="19" r="8" fill="white" opacity="0.9"/>
            <circle cx="20" cy="19" r="4" fill="#1565C0"/>
          </svg>
          <span className="font-[family-name:var(--font-bangers)] tracking-wide">YOUR NEIGHBORHOOD</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="12" height="16" viewBox="0 0 40 52">
            <path d="M20 0 C9 0 0 9 0 20 C0 34 20 52 20 52 C20 52 40 34 40 20 C40 9 31 0 20 0Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2"/>
            <circle cx="20" cy="19" r="8" fill="white" opacity="0.9"/>
            <circle cx="20" cy="19" r="3" fill="#D32F2F"/>
          </svg>
          <span className="font-[family-name:var(--font-bangers)] tracking-wide">OTHER NEIGHBORHOODS</span>
        </div>
        {userKey && (
          <span className="ml-auto text-xs text-ink/60">Starting at your location — zoom out to explore</span>
        )}
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={19}
        className="h-[75vh] w-full"
        worldCopyJump
      >
        {/* Light, colorful street map — CARTO Voyager */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <InitialView pins={valid} userKey={userKey} />

        {valid.map((p) => {
          const isUser = p.key === userKey;
          return (
            <Marker
              key={p.key}
              position={[p.lat, p.lng]}
              icon={makePinIcon(isUser)}
              // User pin renders on top
              zIndexOffset={isUser ? 1000 : 0}
            >
              <Popup minWidth={210}>
                <div style={{ fontFamily: "system-ui, sans-serif" }}>
                  {isUser && (
                    <div
                      style={{
                        background: "#1565C0",
                        color: "white",
                        padding: "2px 8px",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        marginBottom: "6px",
                        fontFamily: "Bangers, Impact, sans-serif",
                      }}
                    >
                      📍 YOUR NEIGHBORHOOD
                    </div>
                  )}
                  <p
                    style={{
                      fontFamily: "Bangers, Impact, sans-serif",
                      fontSize: "20px",
                      letterSpacing: "0.05em",
                      lineHeight: 1.2,
                      marginBottom: "2px",
                      color: isUser ? "#1565C0" : "#D32F2F",
                    }}
                  >
                    {p.neighborhood.toUpperCase()}
                  </p>
                  <p style={{ fontSize: "13px", marginBottom: "2px", color: "#333" }}>
                    {p.city}, {p.country} {p.flag}
                  </p>
                  <p style={{ fontSize: "12px", marginBottom: "10px", color: "#777" }}>
                    {p.pieceCount} piece{p.pieceCount === 1 ? "" : "s"} ·{" "}
                    {p.artistCount} artist{p.artistCount === 1 ? "" : "s"}
                  </p>
                  <Link
                    href={`/browse?loc=${encodeURIComponent(p.neighborhood)}`}
                    style={{
                      display: "inline-block",
                      background: isUser ? "#1565C0" : "#D32F2F",
                      color: "white",
                      padding: "5px 12px",
                      fontFamily: "Bangers, Impact, sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.1em",
                      border: "2px solid #111",
                      boxShadow: "3px 3px 0 0 #111",
                      textDecoration: "none",
                    }}
                  >
                    BROWSE ART HERE →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
