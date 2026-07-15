import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Artwork, Artist, getArtist } from "@/lib/data";
import { PorchLight, isArtistActive } from "./porch-light";
import { FavoriteButton } from "./favorite-button";

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

  void index;
  const neighborhood = artwork.neighborhood ?? artist.neighborhood;
  const city = artwork.city ?? artist.city;
  const active = isArtistActive(artist.id);
  const currencySymbol = artwork.currency === "USD" ? "$" : `${artwork.currency} `;

  return (
    <Link href={`/art/${artwork.slug}`} className="group block">
      <article className="art-card overflow-hidden rounded-sm">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-linen-2)] p-3">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={!artwork.image.includes("unsplash.com")}
            />
          </div>
          <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
            <FavoriteButton slug={artwork.slug} />
          </div>
        </div>

        <div className="px-4 pb-4 pt-1">
          <h3 className="font-display text-lg font-semibold leading-snug text-[var(--color-ink)] line-clamp-1">
            {artwork.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-ink-2)]">
            <PorchLight on={active} size={16} />
            <span className="truncate">by {artist.name}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-ink-3)]">
            <MapPin className="h-3 w-3 shrink-0 text-[var(--color-clay)]" />
            <span className="truncate">{neighborhood}, {city}</span>
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <span className="price-tag">{currencySymbol}{artwork.price.toLocaleString()}</span>
            <span className="text-xs text-[var(--color-ink-3)]">{artwork.medium || "Original"}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
