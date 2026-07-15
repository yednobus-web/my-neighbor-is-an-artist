"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLocation } from "./location-provider";

// Persistent, low-key "Art near you — Country" indicator.
// Not a switcher — clicking it goes to the Location setting in Profile.
export function LocationIndicator() {
  const { country, ready } = useLocation();

  return (
    <Link
      href="/profile/location"
      className="group flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-linen)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-2)] transition hover:border-[var(--color-ink)]"
      title="Change where you're browsing"
    >
      <MapPin className="h-3.5 w-3.5 text-[var(--color-clay)]" />
      <span className="hidden sm:inline">Art near you —</span>
      <span className="font-semibold text-[var(--color-ink)]">
        {ready ? country ?? "finding you…" : "finding you…"}
      </span>
    </Link>
  );
}
