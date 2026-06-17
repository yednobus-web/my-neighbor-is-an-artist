"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Upload, Loader2, User } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { CityAutocomplete, CountryDropdown } from "@/components/location-fields";
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
