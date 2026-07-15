"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm transition hover:bg-white"
      aria-label="Cart"
    >
      <ShoppingBag className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-hot-pink)] px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}
