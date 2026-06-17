"use client";

import dynamic from "next/dynamic";
import type { NeighborhoodPin } from "./neighborhood-map";

const NeighborhoodMap = dynamic(
  () => import("./neighborhood-map").then((m) => m.NeighborhoodMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[75vh] w-full items-center justify-center border-4 border-paper bg-ink/40 font-[family-name:var(--font-bangers)] text-3xl tracking-widest text-paper shadow-graffiti-lg">
        LOADING THE MAP...
      </div>
    ),
  },
);

export function NeighborhoodMapClient({ pins }: { pins: NeighborhoodPin[] }) {
  return <NeighborhoodMap pins={pins} />;
}
