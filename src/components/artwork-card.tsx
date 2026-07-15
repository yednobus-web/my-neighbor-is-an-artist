import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Artwork, Artist, getArtist } from "@/lib/data";

export function ArtworkCard({
  artwork,
  index = 0,
  artist: explicitArtist,
}: {
  artwork: Artwork;
  index?: number;
  artist?: Artist | null;
}) {
  const artist = explicitArtist ?? getArtist(artwork.artistId);
  if (!artist) return null;

  const neighborhood = artwork.neighborhood ?? artist.neighborhood;
  const city = artwork.city ?? artist.city;

  void index; // no rotation in new design

  return (
    <Link href={`/art/${artwork.slug}`} className="group block">
      <article className="card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-canvas-3)]">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            unoptimized={!artwork.image.includes("unsplash.com")}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
          {/* Tag badge */}
          {artwork.tags[0] && (
            <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-[var(--color-ink-2)] shadow">
              {artwork.tags[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-[var(--color-ink)] leading-snug">
            {artwork.title}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-ink-3)]">{artist.name}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-ink-3)]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{neighborhood}, {city} {artist.countryFlag}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="price-badge text-sm">
              {artwork.currency === "USD" ? "$" : artwork.currency}{artwork.price.toLocaleString()}
            </span>
            <span className="text-xs text-[var(--color-ink-3)]">{artwork.medium || "Original"}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
