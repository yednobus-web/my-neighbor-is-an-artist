import Link from "next/link";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/chrome";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { signOut } from "@/app/(auth)/actions";

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
              Auth isn't connected yet. See <Link href="/" className="underline">SETUP.md</Link> in the repo to wire up Supabase.
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
    .select("id, handle, name, neighborhood, city, country, country_flag, stripe_account_id")
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
              {user.email?.split("@")[0]?.toUpperCase() ?? "ANON"}
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
              <div className="mt-3 space-y-1">
                <p className="font-[family-name:var(--font-marker)] text-2xl text-electric-purple">{artist.handle}</p>
                <p className="text-sm">
                  {artist.neighborhood}, {artist.city} {artist.country_flag}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/artists/${artist.id}`}
                    className="border-2 border-ink bg-paper px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest"
                  >
                    VIEW PROFILE
                  </Link>
                  {artist.stripe_account_id ? (
                    <span className="border-2 border-ink bg-cyber-cyan px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest">
                      ✓ STRIPE LINKED
                    </span>
                  ) : (
                    <form action="/api/stripe/connect" method="post">
                      <button className="border-2 border-ink bg-sun-yellow px-3 py-1 font-[family-name:var(--font-bangers)] tracking-widest">
                        CONNECT STRIPE → GET PAID
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm">
                No artist profile yet. List your first piece on{" "}
                <Link href="/sell" className="underline">/sell</Link> and we'll create one.
              </p>
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
