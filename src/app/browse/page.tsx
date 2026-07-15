import { Header, Footer } from "@/components/chrome";
import { fetchArtists, fetchArtworks } from "@/lib/repo";
import { BrowseClient } from "./browse-client";

export const revalidate = 60;

type SP = Promise<{ q?: string; view?: string }>;

export default async function BrowsePage({ searchParams }: { searchParams: SP }) {
  const { q, view } = await searchParams;
  const [artists, artworks] = await Promise.all([fetchArtists(), fetchArtworks()]);

  const tagFreq = new Map<string, number>();
  artworks.forEach((w) => w.tags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)));
  const topTags = Array.from(tagFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([t]) => t);

  return (
    <>
      <Header />
      <main className="bg-[var(--color-plaster)]">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-linen)] px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <p className="font-hand text-2xl text-[var(--color-clay)]">see your neighborhood dotted with art</p>
            <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
              Browse Nearby
            </h1>
          </div>
        </div>
        <BrowseClient artworks={artworks} artists={artists} topTags={topTags} initialQuery={q} initialView={view} />
      </main>
      <Footer />
    </>
  );
}
