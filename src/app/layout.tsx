import type { Metadata } from "next";
import { Bangers, Permanent_Marker, Archivo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MY NEIGHBOR IS AN ARTIST — Global Art Marketplace",
  description:
    "Discover wild art from real neighborhoods around the world. Buy direct from local artists, support your block, your city, your scene.",
  openGraph: {
    title: "MY NEIGHBOR IS AN ARTIST",
    description:
      "A loud, local, global art marketplace. Find the dopest artists on your block.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bangers.variable} ${permanentMarker.variable} ${archivo.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
