import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/chrome";
import { ArtworkCard } from "@/components/artwork-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { BuyNowButton } from "@/components/buy-now-button";
import { fetchArtists, fetchArtworkBySlug, fetchArtworks } from "@/lib/repo";
import { MapPin, Heart, Share2, Truck, Shield } from "lucide-react";

export const revalidate = 60;
export const dynamicParams = true;

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = await fetchArtworkBySlug(slug);
  if (!artwork) notFound();

  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const artist = artists.find((a) => a.id === artwork.artistId);
  if (!artist) notFound();

  const neighborhood = artwork.neighborhood ?? artist.neighborhood;
  const city = artwork.city ?? artist.city;
  const moreFromArtist = artworks
    .filter((w) => w.artistId === artist.id && w.id !== artwork.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/browse" className="mb-6 inline-block font-[family-name:var(--font-marker)] text-acid-lime hover:text-hot-pink">
            ← back to the wall
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div className="-rotate-1">
              <div className="relative aspect-[4/5] w-full overflow-hidden border-4 border-paper bg-ink shadow-graffiti-lg">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  unoptimized={!artwork.image.includes("unsplash.com")}
                />
                <div className="absolute right-3 top-3 rotate-3 bg-sun-yellow px-3 py-1 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti">
                  ${artwork.price}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="font-[family-name:var(--font-marker)] text-xl text-acid-lime">
                  {artwork.tags.join(" · ")}
                </p>
                <h1 className="mt-1 font-[family-name:var(--font-bangers)] text-5xl leading-tight tracking-wide text-paper sm:text-6xl">
                  {artwork.title}
                </h1>
              </div>

              <Link
                href={`/artists/${artist.id}`}
                className="flex items-center gap-3 border-4 border-paper bg-paper p-3 text-ink shadow-graffiti hover:-translate-y-1 transition-transform"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-ink">
                  <Image src={artist.avatar} alt={artist.name} fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-marker)] text-xl text-electric-purple">{artist.handle}</p>
                  <p className="text-sm">{artist.name} · {artist.followers.toLocaleString()} followers</p>
                </div>
              </Link>

              <div className="flex items-center gap-2 font-[family-name:var(--font-bangers)] tracking-widest text-cyber-cyan">
                <MapPin className="h-5 w-5" />
                <span className="text-xl">
                  {neighborhood.toUpperCase()}, {city.toUpperCase()} {artist.countryFlag}
                </span>
              </div>

              <div className="border-y-2 border-paper/30 py-4">
                <p className="font-[family-name:var(--font-bangers)] text-4xl text-paper">
                  ${artwork.price.toLocaleString()} <span className="text-lg text-paper/60">{artwork.currency}</span>
                </p>
                <p className="mt-1 text-sm text-paper/70">
                  Artist keeps ${Math.round(artwork.price * 0.9).toLocaleString()} · Platform fee 10%
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <BuyNowButton slug={artwork.slug} />
                <AddToCartButton
                  item={{
                    artworkId: artwork.id,
                    slug: artwork.slug,
                    title: artwork.title,
                    price: artwork.price,
                    image: artwork.image,
                    artistHandle: artist.handle,
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  aria-label="Save"
                  className="flex items-center justify-center border-4 border-paper bg-paper px-4 py-3 text-ink shadow-graffiti hover:bg-acid-lime"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  aria-label="Share"
                  className="flex items-center justify-center border-4 border-paper bg-paper px-4 py-3 text-ink shadow-graffiti hover:bg-cyber-cyan"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 border-4 border-paper bg-paper p-5 text-ink shadow-graffiti">
                <h2 className="font-[family-name:var(--font-bangers)] text-2xl tracking-wide">DETAILS</h2>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  <li><b>Medium:</b> {artwork.medium}</li>
                  <li><b>Year:</b> {artwork.year}</li>
                  <li><b>Size:</b> {artwork.width} × {artwork.height} cm</li>
                  <li><b>Original:</b> 1 of 1</li>
                </ul>
                <p className="text-sm">{artwork.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2 border-2 border-paper p-3 text-paper">
                  <Truck className="h-5 w-5 shrink-0 text-acid-lime" />
                  <div>
                    <p className="font-[family-name:var(--font-bangers)] tracking-widest">SHIPS WORLDWIDE</p>
                    <p className="text-paper/70">5–14 days, tracked, insured.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-2 border-paper p-3 text-paper">
                  <Shield className="h-5 w-5 shrink-0 text-hot-pink" />
                  <div>
                    <p className="font-[family-name:var(--font-bangers)] tracking-widest">BUYER PROTECTED</p>
                    <p className="text-paper/70">Refund if it doesn't arrive as described.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More from artist */}
          {moreFromArtist.length > 0 && (
            <section className="mt-20">
              <h2 className="mb-8 font-[family-name:var(--font-bangers)] text-4xl tracking-wide text-paper sm:text-5xl">
                MORE FROM {artist.handle.toUpperCase()}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {moreFromArtist.map((w, i) => (
                  <ArtworkCard key={w.id} artwork={w} index={i} artist={artist} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
