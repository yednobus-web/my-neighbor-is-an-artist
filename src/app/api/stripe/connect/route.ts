// POST /api/stripe/connect — kicks off Stripe Connect onboarding
// for the currently signed-in artist. Creates a Standard connected
// account on first run, then returns an account link (URL).

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.redirect(new URL("/account?stripe=not-configured", req.url));
  }
  const sb = await createSupabaseServer();
  if (!sb) return NextResponse.redirect(new URL("/login", req.url));

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data: artist } = await sb
    .from("artists")
    .select("id, stripe_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!artist) {
    return NextResponse.redirect(new URL("/sell?from=stripe", req.url));
  }

  const stripe = getStripe()!;
  let acctId = artist.stripe_account_id as string | null;

  if (!acctId) {
    const acct = await stripe.accounts.create({
      type: "standard",
      email: user.email ?? undefined,
      metadata: { artist_id: artist.id, user_id: user.id },
    });
    acctId = acct.id;
    await sb.from("artists").update({ stripe_account_id: acctId }).eq("id", artist.id);
  }

  const origin = req.nextUrl.origin;
  const link = await stripe.accountLinks.create({
    account: acctId,
    refresh_url: `${origin}/account?stripe=refresh`,
    return_url: `${origin}/account?stripe=ok`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(link.url, { status: 303 });
}
