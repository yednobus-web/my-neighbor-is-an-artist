import Link from "next/link";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/chrome";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { ProfileForm } from "./profile-form";

export default async function ProfileEditPage() {
  if (!isSupabaseConfigured) {
    return (
      <>
        <Header />
        <main className="relative z-10 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl border-4 border-paper bg-paper p-8 text-ink shadow-graffiti-lg">
            <h1 className="font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
              DEMO MODE
            </h1>
            <p className="mt-2">
              The database isn't connected. See SETUP.md to wire up Supabase.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sb = await createSupabaseServer();
  if (!sb) redirect("/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  // Existing artist row (if any).
  const { data: artist } = await sb
    .from("artists")
    .select("id, handle, name, bio, avatar_url, city, neighborhood, country, vibe")
    .eq("user_id", user.id)
    .maybeSingle();

  const isNew = !artist;

  // Sensible default handle: the email local part.
  const fallbackHandle =
    user.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, "") ?? "artist";

  const initialValues = {
    handle: artist?.handle ?? `@${fallbackHandle}`,
    name: artist?.name ?? "",
    bio: artist?.bio ?? "",
    avatarUrl: artist?.avatar_url ?? "",
    city: artist?.city ?? "",
    neighborhood: artist?.neighborhood ?? "",
    country: artist?.country ?? "",
    vibe: (artist?.vibe ?? []).join(", "),
  };

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/account"
            className="mb-6 inline-block font-[family-name:var(--font-marker)] text-acid-lime hover:text-hot-pink"
          >
            ← back to account
          </Link>

          <div className="-rotate-1 border-4 border-paper bg-electric-purple p-6 text-paper shadow-graffiti-lg">
            <p className="font-[family-name:var(--font-marker)] text-xl text-acid-lime">
              {isNew ? "let's get you on the wall" : "tweak your profile"}
            </p>
            <h1 className="mb-2 font-[family-name:var(--font-bangers)] text-5xl leading-none tracking-wide">
              {isNew ? "SET UP PROFILE" : "EDIT PROFILE"}
            </h1>
            <p className="mb-6 text-sm text-paper/80">
              {isNew
                ? "This is your artist identity — what buyers see when they find your work."
                : "Update your handle, bio, photo, location, and vibe."}
            </p>

            <ProfileForm userId={user.id} initialValues={initialValues} isNew={isNew} />

            {artist && (
              <Link
                href={`/artists/${artist.id}`}
                className="mt-6 inline-block border-4 border-paper bg-paper px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-ink shadow-graffiti hover:-translate-y-1 transition-transform"
              >
                VIEW PUBLIC PROFILE →
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
