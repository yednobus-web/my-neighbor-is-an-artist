"use client";

import { useActionState } from "react";
import { signInWithEmail, signInWithGoogle, type AuthResult } from "./actions";

const initial: AuthResult | null = null;

export function LoginForms() {
  const [state, formAction, pending] = useActionState(signInWithEmail, initial);

  return (
    <div className="space-y-6">
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 border-4 border-ink bg-paper px-6 py-4 font-[family-name:var(--font-bangers)] text-2xl tracking-widest text-ink shadow-graffiti hover:-translate-y-1 transition-transform"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          SIGN IN WITH GOOGLE
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-paper/30" />
        <span className="font-[family-name:var(--font-marker)] text-paper/70">or</span>
        <div className="h-0.5 flex-1 bg-paper/30" />
      </div>

      <form action={formAction} className="space-y-3">
        <label className="block">
          <span className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
            EMAIL ME A MAGIC LINK
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@yourblock.com"
            className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full border-4 border-ink bg-acid-lime px-6 py-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-ink shadow-graffiti hover:-translate-y-1 transition-transform disabled:opacity-50"
        >
          {pending ? "SENDING..." : "SEND THE LINK 📩"}
        </button>
        {state && (
          <p
            className={`border-2 border-ink p-3 font-[family-name:var(--font-bangers)] tracking-wide ${
              state.ok ? "bg-acid-lime text-ink" : "bg-blood-orange text-paper"
            }`}
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
