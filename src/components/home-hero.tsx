"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useLocation } from "@/components/location-provider";
import { PorchLight, isArtistActive } from "@/components/porch-light";
import type { Artwork, Artist } from "@/lib/data";

// Human hero: one concrete piece, captioned like a neighbor made it.
// Prefers a local piece; falls back to any piece so the hero is never empty.
export function HomeHero({
  artworks,
  artists,
}: {
  artworks: Artwork[];
  artists: Artist[];
}) {
  const { country, ready } = useLocation();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);

  const { piece, artist, isLocal } = useMemo(() => {
    const local = artworks.filter((w) => byId.get(w.artistId)?.country === country);
    if (local.length > 0) {
      const p = local[0];
      return { piece: p, artist: byId.get(p.artistId) ?? null, isLocal: true };
    }
    const p = artworks[0] ?? null;
    return { piece: p, artist: p ? byId.get(p.artistId) ?? null : null, isLocal: false };
  }, [artworks, byId, country]);

  if (!piece || !artist) return null;

  const neighborhood = piece.neighborhood ?? artist.neighborhood;
  const active = isArtistActive(artist.id);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* The piece */}
        <Link href={`/art/${piece.slug}`} className="group relative block overflow-hidden rounded-sm">
          <div className="relative aspect-[5/4] w-full bg-[var(--color-linen-2)]">
            <Image
              src={piece.image}
              alt={piece.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              unoptimized={!piece.image.includes("unsplash.com")}
            />
            {/* caption plate — like a museum wall label */}
            <div className="absolute bottom-4 left-4 max-w-[85%] rounded-sm bg-[var(--color-plaster)]/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <PorchLight on={active} size={18} />
                <p className="font-hand text-xl text-[var(--color-clay)]">
                  {isLocal ? `Made in ${neighborhood}` : `From ${neighborhood}`}
                </p>
              </div>
              <p className="mt-0.5 font-display text-lg font-semibold text-[var(--color-ink)]">
                “{piece.title}” — by {artist.name}
              </p>
            </div>
          </div>
        </Link>

        {/* The message */}
        <div className="flex flex-col justify-center py-2">
          <p className="font-hand text-2xl text-[var(--color-clay)]">
            {ready && country ? `Welcome — here's ${country}` : "Welcome"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Your neighbor<br />is an artist.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-ink-2)]">
            The person two streets over paints. We help you find them — and buy
            their work directly, no gallery in between. This is art from your
            actual neighborhood.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/browse" className="btn-primary">See art near you</Link>
            <Link href="/about" className="btn-outline">Why neighbors?</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
