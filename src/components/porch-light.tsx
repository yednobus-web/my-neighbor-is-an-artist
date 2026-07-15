// The site's signature "neighbor" element: a small porch light.
// When `on` (artist is active / taking commissions) the bulb glows warm and
// flickers gently. When off, it's a quiet dim lamp.

export function PorchLight({
  on = false,
  size = 20,
  withLabel = false,
}: {
  on?: boolean;
  size?: number;
  withLabel?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5" title={on ? "Artist is active — taking commissions" : "Artist is away"}>
      <span
        className={`porch-glow inline-block ${on ? "is-on" : ""}`}
        style={{ width: size, height: size, lineHeight: 0 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          {/* bracket */}
          <path d="M4 4h4" stroke="#5c554c" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 4v3" stroke="#5c554c" strokeWidth="1.6" strokeLinecap="round" />
          {/* lantern body */}
          <path
            d="M6 8.5h6l-1 7.5H7L6 8.5Z"
            fill={on ? "#f4d27a" : "#cfc6b6"}
            stroke="#5c554c"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* lantern top */}
          <path d="M5.5 8.5h7" stroke="#5c554c" strokeWidth="1.4" strokeLinecap="round" />
          {/* glow bulb */}
          {on && <circle cx="9" cy="12" r="2.2" fill="#e0a32e" opacity="0.9" />}
        </svg>
      </span>
      {withLabel && (
        <span className={`text-xs font-medium ${on ? "text-[var(--color-marigold)]" : "text-[var(--color-ink-3)]"}`}>
          {on ? "Porch light on" : "Away"}
        </span>
      )}
    </span>
  );
}

// Deterministic "is this artist active" from their id, so the UI is stable
// across renders until real activity data exists. ~65% are lit.
export function isArtistActive(id: string): boolean {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 100 < 65;
}
