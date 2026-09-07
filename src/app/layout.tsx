import type { Metadata } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/app-shell";
import AccentSwitch from "@/components/accent-switch"; // TEMP: palette compare
import "./globals.css";

/* Fonts are self-hosted variable woff2. No third-party request on load. */
const inter = localFont({
  src: "../fonts/inter-var.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const interTight = localFont({
  src: "../fonts/inter-tight-var.woff2",
  variable: "--font-inter-tight",
  display: "swap",
  weight: "100 900",
});

const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-var.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
        <AccentSwitch />
      </body>
    </html>
  );
}
