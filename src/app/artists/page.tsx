import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { ArtistsGrid, type ArtistCard } from "./artists-grid";

export const revalidate = 60;

export default async function ArtistsIndexPage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);

  // Count artworks per artist
  const pieceCounts = new Map<string, number>();
  artworks.forEach((w) => pieceCounts.set(w.artistId, (pieceCounts.get(w.artistId) ?? 0) + 1));

  // Build card data and sort: most pieces first, then by name
  const cards: ArtistCard[] = artists
    .map((a) => ({
      id: a.id,
      handle: a.handle,
      name: a.name,
      avatar: a.avatar,
      city: a.city,
      neighborhood: a.neighborhood,
      countryFlag: a.countryFlag,
      vibe: a.vibe,
      pieceCount: pieceCounts.get(a.id) ?? 0,
    }))
    .sort((a, b) => b.pieceCount - a.pieceCount || a.name.localeCompare(b.name));

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">the realest</p>
          <h1 className="mb-8 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
            ARTISTS
          </h1>
          <p className="mb-6 font-[family-name:var(--font-marker)] text-paper/70">
            {cards.length} artist{cards.length === 1 ? "" : "s"} on the wall · sorted by most active
          </p>

          <ArtistsGrid artists={cards} />
        </div>
      </main>
      <Footer />
    </>
  );
}
