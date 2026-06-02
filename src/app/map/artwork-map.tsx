"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import Image from "next/image";

// Custom graffiti-style marker — hot pink circle with offset shadow
const graffitiIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #ff2d87;
      border: 3px solid #0a0a0a;
      border-radius: 50%;
      box-shadow: 4px 4px 0 0 #0a0a0a;
      transform: rotate(-3deg);
    "></div>
  `,
  iconSize: [32, 32],
  iconAnchor: [14, 14],
});

export type MapPin = {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  artistHandle: string;
  neighborhood: string;
  city: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
};

export function ArtworkMap({ pins }: { pins: MapPin[] }) {
  // Filter out pins without coords
  const valid = pins.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && (p.lat !== 0 || p.lng !== 0));

  return (
    <div className="border-4 border-paper shadow-graffiti-lg">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        className="h-[70vh] w-full"
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {valid.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={graffitiIcon}>
            <Popup>
              <Link href={`/art/${p.slug}`} className="block w-48">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image src={p.image} alt={p.title} fill sizes="200px" className="object-cover" unoptimized />
                </div>
                <div className="pt-2 text-ink">
                  <div className="font-[family-name:var(--font-bangers)] text-lg leading-tight tracking-wide">
                    {p.title}
                  </div>
                  <div className="font-[family-name:var(--font-marker)] text-sm text-electric-purple">
                    {p.artistHandle}
                  </div>
                  <div className="text-xs">
                    {p.neighborhood}, {p.city} {p.countryFlag}
                  </div>
                  <div className="mt-1 inline-block bg-hot-pink px-2 py-0.5 text-xs font-bold text-paper">
                    ${p.price}
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
