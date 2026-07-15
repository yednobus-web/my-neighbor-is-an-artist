"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartLink } from "./cart-link";
import { AuthButton } from "./auth-button";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/browse?loc=${encodeURIComponent(query)}` : "/browse");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50">
      {/* ── Vibrant gradient bar ── */}
      <div className="vibrant-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-marker)] text-lg text-white drop-shadow-sm">
              my neighbor
            </span>
            <span
              className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-white drop-shadow-sm"
              style={{ letterSpacing: "0.06em" }}
            >
              IS AN ARTIST
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-semibold text-white lg:flex">
            <Link href="/neighborhoods?mine=1" className="drop-shadow-sm hover:text-black/80 transition-colors">My Neighborhood</Link>
            <Link href="/neighborhoods" className="drop-shadow-sm hover:text-black/80 transition-colors">Other Neighborhoods</Link>
            <Link href="/artists" className="drop-shadow-sm hover:text-black/80 transition-colors">Artists</Link>
            <Link href="/sell" className="drop-shadow-sm hover:text-black/80 transition-colors">Sell Your Art</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm transition hover:bg-white"
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
            <CartLink />
            <AuthButton />
            <MobileMenu />
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t border-white/20 bg-black/10 px-4 py-3 sm:px-6">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-2">
              <div className="flex flex-1 items-center bg-white">
                <MapPin className="ml-3 h-4 w-4 shrink-0 text-[var(--color-ink-3)]" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by neighborhood, city, or country…"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none"
                />
                <button type="submit" className="bg-[var(--color-ink)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-hot-pink)]">
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Running marquee ── */}
      <div className="overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-ink)] py-1.5">
        <div className="marquee flex w-max whitespace-nowrap text-xs font-bold uppercase tracking-widest text-white">
          {Array.from({ length: 2 }).map((_, j) => (
            <span key={j} className="flex">
              {[
                "🔥 New drops daily",
                "🎨 Support your local artist",
                "🌍 Art from every neighborhood",
                "✊ No middleman",
                "💸 Artists keep 90%",
                "🛹 Buy the block",
              ].map((s, i) => (
                <span key={i} className="mx-6">{s}</span>
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
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-canvas-2)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-marker)] text-xl text-[var(--color-hot-pink)]">
                my neighbor
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-[var(--color-ink)]">
                IS AN ARTIST
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-ink-3)] leading-relaxed">
              A global art marketplace built for real artists in real neighborhoods.
              Buy direct. Artists keep more. No gallery markup.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-[var(--color-ink-3)]">
              <MapPin className="h-3 w-3" />
              <span>Everywhere · Somewhere</span>
            </div>
          </div>
          <div>
            <h4 className="filter-group-title">Explore</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-2)]">
              <li><Link href="/neighborhoods?mine=1" className="hover:text-[var(--color-ink)]">My Neighborhood</Link></li>
              <li><Link href="/neighborhoods" className="hover:text-[var(--color-ink)]">Other Neighborhoods</Link></li>
              <li><Link href="/map" className="hover:text-[var(--color-ink)]">World Map</Link></li>
              <li><Link href="/artists" className="hover:text-[var(--color-ink)]">Artists</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="filter-group-title">For Artists</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-2)]">
              <li><Link href="/sell" className="hover:text-[var(--color-ink)]">Sell Your Art</Link></li>
              <li><Link href="/account" className="hover:text-[var(--color-ink)]">My Account</Link></li>
              <li><Link href="/account/profile" className="hover:text-[var(--color-ink)]">Edit Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start gap-2 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-ink-3)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 My Neighbor Is An Artist. All rights reserved.</span>
          <span className="font-[family-name:var(--font-marker)] text-[var(--color-hot-pink)] text-sm">stay loud.</span>
        </div>
      </div>
    </footer>
  );
}
