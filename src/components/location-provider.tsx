"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { detectCountry } from "@/lib/geo";

type LocationState = {
  country: string | null;
  countryCode: string | null;
  ready: boolean;         // true once we've resolved an initial value
  source: "profile" | "stored" | "detected" | "default" | null;
  setCountry: (country: string, countryCode: string) => void;
};

const STORAGE_KEY = "mnia.location.v1";
const Ctx = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<LocationState["source"]>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Stored choice (guest localStorage) wins first — it's an explicit prior choice.
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.country && parsed?.countryCode) {
            if (!cancelled) {
              setCountryState(parsed.country);
              setCountryCode(parsed.countryCode);
              setSource("stored");
              setReady(true);
            }
            return;
          }
        }
      } catch {}

      // 2. No stored choice — detect quietly via IP.
      const geo = await detectCountry();
      if (cancelled) return;
      if (geo) {
        setCountryState(geo.country);
        setCountryCode(geo.countryCode);
        setSource("detected");
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(geo));
        } catch {}
      } else {
        // 3. Fallback default.
        setCountryState("United States");
        setCountryCode("US");
        setSource("default");
      }
      setReady(true);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const setCountry = useCallback((c: string, code: string) => {
    setCountryState(c);
    setCountryCode(code);
    setSource("profile");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ country: c, countryCode: code }));
    } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ country, countryCode, ready, source, setCountry }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}
