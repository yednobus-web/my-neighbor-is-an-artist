import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { Sparkles, DollarSign, Globe, Camera } from "lucide-react";
import { ListArtworkForm } from "./list-artwork-form";

export default function SellPage() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <section className="border-b-4 border-paper bg-acid-lime px-4 py-20 text-ink sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-block -rotate-3 bg-ink px-3 py-1 font-[family-name:var(--font-marker)] text-xl text-acid-lime shadow-graffiti-pink">
              calling all artists
            </p>
            <h1 className="my-4 font-[family-name:var(--font-bangers)] text-6xl leading-none tracking-wide sm:text-8xl">
              <span className="block">SELL YOUR ART.</span>
              <span
                className="block font-[family-name:var(--font-marker)] text-7xl text-hot-pink sm:text-8xl"
                style={{ transform: "rotate(-2deg)", display: "inline-block" }}
              >
                keep 90%.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg">
              No gatekeepers. No gallery markup. Just you, your block, and the planet.
            </p>
            <Link
              href="#start"
              className="mt-8 inline-block border-4 border-ink bg-hot-pink px-8 py-4 font-[family-name:var(--font-bangers)] text-3xl tracking-widest text-paper shadow-graffiti-lg hover:-translate-y-1"
            >
              LIST YOUR FIRST PIECE →
            </Link>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: DollarSign, title: "90% YOURS", desc: "We take 10%. You keep the rest. Always." },
              { icon: Globe, title: "GLOBAL REACH", desc: "Buyers from Bushwick to Berlin to Bangkok." },
              { icon: Camera, title: "EASY LISTING", desc: "Snap a pic, write a vibe, drop the price. Done." },
              { icon: Sparkles, title: "YOU OWN IT", desc: "Your work, your prices, your terms. Always." },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`border-4 border-paper bg-paper p-5 text-ink shadow-graffiti ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <f.icon className="h-8 w-8 text-hot-pink" />
                <h3 className="mt-2 font-[family-name:var(--font-bangers)] text-2xl tracking-widest">{f.title}</h3>
                <p className="mt-1 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="start" className="border-t-4 border-paper bg-electric-purple px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">step 1 of getting paid</p>
            <h2 className="mb-2 font-[family-name:var(--font-bangers)] text-4xl tracking-wide text-paper sm:text-6xl">
              LIST YOUR ART
            </h2>
            <p className="mb-8 text-paper/80">
              Drop the details below. If you're new, we'll create your artist profile in one shot.
            </p>
            <ListArtworkForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
