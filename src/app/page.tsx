import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { ArtworkCard } from "@/components/artwork-card";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { ArrowRight, MapPin } from "lucide-react";

export const revalidate = 60;

const CATEGORY_TILES = [
  { label: "PHOTOGRAPHY", tag: "photo" },
  { label: "GRAPHICS", tag: "digital" },
  { label: "PAINTINGS", tag: "painting" },
  { label: "SCULPTURES", tag: "sculpture" },
];

export default async function HomePage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const featured = artworks.slice(0, 8);
  const featuredArtists = artists.slice(0, 6);
  const heroArt = artworks[0];

  // Neighborhood tiles — unique cities
  const cities = Array.from(
    new Map(artists.map((a) => [a.city, { city: a.city, flag: a.countryFlag, country: a.country }])).values()
  ).slice(0, 6);

  // Pick an image for each category tile
  const tileImages = artworks.slice(0, 4).map((w) => w.image);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* ── HERO BANNER ── */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <div className="relative overflow-hidden">
            {/* Background artwork */}
            <div className="relative h-[300px] w-full sm:h-[380px] lg:h-[440px]">
              {heroArt && (
                <Image
                  src={heroArt.image}
                  alt={heroArt.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  unoptimized={!heroArt.image.includes("unsplash.com")}
                />
              )}
              {/* Left fade for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
                <p className="mb-2 text-xs font-medium italic text-[var(--color-ink-2)]">
                  Browse Works For Sale
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
                  ART FROM<br />YOUR NEIGHBOR
                </h1>
                <p className="mt-3 max-w-sm text-sm text-[var(--color-ink-2)] leading-relaxed">
                  Original art from real artists in real neighborhoods around the world.
                  Buy direct — artists keep 90%.
                </p>
                <Link
                  href="/browse"
                  className="mt-6 inline-flex w-fit items-center gap-2 bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--color-hot-pink)]"
                >
                  Read More
                </Link>
              </div>

              {/* Carousel dots (decorative) */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-ink)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/30" />
                <span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/30" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY TILES ── */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CATEGORY_TILES.map((cat, i) => (
              <Link
                key={cat.label}
                href={`/browse?tag=${encodeURIComponent(cat.tag)}`}
                className="group relative h-32 overflow-hidden sm:h-36"
              >
                {tileImages[i] && (
                  <Image
                    src={tileImages[i]}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized={!tileImages[i].includes("unsplash.com")}
                  />
                )}
                <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/25" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-white drop-shadow-md">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BROWSE BY MEDIUM STRIP ── */}
        <section className="border-y border-[var(--color-border)] bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ink-2)]">
                Browse by Style
              </p>
              <div className="flex flex-wrap gap-2">
                {["Painting", "Photography", "Sculpture", "Digital Art", "Graffiti / Street Art", "Illustration"].map((s) => (
                  <Link
                    key={s}
                    href={`/browse?tag=${encodeURIComponent(s.toLowerCase())}`}
                    className="tag-pill text-sm"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED ARTWORKS ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-3)]">
                  Latest Drops
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-[var(--color-ink)] sm:text-4xl">
                  NEW ON THE WALL
                </h2>
              </div>
              <Link href="/browse" className="btn-outline hidden sm:inline-flex">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((w, i) => {
                const artist = artists.find((a) => a.id === w.artistId) ?? null;
                return <ArtworkCard key={w.id} artwork={w} index={i} artist={artist} />;
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/browse" className="btn-outline">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── NEIGHBORHOODS ── */}
        <section className="bg-[var(--color-canvas-2)] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-3)]">
                Discover
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-[var(--color-ink)] sm:text-4xl">
                ART BY LOCATION
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {cities.map((c) => (
                <Link
                  key={c.city}
                  href={`/browse?loc=${encodeURIComponent(c.city)}`}
                  className="group flex flex-col items-center justify-center gap-2 border border-[var(--color-border)] bg-white p-5 text-center transition-shadow hover:shadow-md"
                >
                  <span className="text-3xl">{c.flag}</span>
                  <span className="font-semibold text-sm text-[var(--color-ink)]">{c.city}</span>
                  <span className="text-xs text-[var(--color-ink-3)]">{c.country}</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/neighborhoods" className="btn-outline">
                View All Neighborhoods <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── ARTISTS ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-3)]">
                  Meet the Makers
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-[var(--color-ink)] sm:text-4xl">
                  FEATURED ARTISTS
                </h2>
              </div>
              <Link href="/artists" className="btn-outline hidden sm:inline-flex">
                All Artists <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {featuredArtists.map((a) => (
                <Link
                  key={a.id}
                  href={`/artists/${a.id}`}
                  className="group flex flex-col items-center gap-3 text-center"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-canvas-3)] transition-shadow group-hover:shadow-md">
                    {a.avatar ? (
                      <Image
                        src={a.avatar}
                        alt={a.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform group-hover:scale-110"
                        unoptimized={!a.avatar.includes("unsplash.com")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--color-canvas-3)] text-xl font-bold text-[var(--color-ink-3)]">
                        {a.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{a.name}</p>
                    <div className="flex items-center justify-center gap-0.5 text-xs text-[var(--color-ink-3)]">
                      <MapPin className="h-3 w-3" />
                      <span>{a.city} {a.countryFlag}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SELL CTA ── */}
        <section className="bg-[var(--color-ink)] py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-acid-lime)]">
              For Artists
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide sm:text-5xl">
              SELL YOUR ART.<br />
              <span style={{ color: "var(--color-hot-pink)" }}>KEEP 90%.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-white/70 leading-relaxed">
              No gatekeepers. No gallery commission. List your work, set your price,
              get paid direct. We handle the rest.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 bg-[var(--color-hot-pink)] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Start Selling <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/account/profile"
                className="inline-flex items-center gap-2 border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:border-white"
              >
                Set Up Profile
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
