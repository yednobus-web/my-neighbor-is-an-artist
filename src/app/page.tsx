import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { HomeHero } from "@/components/home-hero";
import { LocalFeed } from "@/components/local-feed";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { PorchLight, isArtistActive } from "@/components/porch-light";
import { MapPin, Home as HomeIcon } from "lucide-react";

export const revalidate = 60;

// Fixed marketplace categories (Yessy-style tile grid)
const CATEGORIES = [
  { label: "Paintings", tag: "painting" },
  { label: "Photography", tag: "photo" },
  { label: "Drawings & Illustration", tag: "illustration" },
  { label: "Digital Art", tag: "digital" },
  { label: "Sculpture", tag: "sculpture" },
  { label: "Ceramics & Pottery", tag: "ceramics" },
  { label: "Textile & Fiber", tag: "textile" },
  { label: "Street & Graffiti", tag: "graffiti" },
];

export default async function HomePage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const spotlight = artists[0] ?? null;
  const spotlightWorks = spotlight
    ? artworks.filter((w) => w.artistId === spotlight.id).slice(0, 3)
    : [];

  // Pick a representative image per category (falls back to any artwork).
  function imageForCategory(tag: string, i: number): string {
    const match = artworks.find((w) =>
      w.tags.some((t) => t.toLowerCase().includes(tag)) ||
      (w.medium ?? "").toLowerCase().includes(tag),
    );
    return (match ?? artworks[i % Math.max(artworks.length, 1)])?.image ?? "";
  }

  return (
    <>
      <Header />
      <main>
        {/* Bold hero with search */}
        <HomeHero artworks={artworks} artists={artists} />

        {/* ── CATEGORIES GRID ── */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 text-center">
            <p className="font-hand text-2xl text-[var(--color-clay)]">what are you looking for?</p>
            <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)]">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => {
              const img = imageForCategory(cat.tag, i);
              return (
                <Link
                  key={cat.label}
                  href={`/browse?q=${encodeURIComponent(cat.tag)}`}
                  className="group relative h-40 overflow-hidden rounded-sm sm:h-44"
                >
                  {img && (
                    <Image
                      src={img}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized={!img.includes("unsplash.com")}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a2622]/85 via-[#2a2622]/25 to-transparent transition-colors group-hover:from-[#2a2622]/70" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="font-display text-lg font-semibold text-white drop-shadow">
                      {cat.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Local preview grid */}
        <section className="bg-[var(--color-linen)] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-hand text-2xl text-[var(--color-clay)]">fresh off the easel</p>
                <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)]">
                  Art from your neighborhood
                </h2>
              </div>
              <Link href="/browse" className="btn-outline hidden sm:inline-flex">See all nearby</Link>
            </div>
            <LocalFeed artworks={artworks} artists={artists} limit={8} />
          </div>
        </section>

        {/* Artist spotlight */}
        {spotlight && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="grid items-center gap-10 rounded-sm border border-[var(--color-border)] bg-[var(--color-linen)] p-6 sm:p-10 lg:grid-cols-2">
              <div>
                <p className="font-hand text-2xl text-[var(--color-clay)]">neighbor spotlight</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--color-border)]">
                    {spotlight.avatar ? (
                      <Image src={spotlight.avatar} alt={spotlight.name} fill sizes="80px" className="object-cover" unoptimized={!spotlight.avatar.includes("unsplash.com")} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--color-linen-2)] text-2xl font-bold text-[var(--color-ink-3)]">{spotlight.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">{spotlight.name}</h3>
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-[var(--color-ink-2)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--color-clay)]" />
                      {spotlight.neighborhood}, {spotlight.city}
                    </div>
                    <div className="mt-1"><PorchLight on={isArtistActive(spotlight.id)} size={16} withLabel /></div>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-ink-2)]">{spotlight.bio}</p>
                <Link href={`/artists/${spotlight.id}`} className="btn-primary mt-6">Meet the artist</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {spotlightWorks.map((w) => (
                  <Link key={w.id} href={`/art/${w.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-linen-2)]">
                    <Image src={w.image} alt={w.title} fill sizes="20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized={!w.image.includes("unsplash.com")} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sell CTA */}
        <section className="bg-[var(--color-ink)] py-16 text-[var(--color-linen)]">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
            <HomeIcon className="h-8 w-8 text-[var(--color-marigold)]" />
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              You're someone's neighbor too.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-linen)]/70">
              If you make art, your street should know. List your work in a few minutes,
              set your own prices, keep 90% of every sale.
            </p>
            <Link href="/sell" className="mt-7 inline-flex items-center gap-2 rounded-sm bg-[var(--color-marigold)] px-8 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white">
              Sell your art
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
