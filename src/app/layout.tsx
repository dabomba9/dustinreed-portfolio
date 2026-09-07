import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/app-shell";
import { SITE_URL } from "@/lib/site";
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
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
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
