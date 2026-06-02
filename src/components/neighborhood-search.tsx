"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export function NeighborhoodSearch({
  suggestions,
  size = "lg",
}: {
  suggestions: string[];
  size?: "lg" | "md";
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = q
    ? suggestions.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : suggestions.slice(0, 6);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL("/browse", "http://x");
    if (q.trim()) url.searchParams.set("loc", q.trim());
    router.push(url.pathname + url.search);
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div
        className={`flex items-center gap-2 border-4 border-ink bg-paper text-ink shadow-graffiti-lg ${
          size === "lg" ? "p-3" : "p-2"
        }`}
      >
        <MapPin className={`shrink-0 text-hot-pink ${size === "lg" ? "h-7 w-7" : "h-5 w-5"}`} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Bushwick, Tokyo, your block..."
          className={`w-full bg-transparent font-[family-name:var(--font-bangers)] tracking-wide text-ink placeholder:text-ink/50 focus:outline-none ${
            size === "lg" ? "text-2xl" : "text-lg"
          }`}
        />
        <button
          type="submit"
          className={`flex items-center gap-1 bg-ink font-[family-name:var(--font-bangers)] tracking-widest text-acid-lime hover:bg-hot-pink hover:text-ink ${
            size === "lg" ? "px-5 py-3 text-xl" : "px-3 py-2 text-sm"
          }`}
        >
          <Search className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
          GO
        </button>
      </div>

      {focused && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto border-4 border-ink bg-paper text-ink shadow-graffiti-lg">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQ(s);
                  router.push(`/browse?loc=${encodeURIComponent(s)}`);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left font-[family-name:var(--font-bangers)] text-lg tracking-wide hover:bg-acid-lime"
              >
                <MapPin className="h-4 w-4 text-hot-pink" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
