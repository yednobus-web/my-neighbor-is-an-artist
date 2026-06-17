"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export type ProfileResult = {
  ok: boolean;
  message: string;
};

function normalizeHandle(raw: string): string {
  // Force a leading "@" and strip illegal characters.
  const cleaned = raw
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
  return `@${cleaned}`;
}

export async function saveProfileAction(
  _prev: ProfileResult | null,
  formData: FormData,
): Promise<ProfileResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Database isn't connected — see SETUP.md" };
  }

  const sb = await createSupabaseServer();
  if (!sb) return { ok: false, message: "Couldn't reach the database." };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, message: "You need to be signed in." };

  const rawHandle = (formData.get("handle") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const neighborhood = (formData.get("neighborhood") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  // countryFlag is set automatically by the CountryDropdown as a hidden input.
  const countryFlag = (formData.get("countryFlag") as string)?.trim() || "🌍";
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim();
  const vibeStr = (formData.get("vibe") as string) ?? "";
  const vibe = vibeStr.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);

  if (!rawHandle || rawHandle.length < 2) {
    return { ok: false, message: "Pick a handle (minimum 2 characters)." };
  }
  const handle = normalizeHandle(rawHandle);
  if (handle.length < 3) {
    return { ok: false, message: "Handle needs at least 2 valid characters (letters, numbers, . _ -)." };
  }

  // Find existing artist row (if any) — could be linked OR could be unlinked under the same handle.
  const { data: existingByUser } = await sb
    .from("artists")
    .select("id, handle, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check handle uniqueness — but allow the user to keep their own handle.
  const { data: existingByHandle } = await sb
    .from("artists")
    .select("id, user_id")
    .eq("handle", handle)
    .maybeSingle();

  if (existingByHandle && existingByHandle.id !== existingByUser?.id) {
    if (existingByHandle.user_id) {
      return { ok: false, message: `Handle ${handle} is already taken — try another.` };
    }
    // Orphaned profile (created via /sell with that handle by an unauth user).
    // Claim it for this signed-in user.
    const { error: claimErr } = await sb
      .from("artists")
      .update({
        user_id: user.id,
        name: name || handle.replace(/^@/, ""),
        bio: bio || null,
        avatar_url: avatarUrl || null,
        city: city || "Earth",
        neighborhood: neighborhood || "Somewhere",
        country: country || "Earth",
        country_flag: countryFlag || "🌍",
        vibe,
      })
      .eq("id", existingByHandle.id);
    if (claimErr) return { ok: false, message: `Couldn't claim profile: ${claimErr.message}` };
    revalidatePath("/account");
    revalidatePath(`/artists/${existingByHandle.id}`);
    revalidatePath("/artists");
    return { ok: true, message: `Profile claimed and saved as ${handle}.` };
  }

  if (existingByUser) {
    // Update existing — only touch fields that have a value, so partial saves
    // don't accidentally clear required NOT NULL columns.
    const update: Record<string, unknown> = {
      handle,
      name: name || handle.replace(/^@/, ""),
      bio: bio || null,
      avatar_url: avatarUrl || null,
      vibe,
    };
    if (city) update.city = city;
    if (neighborhood) update.neighborhood = neighborhood;
    if (country) update.country = country;
    if (countryFlag) update.country_flag = countryFlag;

    const { error } = await sb.from("artists").update(update).eq("id", existingByUser.id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false, message: `Handle ${handle} is already taken — try another.` };
      }
      return { ok: false, message: `Couldn't save: ${error.message}` };
    }
    revalidatePath("/account");
    revalidatePath(`/artists/${existingByUser.id}`);
    revalidatePath("/artists");
    return { ok: true, message: "Profile updated! 🎨" };
  }

  // Brand new profile — needs city, neighborhood, country (NOT NULL columns).
  if (!city || !neighborhood || !country) {
    return {
      ok: false,
      message: "Tell us where you're based — city, neighborhood, and country are required for new profiles.",
    };
  }

  const { error } = await sb.from("artists").insert({
    user_id: user.id,
    handle,
    name: name || handle.replace(/^@/, ""),
    bio: bio || null,
    avatar_url: avatarUrl || null,
    city,
    neighborhood,
    country,
    country_flag: countryFlag || "🌍",
    vibe,
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: `Handle ${handle} is already taken — try another.` };
    }
    return { ok: false, message: `Couldn't save: ${error.message}` };
  }
  revalidatePath("/account");
  revalidatePath("/artists");
  revalidatePath("/");
  return { ok: true, message: "Profile created! Welcome to the wall 🎨" };
}
