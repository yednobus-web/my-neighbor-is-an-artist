"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocation } from "@/components/location-provider";
import type { Artwork, Artist } from "@/lib/data";

// Bold gallery hero (Yessy-style): a real piece behind a dark scrim,
// headline, and a working search bar. Location-aware caption.
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

  const backdrop = useMemo(() => {
    const local = artworks.filter((w) => byId.get(w.artistId)?.country === country);
    return (local[0] ?? artworks[0])?.image ?? "";
  }, [artworks, byId, country]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/browse?q=${encodeURIComponent(q.trim())}` : "/browse");
  }

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop art */}
      <div className="relative h-[420px] w-full sm:h-[480px]">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={!backdrop.includes("unsplash.com")}
          />
        )}
        {/* Warm dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2622]/70 via-[#2a2622]/55 to-[#2a2622]/80" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="font-hand text-2xl text-[var(--color-marigold)] sm:text-3xl">
            {ready && country ? `art from your neighborhood in ${country}` : "art from your neighborhood"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white drop-shadow sm:text-6xl">
            Your Neighbor Is An Artist
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            The person two streets over paints. Find them, meet them, and buy their
            work directly — no gallery in between.
          </p>

          {/* Search bar */}
          <form onSubmit={submit} className="mt-7 flex w-full max-w-xl items-center overflow-hidden rounded-sm bg-white shadow-xl">
            <Search className="ml-4 h-5 w-5 shrink-0 text-[var(--color-ink-3)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search art, artists, styles…"
              className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none"
            />
            <button type="submit" className="bg-[var(--color-clay)] px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[var(--color-berry)]">
              Search
            </button>
          </form>

          <div className="mt-4 flex gap-3">
            <Link href="/browse" className="text-sm font-semibold text-white underline-offset-4 hover:underline">
              Browse nearby →
            </Link>
            <span className="text-white/40">·</span>
            <Link href="/sell" className="text-sm font-semibold text-white underline-offset-4 hover:underline">
              Sell your art →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
