import { Header, Footer } from "@/components/chrome";
import { LoginForms } from "../login-forms";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="-rotate-1 border-4 border-paper bg-electric-purple p-6 text-paper shadow-graffiti-lg">
            <p className="font-[family-name:var(--font-marker)] text-xl text-acid-lime">welcome back</p>
            <h1 className="mb-1 font-[family-name:var(--font-bangers)] text-5xl tracking-wide">SIGN IN</h1>
            <p className="mb-6 text-sm text-paper/80">
              Sign in to list art, follow artists, and check on your orders.
            </p>
            <LoginForms />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
