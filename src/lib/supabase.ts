import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Browser-side Supabase client. Returns null if env vars are missing. */
export function createSupabaseBrowser() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

/** Server Component / Route Handler Supabase client. Returns null if env vars are missing. */
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
          // Server Component context — set will throw, that's fine.
        }
      },
    },
  });
}
