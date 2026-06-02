"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { listArtworkAction, type ListArtworkResult } from "./actions";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Upload, Loader2 } from "lucide-react";

const initial: ListArtworkResult | null = null;

type Session = { userId: string | null };

export function ListArtworkForm() {
  const [state, formAction] = useActionState(listArtworkAction, initial);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [session, setSession] = useState<Session>({ userId: null });
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    const sb = createSupabaseBrowser();
    if (!sb) return;
    setSupabaseReady(true);
    sb.auth.getUser().then(({ data }) => setSession({ userId: data.user?.id ?? null }));
    const { data } = sb.auth.onAuthStateChange((_e, s) =>
      setSession({ userId: s?.user?.id ?? null }),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleFile(file: File) {
    setUploadError(null);
    const sb = createSupabaseBrowser();
    if (!sb || !session.userId) {
      setUploadError("Sign in first to upload images.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image is over 8MB — try a smaller file.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${session.userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage.from("artworks").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data: urlData } = sb.storage.from("artworks").getPublicUrl(path);
      setImageUrl(urlData.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {/* Image upload + preview */}
      <div className="sm:col-span-2">
        <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
          ARTWORK IMAGE *
        </label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {imageUrl ? (
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-ink bg-ink shadow-graffiti">
              <Image src={imageUrl} alt="Preview" fill sizes="100vw" className="object-cover" unoptimized />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="mt-2 border-2 border-ink bg-blood-orange px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest text-paper hover:-translate-y-0.5"
            >
              REMOVE
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {supabaseReady && session.userId ? (
              <label
                className={`flex cursor-pointer items-center justify-center gap-3 border-4 border-dashed border-ink bg-paper p-8 text-ink shadow-graffiti hover:bg-acid-lime ${
                  uploading ? "opacity-60" : ""
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                <span className="font-[family-name:var(--font-bangers)] text-xl tracking-widest">
                  {uploading ? "UPLOADING..." : "DROP IMAGE / CLICK TO UPLOAD"}
                </span>
              </label>
            ) : (
              <div className="border-2 border-paper/50 bg-paper/10 p-3 text-paper/80">
                {supabaseReady ? (
                  <>
                    <Link href="/login" className="underline">Sign in</Link> to upload images, or paste a URL below.
                  </>
                ) : (
                  "Image upload needs Supabase configured. For now, paste an image URL below."
                )}
              </div>
            )}
            <input
              type="url"
              placeholder="...or paste image URL: https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
            />
          </div>
        )}
        {uploadError && (
          <p className="mt-2 border-2 border-ink bg-blood-orange p-2 font-[family-name:var(--font-bangers)] text-paper">
            {uploadError}
          </p>
        )}
      </div>

      <Field label="Title *" name="title" placeholder="LOUD GIRL #2" required />
      <Field label="Artist handle *" name="artistHandle" placeholder="@your.handle" required />
      <Field label="Artist name" name="artistName" placeholder="Your real name (optional)" />
      <Field label="City *" name="city" placeholder="Brooklyn" required />
      <Field label="Neighborhood *" name="neighborhood" placeholder="Bushwick" required />
      <Field label="Country" name="country" placeholder="USA" />
      <Field label="Price (USD) *" name="price" type="number" min="1" step="1" placeholder="320" required />
      <Field label="Medium" name="medium" placeholder="Spray on canvas" />
      <Field label="Tags (comma sep)" name="tags" placeholder="graffiti, neon, portrait" />
      <Field label="Latitude (optional)" name="lat" type="number" step="any" placeholder="40.6943" />
      <Field label="Longitude (optional)" name="lng" type="number" step="any" placeholder="-73.9249" />

      <div className="sm:col-span-2">
        <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
          DESCRIPTION
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder="Tell the story behind this piece..."
          className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <SubmitButton />
        {state && !state.ok && (
          <p className="mt-3 border-2 border-ink bg-blood-orange p-3 font-[family-name:var(--font-bangers)] tracking-wide text-paper">
            {state.message}
          </p>
        )}
        {state?.ok && state.slug && (
          <div className="mt-3 border-4 border-ink bg-acid-lime p-4 text-ink shadow-graffiti">
            <p className="font-[family-name:var(--font-bangers)] text-2xl tracking-widest">{state.message}</p>
            <Link
              href={`/art/${state.slug}`}
              className="mt-2 inline-block underline font-[family-name:var(--font-marker)] text-electric-purple text-lg"
            >
              see it live →
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border-4 border-ink bg-hot-pink px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50"
    >
      {pending ? "PUTTING IT UP..." : "DROP IT ON THE WALL 🎨"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
        {label}
      </span>
      <input
        name={name}
        type={type}
        className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
        {...rest}
      />
    </label>
  );
}
