"use client";

import dynamic from "next/dynamic";
import type { CityCluster } from "./browse-map";

const BrowseMap = dynamic(() => import("./browse-map").then((m) => m.BrowseMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] w-full items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-linen)] text-sm text-[var(--color-ink-3)]">
      Loading the map…
    </div>
  ),
});

export function BrowseMapClient({ clusters }: { clusters: CityCluster[] }) {
  return <BrowseMap clusters={clusters} />;
}
