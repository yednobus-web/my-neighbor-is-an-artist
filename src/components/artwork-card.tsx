import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Artwork, Artist, getArtist } from "@/lib/data";

const SHADOWS = [
  "shadow-graffiti-pink",
  "shadow-graffiti-cyan",
  "shadow-graffiti-lime",
  "shadow-graffiti",
] as const;

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"] as const;

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

  const shadow = SHADOWS[index % SHADOWS.length];
  const rotate = ROTATIONS[index % ROTATIONS.length];
  const neighborhood = artwork.neighborhood ?? artist.neighborhood;
  const city = artwork.city ?? artist.city;

  return (
    <Link
      href={`/art/${artwork.slug}`}
      className={`group block ${rotate} hover:rotate-0 transition-transform duration-200`}
    >
      <article
        className={`relative overflow-hidden border-4 border-paper bg-paper text-ink ${shadow}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={!artwork.image.includes("unsplash.com")}
          />
          <div className="absolute left-2 top-2 rotate-[-4deg] bg-sun-yellow px-2 py-0.5 font-[family-name:var(--font-bangers)] text-sm tracking-widest text-ink shadow-graffiti">
            {artwork.tags[0]?.toUpperCase()}
          </div>
          <div className="absolute right-2 top-2 rotate-[3deg] bg-hot-pink px-2 py-0.5 font-[family-name:var(--font-bangers)] text-sm tracking-widest text-paper shadow-graffiti">
            ${artwork.price}
          </div>
        </div>

        <div className="space-y-1 p-3">
          <h3
            className="font-[family-name:var(--font-bangers)] text-2xl leading-tight tracking-wide text-ink line-clamp-2"
          >
            {artwork.title}
          </h3>
          <p className="font-[family-name:var(--font-marker)] text-base text-electric-purple">
            {artist.handle}
          </p>
          <div className="flex items-center gap-1 text-xs text-ink/70">
            <MapPin className="h-3 w-3" />
            <span>
              {neighborhood}, {city} {artist.countryFlag}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
