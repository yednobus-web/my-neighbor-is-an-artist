import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { LocationProvider } from "@/components/location-provider";
import { FavoritesProvider } from "@/components/favorites-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Neighbor Is An Artist — Art from your neighborhood",
  description:
    "The person two streets over paints. Discover and buy original art directly from artists near you.",
  openGraph: {
    title: "My Neighbor Is An Artist",
    description:
      "The person two streets over paints. Discover and buy original art directly from artists near you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        <LocationProvider>
          <FavoritesProvider>
            <CartProvider>{children}</CartProvider>
          </FavoritesProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
