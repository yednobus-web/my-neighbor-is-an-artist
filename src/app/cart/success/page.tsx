// /cart/success — landing page after Stripe redirects post-payment.
// We don't need to do anything here other than confirm; the webhook
// updates the DB. We just show a celebratory message.

import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
import { ClearCartOnMount } from "./clear-cart";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-20 sm:px-6">
        <ClearCartOnMount />
        <div className="mx-auto max-w-2xl -rotate-1 border-4 border-paper bg-acid-lime p-10 text-ink shadow-graffiti-lg text-center">
          <p className="font-[family-name:var(--font-marker)] text-3xl text-electric-purple">payment received</p>
          <h1 className="my-3 font-[family-name:var(--font-bangers)] text-6xl leading-none tracking-wide">
            ART IS YOURS! 🎨
          </h1>
          <p className="mt-2 text-lg">
            We just told the artist. They'll ship it within 5 working days, fully tracked.
          </p>
          {session_id && <p className="mt-4 text-xs text-ink/60">Reference: {session_id.slice(-12)}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/account"
              className="border-4 border-ink bg-paper px-5 py-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest shadow-graffiti hover:-translate-y-1"
            >
              SEE YOUR ORDERS
            </Link>
            <Link
              href="/browse"
              className="border-4 border-ink bg-hot-pink px-5 py-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1"
            >
              KEEP BROWSING
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
