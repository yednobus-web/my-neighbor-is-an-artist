# MY NEIGHBOR IS AN ARTIST 🎨

A loud, local, global art marketplace. Gen Z energy, graffiti aesthetics, neighborhood-first discovery.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19) — hosted on Vercel
- **TypeScript** + **Tailwind CSS v4**
- **Supabase** — for DB, auth, image storage (wired up next phase)
- **Fonts:** Bangers, Permanent Marker, Archivo (Google Fonts via next/font)

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
npm run build
```

## What's built (Phase 1)

- 🏠 **Homepage** — hero with neighborhood search, featured drops, neighborhoods grid, artists, sell CTA
- 🔍 **Browse** ([/browse](src/app/browse/page.tsx)) — filter by location (`?loc=Bushwick`), tag, sort
- 🎨 **Artwork detail** ([/art/[slug]](src/app/art/[slug]/page.tsx)) — image, artist, location, buy box, related works
- 👤 **Artist profile** ([/artists/[id]](src/app/artists/[id]/page.tsx)) — bio, vibes, full catalog
- 🌎 **Neighborhoods index** ([/neighborhoods](src/app/neighborhoods/page.tsx)) — grouped by country
- 💸 **Sell page** ([/sell](src/app/sell/page.tsx)) — artist signup teaser

All data is mocked in [src/lib/data.ts](src/lib/data.ts) — 8 artists across 8 cities, 16 artworks.

## Design system

[src/app/globals.css](src/app/globals.css):

- **Palette:** ink black, paper cream, hot pink, acid lime, cyber cyan, sun yellow, electric purple, blood orange, spray blue
- **Utilities:** `shadow-graffiti*` (offset hard shadows), `text-stroke-*`, `marquee`, `wiggle`, `stripe-pink`, `grid-bg`, `tape`, `sticker`/`sticker-r`
- **Vibe:** rotated cards, tilted stickers, hard shadows, marquee strip, paper-noise overlay, neon-on-black

## Phase 2 — what's next

1. **Supabase wiring** — schema for `artists`, `artworks`, `cities`, `neighborhoods`; storage bucket for uploaded art; auth (Sign in with Google / email).
2. **Artist onboarding flow** — real listing form (image upload, price, location autocomplete via Mapbox).
3. **Search + map** — full-text search on title/tags + map view of artworks by neighborhood.
4. **Cart + checkout** — Stripe Connect so artists get paid direct (90/10 split).
5. **Vercel deploy** — link to GitHub `yednobus-web/my-neighbor-is-an-artist`, push, hook up `vercel.com/yednobus-2010s-projects`.

## Routes

```
/                        homepage
/browse                  search/filter all artworks (?loc=, ?tag=, ?sort=)
/art/[slug]              artwork detail
/artists                 all artists
/artists/[id]            artist profile
/neighborhoods           browse by neighborhood/country
/sell                    artist signup
```
