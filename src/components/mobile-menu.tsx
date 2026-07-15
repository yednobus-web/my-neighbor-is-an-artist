"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/map", label: "Map" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/artists", label: "Artists" },
  { href: "/sell", label: "Sell Your Art" },
  { href: "/account", label: "My Account" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-2)] hover:bg-[var(--color-canvas-2)] transition-colors md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <span className="font-[family-name:var(--font-marker)] text-lg text-[var(--color-hot-pink)]">menu</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-2)] hover:bg-[var(--color-canvas-2)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col py-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-5 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-canvas-2)] ${
                pathname === l.href
                  ? "text-[var(--color-hot-pink)] font-semibold"
                  : "text-[var(--color-ink-2)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t border-[var(--color-border)] p-5">
          <Link
            href="/sell"
            onClick={() => setOpen(false)}
            className="btn-primary w-full justify-center"
          >
            Start Selling
          </Link>
        </div>
      </nav>
    </>
  );
}
