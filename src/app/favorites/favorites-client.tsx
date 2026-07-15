"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { useFavorites } from "@/components/favorites-provider";
import type { Artwork, Artist } from "@/lib/data";

export function FavoritesClient({ artworks, artists }: { artworks: Artwork[]; artists: Artist[] }) {
  const { ids, ready } = useFavorites();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);
  const saved = useMemo(() => artworks.filter((w) => ids.includes(w.slug)), [artworks, ids]);

  if (!ready) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-[var(--color-linen-2)]" />
        ))}
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-linen)] p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-linen-2)] text-2xl">🤍</div>
        <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Nothing saved yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-2)]">
          Tap the heart on any piece you love and it'll wait for you here.
        </p>
        <Link href="/browse" className="btn-primary mt-6">See art near you</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {saved.map((w, i) => (
        <ArtworkCard key={w.id} artwork={w} index={i} artist={byId.get(w.artistId) ?? null} />
      ))}
    </div>
  );
}
