// Leaflet uses `window` heavily, so the map is loaded client-only via dynamic().
"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./artwork-map";

const ArtworkMap = dynamic(() => import("./artwork-map").then((m) => m.ArtworkMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] w-full items-center justify-center border-4 border-paper bg-ink/40 font-[family-name:var(--font-bangers)] text-3xl tracking-widest text-paper shadow-graffiti-lg">
      LOADING THE WORLD MAP...
    </div>
  ),
});

export function MapClient({ pins }: { pins: MapPin[] }) {
  return <ArtworkMap pins={pins} />;
}
