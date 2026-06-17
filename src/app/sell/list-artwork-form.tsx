"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Upload, Loader2, ChevronDown, MapPin } from "lucide-react";
import { listArtworkAction, type ListArtworkResult } from "./actions";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { CityAutocomplete, CountryDropdown } from "@/components/location-fields";
import { CURRENCIES, ART_STYLES } from "@/lib/locations";

const LocationPickerMap = dynamic(
  () => import("@/components/location-picker-map").then((m) => m.LocationPickerMap),
  { ssr: false, loading: () => <div className="flex h-64 items-center justify-center border-4 border-ink bg-paper/10 font-[family-name:var(--font-bangers)] tracking-widest text-paper">LOADING MAP...</div> },
);

const initial: ListArtworkResult | null = null;

export function ListArtworkForm() {
  const [state, formAction] = useActionState(listArtworkAction, initial);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Map / location
  const [lat, setLat] = useState(40.6943);
  const [lng, setLng] = useState(-73.9249);
  const [showMap, setShowMap] = useState(false);

  // Dimension unit
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const sb = createSupabaseBrowser();
    if (!sb) return;
    setSupabaseReady(true);
    sb.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleFile(file: File) {
    setUploadError(null);
    const sb = createSupabaseBrowser();
    if (!sb || !userId) { setUploadError("Sign in first to upload images."); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadError("Image is over 8MB — try a smaller file."); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage.from("artworks").upload(path, file, {
        cacheControl: "31536000", contentType: file.type || undefined,
      });
      if (error) throw error;
      setImageUrl(sb.storage.from("artworks").getPublicUrl(path).data.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden lat/lng/unit */}
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
      <input type="hidden" name="measurementUnit" value={unit} />
      <input type="hidden" name="currency" value={currency} />

      {/* ── IMAGE ── */}
      <div>
        <Label>ARTWORK IMAGE *</Label>
        {imageUrl ? (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-ink bg-ink shadow-graffiti">
              <Image src={imageUrl} alt="Preview" fill sizes="100vw" className="object-cover" unoptimized />
            </div>
            <button type="button" onClick={() => setImageUrl("")}
              className="mt-2 border-2 border-ink bg-blood-orange px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest text-paper hover:-translate-y-0.5">
              REMOVE
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {supabaseReady && userId ? (
              <label className={`flex cursor-pointer items-center justify-center gap-3 border-4 border-dashed border-ink bg-paper p-8 text-ink shadow-graffiti hover:bg-acid-lime ${uploading ? "opacity-60" : ""}`}>
                <input type="file" accept="image/*" className="sr-only" disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }} />
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                <span className="font-[family-name:var(--font-bangers)] text-xl tracking-widest">
                  {uploading ? "UPLOADING..." : "DROP IMAGE / CLICK TO UPLOAD"}
                </span>
              </label>
            ) : (
              <div className="border-2 border-paper/50 bg-paper/10 p-3 text-paper/80">
                {supabaseReady
                  ? <><Link href="/login" className="underline">Sign in</Link> to upload images, or paste a URL below.</>
                  : "Image upload needs Supabase. Paste an image URL below."}
              </div>
            )}
            <input type="url" placeholder="...or paste image URL: https://..."
              value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none" />
          </div>
        )}
        {uploadError && <p className="mt-2 border-2 border-ink bg-blood-orange p-2 font-[family-name:var(--font-bangers)] text-paper">{uploadError}</p>}
      </div>

      {/* ── TITLE ── */}
      <TextField label="Title *" name="title" placeholder="LOUD GIRL #2" required />

      {/* ── STYLE ── */}
      <NativeSelect label="Art Style *" name="style" required>
        <option value="">Select a style…</option>
        {ART_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
      </NativeSelect>

      {/* ── LOCATION ── */}
      <div>
        <Label>LOCATION OF THE ART</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <CityAutocomplete label="City *" name="city" placeholder="Brooklyn" required />
          <CityAutocomplete label="State / Region *" name="neighborhood" placeholder="New York" required isState />
          <CountryDropdown label="Country *" name="country" required />
        </div>

        {/* Map pin toggle */}
        <button type="button" onClick={() => setShowMap((v) => !v)}
          className="mt-3 inline-flex items-center gap-2 border-2 border-paper px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-paper hover:bg-paper hover:text-ink">
          <MapPin className="h-4 w-4" />
          {showMap ? "HIDE MAP" : "📍 PIN ON MAP (OPTIONAL)"}
        </button>

        {showMap && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-paper/70">Click anywhere on the map or drag the pink marker to set the exact location.</p>
            <LocationPickerMap lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln); }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>LATITUDE</Label>
                <input type="number" step="any" value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || lat)}
                  className="w-full border-4 border-ink bg-paper p-2 text-ink shadow-graffiti focus:outline-none" />
              </div>
              <div>
                <Label>LONGITUDE</Label>
                <input type="number" step="any" value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || lng)}
                  className="w-full border-4 border-ink bg-paper p-2 text-ink shadow-graffiti focus:outline-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PRICE + CURRENCY ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>PRICE *</Label>
          <div className="flex gap-2">
            <div className="w-36 shrink-0">
              <CurrencyDropdown value={currency} onChange={setCurrency} />
            </div>
            <input name="price" type="number" min="1" step="0.01" required placeholder="320"
              className="flex-1 border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none" />
          </div>
        </div>
        <TextField label="Medium" name="medium" placeholder="Spray on canvas" />
      </div>

      {/* ── SIZE ── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>SIZE</Label>
          <div className="flex gap-1">
            {(["cm", "in"] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`border-2 border-ink px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest text-sm ${unit === u ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-acid-lime"}`}>
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["width", "height", "depth"].map((dim) => (
            <label key={dim} className="block">
              <span className="mb-1 block text-xs font-[family-name:var(--font-bangers)] tracking-widest text-paper">
                {dim.toUpperCase()} ({unit})
              </span>
              <input name={dim} type="number" min="0" step="0.1" placeholder="0"
                className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none" />
            </label>
          ))}
        </div>
      </div>

      {/* ── TAGS ── */}
      <TextField label="Tags (comma separated)" name="tags" placeholder="graffiti, neon, portrait"
        hint="Helps buyers find your work." />

      {/* ── DESCRIPTION ── */}
      <div>
        <Label>DESCRIPTION</Label>
        <textarea name="description" rows={4} placeholder="Tell the story behind this piece..."
          className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none" />
      </div>

      <SubmitButton />

      {state && !state.ok && (
        <p className="border-2 border-ink bg-blood-orange p-3 font-[family-name:var(--font-bangers)] tracking-wide text-paper">{state.message}</p>
      )}
      {state?.ok && state.slug && (
        <div className="border-4 border-ink bg-acid-lime p-4 text-ink shadow-graffiti">
          <p className="font-[family-name:var(--font-bangers)] text-2xl tracking-widest">{state.message}</p>
          <Link href={`/art/${state.slug}`}
            className="mt-2 inline-block font-[family-name:var(--font-marker)] text-electric-purple text-lg underline">
            see it live →
          </Link>
        </div>
      )}
    </form>
  );
}

