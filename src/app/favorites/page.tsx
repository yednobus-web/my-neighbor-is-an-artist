import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { FavoritesClient } from "./favorites-client";

export const revalidate = 60;

export default async function FavoritesPage() {
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="font-hand text-2xl text-[var(--color-clay)]">the ones you keep coming back to</p>
        <h1 className="mb-8 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          Your Favorites
        </h1>
        <FavoritesClient artworks={artworks} artists={artists} />
      </main>
      <Footer />
    </>
  );
}
