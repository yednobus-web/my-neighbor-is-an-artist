import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { fetchArtists } from "@/lib/repo";
import { MapPin } from "lucide-react";

export const revalidate = 60;

export default async function ArtistsIndexPage() {
  const artists = await fetchArtists();

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">the realest</p>
          <h1 className="mb-10 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
            ARTISTS
          </h1>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((a, i) => (
              <Link
                key={a.id}
                href={`/artists/${a.id}`}
                className={`group block border-4 border-paper bg-paper p-3 text-ink shadow-graffiti transition-transform hover:-translate-y-1 ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden border-2 border-ink bg-ink">
                  <Image
                    src={a.avatar}
                    alt={a.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <p className="mt-2 font-[family-name:var(--font-marker)] text-lg text-electric-purple">{a.handle}</p>
                <p className="font-[family-name:var(--font-bangers)] text-xl tracking-wide">{a.name.toUpperCase()}</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span>{a.neighborhood}, {a.city} {a.countryFlag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
