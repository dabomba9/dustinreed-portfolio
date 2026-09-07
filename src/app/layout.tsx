import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/app-shell";
import "./globals.css";

/* Fonts are self-hosted variable woff2. No third-party request on load.
   Geist and Geist Mono, SIL OFL - see src/fonts/GEIST-LICENSE.txt.
   Both carry a weight axis only; there is no optical size axis, so the one
   lever available for the dark ground is weight. */
const geist = localFont({
  src: "../fonts/geist-var.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/geist-mono-var.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

/* Set NEXT_PUBLIC_SITE_URL at deploy time. Until then this stays local, so
   nothing hardcodes a domain that isn't yours yet. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dustin Reed — I design products and ship the code",
    template: "%s — Dustin Reed",
  },
  description:
    "Founding designer at CurbNTurf. Brand, product, web and native apps, front end. Seven years on the same product.",
  openGraph: {
    title: "Dustin Reed — I design products and ship the code",
    description:
      "Founding designer at CurbNTurf. Brand, product, web and native apps, front end. Seven years on the same product.",
    url: SITE_URL,
    siteName: "Dustin Reed",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dustin Reed — I design products and ship the code" }],
  },
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: "Dustin Reed — I design products and ship the code",
    description:
      "Founding designer at CurbNTurf. Brand, product, web and native apps, front end.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#131512",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-ground"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
