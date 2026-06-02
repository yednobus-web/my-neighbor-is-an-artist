"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  artworkId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  artistHandle: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (artworkId: string) => void;
  clear: () => void;
  has: (artworkId: string) => boolean;
};

const STORAGE_KEY = "mnia.cart.v1";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("cart:change", { detail: items.length }));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((s, i) => s + i.price, 0),
      add: (item) =>
        setItems((prev) => (prev.some((p) => p.artworkId === item.artworkId) ? prev : [...prev, item])),
      remove: (id) => setItems((prev) => prev.filter((p) => p.artworkId !== id)),
      clear: () => setItems([]),
      has: (id) => items.some((p) => p.artworkId === id),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  return ctx;
}
