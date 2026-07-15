"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "./favorites-provider";

// Consistent label: "Add to Favorites" everywhere.
export function FavoriteButton({
  slug,
  variant = "icon",
}: {
  slug: string;
  variant?: "icon" | "full";
}) {
  const { has, toggle } = useFavorites();
  const active = has(slug);

  if (variant === "full") {
    return (
      <button
        onClick={(e) => { e.preventDefault(); toggle(slug); }}
        className={`inline-flex items-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold transition ${
          active
            ? "border-[var(--color-berry)] bg-[var(--color-berry)] text-white"
            : "border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-linen)]"
        }`}
      >
        <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
        {active ? "In your favorites" : "Add to Favorites"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(slug); }}
      aria-label={active ? "Remove from favorites" : "Add to Favorites"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-plaster)]/90 text-[var(--color-ink)] shadow-sm backdrop-blur transition hover:bg-white"
    >
      <Heart className={`h-4 w-4 ${active ? "fill-[var(--color-berry)] text-[var(--color-berry)]" : ""}`} />
    </button>
  );
}
