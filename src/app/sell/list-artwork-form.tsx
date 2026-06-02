"use client";

import Link from "next/link";
import { useActionState } from "react";
import { listArtworkAction, type ListArtworkResult } from "./actions";

const initial: ListArtworkResult | null = null;

export function ListArtworkForm() {
  const [state, formAction, pending] = useActionState(listArtworkAction, initial);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="Title *" name="title" placeholder="LOUD GIRL #2" required />
      <Field label="Image URL *" name="imageUrl" placeholder="https://..." required />
      <Field label="Artist handle *" name="artistHandle" placeholder="@your.handle" required />
      <Field label="Artist name" name="artistName" placeholder="Your real name (optional)" />
      <Field label="City *" name="city" placeholder="Brooklyn" required />
      <Field label="Neighborhood *" name="neighborhood" placeholder="Bushwick" required />
      <Field label="Country" name="country" placeholder="USA" />
      <Field label="Price (USD) *" name="price" type="number" min="1" step="1" placeholder="320" required />
      <Field label="Medium" name="medium" placeholder="Spray on canvas" />
      <Field label="Tags (comma sep)" name="tags" placeholder="graffiti, neon, portrait" />
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
        <button
          type="submit"
          disabled={pending}
          className="w-full border-4 border-ink bg-hot-pink px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50"
        >
          {pending ? "PUTTING IT UP..." : "DROP IT ON THE WALL 🎨"}
        </button>

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
