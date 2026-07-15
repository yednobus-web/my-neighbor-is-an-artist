"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocation } from "@/components/location-provider";
import type { Artwork, Artist } from "@/lib/data";

// Gallery-hero (reference style): a real artwork fills the frame,
// with a solid marigold block behind the welcome headline on the left.
export function HomeHero({
  artworks,
  artists,
}: {
  artworks: Artwork[];
  artists: Artist[];
}) {
  const router = useRouter();
  const { country, ready } = useLocation();
  const byId = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists]);
  const [q, setQ] = useState("");

  const { backdrop, artist, piece } = useMemo(() => {
    const local = artworks.filter((w) => byId.get(w.artistId)?.country === country);
    const p = local[0] ?? artworks[0];
    return { backdrop: p?.image ?? "", artist: p ? byId.get(p.artistId) ?? null : null, piece: p ?? null };
  }, [artworks, byId, country]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/browse?q=${encodeURIComponent(q.trim())}` : "/browse");
  }

  return (
    <section className="relative overflow-hidden bg-[var(--color-plaster)]">
      <div className="relative h-[520px] w-full sm:h-[560px]">
        {/* Full artwork backdrop */}
        {backdrop && (
          <Image
            src={backdrop}
            alt={piece?.title ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={!backdrop.includes("unsplash.com")}
          />
        )}
        {/* soft warm wash so text reads, art still shows */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-plaster)]/95 via-[var(--color-plaster)]/40 to-transparent" />

        {/* Marigold color block + headline */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <div className="relative ml-4 sm:ml-10 lg:ml-16">
            {/* the yellow block */}
            <div className="absolute -left-4 top-6 h-[78%] w-[70%] bg-[var(--color-marigold)]" aria-hidden />
            <div className="relative max-w-md px-6 py-8">
              <p className="font-hand text-3xl text-[var(--color-ink)]">
                {ready && country ? `welcome to ${country}` : "welcome to the"}
              </p>
              <h1 className="mt-1 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-[var(--color-ink)] sm:text-6xl">
                Your Neighbor<br />Is An Artist
              </h1>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-ink)]/85">
                The person two streets over paints. Find them, meet them, and buy their
                work directly — no gallery in between.
              </p>

              <form onSubmit={submit} className="mt-6 flex max-w-sm items-center overflow-hidden rounded-sm border border-[var(--color-ink)] bg-white shadow-lg">
                <Search className="ml-3 h-4 w-4 shrink-0 text-[var(--color-ink-3)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search art, artists, styles…"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none"
                />
                <button type="submit" className="bg-[var(--color-ink)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--color-berry)]">
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* caption plate bottom-right */}
        {artist && piece && (
          <div className="absolute bottom-5 right-5 hidden max-w-xs rounded-sm bg-[var(--color-ink)]/85 px-4 py-3 text-right backdrop-blur sm:block">
            <p className="font-hand text-xl text-[var(--color-marigold)]">from {artist.neighborhood}</p>
            <p className="font-display text-base font-semibold text-white">“{piece.title}” — {artist.name}</p>
          </div>
        )}
      </div>
    </section>
  );
}
