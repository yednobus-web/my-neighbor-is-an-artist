"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, User } from "lucide-react";

export type ArtistCard = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  city: string;
  neighborhood: string;
  countryFlag: string;
  vibe: string[];
  pieceCount: number;
};

export function ArtistsGrid({ artists }: { artists: ArtistCard[] }) {
  const [q, setQ] = useState("");

  const filtered = q.trim().length < 1
    ? artists
    : artists.filter((a) => {
        const s = q.toLowerCase();
        return (
          a.name.toLowerCase().includes(s) ||
          a.handle.toLowerCase().includes(s) ||
          a.city.toLowerCase().includes(s) ||
          a.neighborhood.toLowerCase().includes(s)
        );
      });

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="flex items-center gap-2 border-4 border-paper bg-paper text-ink shadow-graffiti-lg">
          <Search className="ml-3 h-6 w-6 shrink-0 text-ink/50" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, handle, city…"
            className="flex-1 bg-transparent py-3 pr-3 font-[family-name:var(--font-bangers)] text-xl tracking-wide text-ink placeholder:text-ink/40 focus:outline-none"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="mr-3 border-2 border-ink px-2 py-0.5 font-[family-name:var(--font-bangers)] text-sm tracking-widest hover:bg-blood-orange hover:text-paper"
            >
              CLEAR
            </button>
          )}
        </div>
        {q && (
          <p className="mt-2 font-[family-name:var(--font-marker)] text-paper/70">
            {filtered.length === 0
              ? "no artists match that search"
              : `${filtered.length} artist${filtered.length === 1 ? "" : "s"} found`}
          </p>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border-4 border-paper bg-paper p-10 text-center text-ink shadow-graffiti">
          <h2 className="font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
            NO ARTIST BY THAT NAME 😤
          </h2>
          <p className="mt-2">Try a different search.</p>
          <button
            onClick={() => setQ("")}
            className="mt-6 border-4 border-ink bg-hot-pink px-4 py-2 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-paper shadow-graffiti"
          >
            SHOW ALL
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((a, i) => (
            <Link
              key={a.id}
              href={`/artists/${a.id}`}
              className={`group block border-4 border-paper bg-paper p-3 text-ink shadow-graffiti transition-transform hover:-translate-y-1 ${
                i % 2 === 0 ? "-rotate-1" : "rotate-1"
              }`}
            >
              {/* Avatar */}
              <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-ink bg-ink shadow-graffiti">
                {a.avatar ? (
                  <Image
                    src={a.avatar}
                    alt={a.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized={!a.avatar.includes("unsplash.com")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-electric-purple">
                    <span className="font-[family-name:var(--font-bangers)] text-4xl text-paper">
                      {a.name.charAt(0).toUpperCase() || <User />}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <p className="mt-2 truncate font-[family-name:var(--font-marker)] text-base text-electric-purple">
                {a.handle}
              </p>
              <p className="truncate font-[family-name:var(--font-bangers)] text-lg tracking-wide">
                {a.name.toUpperCase()}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-ink/70">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{a.neighborhood}, {a.city} {a.countryFlag}</span>
              </div>

              {/* Piece count badge */}
              {a.pieceCount > 0 && (
                <div className="mt-2 inline-block bg-acid-lime px-2 py-0.5 font-[family-name:var(--font-bangers)] text-xs tracking-widest text-ink">
                  {a.pieceCount} {a.pieceCount === 1 ? "PIECE" : "PIECES"}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
