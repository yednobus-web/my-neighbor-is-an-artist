import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { MapClient } from "./map-client";
import type { MapPin } from "./artwork-map";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);
  const byArtist = new Map(artists.map((a) => [a.id, a]));

  const pins: MapPin[] = artworks
    .map((w) => {
      const a = byArtist.get(w.artistId);
      if (!a) return null;
      const lat = (w as { lat?: number }).lat ?? a.lat;
      const lng = (w as { lng?: number }).lng ?? a.lng;
      return {
        id: w.id,
        slug: w.slug,
        title: w.title,
        price: w.price,
        image: w.image,
        artistHandle: a.handle,
        neighborhood: w.neighborhood ?? a.neighborhood,
        city: w.city ?? a.city,
        country: a.country,
        countryFlag: a.countryFlag,
        lat,
        lng,
      } satisfies MapPin;
    })
    .filter((p): p is MapPin => p !== null);

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">art on the planet</p>
          <h1 className="mb-2 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
            THE WORLD MAP
          </h1>
          <p className="mb-6 max-w-2xl text-paper/80">
            {pins.length} piece{pins.length === 1 ? "" : "s"} pinned across {new Set(pins.map((p) => p.city)).size} cities.
            Click a marker to peep the work.
          </p>
          <MapClient pins={pins} />
        </div>
      </main>
      <Footer />
    </>
  );
}
