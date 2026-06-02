import Stripe from "stripe";

export const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const PLATFORM_FEE_PERCENT = 10;

export const isStripeConfigured = Boolean(STRIPE_SECRET);

let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET) return null;
  if (!_stripe) {
    _stripe = new Stripe(STRIPE_SECRET);
  }
  return _stripe;
}

export function platformFeeCents(amountCents: number) {
  return Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
}
