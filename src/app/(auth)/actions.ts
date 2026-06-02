"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { headers } from "next/headers";

export type AuthResult = { ok: boolean; message: string };

async function origin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured) {
    redirect("/login?error=demo");
  }
  const sb = await createSupabaseServer();
  if (!sb) redirect("/login?error=supabase");
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await origin()}/auth/callback` },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signInWithEmail(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { ok: false, message: "Drop your email first." };
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: "Demo mode: auth isn't connected yet. Once Supabase env vars are set, magic link works.",
    };
  }
  const sb = await createSupabaseServer();
  if (!sb) return { ok: false, message: "Couldn't reach Supabase." };
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await origin()}/auth/callback` },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Check your email for a magic link 📩" };
}

export async function signOut() {
  const sb = await createSupabaseServer();
  if (sb) await sb.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
