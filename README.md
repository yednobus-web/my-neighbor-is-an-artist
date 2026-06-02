# MY NEIGHBOR IS AN ARTIST 🎨

A loud, local, global art marketplace. Gen Z energy, graffiti aesthetics, neighborhood-first discovery.

## 🌍 Live

**Site:** https://my-neighbor-is-an-artist.vercel.app
**Repo:** https://github.com/yednobus-web/my-neighbor-is-an-artist
**Vercel:** https://vercel.com/yednobus-2010s-projects/my-neighbor-is-an-artist
**Supabase:** https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba

> 👉 To switch from demo (mock) data to the real database, follow [SETUP.md](SETUP.md). Two short steps.

## Stack

- **Next.js 16** App Router · React 19 · TypeScript · Turbopack
- **Tailwind CSS v4** with custom graffiti theme
- **Supabase** — Postgres + auth + storage (with mock fallback so the app works even unconfigured)
- **Vercel** — hosting + CI/CD (every push to `main` deploys)

## Routes

| Route | What |
|-------|------|
| `/` | Hero + neighborhood search + hot drops |
| `/browse?loc=&tag=&sort=` | Filter by neighborhood / vibe / sort by price |
| `/art/[slug]` | Artwork detail + buy box |
| `/artists` and `/artists/[id]` | All artists / artist profile |
| `/neighborhoods` | Browse by city/country |
| `/cart` | Cart (localStorage-persisted, 90/10 split shown) |
| `/sell` | Artist listing form (writes to Supabase when configured) |

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — fill in Supabase keys (see SETUP.md)
npm run dev                   # http://localhost:3000
```

App falls back to mock data ([src/lib/data.ts](src/lib/data.ts)) if Supabase env vars are missing — nothing breaks.

## Project layout

```
src/
  app/
    page.tsx                    homepage
    browse/page.tsx             search/filter
    art/[slug]/page.tsx         artwork detail
    artists/page.tsx            artist index
    artists/[id]/page.tsx       artist profile
    neighborhoods/page.tsx      neighborhoods grid
    cart/page.tsx               cart (client)
    sell/page.tsx               sell page
    sell/list-artwork-form.tsx  client form
    sell/actions.ts             server action — writes to Supabase
    layout.tsx + globals.css    fonts, theme, CartProvider
  components/
    chrome.tsx                  Header + Footer
    artwork-card.tsx
    cart-provider.tsx           localStorage-backed cart context
    cart-link.tsx               header cart button w/ live count
    add-to-cart-button.tsx
    neighborhood-search.tsx     search w/ autocomplete
  lib/
    data.ts                     mock data + types
    supabase.ts                 SSR/browser clients
    repo.ts                     fetch* functions w/ Supabase + mock fallback
supabase/
  schema.sql                    paste this into Supabase SQL editor
```

## Design system

In [src/app/globals.css](src/app/globals.css):

- **Palette:** ink black, paper cream, hot pink, acid lime, cyber cyan, sun yellow, electric purple, blood orange, spray blue
- **Fonts:** Bangers (display), Permanent Marker (handwritten), Archivo (body) — all via `next/font`
- **Utilities:** `shadow-graffiti*` (offset hard shadows), `text-stroke-*`, `marquee`, `wiggle`, `stripe-pink`, `grid-bg`, `tape`, `sticker`/`sticker-r`

## What's built

✅ Phase 1: Full UI on mock data — homepage, browse, artwork, artist, neighborhoods, sell, all 32 routes
✅ Phase 2: Supabase schema + adapter + listing form server action, working cart, GitHub repo, Vercel deploy

🚧 Phase 3 (next): Stripe Connect checkout, real auth, image upload to Supabase storage, Mapbox map view, custom domain
