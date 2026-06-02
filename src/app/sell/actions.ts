"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export type ListArtworkResult = {
  ok: boolean;
  message: string;
  slug?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listArtworkAction(
  _prev: ListArtworkResult | null,
  formData: FormData,
): Promise<ListArtworkResult> {
  const title = (formData.get("title") as string)?.trim();
  const artistHandle = (formData.get("artistHandle") as string)?.trim();
  const artistName = (formData.get("artistName") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const neighborhood = (formData.get("neighborhood") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const medium = (formData.get("medium") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const tags = ((formData.get("tags") as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title || !artistHandle || !city || !neighborhood || !priceStr || !imageUrl) {
    return { ok: false, message: "Fill out title, artist handle, city, neighborhood, price, and image URL." };
  }
  const price = Number(priceStr);
  if (Number.isNaN(price) || price <= 0) {
    return { ok: false, message: "Price needs to be a positive number." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message:
        "Demo mode: Supabase isn't connected yet. Once env vars are set + the schema is run, this form writes to the database.",
    };
  }

  const sb = await createSupabaseServer();
  if (!sb) {
    return { ok: false, message: "Couldn't reach Supabase. Try again in a moment." };
  }

  // Find or create the artist by handle.
  const { data: existing } = await sb
    .from("artists")
    .select("id")
    .eq("handle", artistHandle)
    .maybeSingle();

  let artistId = existing?.id as string | undefined;

  if (!artistId) {
    const { data: created, error: artistErr } = await sb
      .from("artists")
      .insert({
        handle: artistHandle,
        name: artistName || artistHandle.replace(/^@/, ""),
        city,
        neighborhood,
        country: country || "Earth",
        country_flag: "🌍",
      })
      .select("id")
      .single();

    if (artistErr || !created) {
      return { ok: false, message: `Couldn't create artist: ${artistErr?.message ?? "unknown error"}` };
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
    price,
    image_url: imageUrl,
    tags,
    city: city || null,
    neighborhood: neighborhood || null,
  });

  if (workErr) {
    return { ok: false, message: `Couldn't list artwork: ${workErr.message}` };
  }

  revalidatePath("/browse");
  revalidatePath("/");
  return { ok: true, message: "Boom — your art is on the wall.", slug };
}
