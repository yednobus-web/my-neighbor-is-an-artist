import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { NeighborhoodSearch } from "@/components/neighborhood-search";
import { ArtworkCard } from "@/components/artwork-card";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { Sparkles, Zap, Globe, Heart, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const featured = artworks.slice(0, 8);
  const neighborhoods = Array.from(new Set(artists.map((a) => `${a.neighborhood}, ${a.city}`))).sort();
  const featuredArtists = artists.slice(0, 6);

  return (
    <>
      <Header />
      <main className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden border-b-4 border-paper px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid-bg absolute inset-0 opacity-40" />

          {/* Floating stickers */}
          <div className="pointer-events-none absolute right-[5%] top-10 hidden rotate-12 md:block">
            <div className="bg-sun-yellow px-4 py-2 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-ink shadow-graffiti">
              ★ NEW DROP ★
            </div>
          </div>
          <div className="pointer-events-none absolute left-[5%] bottom-10 hidden -rotate-6 md:block">
            <div className="bg-cyber-cyan px-4 py-2 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti">
              90% TO ARTIST
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            <p
              className="mb-4 inline-block rotate-[-3deg] bg-hot-pink px-3 py-1 font-[family-name:var(--font-marker)] text-lg tracking-wide text-paper shadow-graffiti"
            >
              global art marketplace
            </p>
            <h1 className="font-[family-name:var(--font-bangers)] text-6xl leading-[0.9] tracking-wide text-paper sm:text-8xl md:text-9xl">
              <span className="block text-stroke-ink" style={{ color: "var(--color-acid-lime)" }}>MY NEIGHBOR</span>
              <span className="my-2 block">IS AN</span>
              <span
                className="block font-[family-name:var(--font-marker)] text-7xl text-hot-pink sm:text-8xl md:text-9xl"
                style={{ transform: "rotate(-2deg)", display: "inline-block" }}
              >
                artist
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/80 sm:text-xl">
              Find dope artists on your block, in your city, on the other side of the planet.
              Buy direct. Support the scene. No corporate gallery vibes.
            </p>

            <div className="mx-auto mt-10 max-w-2xl">
              <NeighborhoodSearch suggestions={neighborhoods} />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
              <span className="font-[family-name:var(--font-bangers)] tracking-wide text-paper/70">TRY:</span>
              {["Bushwick", "Tokyo", "Lagos", "Berlin", "Mexico City"].map((s, i) => (
                <Link
                  key={s}
                  href={`/browse?loc=${encodeURIComponent(s)}`}
                  className={`border-2 border-paper bg-ink px-3 py-1 font-[family-name:var(--font-bangers)] tracking-wider text-paper hover:bg-paper hover:text-ink ${
                    i % 2 === 0 ? "rotate-1" : "-rotate-1"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WHY STRIP */}
        <section className="border-b-4 border-paper bg-electric-purple py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {[
              { icon: Globe, title: "GLOBAL", desc: "Art from real neighborhoods, everywhere." },
              { icon: Zap, title: "FAST", desc: "Direct from artist. No gallery markup." },
              { icon: Heart, title: "FAIR", desc: "Artists keep 90%. Always." },
              { icon: Sparkles, title: "FRESH", desc: "New work daily. No stale gallery walls." },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`flex items-start gap-3 border-4 border-ink bg-paper p-4 text-ink shadow-graffiti ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <f.icon className="h-8 w-8 shrink-0 text-hot-pink" />
                <div>
                  <h3 className="font-[family-name:var(--font-bangers)] text-2xl tracking-widest">{f.title}</h3>
                  <p className="text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED ARTWORKS */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">fresh off the wall</p>
                <h2 className="font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
                  HOT DROPS
                </h2>
              </div>
              <Link
                href="/browse"
                className="hidden items-center gap-2 border-4 border-paper bg-acid-lime px-4 py-2 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti hover:-translate-y-1 sm:flex"
              >
                SEE ALL <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((w, i) => (
                <ArtworkCard
                  key={w.id}
                  artwork={w}
                  index={i}
                  artist={artists.find((a) => a.id === w.artistId) ?? null}
                />
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 border-4 border-paper bg-acid-lime px-4 py-2 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti"
              >
                SEE ALL <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* NEIGHBORHOODS GRID */}
        <section className="border-y-4 border-paper bg-spray-blue px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="font-[family-name:var(--font-marker)] text-2xl text-sun-yellow">discover by</p>
            <h2 className="mb-10 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
              NEIGHBORHOODS
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {neighborhoods.map((n, i) => {
                const colors = ["bg-hot-pink", "bg-acid-lime", "bg-sun-yellow", "bg-cyber-cyan", "bg-blood-orange"];
                const bg = colors[i % colors.length];
                return (
                  <Link
                    key={n}
                    href={`/browse?loc=${encodeURIComponent(n.split(",")[0])}`}
                    className={`block border-4 border-ink ${bg} p-4 text-ink shadow-graffiti transition-transform hover:-translate-y-1 ${
                      i % 2 === 0 ? "-rotate-1" : "rotate-1"
                    }`}
                  >
                    <p className="font-[family-name:var(--font-marker)] text-base">explore</p>
                    <p className="font-[family-name:var(--font-bangers)] text-2xl leading-tight tracking-wide">
                      {n.split(",")[0].toUpperCase()}
                    </p>
                    <p className="text-xs">{n.split(",")[1]?.trim()}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ARTISTS */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="font-[family-name:var(--font-marker)] text-2xl text-cyber-cyan">the realest</p>
              <h2 className="font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
                ARTISTS ON DECK
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {featuredArtists.map((a, i) => (
                <Link
                  key={a.id}
                  href={`/artists/${a.id}`}
                  className={`group block border-4 border-paper bg-paper p-3 text-ink shadow-graffiti transition-transform hover:-translate-y-1 ${
                    i % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden border-2 border-ink bg-ink">
                    <Image
                      src={a.avatar}
                      alt={a.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 font-[family-name:var(--font-marker)] text-base text-electric-purple">
                    {a.handle}
                  </p>
                  <p className="text-xs">
                    {a.neighborhood} {a.countryFlag}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SELL */}
        <section className="relative overflow-hidden border-t-4 border-paper bg-hot-pink px-4 py-20 sm:px-6">
          <div className="stripe-pink absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="font-[family-name:var(--font-marker)] text-3xl text-acid-lime">yo artist —</p>
            <h2 className="my-4 font-[family-name:var(--font-bangers)] text-6xl leading-none tracking-wide text-paper sm:text-8xl">
              SELL YOUR<br />
              <span className="text-stroke-ink" style={{ color: "var(--color-sun-yellow)" }}>ART HERE</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-paper">
              Free to list. You keep 90%. We handle payments, shipping labels, and putting you on the map.
              Literally.
            </p>
            <Link
              href="/sell"
              className="mt-8 inline-block border-4 border-ink bg-acid-lime px-8 py-4 font-[family-name:var(--font-bangers)] text-3xl tracking-widest text-ink shadow-graffiti-lg hover:-translate-y-1"
            >
              GET ON THE WALL →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
