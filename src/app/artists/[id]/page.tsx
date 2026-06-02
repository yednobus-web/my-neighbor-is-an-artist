import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/chrome";
import { ArtworkCard } from "@/components/artwork-card";
import { ARTISTS, ARTWORKS } from "@/lib/data";
import { MapPin } from "lucide-react";

export function generateStaticParams() {
  return ARTISTS.map((a) => ({ id: a.id }));
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = ARTISTS.find((a) => a.id === id);
  if (!artist) notFound();

  const works = ARTWORKS.filter((w) => w.artistId === artist.id);

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/artists" className="mb-6 inline-block font-[family-name:var(--font-marker)] text-acid-lime hover:text-hot-pink">
            ← all artists
          </Link>

          {/* Profile header */}
          <div className="grid gap-8 border-4 border-paper bg-paper p-6 text-ink shadow-graffiti-lg sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-ink shadow-graffiti-pink sm:mx-0">
              <Image src={artist.avatar} alt={artist.name} fill className="object-cover" sizes="160px" />
            </div>
            <div>
              <p
                className="inline-block rotate-[-2deg] bg-hot-pink px-2 py-0.5 font-[family-name:var(--font-marker)] text-xl text-paper"
              >
                {artist.handle}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-bangers)] text-5xl leading-none tracking-wide sm:text-6xl">
                {artist.name.toUpperCase()}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-electric-purple">
                <MapPin className="h-4 w-4" />
                <span className="font-[family-name:var(--font-bangers)] tracking-widest">
                  {artist.neighborhood}, {artist.city} {artist.countryFlag}
                </span>
              </div>
              <p className="mt-3 max-w-2xl">{artist.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {artist.vibe.map((v, i) => {
                  const colors = ["bg-acid-lime", "bg-cyber-cyan", "bg-sun-yellow", "bg-blood-orange"];
                  return (
                    <span
                      key={v}
                      className={`border-2 border-ink px-2 py-0.5 font-[family-name:var(--font-bangers)] text-sm tracking-widest ${colors[i % colors.length]}`}
                    >
                      {v.toUpperCase()}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-3">
                <button className="border-4 border-ink bg-acid-lime px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest shadow-graffiti">
                  FOLLOW · {artist.followers.toLocaleString()}
                </button>
                <button className="border-4 border-ink bg-paper px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest shadow-graffiti hover:bg-cyber-cyan">
                  MESSAGE
                </button>
              </div>
            </div>
          </div>

          {/* Works */}
          <section className="mt-12">
            <h2 className="mb-6 font-[family-name:var(--font-bangers)] text-4xl tracking-wide text-paper sm:text-5xl">
              THE WORK ({works.length})
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {works.map((w, i) => (
                <ArtworkCard key={w.id} artwork={w} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
