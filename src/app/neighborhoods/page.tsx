import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { NeighborhoodMapClient } from "./neighborhood-map-client";
import type { NeighborhoodPin } from "./neighborhood-map";

export const revalidate = 60;

export default async function NeighborhoodsPage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const byArtist = new Map(artists.map((a) => [a.id, a]));

  // Build neighborhood clusters: aggregate pieces + artists + average lat/lng
  type Cluster = {
    neighborhood: string;
    city: string;
    country: string;
    flag: string;
    pieceCount: number;
    artistIds: Set<string>;
    latSum: number;
    lngSum: number;
    coordCount: number;
  };

  const clusters = new Map<string, Cluster>();

  artworks.forEach((w) => {
    const a = byArtist.get(w.artistId);
    if (!a) return;
    const neighborhood = w.neighborhood ?? a.neighborhood;
    const city = w.city ?? a.city;
    const key = `${neighborhood}|${city}`;

    const cur = clusters.get(key) ?? {
      neighborhood,
      city,
      country: a.country,
      flag: a.countryFlag,
      pieceCount: 0,
      artistIds: new Set(),
      latSum: 0,
      lngSum: 0,
      coordCount: 0,
    };

    cur.pieceCount++;
    cur.artistIds.add(w.artistId);

    // Use artwork-level coords if set, else artist coords
    const lat = (w as unknown as { lat?: number }).lat ?? a.lat;
    const lng = (w as unknown as { lng?: number }).lng ?? a.lng;
    if (lat && lng && (lat !== 0 || lng !== 0)) {
      cur.latSum += lat;
      cur.lngSum += lng;
      cur.coordCount++;
    }

    clusters.set(key, cur);
  });

  // Convert to pins — skip clusters with no coords
  const pins: NeighborhoodPin[] = Array.from(clusters.entries())
    .map(([key, c]) => ({
      key,
      neighborhood: c.neighborhood,
      city: c.city,
      country: c.country,
      flag: c.flag,
      pieceCount: c.pieceCount,
      artistCount: c.artistIds.size,
      lat: c.coordCount > 0 ? c.latSum / c.coordCount : 0,
      lng: c.coordCount > 0 ? c.lngSum / c.coordCount : 0,
    }))
    .sort((a, b) => b.pieceCount - a.pieceCount);

  // Group by country for the list below the map
  const byCountry = new Map<string, NeighborhoodPin[]>();
  pins.forEach((p) => {
    const arr = byCountry.get(p.country) ?? [];
    arr.push(p);
    byCountry.set(p.country, arr);
  });

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-[family-name:var(--font-marker)] text-2xl text-cyber-cyan">find art by</p>
          <h1 className="mb-2 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
            NEIGHBORHOODS
          </h1>
          <p className="mb-6 max-w-2xl text-paper/80">
            Zoom into any neighborhood on the map — click a pin to browse the art there.
          </p>

          {/* ── BIG MAP ── */}
          <NeighborhoodMapClient pins={pins} />

          <p className="mb-10 mt-3 text-xs text-paper/50">
            {pins.filter((p) => p.lat !== 0 || p.lng !== 0).length} neighborhoods pinned ·{" "}
            {pins.reduce((s, p) => s + p.pieceCount, 0)} pieces total
          </p>

          {/* ── LIST BELOW ── */}
          <div className="space-y-12">
            {Array.from(byCountry.entries()).map(([country, list]) => {
              const flag = list[0].flag;
              return (
                <section key={country}>
                  <h2 className="mb-4 font-[family-name:var(--font-bangers)] text-3xl tracking-widest text-acid-lime">
                    {flag} {country.toUpperCase()}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((b, i) => {
                      const colors = [
                        "bg-hot-pink",
                        "bg-acid-lime",
                        "bg-sun-yellow",
                        "bg-cyber-cyan",
                        "bg-blood-orange",
                        "bg-electric-purple",
                      ];
                      const bg = colors[i % colors.length];
                      const text = bg === "bg-electric-purple" ? "text-paper" : "text-ink";
                      return (
                        <Link
                          key={b.key}
                          href={`/browse?loc=${encodeURIComponent(b.neighborhood)}`}
                          className={`block border-4 border-ink ${bg} ${text} p-5 shadow-graffiti transition-transform hover:-translate-y-1 ${
                            i % 2 === 0 ? "-rotate-1" : "rotate-1"
                          }`}
                        >
                          <p className="font-[family-name:var(--font-marker)] text-base">explore</p>
                          <p className="font-[family-name:var(--font-bangers)] text-3xl leading-tight tracking-wide">
                            {b.neighborhood.toUpperCase()}
                          </p>
                          <p className="text-sm">{b.city}</p>
                          <p className="mt-2 text-xs">
                            {b.pieceCount} piece{b.pieceCount === 1 ? "" : "s"} ·{" "}
                            {b.artistCount} artist{b.artistCount === 1 ? "" : "s"}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-16 border-4 border-paper bg-spray-blue p-8 text-paper shadow-graffiti-lg">
            <h2 className="font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
              YOUR BLOCK NOT HERE YET?
            </h2>
            <p className="mt-2">Be the first artist to put it on the map.</p>
            <Link
              href="/sell"
              className="mt-4 inline-block border-4 border-paper bg-acid-lime px-5 py-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti"
            >
              CLAIM YOUR HOOD →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
