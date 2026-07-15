import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { ArtworkCard } from "@/components/artwork-card";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { Search, SlidersHorizontal } from "lucide-react";
import { ART_STYLES } from "@/lib/locations";

export const revalidate = 60;

type SP = Promise<{ loc?: string; tag?: string; sort?: string; style?: string; priceMin?: string; priceMax?: string }>;

export default async function BrowsePage({ searchParams }: { searchParams: SP }) {
  const { loc, tag, sort, style, priceMin, priceMax } = await searchParams;
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const byArtist = new Map(artists.map((a) => [a.id, a]));

  // Top 30 tags by frequency
  const tagFreq = new Map<string, number>();
  artworks.forEach((w) => w.tags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)));
  const topTags = Array.from(tagFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([t]) => t);

  // Unique countries for filter
  const countries = Array.from(new Set(artists.map((a) => a.country))).sort();

  // Filter artworks
  let results = artworks.filter((w) => {
    const a = byArtist.get(w.artistId);
    if (!a) return false;
    const locStr = `${a.neighborhood} ${a.city} ${a.country}`.toLowerCase();
    const matchLoc = loc ? locStr.includes(loc.toLowerCase()) : true;
    const matchTag = tag ? w.tags.includes(tag) : true;
    const matchStyle = style ? (w as unknown as { style?: string }).style === style : true;
    const matchPriceMin = priceMin ? w.price >= Number(priceMin) : true;
    const matchPriceMax = priceMax ? w.price <= Number(priceMax) : true;
    return matchLoc && matchTag && matchStyle && matchPriceMin && matchPriceMax;
  });

  if (sort === "price-low") results = [...results].sort((a, b) => a.price - b.price);
  else if (sort === "price-high") results = [...results].sort((a, b) => b.price - a.price);
  else if (sort === "newest") results = [...results].sort((a, b) => b.year - a.year);

  const hasFilters = !!(loc || tag || style || priceMin || priceMax);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Page title bar */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-canvas-2)] px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-[var(--color-ink)]">
                {loc ? loc.toUpperCase() : "BROWSE ART"}
              </h1>
              <p className="mt-0.5 text-sm text-[var(--color-ink-3)]">
                {results.length.toLocaleString()} work{results.length === 1 ? "" : "s"}{loc ? ` near "${loc}"` : " available"}
              </p>
            </div>
            {/* Search bar */}
            <form method="get" action="/browse" className="hidden max-w-xs flex-1 sm:flex">
              <div className="flex w-full items-center border border-[var(--color-border)] bg-white">
                <Search className="ml-3 h-4 w-4 shrink-0 text-[var(--color-ink-3)]" />
                <input
                  name="loc"
                  defaultValue={loc ?? ""}
                  placeholder="Search by city, neighborhood…"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none"
                />
                <button type="submit" className="bg-[var(--color-ink)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-hot-pink)]">
                  GO
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl gap-0 px-0">
          {/* ── SIDEBAR ── */}
          <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] px-5 py-6 lg:block">
            {hasFilters && (
              <div className="mb-5">
                <Link
                  href="/browse"
                  className="text-xs font-semibold text-[var(--color-hot-pink)] hover:underline"
                >
                  ✕ Clear all filters
                </Link>
              </div>
            )}

            {/* Sort */}
            <div className="mb-6">
              <p className="filter-group-title">Sort By</p>
              <div className="space-y-1">
                {[
                  { v: "", l: "Featured" },
                  { v: "newest", l: "Newest First" },
                  { v: "price-low", l: "Price: Low to High" },
                  { v: "price-high", l: "Price: High to Low" },
                ].map((s) => (
                  <Link
                    key={s.l}
                    href={buildQuery({ loc, tag, style, priceMin, priceMax, sort: s.v || undefined })}
                    className={`block text-sm py-1 ${
                      (sort ?? "") === s.v
                        ? "font-semibold text-[var(--color-ink)]"
                        : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {s.l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Subjects / Tags */}
            <div className="mb-6">
              <p className="filter-group-title">Subject / Vibe</p>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {topTags.map((t) => (
                  <Link
                    key={t}
                    href={buildQuery({ loc, sort, style, priceMin, priceMax, tag: tag === t ? undefined : t })}
                    className={`flex items-center justify-between text-sm py-0.5 ${
                      tag === t
                        ? "font-semibold text-[var(--color-ink)]"
                        : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <span className="capitalize">{t}</span>
                    {tag === t && <span className="text-[var(--color-hot-pink)]">✓</span>}
                  </Link>
                ))}
              </div>
            </div>

            {/* Art Style */}
            <div className="mb-6">
              <p className="filter-group-title">Art Style</p>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {ART_STYLES.slice(0, 20).map((s) => (
                  <Link
                    key={s}
                    href={buildQuery({ loc, sort, tag, priceMin, priceMax, style: style === s ? undefined : s })}
                    className={`flex items-center justify-between text-sm py-0.5 ${
                      style === s
                        ? "font-semibold text-[var(--color-ink)]"
                        : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <span>{s}</span>
                    {style === s && <span className="text-[var(--color-hot-pink)]">✓</span>}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <p className="filter-group-title">Price (USD)</p>
              <div className="space-y-1">
                {[
                  { l: "Under $100", min: "", max: "100" },
                  { l: "$100 – $300", min: "100", max: "300" },
                  { l: "$300 – $600", min: "300", max: "600" },
                  { l: "$600 – $1,200", min: "600", max: "1200" },
                  { l: "Over $1,200", min: "1200", max: "" },
                ].map((p) => {
                  const active = priceMin === p.min && priceMax === p.max;
                  return (
                    <Link
                      key={p.l}
                      href={buildQuery({ loc, sort, tag, style, priceMin: active ? undefined : p.min || undefined, priceMax: active ? undefined : p.max || undefined })}
                      className={`flex items-center justify-between text-sm py-0.5 ${
                        active
                          ? "font-semibold text-[var(--color-ink)]"
                          : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      <span>{p.l}</span>
                      {active && <span className="text-[var(--color-hot-pink)]">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <p className="filter-group-title">Location</p>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {countries.map((c) => (
                  <Link
                    key={c}
                    href={buildQuery({ sort, tag, style, priceMin, priceMax, loc: loc === c ? undefined : c })}
                    className={`flex items-center justify-between text-sm py-0.5 ${
                      loc === c
                        ? "font-semibold text-[var(--color-ink)]"
                        : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <span>{c}</span>
                    {loc === c && <span className="text-[var(--color-hot-pink)]">✓</span>}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN GRID ── */}
          <div className="flex-1 px-4 py-6 sm:px-6">
            {/* Mobile filter bar */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <div className="flex flex-wrap gap-2">
                {topTags.slice(0, 6).map((t) => (
                  <Link
                    key={t}
                    href={buildQuery({ loc, sort, style, priceMin, priceMax, tag: tag === t ? undefined : t })}
                    className={`tag-pill ${tag === t ? "active" : ""}`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-[var(--color-ink-2)]">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {loc && <ActiveChip label={`Location: ${loc}`} href={buildQuery({ sort, tag, style, priceMin, priceMax })} />}
                {tag && <ActiveChip label={`Vibe: ${tag}`} href={buildQuery({ loc, sort, style, priceMin, priceMax })} />}
                {style && <ActiveChip label={`Style: ${style}`} href={buildQuery({ loc, sort, tag, priceMin, priceMax })} />}
                {(priceMin || priceMax) && (
                  <ActiveChip
                    label={`Price: ${priceMin ? `$${priceMin}` : ""}${priceMin && priceMax ? " – " : ""}${priceMax ? `$${priceMax}` : "+"}`}
                    href={buildQuery({ loc, sort, tag, style })}
                  />
                )}
              </div>
            )}

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-semibold text-[var(--color-ink)]">No artworks found</p>
                <p className="mt-1 text-sm text-[var(--color-ink-3)]">Try adjusting your filters.</p>
                <Link href="/browse" className="btn-primary mt-6">Clear Filters</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {results.map((w, i) => (
                  <ArtworkCard
                    key={w.id}
                    artwork={w}
                    index={i}
                    artist={byArtist.get(w.artistId) ?? null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildQuery(p: { loc?: string; tag?: string; sort?: string; style?: string; priceMin?: string; priceMax?: string }) {
  const sp = new URLSearchParams();
  if (p.loc) sp.set("loc", p.loc);
  if (p.tag) sp.set("tag", p.tag);
  if (p.sort) sp.set("sort", p.sort);
  if (p.style) sp.set("style", p.style);
  if (p.priceMin) sp.set("priceMin", p.priceMin);
  if (p.priceMax) sp.set("priceMax", p.priceMax);
  const qs = sp.toString();
  return qs ? `/browse?${qs}` : "/browse";
}

function ActiveChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded bg-[var(--color-canvas-2)] border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-ink-2)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
    >
      {label} <span className="ml-0.5 text-[var(--color-ink-3)]">✕</span>
    </Link>
  );
}
