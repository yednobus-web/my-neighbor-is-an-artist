"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type FavCtx = {
  ids: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  ready: boolean;
};

const STORAGE_KEY = "mnia.favorites.v1";
const Ctx = createContext<FavCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
  }, [ids, ready]);

  const toggle = useCallback((slug: string) => {
    setIds((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const has = useCallback((slug: string) => ids.includes(slug), [ids]);

  return <Ctx.Provider value={{ ids, has, toggle, ready }}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
