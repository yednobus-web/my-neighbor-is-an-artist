"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse", label: "BROWSE" },
  { href: "/map", label: "MAP" },
  { href: "/neighborhoods", label: "NEIGHBORHOODS" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/sell", label: "SELL YOUR ART" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when route changes
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible below md */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center border-2 border-paper text-paper hover:bg-paper hover:text-ink md:hidden"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/80 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col border-l-4 border-paper bg-ink transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between border-b-4 border-paper px-5 py-4">
          <span className="font-[family-name:var(--font-marker)] text-xl text-hot-pink">menu</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center border-2 border-paper text-paper hover:bg-paper hover:text-ink"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-4 border-transparent px-4 py-3 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper hover:border-paper hover:bg-paper hover:text-ink ${
                pathname === l.href ? "border-acid-lime text-acid-lime" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="mt-auto border-t-2 border-paper/20 px-5 py-4">
          <div className="flex items-center gap-2 text-acid-lime">
            <MapPin className="h-4 w-4" />
            <span className="font-[family-name:var(--font-bangers)] text-sm tracking-widest">
              EVERYWHERE / SOMEWHERE
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
