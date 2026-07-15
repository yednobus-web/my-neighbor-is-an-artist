// Refreshes Supabase auth cookies on every request so server components
// always see the latest session. Skipped automatically when Supabase env
// vars aren't configured — keeps the app running in demo mode.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  // Fast path: anonymous visitors have no Supabase auth cookie, so there's
  // nothing to refresh. Skip the auth-server round-trip entirely for them.
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!hasAuthCookie) return NextResponse.next();

  const response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the user — refreshes the session cookie if needed.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Only run on pages that actually depend on auth state.
  // Public pages (home, browse, artists, art, map, neighborhoods) are skipped
  // so they stay fast and cacheable.
  matcher: ["/account/:path*", "/sell", "/auth/:path*"],
};
