"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { useLocation } from "@/components/location-provider";
import { BrowseMapClient } from "./browse-map-client";
import type { CityCluster } from "./browse-map";
import type { Artwork, Artist } from "@/lib/data";
import { Map as MapIcon, LayoutGrid } from "lucide-react";

type Props = {
  artworks: Artwork[];
  artists: Artist[];
  topTags: string[];
  initialQuery?: string;
  initialView?: string;
};

export function BrowseClient({ artworks, artists, topTags, initialQuery, initialView }: Props) {
  const { country, ready } = useLocation();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);

  const [view, setView] = useState<"map" | "grid">(initialView === "grid" ? "grid" : "map");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "newest" | "price-low" | "price-high">("featured");
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const [q, setQ] = useState(initialQuery ?? "");

  useEffect(() => {
    if (initialView === "grid") setView("grid");
  }, [initialView]);

  const PRICE_BANDS: Record<string, [number, number]> = {
    "Under $100": [0, 100],
    "$100–$300": [100, 300],
    "$300–$600": [300, 600],
    "$600–$1,200": [600, 1200],
    "Over $1,200": [1200, Infinity],
  };

  // Location-gated + filtered results
  const results = useMemo(() => {
    let list = artworks.filter((w) => {
      const a = byId.get(w.artistId);
      if (!a) return false;
      if (country && a.country !== country) return false;
      if (tag && !w.tags.includes(tag)) return false;
      if (priceBand) {
        const [lo, hi] = PRICE_BANDS[priceBand];
        if (w.price < lo || w.price > hi) return false;
      }
      if (q.trim()) {
        const hay = `${w.title} ${a.name} ${w.tags.join(" ")} ${a.city} ${a.neighborhood} ${w.medium}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "newest") list = [...list].sort((a, b) => b.year - a.year);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks, byId, country, tag, sort, priceBand, q]);

  // Build city clusters for the map from the (location-gated) results
  const clusters = useMemo<CityCluster[]>(() => {
    const map = new Map<string, CityCluster & { _artists: Set<string>; _latSum: number; _lngSum: number; _n: number }>();
    for (const w of results) {
      const a = byId.get(w.artistId);
      if (!a) continue;
      const lat = (w as unknown as { lat?: number }).lat ?? a.lat;
      const lng = (w as unknown as { lng?: number }).lng ?? a.lng;
      if (!lat && !lng) continue;
      const key = `${a.city}`;
      const cur = map.get(key) ?? {
        key, city: a.city, neighborhood: a.neighborhood, country: a.country,
        pieceCount: 0, artistCount: 0, thumb: w.image, slug: w.slug,
        lat: 0, lng: 0, isUser: false,
        _artists: new Set<string>(), _latSum: 0, _lngSum: 0, _n: 0,
      };
      cur.pieceCount += 1;
      cur._artists.add(a.id);
      cur._latSum += lat; cur._lngSum += lng; cur._n += 1;
      map.set(key, cur);
    }
    return Array.from(map.values()).map((c) => ({
      key: c.key, city: c.city, neighborhood: c.neighborhood, country: c.country,
      pieceCount: c.pieceCount, artistCount: c._artists.size, thumb: c.thumb, slug: c.slug,
      lat: c._n ? c._latSum / c._n : 0, lng: c._n ? c._lngSum / c._n : 0,
      isUser: true, // everything shown is in the user's country → all "home" pins
    }));
  }, [results, byId]);

  const activeFilters = tag || priceBand || q;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-ink-2)]">
          {ready ? (
            <>
              <span className="font-semibold text-[var(--color-ink)]">{results.length}</span> work{results.length === 1 ? "" : "s"} near you
              {country && <> in <span className="font-semibold text-[var(--color-ink)]">{country}</span></>}
            </>
          ) : "Finding art near you…"}
        </p>

        {/* View toggle */}
        <div className="flex items-center overflow-hidden rounded-sm border border-[var(--color-border)]">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition ${view === "map" ? "bg-[var(--color-ink)] text-[var(--color-linen)]" : "text-[var(--color-ink-2)] hover:bg-[var(--color-linen)]"}`}
          >
            <MapIcon className="h-4 w-4" /> Map
          </button>
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition ${view === "grid" ? "bg-[var(--color-ink)] text-[var(--color-linen)]" : "text-[var(--color-ink-2)] hover:bg-[var(--color-linen)]"}`}
          >
            <LayoutGrid className="h-4 w-4" /> Grid
          </button>
        </div>
      </div>

      {/* Filter chips (shared by both views) */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {topTags.slice(0, 10).map((t) => (
          <button key={t} onClick={() => setTag(tag === t ? null : t)} className={`chip capitalize ${tag === t ? "active" : ""}`}>
            {t}
          </button>
        ))}
        {activeFilters && (
          <button onClick={() => { setTag(null); setPriceBand(null); setQ(""); }} className="text-xs font-semibold text-[var(--color-clay)] hover:underline">
            ✕ Clear
          </button>
        )}
      </div>

      {!ready ? (
        <div className="h-[70vh] w-full animate-pulse rounded-sm bg-[var(--color-linen-2)]" />
      ) : results.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-linen)] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-linen-2)] text-2xl">🏡</div>
          <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
            {activeFilters ? "Nothing matches those filters" : `No neighbors listed in ${country} yet`}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-2)]">
            {activeFilters
              ? "Try loosening a filter — there may be more nearby than you think."
              : "Be the first to put your neighborhood on the map."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {activeFilters
              ? <button onClick={() => { setTag(null); setPriceBand(null); setQ(""); }} className="btn-primary">Clear filters</button>
              : <Link href="/sell" className="btn-primary">Be the first to list</Link>}
            <Link href="/profile/location" className="btn-outline">Browse another area</Link>
          </div>
        </div>
      ) : view === "map" ? (
        <>
          {clusters.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-linen)] p-10 text-center text-sm text-[var(--color-ink-2)]">
              These pieces don't have map locations yet — <button onClick={() => setView("grid")} className="font-semibold text-[var(--color-clay)] underline">see them in a grid</button>.
            </div>
          ) : (
            <BrowseMapClient clusters={clusters} />
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {results.map((w, i) => (
            <ArtworkCard key={w.id} artwork={w} index={i} artist={byId.get(w.artistId) ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
