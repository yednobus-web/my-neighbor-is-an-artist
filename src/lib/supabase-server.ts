// Server-only Supabase clients. Imports next/headers — never reachable from
// client components. Re-exports the public flags from the browser file so a
// single import works in server code.
import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isServiceRoleConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE);

/** Server Component / Route Handler / Server Action client (uses cookies). */
export async function createSupabaseServer() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component context — cookies are read-only there. Ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses RLS — only use server-side, never expose
 * to the browser. Used by webhooks (Stripe) where there's no user session.
 */
export function createSupabaseAdmin() {
  if (!isServiceRoleConfigured) return null;
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
