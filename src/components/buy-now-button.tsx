"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

export function BuyNowButton({ slug, label = "BUY NOW 💸" }: { slug: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await r.json();
      if (!r.ok || !data.url) {
        setError(data.error ?? "Checkout failed.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <button
        onClick={buy}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 border-4 border-ink bg-electric-purple px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CreditCard className="h-6 w-6" />}
        {loading ? "REDIRECTING..." : label}
      </button>
      {error && (
        <p className="mt-2 border-2 border-ink bg-blood-orange p-2 font-[family-name:var(--font-bangers)] text-paper">
          {error}
        </p>
      )}
    </div>
  );
}
