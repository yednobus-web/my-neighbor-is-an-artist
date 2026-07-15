"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartLink } from "./cart-link";
import { AuthButton } from "./auth-button";
import { MobileMenu } from "./mobile-menu";
import { LocationIndicator } from "./location-indicator";

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/browse?q=${encodeURIComponent(query)}` : "/browse");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-plaster)]/95 backdrop-blur">
      <div className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5 leading-none">
            <span className="font-hand text-2xl text-[var(--color-clay)]">my neighbor</span>
            <span className="font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              is an artist
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-ink-2)] lg:flex">
            <Link href="/browse" className="hover:text-[var(--color-ink)] transition-colors">Browse</Link>
            <Link href="/artists" className="hover:text-[var(--color-ink)] transition-colors">Artists</Link>
            <Link href="/favorites" className="hover:text-[var(--color-ink)] transition-colors">Favorites</Link>
            <Link href="/sell" className="hover:text-[var(--color-ink)] transition-colors">Sell Your Art</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)] transition-colors">About</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LocationIndicator />
            </div>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-2)] transition hover:bg-[var(--color-linen)]"
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
            <CartLink />
            <AuthButton />
            <MobileMenu />
          </div>
        </div>

        {/* Mobile location indicator row */}
        <div className="border-t border-[var(--color-border)] px-4 py-2 md:hidden">
          <LocationIndicator />
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-linen)] px-4 py-3 sm:px-6">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center">
              <div className="flex flex-1 items-center border border-[var(--color-border)] bg-white">
                <Search className="ml-3 h-4 w-4 shrink-0 text-[var(--color-ink-3)]" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search art, artists, styles…"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none"
                />
                <button type="submit" className="bg-[var(--color-ink)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-berry)]">
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Running marquee — new drops daily */}
      <div className="overflow-hidden bg-[var(--color-ink)] py-1.5">
        <div className="marquee flex w-max whitespace-nowrap text-xs font-medium tracking-wide text-[var(--color-linen)]">
          {Array.from({ length: 2 }).map((_, j) => (
            <span key={j} className="flex">
              {[
                "🖼️ New drops daily",
                "🏡 Buy from a neighbor",
                "🎨 Original work, one of one",
                "✋ Artists keep 90%",
                "📍 Art from your neighborhood",
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
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-linen)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-hand text-2xl text-[var(--color-clay)]">my neighbor</span>
              <span className="font-display text-xl font-semibold text-[var(--color-ink)]">is an artist</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-ink-2)] leading-relaxed">
              The person two streets over paints. Discover and buy original art directly
              from the artists who live near you.
            </p>
          </div>
          <div>
            <h4 className="filter-group-title">Explore</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-2)]">
              <li><Link href="/browse" className="hover:text-[var(--color-ink)]">Browse Nearby</Link></li>
              <li><Link href="/artists" className="hover:text-[var(--color-ink)]">Artists</Link></li>
              <li><Link href="/favorites" className="hover:text-[var(--color-ink)]">Favorites</Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-ink)]">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="filter-group-title">For Artists</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-2)]">
              <li><Link href="/sell" className="hover:text-[var(--color-ink)]">Sell Your Art</Link></li>
              <li><Link href="/profile" className="hover:text-[var(--color-ink)]">Profile</Link></li>
              <li><Link href="/profile/location" className="hover:text-[var(--color-ink)]">Change Location</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start gap-2 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-ink-3)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 My Neighbor Is An Artist</span>
          <span className="font-hand text-lg text-[var(--color-clay)]">made for your block</span>
        </div>
      </div>
    </footer>
  );
}
