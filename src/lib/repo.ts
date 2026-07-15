// Repository layer — reads from Supabase if configured, falls back to mock data.
// Same return shape either way, so pages don't need to know which is in use.

import {
  ARTISTS as MOCK_ARTISTS,
  ARTWORKS as MOCK_ARTWORKS,
  type Artist,
  type Artwork,
} from "./data";
import { createSupabasePublic, isPublicSupabaseConfigured } from "./supabase-public";
import { unstable_cache } from "next/cache";

type DBArtist = {
  id: string;
  handle: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  city: string;
  neighborhood: string;
  country: string;
  country_flag: string | null;
  vibe: string[] | null;
  followers: number | null;
  lat: number | null;
  lng: number | null;
};

type DBArtwork = {
  id: string;
  artist_id: string;
  slug: string;
  title: string;
  description: string | null;
  medium: string | null;
  year: number | null;
  width_cm: number | null;
  height_cm: number | null;
  price: number;
  currency: string | null;
  image_url: string;
  tags: string[] | null;
  city: string | null;
  neighborhood: string | null;
};

function dbToArtist(a: DBArtist): Artist {
  return {
    id: a.id,
    handle: a.handle,
    name: a.name,
    city: a.city,
    neighborhood: a.neighborhood,
    country: a.country,
    countryFlag: a.country_flag ?? "",
    bio: a.bio ?? "",
    avatar: a.avatar_url ?? "",
    followers: a.followers ?? 0,
    vibe: a.vibe ?? [],
    lat: a.lat ?? 0,
    lng: a.lng ?? 0,
  };
}

function dbToArtwork(w: DBArtwork): Artwork {
  return {
    id: w.id,
    slug: w.slug,
    title: w.title,
    artistId: w.artist_id,
    price: Number(w.price),
    currency: w.currency ?? "USD",
    medium: w.medium ?? "",
    year: w.year ?? new Date().getFullYear(),
    width: w.width_cm ?? 0,
    height: w.height_cm ?? 0,
    image: w.image_url,
    tags: w.tags ?? [],
    description: w.description ?? "",
    city: w.city ?? undefined,
    neighborhood: w.neighborhood ?? undefined,
  };
}

export async function fetchArtists(): Promise<Artist[]> {
  if (!isPublicSupabaseConfigured) return MOCK_ARTISTS;
  return getCachedArtists();
}

export async function fetchArtworks(): Promise<Artwork[]> {
  if (!isPublicSupabaseConfigured) return MOCK_ARTWORKS;
  return getCachedArtworks();
}

// Cache DB reads for 60s across ALL requests (even dynamic pages like /browse),
// so filtering doesn't trigger a fresh cross-network query every time.
const getCachedArtists = unstable_cache(
  async (): Promise<Artist[]> => {
    const sb = createSupabasePublic();
    if (!sb) return MOCK_ARTISTS;
    const { data, error } = await sb.from("artists").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return MOCK_ARTISTS;
    return (data as unknown as DBArtist[]).map(dbToArtist);
  },
  ["artists-all"],
  { revalidate: 60, tags: ["artists"] },
);

const getCachedArtworks = unstable_cache(
  async (): Promise<Artwork[]> => {
    const sb = createSupabasePublic();
    if (!sb) return MOCK_ARTWORKS;
    const { data, error } = await sb
      .from("artworks")
      .select("*")
      .neq("status", "draft")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return MOCK_ARTWORKS;
    return (data as unknown as DBArtwork[]).map(dbToArtwork);
  },
  ["artworks-all"],
  { revalidate: 60, tags: ["artworks"] },
);

export async function fetchArtist(id: string): Promise<Artist | null> {
  const all = await fetchArtists();
  return all.find((a) => a.id === id) ?? null;
}

export async function fetchArtworkBySlug(slug: string): Promise<Artwork | null> {
  const all = await fetchArtworks();
  return all.find((w) => w.slug === slug) ?? null;
}
