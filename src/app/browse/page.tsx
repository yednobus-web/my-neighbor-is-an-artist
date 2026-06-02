import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { NeighborhoodSearch } from "@/components/neighborhood-search";
import { ArtworkCard } from "@/components/artwork-card";
import { fetchArtists, fetchArtworks } from "@/lib/repo";

export const revalidate = 60;

type SP = Promise<{ loc?: string; tag?: string; sort?: string }>;

export default async function BrowsePage({ searchParams }: { searchParams: SP }) {
  const { loc, tag, sort } = await searchParams;
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const byArtist = new Map(artists.map((a) => [a.id, a]));

  const allTags = Array.from(new Set(artworks.flatMap((w) => w.tags))).sort();
  const neighborhoods = Array.from(new Set(artists.map((a) => `${a.neighborhood}, ${a.city}`))).sort();

  let results = artworks.filter((w) => {
    const a = byArtist.get(w.artistId);
    if (!a) return false;
    const locStr = `${a.neighborhood} ${a.city} ${a.country}`.toLowerCase();
    const matchLoc = loc ? locStr.includes(loc.toLowerCase()) : true;
    const matchTag = tag ? w.tags.includes(tag) : true;
    return matchLoc && matchTag;
  });

  if (sort === "price-low") results = [...results].sort((a, b) => a.price - b.price);
  else if (sort === "price-high") results = [...results].sort((a, b) => b.price - a.price);
  else if (sort === "newest") results = [...results].sort((a, b) => b.year - a.year);

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">
                {loc ? `art near "${loc}"` : "all art, all blocks"}
              </p>
              <h1 className="font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
                {loc ? loc.toUpperCase() : "BROWSE"}
              </h1>
            </div>
            <div className="md:max-w-md md:flex-1">
              <NeighborhoodSearch suggestions={neighborhoods} size="md" />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div>
              <p className="mb-2 font-[family-name:var(--font-bangers)] text-lg tracking-widest text-cyber-cyan">
                VIBE
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  href={buildQuery({ loc, sort, tag: undefined })}
                  active={!tag}
                  label="ALL"
                  color="bg-paper"
                />
                {allTags.map((t, i) => {
                  const colors = [
                    "bg-hot-pink",
                    "bg-acid-lime",
                    "bg-sun-yellow",
                    "bg-cyber-cyan",
                    "bg-blood-orange",
                    "bg-electric-purple",
                  ];
                  return (
                    <FilterChip
                      key={t}
                      href={buildQuery({ loc, sort, tag: t })}
                      active={tag === t}
                      label={t.toUpperCase()}
                      color={colors[i % colors.length]}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-bangers)] tracking-widest text-cyber-cyan">SORT:</p>
              {[
                { v: undefined, l: "FEATURED" },
                { v: "newest", l: "NEWEST" },
                { v: "price-low", l: "PRICE ↑" },
                { v: "price-high", l: "PRICE ↓" },
              ].map((s) => (
                <Link
                  key={s.l}
                  href={buildQuery({ loc, tag, sort: s.v })}
                  className={`border-2 border-paper px-3 py-1 font-[family-name:var(--font-bangers)] tracking-wider ${
                    sort === s.v ? "bg-paper text-ink" : "text-paper hover:bg-paper hover:text-ink"
                  }`}
                >
                  {s.l}
                </Link>
              ))}
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="border-4 border-paper bg-paper p-10 text-center text-ink shadow-graffiti">
              <h2 className="font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
                NOTHING ON THIS BLOCK YET 😤
              </h2>
              <p className="mt-2">Try a different neighborhood or vibe.</p>
              <Link
                href="/browse"
                className="mt-6 inline-block border-4 border-ink bg-hot-pink px-4 py-2 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-paper shadow-graffiti"
              >
                CLEAR FILTERS
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4 font-[family-name:var(--font-marker)] text-paper/80">
                {results.length} piece{results.length === 1 ? "" : "s"} found
              </p>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((w, i) => (
                  <ArtworkCard
                    key={w.id}
                    artwork={w}
                    index={i}
                    artist={byArtist.get(w.artistId) ?? null}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildQuery(p: { loc?: string; tag?: string; sort?: string }) {
  const sp = new URLSearchParams();
  if (p.loc) sp.set("loc", p.loc);
  if (p.tag) sp.set("tag", p.tag);
  if (p.sort) sp.set("sort", p.sort);
  const qs = sp.toString();
  return qs ? `/browse?${qs}` : "/browse";
}

function FilterChip({
  href,
  active,
  label,
  color,
}: {
  href: string;
  active: boolean;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`border-2 border-ink px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest text-ink shadow-graffiti transition-transform hover:-translate-y-0.5 ${color} ${
        active ? "ring-4 ring-paper" : ""
      }`}
    >
      {label}
    </Link>
  );
}
