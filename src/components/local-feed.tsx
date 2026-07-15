"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { useLocation } from "@/components/location-provider";
import type { Artwork, Artist } from "@/lib/data";

// Shows artworks filtered to the visitor's detected/chosen country.
// Never a global feed. If nothing local, shows an inviting empty state.
export function LocalFeed({
  artworks,
  artists,
  limit = 8,
}: {
  artworks: Artwork[];
  artists: Artist[];
  limit?: number;
}) {
  const { country, ready } = useLocation();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);

  const local = useMemo(() => {
    if (!country) return [];
    return artworks.filter((w) => {
      const a = byId.get(w.artistId);
      return a?.country === country;
    });
  }, [artworks, byId, country]);

  if (!ready) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-[var(--color-linen-2)]" />
        ))}
      </div>
    );
  }

  if (local.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-linen)] p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-linen-2)] text-2xl">
          🏡
        </div>
        <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          No neighbors listed in {country} yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-2)]">
          You could be the first. If you make art here — or you know someone who does —
          this is where their work would live.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/sell" className="btn-primary">Be the first to list</Link>
          <Link href="/profile/location" className="btn-outline">Browse another area</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {local.slice(0, limit).map((w, i) => (
        <ArtworkCard key={w.id} artwork={w} index={i} artist={byId.get(w.artistId) ?? null} />
      ))}
    </div>
  );
}
