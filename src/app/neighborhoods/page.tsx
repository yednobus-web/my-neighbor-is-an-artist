import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";

export const revalidate = 60;

export default async function NeighborhoodsPage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const byArtist = new Map(artists.map((a) => [a.id, a]));

  const grouped = new Map<string, { city: string; country: string; flag: string; count: number; neighborhood: string }>();
  artworks.forEach((w) => {
    const a = byArtist.get(w.artistId);
    if (!a) return;
    const neighborhood = w.neighborhood ?? a.neighborhood;
    const city = w.city ?? a.city;
    const key = `${neighborhood}|${city}|${a.country}|${a.countryFlag}`;
    const cur = grouped.get(key) ?? { neighborhood, city, country: a.country, flag: a.countryFlag, count: 0 };
    cur.count++;
    grouped.set(key, cur);
  });

  const blocks = Array.from(grouped.values());

  // group by country
  const byCountry = new Map<string, typeof blocks>();
  blocks.forEach((b) => {
    const arr = byCountry.get(b.country) ?? [];
    arr.push(b);
    byCountry.set(b.country, arr);
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
          <p className="mb-10 max-w-2xl text-paper/80">
            Every block has a scene. Pick yours — or somebody else's.
          </p>

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
                      const colors = ["bg-hot-pink", "bg-acid-lime", "bg-sun-yellow", "bg-cyber-cyan", "bg-blood-orange", "bg-electric-purple"];
                      const bg = colors[i % colors.length];
                      const text = bg === "bg-electric-purple" ? "text-paper" : "text-ink";
                      return (
                        <Link
                          key={b.neighborhood + b.city}
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
                          <p className="mt-2 text-xs">{b.count} piece{b.count === 1 ? "" : "s"} on the wall</p>
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
