// POST /api/stripe/cart-checkout — creates a Checkout session for ALL items
// in the buyer's cart at once. Body: { slugs: string[] }
// Multi-vendor split via Connect is messy; for cart purchases we keep it simple
// and run a single platform checkout. Direct buys (single artwork) still use
// the per-artist Connect flow at /api/stripe/checkout.

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";
import { getStripe, isStripeConfigured, platformFeeCents } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe isn't configured yet — see SETUP.md" }, { status: 503 });
  }

  const { slugs } = (await req.json().catch(() => ({}))) as { slugs?: string[] };
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return NextResponse.json({ error: "slugs[] required" }, { status: 400 });
  }

  const sb = await createSupabaseServer();
  if (!sb) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const { data: works } = await sb
    .from("artworks")
    .select("id, slug, title, price, currency, image_url, status, artist_id")
    .in("slug", slugs);

  if (!works || works.length === 0) {
    return NextResponse.json({ error: "No artworks found for those slugs" }, { status: 404 });
  }
  const unavailable = works.filter((w) => w.status !== "available");
  if (unavailable.length > 0) {
    return NextResponse.json(
      { error: `Some pieces are no longer available: ${unavailable.map((w) => w.title).join(", ")}` },
      { status: 409 },
    );
  }

  const { data: { user } } = await sb.auth.getUser();
  const stripe = getStripe()!;
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user?.email ?? undefined,
    line_items: works.map((w) => ({
      price_data: {
        currency: (w.currency ?? "usd").toLowerCase(),
        unit_amount: Math.round(Number(w.price) * 100),
        product_data: {
          name: w.title,
          images: w.image_url ? [w.image_url] : undefined,
        },
      },
      quantity: 1,
    })),
    metadata: {
      slugs: slugs.join(","),
      buyer_user_id: user?.id ?? "",
      cart: "1",
    },
    success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart?canceled=1`,
    shipping_address_collection: { allowed_countries: ["US","CA","GB","DE","FR","ES","PT","IT","NL","BE","AU","NZ","JP","KR","BR","MX","NG","ZA"] },
  });

  // Pre-create one order row per artwork in the cart (so the webhook can mark them paid).
  await Promise.all(
    works.map((w) => {
      const amountCents = Math.round(Number(w.price) * 100);
      return sb.from("orders").insert({
        buyer_user_id: user?.id ?? null,
        artwork_id: w.id,
        artist_id: w.artist_id,
        amount_cents: amountCents,
        platform_fee_cents: platformFeeCents(amountCents),
        stripe_session_id: session.id,
        status: "pending",
        buyer_email: user?.email ?? null,
      });
    }),
  );

  return NextResponse.json({ url: session.url });
}
