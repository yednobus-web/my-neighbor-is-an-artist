# 🚀 SETUP — Two Steps to Go Fully Live

The site is **already deployed and working** at https://my-neighbor-is-an-artist.vercel.app
(running on mocked data, fully functional for browsing & cart).

Follow these two steps to switch on the **real database** so artists can actually list works.

---

## Step 1 — Run the database schema in Supabase (2 minutes)

1. Open **https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/sql/new**
2. Open [supabase/schema.sql](supabase/schema.sql) in this project
3. Copy the **entire contents** of that file
4. Paste it into the Supabase SQL editor
5. Click the green **"Run"** button (bottom right)

You'll see ✅ Success. The schema:
- Creates `artists` and `artworks` tables
- Sets up Row Level Security (anyone can read; only artists can edit their own work)
- Creates a public `artworks` storage bucket for image uploads
- Seeds the same 8 artists + 16 artworks the demo shows

---

## Step 2 — Connect Vercel to Supabase (3 minutes)

### Get your Supabase API key
1. Open **https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/settings/api-keys**
2. Find the **`anon` `public`** key — copy it (long string starting with `eyJ...`)

### Add it to Vercel
Run these two commands in the project folder. When it asks for the value, paste the key from above:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# When prompted, paste:  https://ykpkjibzhtpxjoonvnba.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# When prompted, paste:  eyJ...  (the anon key you just copied)
```

(Optional — also add them to `preview` and `development` environments the same way, swapping out `production`.)

### Redeploy
```bash
vercel deploy --prod
```

That's it. Now `/sell` writes to Supabase, and the home + browse pages read from it.

---

## What's Live Right Now

| URL | What |
|-----|------|
| **https://my-neighbor-is-an-artist.vercel.app** | The live site |
| https://github.com/yednobus-web/my-neighbor-is-an-artist | Source code |
| https://vercel.com/yednobus-2010s-projects/my-neighbor-is-an-artist | Vercel dashboard (deployments, logs, settings) |
| https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba | Supabase dashboard (DB, auth, storage) |

Every push to `main` on GitHub auto-deploys to Vercel. ✨

---

## Local development

```bash
npm install
cp .env.example .env.local      # then fill in the anon key
npm run dev                      # http://localhost:3000
```

If `.env.local` is missing or incomplete, the app falls back to mocked data — nothing breaks.

---

## Phase 3 — what's next

The big remaining pieces:
- **Stripe Connect** for real checkout + 90/10 payout to artists
- **Real auth** ("Sign in with Google" via Supabase) so artists own their listings
- **Image upload** — replace "image URL" field with drag-and-drop to the Supabase `artworks` bucket
- **Mapbox** map view of all artworks pinned by neighborhood
- **Custom domain** — point `myneighborisanartist.com` (or whatever) at Vercel

Just say "do phase 3" and I'll keep going.
