// Stripe webhook — verifies signature, marks orders paid, and flips artwork to "sold".
// Configure URL in Stripe dashboard:  https://<your-site>/api/stripe/webhook
// Set STRIPE_WEBHOOK_SECRET to the signing secret it gives you.

import { NextResponse, type NextRequest } from "next/server";
import { getStripe, STRIPE_WEBHOOK_SECRET, isStripeConfigured } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const stripe = getStripe()!;
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `bad signature: ${err instanceof Error ? err.message : ""}` }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const sessionId = session.id;
    const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

    // Mark order paid
    const { data: order } = await admin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: piId,
        shipping_address: (session as unknown as { shipping_details?: unknown }).shipping_details ?? null,
      })
      .eq("stripe_session_id", sessionId)
      .select("artwork_id, buyer_user_id")
      .maybeSingle();

    // Mark artwork sold
    if (order?.artwork_id) {
      await admin
        .from("artworks")
        .update({
          status: "sold",
          sold_at: new Date().toISOString(),
          buyer_user_id: order.buyer_user_id,
        })
        .eq("id", order.artwork_id);
    }
  }

  if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
    const session = event.data.object;
    await admin.from("orders").update({ status: "failed" }).eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
