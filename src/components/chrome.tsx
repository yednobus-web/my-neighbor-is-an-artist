import Link from "next/link";
import { MapPin, Search, User } from "lucide-react";
import { CartLink } from "./cart-link";

export function Header() {
  return (
    <header className="relative z-20 border-b-4 border-paper bg-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-marker)] text-2xl leading-none text-hot-pink sm:text-3xl"
            style={{ transform: "rotate(-3deg)", display: "inline-block" }}
          >
            my neighbor
          </span>
          <span className="font-[family-name:var(--font-bangers)] text-xl tracking-wider text-acid-lime sm:text-2xl">
            IS AN ARTIST
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-[family-name:var(--font-bangers)] tracking-wider text-paper md:flex">
          <Link href="/browse" className="hover:text-hot-pink">BROWSE</Link>
          <Link href="/map" className="hover:text-acid-lime">MAP</Link>
          <Link href="/neighborhoods" className="hover:text-cyber-cyan">NEIGHBORHOODS</Link>
          <Link href="/artists" className="hover:text-acid-lime">ARTISTS</Link>
          <Link href="/sell" className="hover:text-sun-yellow">SELL YOUR ART</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/browse"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper text-paper hover:bg-paper hover:text-ink"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <CartLink />
          <Link
            href="/account"
            className="hidden h-10 w-10 items-center justify-center rounded-full border-2 border-paper text-paper hover:bg-paper hover:text-ink sm:flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="overflow-hidden border-t-2 border-paper bg-acid-lime py-2 text-ink">
        <div className="marquee flex w-max gap-8 whitespace-nowrap font-[family-name:var(--font-bangers)] text-lg tracking-widest">
          {Array.from({ length: 2 }).map((_, j) => (
            <span key={j} className="flex gap-8">
              {[
                "🎨 SUPPORT YOUR LOCAL ARTIST",
                "🌎 ART FROM EVERY NEIGHBORHOOD",
                "🔥 NEW DROPS DAILY",
                "✊ NO MIDDLEMAN",
                "💸 ARTISTS KEEP 90%",
                "🛹 BUY THE BLOCK",
              ].map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t-4 border-paper bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3
              className="font-[family-name:var(--font-marker)] text-3xl text-hot-pink"
              style={{ transform: "rotate(-2deg)", display: "inline-block" }}
            >
              my neighbor
            </h3>
            <p className="mt-3 max-w-md text-paper/80">
              A loud, local, global art marketplace. Built so artists keep more, and
              buyers find the realest stuff on their block.
            </p>
            <div className="mt-4 flex items-center gap-2 text-acid-lime">
              <MapPin className="h-4 w-4" />
              <span className="font-[family-name:var(--font-bangers)] tracking-widest">
                EVERYWHERE / SOMEWHERE
              </span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-cyber-cyan">EXPLORE</h4>
            <ul className="space-y-2 text-paper/80">
              <li><Link href="/browse" className="hover:text-paper">Browse</Link></li>
              <li><Link href="/neighborhoods" className="hover:text-paper">Neighborhoods</Link></li>
              <li><Link href="/artists" className="hover:text-paper">Artists</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-sun-yellow">FOR ARTISTS</h4>
            <ul className="space-y-2 text-paper/80">
              <li><Link href="/sell" className="hover:text-paper">Sell your art</Link></li>
              <li><Link href="/manifesto" className="hover:text-paper">Manifesto</Link></li>
              <li><Link href="/help" className="hover:text-paper">Help</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start gap-2 border-t border-paper/20 pt-6 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 MY NEIGHBOR IS AN ARTIST. Painted with love.</span>
          <span className="font-[family-name:var(--font-marker)] text-acid-lime">stay loud.</span>
        </div>
      </div>
    </footer>
  );
}