// ─── Currency dropdown ────────────────────────────────────────────────────────

function CurrencyDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-4 border-ink bg-paper p-3 text-ink shadow-graffiti focus:outline-none">
        <span className="font-[family-name:var(--font-bangers)] tracking-wide">{selected.symbol} {selected.code}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 max-h-52 overflow-auto border-4 border-t-0 border-ink bg-paper text-ink shadow-graffiti">
          {CURRENCIES.map((c) => (
            <li key={c.code}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); onChange(c.code); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-acid-lime ${c.code === value ? "bg-acid-lime/40" : ""}`}>
                <span className="w-6 font-[family-name:var(--font-bangers)]">{c.symbol}</span>
                <span className="font-[family-name:var(--font-bangers)] tracking-wide">{c.code}</span>
                <span className="text-xs text-ink/60">{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 font-[family-name:var(--font-bangers)] tracking-widest text-paper">{children}</p>;
}

function NativeSelect({ label, name, required, children }: {
  label: string; name: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">{label}</span>
      <select name={name} required={required}
        className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti focus:outline-none">
        {children}
      </select>
    </label>
  );
}

function TextField({ label, name, hint, ...rest }: {
  label: string; name: string; hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">{label}</span>
      <input name={name} type="text"
        className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
        {...rest} />
      {hint && <p className="mt-1 text-xs text-paper/60">{hint}</p>}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full border-4 border-ink bg-hot-pink px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50">
      {pending ? "PUTTING IT UP..." : "DROP IT ON THE WALL 🎨"}
    </button>
  );
}
