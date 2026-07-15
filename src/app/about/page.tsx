import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { PorchLight } from "@/components/porch-light";

export const metadata = {
  title: "About — My Neighbor Is An Artist",
  description: "Why we built a marketplace around your neighborhood, not the globe.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-hand text-3xl text-[var(--color-clay)]">why neighbor?</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
          The person two streets over paints.
        </h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-2)]">
          <p>
            Somewhere near you, someone is making art in a spare room, a garage, a
            kitchen table after the kids are asleep. You'd never know. Their work
            doesn't hang in a gallery downtown. It lives on their own walls, and in
            their heads, and in a folder on their phone.
          </p>
          <p>
            <strong className="text-[var(--color-ink)]">We think that's a shame.</strong>{" "}
            Not because they deserve to be famous — because you deserve to know them.
            Because a painting means more when you can drive past the street it was
            made on. Because the money you spend on art should be able to stay close
            enough to matter.
          </p>
          <p>
            So this isn't a global marketplace with a search bar. When you arrive, we
            quietly figure out where you are and show you the artists near{" "}
            <em>you</em> — first, by default, on purpose. You can look further afield
            if you want to, but you have to choose to. The front door opens onto your
            own neighborhood.
          </p>
        </div>

        {/* Porch light explainer */}
        <div className="mt-12 flex items-start gap-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-linen)] p-6">
          <PorchLight on size={40} />
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-ink)]">
              About that porch light
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-2)]">
              You'll see a little lamp next to each artist. When it's glowing, that
              artist is active right now and open to commissions — the neighborly
              equivalent of a light left on for you. When it's dim, they're heads-down
              or away. It's our small way of saying: someone's home.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { n: "90%", l: "goes to the artist" },
            { n: "1 of 1", l: "every piece is original" },
            { n: "0", l: "galleries in between" },
          ].map((s) => (
            <div key={s.l} className="rounded-sm border border-[var(--color-border)] bg-[var(--color-linen)] p-5 text-center">
              <p className="font-display text-3xl font-semibold text-[var(--color-berry)]">{s.n}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-2)]">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/browse" className="btn-primary">See art near you</Link>
          <Link href="/sell" className="btn-outline">List your own work</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
