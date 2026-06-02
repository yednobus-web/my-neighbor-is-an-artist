// POST /api/stripe/checkout — creates a Stripe Checkout session for a single artwork.
// Body: { artworkId: string }
// If the artist has a connected Stripe account, payment splits 90/10 via Connect.
// Otherwise it falls through to a regular Checkout (platform pockets it for now).

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";
import { getStripe, isStripeConfigured, platformFeeCents } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe isn't configured yet — see SETUP.md" }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { artworkId?: string; slug?: string };
  if (!body.artworkId && !body.slug) {
    return NextResponse.json({ error: "artworkId or slug required" }, { status: 400 });
  }

  const sb = await createSupabaseServer();
  if (!sb) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const query = sb
    .from("artworks")
    .select("id, slug, title, price, currency, image_url, status, artist_id");
  const { data: artwork } = body.artworkId
    ? await query.eq("id", body.artworkId).maybeSingle()
    : await query.eq("slug", body.slug!).maybeSingle();

  if (!artwork) return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  if (artwork.status !== "available") {
    return NextResponse.json({ error: "Artwork is no longer available" }, { status: 409 });
  }

  const { data: artist } = await sb
    .from("artists")
    .select("id, stripe_account_id, handle")
    .eq("id", artwork.artist_id)
    .maybeSingle();

  const { data: { user } } = await sb.auth.getUser();

  const amountCents = Math.round(Number(artwork.price) * 100);
  const feeCents = platformFeeCents(amountCents);
  const stripe = getStripe()!;
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user?.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: (artwork.currency ?? "usd").toLowerCase(),
          unit_amount: amountCents,
          product_data: {
            name: artwork.title,
            description: `By ${artist?.handle ?? "artist"} · 1 of 1 original`,
            images: artwork.image_url ? [artwork.image_url] : undefined,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      artwork_id: artwork.id,
      artist_id: artwork.artist_id,
      buyer_user_id: user?.id ?? "",
    },
    success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/art/${artwork.slug}?canceled=1`,
    shipping_address_collection: { allowed_countries: ["US","CA","GB","DE","FR","ES","PT","IT","NL","BE","AU","NZ","JP","KR","BR","MX","NG","ZA"] },
    payment_intent_data: artist?.stripe_account_id
      ? {
          application_fee_amount: feeCents,
          transfer_data: { destination: artist.stripe_account_id },
          metadata: {
            artwork_id: artwork.id,
            artist_id: artwork.artist_id,
          },
        }
      : undefined,
  });

  // Pre-create order row so the webhook can flip it to paid.
  await sb.from("orders").insert({
    buyer_user_id: user?.id ?? null,
    artwork_id: artwork.id,
    artist_id: artwork.artist_id,
    amount_cents: amountCents,
    platform_fee_cents: feeCents,
    stripe_session_id: session.id,
    status: "pending",
    buyer_email: user?.email ?? null,
  });

  return NextResponse.json({ url: session.url });
}
