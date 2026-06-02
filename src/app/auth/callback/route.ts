// Handles Supabase OAuth + magic-link callbacks.
// /auth/callback?code=... — exchanges the code for a session cookie.

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const sb = await createSupabaseServer();
    if (sb) {
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
