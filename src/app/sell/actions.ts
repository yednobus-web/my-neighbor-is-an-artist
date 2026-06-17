"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export type ListArtworkResult = {
  ok: boolean;
  message: string;
  slug?: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export async function listArtworkAction(
  _prev: ListArtworkResult | null,
  formData: FormData,
): Promise<ListArtworkResult> {
  const title = (formData.get("title") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const neighborhood = (formData.get("neighborhood") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const countryFlag = (formData.get("countryFlag") as string)?.trim() || "🌍";
  const priceStr = (formData.get("price") as string)?.trim();
  const currency = (formData.get("currency") as string)?.trim() || "USD";
  const medium = (formData.get("medium") as string)?.trim();
  const style = (formData.get("style") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const latStr = (formData.get("lat") as string)?.trim();
  const lngStr = (formData.get("lng") as string)?.trim();
  const measurementUnit = (formData.get("measurementUnit") as string)?.trim() || "cm";
  const widthStr = (formData.get("width") as string)?.trim();
  const heightStr = (formData.get("height") as string)?.trim();
  const depthStr = (formData.get("depth") as string)?.trim();
  const tags = ((formData.get("tags") as string) ?? "")
    .split(",").map((t) => t.trim()).filter(Boolean);

  if (!title || !city || !neighborhood || !priceStr || !imageUrl) {
    return { ok: false, message: "Fill out title, city, state/region, price, and image." };
  }
  const price = Number(priceStr);
  if (Number.isNaN(price) || price <= 0) {
    return { ok: false, message: "Price needs to be a positive number." };
  }
  const lat = latStr ? Number(latStr) : null;
  const lng = lngStr ? Number(lngStr) : null;
  const width = widthStr ? Number(widthStr) : null;
  const height = heightStr ? Number(heightStr) : null;
  const depth = depthStr ? Number(depthStr) : null;

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: "Demo mode: Supabase isn't connected yet. See SETUP.md to wire it up.",
    };
  }

  const sb = await createSupabaseServer();
  if (!sb) return { ok: false, message: "Couldn't reach Supabase. Try again." };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    return { ok: false, message: "You need to be signed in to list art. Sign in first." };
  }

  // Use the signed-in user's existing artist profile.
  const { data: existingArtist } = await sb
    .from("artists")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let artistId = existingArtist?.id as string | undefined;

  if (!artistId) {
    // No profile yet — create a minimal one so the artwork can be linked.
    // The artist is prompted to fill in their full profile from /account.
    const emailHandle = `@${user.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, "") ?? "artist"}`;
    const { data: created, error: artistErr } = await sb
      .from("artists")
      .insert({
        user_id: user.id,
        handle: emailHandle,
        name: emailHandle.replace(/^@/, ""),
        city,
        neighborhood,
        country: country || "Earth",
        country_flag: countryFlag,
        lat,
        lng,
      })
      .select("id")
      .single();

    if (artistErr || !created) {
      return { ok: false, message: `Couldn't set up your artist profile: ${artistErr?.message ?? "unknown error"}` };
    }
    artistId = created.id;
  }

  const slug = `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

  const { error: workErr } = await sb.from("artworks").insert({
    artist_id: artistId,
    slug,
    title,
    description: description || null,
    medium: medium || null,
    style: style || null,
    price,
    currency,
    image_url: imageUrl,
    tags,
    city: city || null,
    neighborhood: neighborhood || null,
    lat,
    lng,
    width_cm: width,
    height_cm: height,
    depth_cm: depth,
    measurement_unit: measurementUnit,
  });

  if (workErr) {
    return { ok: false, message: `Couldn't list artwork: ${workErr.message}` };
  }

  revalidatePath("/browse");
  revalidatePath("/");
  revalidatePath("/map");
  return { ok: true, message: "Boom — your art is on the wall.", slug };
}
