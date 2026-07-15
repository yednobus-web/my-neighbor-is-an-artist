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

  // Signed in → My Profile
  if (signedIn) {
    return (
      <Link
        href="/account"
        className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition hover:bg-white"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">My Profile</span>
      </Link>
    );
  }

  // Signed out (or still loading) → Log in / Sign up
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition hover:bg-white"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Log in / Sign up</span>
    </Link>
  );
}
