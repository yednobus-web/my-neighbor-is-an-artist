"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Upload, Loader2, User, ChevronDown } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { COUNTRIES, CITY_SUGGESTIONS } from "@/lib/locations";
import { saveProfileAction, type ProfileResult } from "./actions";

const initial: ProfileResult | null = null;

export type ProfileFormProps = {
  userId: string;
  initialValues: {
    handle: string;
    name: string;
    bio: string;
    avatarUrl: string;
    city: string;
    neighborhood: string;
    country: string;
    vibe: string;
  };
  isNew: boolean;
};

export function ProfileForm({ userId, initialValues, isNew }: ProfileFormProps) {
  const [state, formAction] = useActionState(saveProfileAction, initial);
  const [avatarUrl, setAvatarUrl] = useState(initialValues.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) setUploadError(null);
  }, [state]);

  async function handleAvatar(file: File) {
    setUploadError(null);
    const sb = createSupabaseBrowser();
    if (!sb) { setUploadError("Storage isn't configured."); return; }
    if (file.size > 4 * 1024 * 1024) { setUploadError("Avatar is over 4MB — try a smaller image."); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage.from("artworks").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data: urlData } = sb.storage.from("artworks").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatarUrl" value={avatarUrl} />

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-ink bg-ink shadow-graffiti-pink">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Profile photo" fill sizes="128px" className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-paper text-ink">
              <User className="h-16 w-16" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-[family-name:var(--font-bangers)] tracking-widest text-paper">PROFILE PHOTO</p>
          <p className="mb-2 text-sm text-paper/70">Square images look best. Max 4MB.</p>
          <label className={`inline-flex cursor-pointer items-center gap-2 border-4 border-ink bg-paper px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-ink shadow-graffiti hover:bg-acid-lime ${uploading ? "opacity-60" : ""}`}>
            <input type="file" accept="image/*" className="sr-only" disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleAvatar(f); }} />
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            {uploading ? "UPLOADING..." : avatarUrl ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
          </label>
          {avatarUrl && !uploading && (
            <button type="button" onClick={() => setAvatarUrl("")}
              className="ml-3 border-2 border-paper px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-paper hover:bg-blood-orange">
              REMOVE
            </button>
          )}
          {uploadError && (
            <p className="mt-2 border-2 border-ink bg-blood-orange p-2 font-[family-name:var(--font-bangers)] text-paper">{uploadError}</p>
          )}
        </div>
      </div>

      <TextField label="Handle *" name="handle" placeholder="@your.handle"
        defaultValue={initialValues.handle} required
        hint="What buyers will see. Letters, numbers, . _ - only." />

      <TextField label="Display name" name="name" placeholder="Your name (or stage name)"
        defaultValue={initialValues.name} />

      <div>
        <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">SHORT BIO</label>
        <textarea name="bio" rows={3} maxLength={280}
          placeholder="Who are you? What's your vibe? Keep it short."
          defaultValue={initialValues.bio}
          className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none" />
        <p className="mt-1 text-xs text-paper/60">280 characters max.</p>
      </div>

      {/* Location row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <CityAutocomplete
          label={isNew ? "City *" : "City"}
          name="city"
          placeholder="Brooklyn"
          defaultValue={initialValues.city}
          required={isNew}
        />
        <CityAutocomplete
          label={isNew ? "State / Region *" : "State / Region"}
          name="neighborhood"
          placeholder="New York"
          defaultValue={initialValues.neighborhood}
          required={isNew}
          isState
        />
        <CountryDropdown
          label={isNew ? "Country *" : "Country"}
          name="country"
          defaultValue={initialValues.country}
          required={isNew}
        />
      </div>

      <TextField label="Vibe tags" name="vibe" placeholder="graffiti, neon, portrait"
        defaultValue={initialValues.vibe}
        hint="Comma separated. Helps buyers find your style." />

      <SubmitButton isNew={isNew} />

      {state && !state.ok && (
        <p className="border-2 border-ink bg-blood-orange p-3 font-[family-name:var(--font-bangers)] tracking-wide text-paper">{state.message}</p>
      )}
      {state?.ok && (
        <p className="border-4 border-ink bg-acid-lime p-3 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-ink shadow-graffiti">{state.message}</p>
      )}
    </form>
  );
}

// ─── City/State autocomplete ──────────────────────────────────────────────────

function CityAutocomplete({
  label, name, placeholder, defaultValue, required, isState = false,
}: {
  label: string; name: string; placeholder: string;
  defaultValue: string; required?: boolean; isState?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // When the user types a city we suggest "City, State" pairs.
  // When they're typing a state we suggest just the state part.
  const suggestions = value.trim().length < 2 ? [] : CITY_SUGGESTIONS.filter((s) => {
    const q = value.toLowerCase();
    if (isState) {
      const state = s.split(", ")[1] ?? "";
      return state.toLowerCase().startsWith(q);
    }
    return s.toLowerCase().includes(q);
  }).slice(0, 8);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(suggestion: string) {
    const parts = suggestion.split(", ");
    setValue(isState ? (parts[1] ?? suggestion) : parts[0]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">{label}</label>
      <input
        name={name}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => { setValue(e.target.value); setOpen(true); }}
        onFocus={() => value.trim().length >= 2 && setOpen(true)}
        className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-30 max-h-52 overflow-auto border-4 border-t-0 border-ink bg-paper text-ink shadow-graffiti">
          {suggestions.map((s) => (
            <li key={s}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                className="flex w-full items-start gap-1 px-3 py-2 text-left hover:bg-acid-lime">
                <span className="font-[family-name:var(--font-bangers)] tracking-wide">
                  {isState ? s.split(", ")[1] : s.split(", ")[0]}
                </span>
                <span className="ml-1 text-xs text-ink/60">
                  {isState ? s.split(", ")[0] : s.split(", ")[1]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Country dropdown ─────────────────────────────────────────────────────────

function CountryDropdown({
  label, name, defaultValue, required,
}: {
  label: string; name: string; defaultValue: string; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() =>
    COUNTRIES.find((c) => c.name === defaultValue || c.code === defaultValue) ?? null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  function pick(c: typeof COUNTRIES[0]) {
    setSelected(c); setOpen(false); setSearch("");
  }

  return (
    <div ref={containerRef} className="relative sm:col-span-1">
      {/* Hidden real input */}
      <input type="hidden" name={name} value={selected?.name ?? ""} />
      <input type="hidden" name="countryFlag" value={selected?.flag ?? "🌍"} />

      <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between border-4 border-ink bg-paper p-3 text-left text-ink shadow-graffiti hover:bg-paper/90 focus:outline-none ${required && !selected ? "ring-2 ring-hot-pink" : ""}`}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="text-xl">{selected.flag}</span>
            <span className="font-[family-name:var(--font-bangers)] tracking-wide">{selected.name}</span>
          </span>
        ) : (
          <span className="text-ink/40">Select country…</span>
        )}
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-4 border-t-0 border-ink bg-paper text-ink shadow-graffiti">
          <div className="border-b-2 border-ink p-2">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries…"
              className="w-full border-2 border-ink bg-paper p-2 text-sm focus:outline-none placeholder:text-ink/40"
            />
          </div>
          <ul className="max-h-52 overflow-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-ink/60">No match</li>
            ) : filtered.map((c) => (
              <li key={c.code}>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(c); }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-acid-lime ${selected?.code === c.code ? "bg-acid-lime/40" : ""}`}>
                  <span className="text-lg">{c.flag}</span>
                  <span className="font-[family-name:var(--font-bangers)] tracking-wide">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full border-4 border-ink bg-hot-pink px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50">
      {pending ? "SAVING..." : isNew ? "CREATE PROFILE 🎨" : "SAVE CHANGES 💾"}
    </button>
  );
}

function TextField({
  label, name, hint, ...rest
}: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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
