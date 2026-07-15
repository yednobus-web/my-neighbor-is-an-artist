"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogIn } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function AuthButton() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const sb = createSupabaseBrowser();
    if (!sb) { setSignedIn(false); return; }
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSignedIn(!!s?.user));
    return () => data.subscription.unsubscribe();
  }, []);

  if (signedIn) {
    return (
      <Link
        href="/profile"
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-linen)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">My Profile</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-1.5 text-sm font-semibold text-[var(--color-linen)] transition hover:bg-[var(--color-berry)]"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Log in</span>
    </Link>
  );
}
