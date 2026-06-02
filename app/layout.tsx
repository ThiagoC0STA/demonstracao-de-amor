import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";

// Display: Fraunces — a high-contrast old-style serif with an optical-size axis
// (`opsz`). With `font-optical-sizing: auto` (see globals.css) the letterforms
// get more dramatic and characterful as the type grows, and quieter at small
// sizes. Far less generic than Playfair, and the italic is gorgeous at scale.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

// Letter body: Newsreader — a reading serif (also optical-size aware). The
// letter is the emotional climax; it should read like a letter, not UI copy.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

// Meta / UI voice: Inter (variable — full weight range, no need to list weights).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Signature: Pinyon Script — a fine copperplate pen script for "seu, pra sempre".
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
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
      className={`${fraunces.variable} ${newsreader.variable} ${inter.variable} ${pinyon.variable}`}
    >
      <body className="bg-night text-cream antialiased">
        <ReducedMotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
