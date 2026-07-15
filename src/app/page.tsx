import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { HomeHero } from "@/components/home-hero";
import { LocalFeed } from "@/components/local-feed";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { PorchLight, isArtistActive } from "@/components/porch-light";
import { MapPin } from "lucide-react";

export const revalidate = 60;

// A small number of LARGE category tiles (not a dense icon grid)
const CATEGORIES = [
  { label: "Paintings", tag: "painting" },
  { label: "Photography", tag: "photo" },
  { label: "Sculpture", tag: "sculpture" },
];

export default async function HomePage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const spotlight = artists[0] ?? null;
  const spotlightWorks = spotlight
    ? artworks.filter((w) => w.artistId === spotlight.id).slice(0, 3)
    : [];

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
        {/* Full-bleed hero */}
        <HomeHero artworks={artworks} artists={artists} />

        {/* ── CURRENT EXHIBITION — lively overlapping thumbnails ── */}
        <section className="relative overflow-hidden bg-white py-16">
          {/* orange accent blob, like the reference */}
          <div className="pointer-events-none absolute -top-10 right-[8%] h-40 w-32 rounded-b-full bg-[var(--color-clay)]" aria-hidden />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.6fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
                Current<br />exhibition
              </h2>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                Fresh work from artists on your block, hung this week. Every piece is
                one of one — and 90% of the price goes straight to the maker.
              </p>
              <Link href="/browse" className="btn-primary mt-6">See what&apos;s up</Link>
            </div>
            {/* overlapping tilted thumbnails */}
            <div className="flex items-center justify-center gap-0 sm:justify-start">
              {artworks.slice(0, 4).map((w, i) => {
                const rot = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"][i % 4];
                const mt = ["mt-0", "mt-8", "mt-2", "mt-10"][i % 4];
                return (
                  <Link
                    key={w.id}
                    href={`/art/${w.slug}`}
                    className={`group relative -ml-4 first:ml-0 ${mt} ${rot} transition-transform duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0`}
                    style={{ zIndex: 4 - i }}
                  >
                    <div className="relative h-52 w-40 overflow-hidden rounded-sm border-4 border-white shadow-xl sm:h-64 sm:w-48">
                      <Image
                        src={w.image}
                        alt={w.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                        unoptimized={!w.image.includes("unsplash.com")}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MISSION — warm mustard color-block moment ── */}
        <section className="bg-[var(--color-marigold)]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-hand text-2xl text-[var(--color-ink)]/70">the whole idea</p>
              <h2 className="mt-1 font-display text-3xl font-semibold leading-tight text-[var(--color-ink)] sm:text-4xl">
                These are your neighbors —<br />not vendors.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-ink)]/80">
                Somewhere near you, someone paints after the kids are asleep. We help you
                find them and buy their work directly — no gallery in between, 90% to the
                artist. A painting means more when you can drive past the street it was made on.
              </p>
              <Link href="/about" className="btn-primary mt-6 bg-[var(--color-ink)]">
                Why neighbors?
              </Link>
            </div>
            {/* storytelling image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm">
              {spotlight?.avatar && (
                <Image
                  src={artworks[1]?.image ?? spotlight.avatar}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>
        </section>

        {/* ── LARGE CATEGORY TILES (poster-style, not icon grid) ── */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const img = imageForCategory(cat.tag, i);
              return (
                <Link
                  key={cat.label}
                  href={`/browse?q=${encodeURIComponent(cat.tag)}&view=grid`}
                  className="group relative h-64 overflow-hidden rounded-sm"
                >
                  {img && (
                    <Image
                      src={img}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={!img.includes("unsplash.com")}
                    />
                  )}
                  <div className="absolute inset-0 bg-[#2a2622]/45 transition-colors group-hover:bg-[#2a2622]/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl font-semibold uppercase tracking-[0.15em] text-white drop-shadow">
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
            <div className="grid items-center gap-10 lg:grid-cols-2">
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
        <section className="border-t border-[var(--color-border)] bg-[var(--color-linen)] py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
              You&apos;re someone&apos;s neighbor too.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-ink-2)]">
              If you make art, your street should know. List your work in a few minutes,
              set your own prices, keep 90% of every sale.
            </p>
            <Link href="/sell" className="btn-primary mt-7">Sell your art</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
