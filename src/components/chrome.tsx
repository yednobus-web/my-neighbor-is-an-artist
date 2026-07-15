import Link from "next/link";
import { Search, User, MapPin, ChevronDown } from "lucide-react";
import { CartLink } from "./cart-link";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Announcement bar */}
      <div className="announcement-bar">
        🎨 Free shipping on orders over $200 · Artists keep 90% · New drops daily
      </div>

      {/* Main header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span
              className="font-[family-name:var(--font-marker)] text-[var(--color-hot-pink)]"
              style={{ fontSize: "1.1rem" }}
            >
              my neighbor
            </span>
            <span
              className="font-[family-name:var(--font-display)] tracking-widest text-[var(--color-ink)]"
              style={{ fontSize: "1.3rem", letterSpacing: "0.08em" }}
            >
              IS AN ARTIST
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-ink-2)] md:flex">
            <Link href="/browse" className="hover:text-[var(--color-ink)] transition-colors">Browse</Link>
            <Link href="/map" className="hover:text-[var(--color-ink)] transition-colors">Map</Link>
            <Link href="/neighborhoods" className="hover:text-[var(--color-ink)] transition-colors">Neighborhoods</Link>
            <Link href="/artists" className="hover:text-[var(--color-ink)] transition-colors">Artists</Link>
            <Link
              href="/sell"
              className="btn-primary text-xs px-4 py-2"
            >
              Sell Your Art
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <Link
              href="/browse"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-2)] hover:bg-[var(--color-canvas-2)] transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <CartLink />
            <Link
              href="/account"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-2)] hover:bg-[var(--color-canvas-2)] transition-colors sm:flex"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>
            <MobileMenu />
          </div>
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
              <li><Link href="/browse" className="hover:text-[var(--color-ink)]">Browse Art</Link></li>
              <li><Link href="/neighborhoods" className="hover:text-[var(--color-ink)]">Neighborhoods</Link></li>
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
