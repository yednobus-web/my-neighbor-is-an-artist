# 🚀 SETUP — From Demo to Real Live Marketplace

The site is **already deployed and working** at https://my-neighbor-is-an-artist.vercel.app — it runs on mocked data right now and is fully clickable. Follow the steps below to flip on the real database, real payments, real auth, and real image uploads.

---

## ⚡ Step 1 — Database (2 minutes)

Run the schema in Supabase. Two SQL files, run them in order.

1. Open **https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/sql/new**
2. Open [supabase/schema.sql](supabase/schema.sql) in this project, copy everything, paste into the SQL editor, hit **Run** ✅
3. Open [supabase/schema-phase3.sql](supabase/schema-phase3.sql), copy, paste, **Run** ✅

That gives you `artists`, `artworks`, `orders` tables, RLS policies, an `artworks` storage bucket, and seeded demo data with map coordinates.

---

## 🔑 Step 2 — Connect Vercel to Supabase (3 minutes)

Get your Supabase keys at https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/settings/api-keys.

Then in your terminal in this project:

```bash
# anon key — safe in browser
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste:  https://ykpkjibzhtpxjoonvnba.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste:  the anon public key

# service role key — server-only, used by Stripe webhook
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste:  the service_role key  (treat like a password!)
```

Repeat all three with `preview` and `development` if you want preview deployments + local dev to work the same way.

---

## 🌐 Step 3 — Configure Supabase auth (5 minutes, optional but worth it)

This makes "Sign in with Google" + magic links actually work.

### Add the redirect URL
1. Go to https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/auth/url-configuration
2. Set **Site URL** to `https://my-neighbor-is-an-artist.vercel.app`
3. Add to **Redirect URLs**:
   - `https://my-neighbor-is-an-artist.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### Enable Google sign-in (optional)
1. Go to https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/auth/providers
2. Enable **Google** — Supabase will walk you through getting OAuth credentials from Google Cloud Console (you'll create a project, an OAuth consent screen, and a client ID/secret, then paste them in)
3. Email/magic-link auth works out of the box, no setup needed

---

## 💳 Step 4 — Stripe (5 minutes)

This unlocks real Buy Now + cart checkout, plus 90/10 payouts to artists.

### Get keys
1. https://dashboard.stripe.com/apikeys → copy your **Secret key** (use test mode `sk_test_...` first!)

### Add to Vercel
```bash
vercel env add STRIPE_SECRET_KEY production
# Paste:  sk_test_...   (or sk_live_... when you go live)
```

### Set up the webhook
1. Go to https://dashboard.stripe.com/webhooks → **Add endpoint**
2. Endpoint URL: `https://my-neighbor-is-an-artist.vercel.app/api/stripe/webhook`
3. Events to send: select these four
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
4. Save → copy the **Signing secret** it shows you (`whsec_...`)
5. Add it to Vercel:
```bash
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste:  whsec_...
```

### Enable Stripe Connect (so artists get paid direct)
1. https://dashboard.stripe.com/connect/accounts/overview → enable Connect
2. Choose **Standard accounts** when asked

After that, the **"CONNECT STRIPE → GET PAID"** button on the `/account` page kicks off Stripe's hosted onboarding flow for each artist.

---

## 🚀 Step 5 — Redeploy

```bash
vercel deploy --prod
```

That's it. Now everything works:
- Real auth at `/login`, real account page at `/account`
- Real DB-backed listings at `/sell` with image upload to Supabase storage
- Real Stripe checkout from artwork detail (Buy Now) or cart
- Real webhook flips orders to "paid" and artworks to "sold"
- Artist payouts via Stripe Connect (90/10 split)

---

## 📋 What's Live

| URL | What |
|-----|------|
| **https://my-neighbor-is-an-artist.vercel.app** | The live site |
| https://github.com/yednobus-web/my-neighbor-is-an-artist | Source code |
| https://vercel.com/yednobus-2010s-projects/my-neighbor-is-an-artist | Vercel dashboard |
| https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba | Supabase dashboard |
| https://dashboard.stripe.com | Stripe dashboard |

## 🛣️ Routes

```
/             home (hero, hot drops, neighborhoods)
/browse       filter by neighborhood / vibe / sort
/map          🗺️ world map with all artworks pinned
/art/[slug]   artwork detail w/ Buy Now + Add to cart
/artists      all artists
/artists/[id] artist profile
/neighborhoods grid by city/country
/cart         localStorage cart → Stripe Checkout
/cart/success post-payment confirmation
/login        Google + magic-link sign in
/account      profile, orders, Stripe Connect button
/sell         list a new artwork (with image upload)
/auth/callback  Supabase OAuth handler
/api/stripe/connect       Connect onboarding link
/api/stripe/checkout      single artwork checkout
/api/stripe/cart-checkout multi-item cart checkout
/api/stripe/webhook       payment events → DB updates
```

## 🏗️ Local development

```bash
npm install
cp .env.example .env.local      # fill in keys (or skip — falls back to mock data)
npm run dev                      # http://localhost:3000
```

If env vars are missing, the app gracefully falls back to mock data and shows demo-mode notices on auth/payment screens — nothing breaks.

---

## 🔮 Phase 4 — what's next?

- **Custom domain** — buy `myneighborisanartist.com` (or similar) and point it at Vercel
- **Email notifications** — order confirmations + "your art sold!" via Resend
- **Mobile app shell** — PWA support for installable mobile experience
- **Featured artist of the week** — editorial spotlight
- **Search by image** — upload a vibe-reference image, find matching art
- **Studio visits** — IRL meetups in featured neighborhoods
