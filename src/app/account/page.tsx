import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/chrome";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { signOut } from "@/app/(auth)/actions";
import { User, Pencil, Sparkles } from "lucide-react";

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return (
      <>
        <Header />
        <main className="relative z-10 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl border-4 border-paper bg-paper p-8 text-ink shadow-graffiti-lg">
            <h1 className="font-[family-name:var(--font-bangers)] text-4xl tracking-wide">
              ACCOUNT — DEMO MODE
            </h1>
            <p className="mt-2">
              Auth isn&apos;t connected yet. See <Link href="/" className="underline">SETUP.md</Link> in the repo to wire up Supabase.
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

  // Look up linked artist profile (if any)
  const { data: artist } = await sb
    .from("artists")
    .select("id, handle, name, bio, avatar_url, neighborhood, city, country, country_flag, vibe, stripe_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Recent orders for this user
  const { data: orders } = await sb
    .from("orders")
    .select("id, amount_cents, status, created_at, artwork_id")
    .eq("buyer_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Profile card */}
          <section className="-rotate-1 border-4 border-paper bg-paper p-6 text-ink shadow-graffiti-lg">
            <p className="font-[family-name:var(--font-marker)] text-xl text-electric-purple">your account</p>
            <h1 className="font-[family-name:var(--font-bangers)] text-5xl leading-none tracking-wide">
              {(artist?.name || user.email?.split("@")[0] || "ANON").toUpperCase()}
            </h1>
            <p className="mt-1 text-sm">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <form action={signOut}>
                <button className="border-4 border-ink bg-blood-orange px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform">
                  SIGN OUT
                </button>
              </form>
              <Link
                href="/sell"
                className="border-4 border-ink bg-hot-pink px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform"
              >
                LIST NEW ART →
              </Link>
            </div>
          </section>

          {/* Artist profile */}
          <section className="rotate-1 border-4 border-paper bg-acid-lime p-6 text-ink shadow-graffiti">
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl tracking-widest">
              ARTIST PROFILE
            </h2>

            {artist ? (
              <div className="mt-3">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-ink bg-paper shadow-graffiti">
                    {artist.avatar_url ? (
                      <Image src={artist.avatar_url} alt={artist.name} fill sizes="96px" className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-ink/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-marker)] text-2xl text-electric-purple">{artist.handle}</p>
                    {artist.bio && <p className="mt-1 text-sm">{artist.bio}</p>}
                    <p className="mt-1 text-sm">
                      {artist.neighborhood}, {artist.city} {artist.country_flag}
                    </p>
                    {artist.vibe && artist.vibe.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {artist.vibe.map((v: string) => (
                          <span key={v} className="border-2 border-ink bg-paper px-2 py-0.5 font-[family-name:var(--font-bangers)] text-xs tracking-widest">
                            {v.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/account/profile"
                    className="inline-flex items-center gap-1 border-4 border-ink bg-cyber-cyan px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-ink shadow-graffiti hover:-translate-y-1 transition-transform"
                  >
                    <Pencil className="h-4 w-4" />
                    EDIT PROFILE
                  </Link>
                  <Link
                    href={`/artists/${artist.id}`}
                    className="border-4 border-ink bg-paper px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest shadow-graffiti hover:-translate-y-1 transition-transform"
                  >
                    VIEW PUBLIC PROFILE
                  </Link>
                  {artist.stripe_account_id ? (
                    <span className="border-4 border-ink bg-electric-purple px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-paper shadow-graffiti">
                      ✓ STRIPE LINKED
                    </span>
                  ) : (
                    <form action="/api/stripe/connect" method="post">
                      <button className="border-4 border-ink bg-sun-yellow px-4 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-ink shadow-graffiti hover:-translate-y-1 transition-transform">
                        CONNECT STRIPE → GET PAID
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm">
                  No artist profile yet. Set one up so buyers can find you, then drop your first piece.
                </p>
                <Link
                  href="/account/profile"
                  className="mt-4 inline-flex items-center gap-2 border-4 border-ink bg-hot-pink px-5 py-3 font-[family-name:var(--font-bangers)] text-xl tracking-widest text-paper shadow-graffiti hover:-translate-y-1 transition-transform"
                >
                  <Sparkles className="h-5 w-5" />
                  SET UP ARTIST PROFILE →
                </Link>
              </div>
            )}
          </section>

          {/* Orders */}
          <section className="border-4 border-paper bg-paper p-6 text-ink shadow-graffiti">
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl tracking-widest">
              YOUR ORDERS
            </h2>
            {orders && orders.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between border-2 border-ink bg-paper p-3"
                  >
                    <span className="font-[family-name:var(--font-bangers)] tracking-wide">
                      ${(o.amount_cents / 100).toFixed(2)}
                    </span>
                    <span
                      className={`border border-ink px-2 py-0.5 text-xs font-[family-name:var(--font-bangers)] tracking-widest ${
                        o.status === "paid" ? "bg-acid-lime" : "bg-sun-yellow"
                      }`}
                    >
                      {o.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm">No orders yet. Go put something in the cart 🛒</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
