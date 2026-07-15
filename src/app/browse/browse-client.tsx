"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { useLocation } from "@/components/location-provider";
import type { Artwork, Artist } from "@/lib/data";

type Props = {
  artworks: Artwork[];
  artists: Artist[];
  topTags: string[];
  initialQuery?: string;
};

export function BrowseClient({ artworks, artists, topTags, initialQuery }: Props) {
  const { country, ready } = useLocation();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);

  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "newest" | "price-low" | "price-high">("featured");
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const [q, setQ] = useState(initialQuery ?? "");

  const PRICE_BANDS: Record<string, [number, number]> = {
    "Under $100": [0, 100],
    "$100–$300": [100, 300],
    "$300–$600": [300, 600],
    "$600–$1,200": [600, 1200],
    "Over $1,200": [1200, Infinity],
  };

  const results = useMemo(() => {
    let list = artworks.filter((w) => {
      const a = byId.get(w.artistId);
      if (!a) return false;
      // LOCATION GATE — only art from the visitor's country
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

  return (
    <div className="mx-auto flex max-w-7xl gap-0">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] px-5 py-6 lg:block">
        {(tag || priceBand || q) && (
          <button
            onClick={() => { setTag(null); setPriceBand(null); setQ(""); }}
            className="mb-5 text-xs font-semibold text-[var(--color-clay)] hover:underline"
          >
            ✕ Clear filters
          </button>
        )}

        <div className="mb-6">
          <p className="filter-group-title">Sort By</p>
          {([["featured","Featured"],["newest","Newest"],["price-low","Price: Low to High"],["price-high","Price: High to Low"]] as const).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setSort(v)}
              className={`block w-full py-1 text-left text-sm ${sort === v ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="filter-group-title">Vibe</p>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {topTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={`flex w-full items-center justify-between py-0.5 text-left text-sm capitalize ${tag === t ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"}`}
              >
                <span>{t}</span>{tag === t && <span className="text-[var(--color-clay)]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="filter-group-title">Price</p>
          {Object.keys(PRICE_BANDS).map((band) => (
            <button
              key={band}
              onClick={() => setPriceBand(priceBand === band ? null : band)}
              className={`flex w-full items-center justify-between py-0.5 text-left text-sm ${priceBand === band ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"}`}
            >
              <span>{band}</span>{priceBand === band && <span className="text-[var(--color-clay)]">✓</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1 px-4 py-6 sm:px-6">
        {/* Mobile vibe chips */}
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {topTags.slice(0, 8).map((t) => (
            <button key={t} onClick={() => setTag(tag === t ? null : t)} className={`chip ${tag === t ? "active" : ""}`}>
              {t}
            </button>
          ))}
        </div>

        {!ready ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-[var(--color-linen-2)]" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-linen)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-linen-2)] text-2xl">🏡</div>
            <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              {tag || priceBand || q ? "Nothing matches those filters" : `No neighbors listed in ${country} yet`}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-2)]">
              {tag || priceBand || q
                ? "Try loosening a filter — there may be more nearby than you think."
                : "Be the first to put your neighborhood on the map."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {(tag || priceBand || q)
                ? <button onClick={() => { setTag(null); setPriceBand(null); setQ(""); }} className="btn-primary">Clear filters</button>
                : <Link href="/sell" className="btn-primary">Be the first to list</Link>}
              <Link href="/profile/location" className="btn-outline">Browse another area</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[var(--color-ink-2)]">
              {results.length} work{results.length === 1 ? "" : "s"} near you
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((w, i) => (
                <ArtworkCard key={w.id} artwork={w} index={i} artist={byId.get(w.artistId) ?? null} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
