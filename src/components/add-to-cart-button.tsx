"use client";

import { useCart, type CartItem } from "@/components/cart-provider";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({ item }: { item: CartItem }) {
  const { add, has } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = has(item.artworkId) || justAdded;

  return (
    <button
      onClick={() => {
        add(item);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
      disabled={inCart && !justAdded}
      className={`flex flex-1 items-center justify-center gap-2 border-4 border-ink px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest shadow-graffiti hover:-translate-y-1 transition-transform ${
        inCart ? "bg-acid-lime text-ink" : "bg-hot-pink text-paper hover:bg-acid-lime hover:text-ink"
      }`}
    >
      {inCart ? (
        <>
          <Check className="h-6 w-6" />
          {justAdded ? "ADDED!" : "IN CART"}
        </>
      ) : (
        <>
          <ShoppingBag className="h-6 w-6" />
          ADD TO CART
        </>
      )}
    </button>
  );
}
