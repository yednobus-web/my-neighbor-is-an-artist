// Lightweight anonymous Supabase client for PUBLIC reads (no user session).
// Unlike createSupabaseServer(), this does NOT read cookies — so pages using it
// can be statically cached / revalidated instead of rendered fresh per request.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isPublicSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let _client: ReturnType<typeof createClient> | null = null;

export function createSupabasePublic() {
  if (!isPublicSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}
