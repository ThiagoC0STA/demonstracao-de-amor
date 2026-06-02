import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";

// Display serif with italic + bold for the cinematic headlines.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body sans.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

// Handwriting signature.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Change to your deployed URL so the OG image resolves to an absolute URL.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://para-lilian.vercel.app",
  ),
  title: "Para Lilian",
  description: "Uma carta para você.",
  openGraph: {
    title: "Para Lilian",
    description: "Uma carta para você.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body className="bg-night text-cream antialiased">
        <ReducedMotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
