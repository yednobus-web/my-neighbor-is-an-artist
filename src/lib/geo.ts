// IP geolocation service wrapper.
// Isolated so the provider (ipapi.co) can be swapped later without touching callers.

export type GeoResult = {
  country: string;      // human name, e.g. "United States"
  countryCode: string;  // ISO alpha-2, e.g. "US"
};

// Detect the visitor's country from their IP. Quiet, no permission prompt.
// Returns null on any failure — callers should fall back gracefully.
export async function detectCountry(): Promise<GeoResult | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.country_name || !data?.country_code) return null;
    return {
      country: data.country_name as string,
      countryCode: data.country_code as string,
    };
  } catch {
    return null;
  }
}
