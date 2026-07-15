"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect } from "react";

export type CityCluster = {
  key: string;
  city: string;
  neighborhood: string;
  country: string;
  pieceCount: number;
  artistCount: number;
  thumb: string;       // artwork image used inside the pin
  slug: string;        // a representative artwork slug to link to
  lat: number;
  lng: number;
  isUser: boolean;
};

// Circular photo-thumbnail pin using the artwork's own image, with a count badge.
function makePhotoPin(c: CityCluster) {
  const ring = c.isUser ? "#c98a15" : "#2a2622";     // marigold ring for user's area
  const size = c.isUser ? 62 : 54;
  const badge = c.pieceCount;
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          width:${size}px;height:${size}px;border-radius:9999px;overflow:hidden;
          border:3px solid ${ring};
          box-shadow:0 4px 14px rgba(0,0,0,0.35);
          background:#ede6d8;">
          <img src="${c.thumb}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />
        </div>
        <div style="
          position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;
          display:flex;align-items:center;justify-content:center;
          background:${ring};color:#fff;border-radius:9999px;
          font-family:system-ui,sans-serif;font-size:11px;font-weight:700;
          border:2px solid #f4efe6;">${badge}</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function InitialView({ clusters, hasUser }: { clusters: CityCluster[]; hasUser: boolean }) {
  const map = useMap();
  useEffect(() => {
    const valid = clusters.filter((c) => c.lat !== 0 || c.lng !== 0);
    if (valid.length === 0) return;
    const userPin = valid.find((c) => c.isUser);
    if (hasUser && userPin) {
      map.setView([userPin.lat, userPin.lng], 11);
    } else {
      const bounds = L.latLngBounds(valid.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function BrowseMap({ clusters }: { clusters: CityCluster[] }) {
  const valid = clusters.filter(
    (c) => Number.isFinite(c.lat) && Number.isFinite(c.lng) && (c.lat !== 0 || c.lng !== 0),
  );
  const hasUser = valid.some((c) => c.isUser);

  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-border)]">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={18}
        className="browse-map h-[70vh] w-full"
        worldCopyJump
      >
        {/* Muted, low-saturation base — CARTO Positron (light gray) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <InitialView clusters={valid} hasUser={hasUser} />
        {valid.map((c) => (
          <Marker key={c.key} position={[c.lat, c.lng]} icon={makePhotoPin(c)} zIndexOffset={c.isUser ? 1000 : 0}>
            <Popup minWidth={200}>
              <div style={{ fontFamily: "system-ui, sans-serif" }}>
                {c.isUser && (
                  <div style={{ background: "#c98a15", color: "#fff", padding: "2px 8px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px", display: "inline-block" }}>
                    YOUR NEIGHBORHOOD
                  </div>
                )}
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "18px", fontWeight: 600, margin: "0 0 2px", color: "#2a2622" }}>
                  {c.neighborhood}, {c.city}
                </p>
                <p style={{ fontSize: "12px", color: "#777", margin: "0 0 10px" }}>
                  {c.artistCount} artist{c.artistCount === 1 ? "" : "s"} · {c.pieceCount} piece{c.pieceCount === 1 ? "" : "s"}
                </p>
                <Link
                  href={`/browse?q=${encodeURIComponent(c.city)}&view=grid`}
                  style={{ display: "inline-block", background: "#2a2622", color: "#fff", padding: "6px 14px", fontSize: "13px", fontWeight: 600, textDecoration: "none", borderRadius: "2px" }}
                >
                  See the work here →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
