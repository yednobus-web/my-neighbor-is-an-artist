"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/chrome";
import { useCart } from "@/components/cart-provider";
import { Trash2, ShoppingBag, Loader2 } from "lucide-react";

export default function CartPage() {
  const { items, total, remove, clear } = useCart();
  const [checkoutErr, setCheckoutErr] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  async function checkout() {
    setCheckoutErr(null);
    setCheckingOut(true);
    try {
      const r = await fetch("/api/stripe/cart-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slugs: items.map((i) => i.slug) }),
      });
      const data = await r.json();
      if (!r.ok || !data.url) {
        setCheckoutErr(data.error ?? "Checkout failed.");
        setCheckingOut(false);
        return;
      }
      window.location.href = data.url as string;
    } catch (e) {
      setCheckoutErr(e instanceof Error ? e.message : "Network error");
      setCheckingOut(false);
    }
  }

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-marker)] text-2xl text-acid-lime">your stash</p>
          <h1 className="mb-8 font-[family-name:var(--font-bangers)] text-5xl tracking-wide text-paper sm:text-7xl">
            CART ({items.length})
          </h1>

          {items.length === 0 ? (
            <div className="border-4 border-paper bg-paper p-10 text-center text-ink shadow-graffiti-lg -rotate-1">
              <ShoppingBag className="mx-auto h-16 w-16 text-hot-pink" />
              <h2 className="mt-4 font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
                NOTHING IN HERE YET 😤
              </h2>
              <p className="mt-2">Go cop something off the wall.</p>
              <Link
                href="/browse"
                className="mt-6 inline-block border-4 border-ink bg-hot-pink px-6 py-3 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform"
              >
                BROWSE THE WALL →
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div
                    key={item.artworkId}
                    className={`flex gap-4 border-4 border-paper bg-paper p-3 text-ink shadow-graffiti ${
                      i % 2 === 0 ? "-rotate-1" : "rotate-1"
                    }`}
                  >
                    <Link
                      href={`/art/${item.slug}`}
                      className="relative aspect-square w-24 shrink-0 overflow-hidden border-2 border-ink bg-ink sm:w-32"
                    >
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="128px" />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/art/${item.slug}`}>
                          <h3 className="font-[family-name:var(--font-bangers)] text-2xl leading-tight tracking-wide hover:text-hot-pink">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="font-[family-name:var(--font-marker)] text-electric-purple">{item.artistHandle}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-[family-name:var(--font-bangers)] text-3xl">${item.price.toLocaleString()}</p>
                        <button
                          onClick={() => remove(item.artworkId)}
                          aria-label="Remove from cart"
                          className="flex h-10 w-10 items-center justify-center border-2 border-ink hover:bg-hot-pink hover:text-paper"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={clear}
                  className="font-[family-name:var(--font-bangers)] tracking-widest text-paper/60 hover:text-hot-pink"
                >
                  CLEAR CART
                </button>
              </div>

              {/* Summary */}
              <aside className="h-fit border-4 border-paper bg-acid-lime p-6 text-ink shadow-graffiti-lg sticky top-4">
                <h2 className="font-[family-name:var(--font-bangers)] text-3xl tracking-widest">SUMMARY</h2>
                <div className="my-4 space-y-2 text-sm">
                  <Row label="Subtotal" value={`$${total.toLocaleString()}`} />
                  <Row label="Shipping" value="calc'd at checkout" />
                  <Row label="Platform fee (10%)" value={`$${(total * 0.1).toFixed(2)}`} />
                  <Row label="To artists (90%)" value={`$${(total * 0.9).toFixed(2)}`} bold />
                </div>
                <div className="border-t-2 border-ink py-3 font-[family-name:var(--font-bangers)] text-3xl">
                  TOTAL: ${total.toLocaleString()}
                </div>
                <button
                  disabled={checkingOut}
                  onClick={checkout}
                  className="flex w-full items-center justify-center gap-2 border-4 border-ink bg-hot-pink px-4 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50"
                >
                  {checkingOut ? <Loader2 className="h-6 w-6 animate-spin" /> : null}
                  {checkingOut ? "REDIRECTING..." : "CHECKOUT 💸"}
                </button>
                {checkoutErr && (
                  <p className="mt-2 border-2 border-ink bg-blood-orange p-2 font-[family-name:var(--font-bangers)] text-paper">
                    {checkoutErr}
                  </p>
                )}
                <p className="mt-3 text-xs">Secure checkout via Stripe. Artists get paid direct.</p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-bold" : ""}>{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}
