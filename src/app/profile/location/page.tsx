"use client";

import { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { useLocation } from "@/components/location-provider";
import { COUNTRIES } from "@/lib/locations";
import { MapPin, Check } from "lucide-react";

export default function LocationSettingPage() {
  const { country, countryCode, setCountry, source } = useLocation();
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  function choose(name: string, code: string) {
    setCountry(name, code);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/profile" className="text-sm text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">← Back to profile</Link>

        <div className="mt-4">
          <p className="font-hand text-2xl text-[var(--color-clay)]">where you're looking</p>
          <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)]">Your location</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-ink-2)]">
            By default we show you art from artists in your own country — that's the whole
            point. But if you'd like to browse another neighborhood on the map, you can
            change it here. This is the one place location changes; it stays put everywhere else.
          </p>
        </div>

        {/* Current */}
        <div className="mt-6 flex items-center gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-linen)] p-4">
          <MapPin className="h-5 w-5 text-[var(--color-clay)]" />
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-ink-3)]">Currently browsing</p>
            <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
              {country ?? "Detecting…"}{" "}
              <span className="font-body text-xs font-normal text-[var(--color-ink-3)]">
                {source === "detected" && "(detected automatically)"}
                {source === "profile" && "(your choice)"}
                {source === "stored" && "(your choice)"}
                {source === "default" && "(default)"}
              </span>
            </p>
          </div>
          {saved && (
            <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-[var(--color-pine)]">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>

        {/* Search + list */}
        <div className="mt-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries…"
            className="w-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-clay)]/30"
          />
          <ul className="mt-3 max-h-96 divide-y divide-[var(--color-border)] overflow-y-auto rounded-sm border border-[var(--color-border)] bg-white">
            {filtered.map((c) => {
              const active = c.code === countryCode;
              return (
                <li key={c.code}>
                  <button
                    onClick={() => choose(c.name, c.code)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-[var(--color-linen)] ${active ? "bg-[var(--color-linen)] font-semibold" : ""}`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-[var(--color-ink)]">{c.name}</span>
                    {active && <Check className="ml-auto h-4 w-4 text-[var(--color-pine)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
