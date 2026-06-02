"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper bg-hot-pink text-ink hover:bg-acid-lime"
      aria-label="Cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-ink bg-acid-lime px-1 text-xs font-bold text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
