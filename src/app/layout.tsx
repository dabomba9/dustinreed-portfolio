import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/app-shell";
import CustomCursor from "@/components/custom-cursor";
import { SITE_URL, PROFILES, EMAIL, HOME_DESCRIPTION } from "@/lib/site";
import "./globals.css";

/* Fonts are self-hosted variable woff2. No third-party request on load. */
const inter = localFont({
  src: "../fonts/inter-var.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

/* Big Shoulders: XO Type Co, drawn for the Chicago Design System. Two axes,
   weight 100-900 and optical size 10-72, so the display can actually be tuned
   for a dark ground instead of only made heavier. */
const bigShoulders = localFont({
  src: "../fonts/big-shoulders-var.woff2",
  variable: "--font-big-shoulders",
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
  /* The headline on the page is still "I design products and ship the
     code" - that is the better line and it stays. But a <title> is a search
     listing, not a headline, and this one named no role at all: no
     designer, no design engineer, no portfolio. The domain already wins
     "Dustin Reed" outright, so the title was spending its whole budget on
     the one query that was never in doubt. */
  title: {
    default: "Dustin Reed — Founding Product Designer & Design Engineer",
    template: "%s — Dustin Reed",
  },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: "Dustin Reed — Founding Product Designer & Design Engineer",
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: "Dustin Reed",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dustin Reed. I design it, I ship the code, I build the AI underneath." }],
  },
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: "Dustin Reed — Founding Product Designer & Design Engineer",
    /* One description, not two. The X card used to drop "Seven years on the
       same product" - the most distinctive clause in the sentence - for a
       length limit it was nowhere near. */
    description: HOME_DESCRIPTION,
    images: ["/og.png"],
  },
};

/**
 * One Person node, site-wide.
 *
 * Without it the portfolio, the LinkedIn profile and the GitHub account are
 * three unrelated documents. `sameAs` is what reconciles them into one
 * entity with a job title, an employer and a location - and it is also what
 * the LLM-shaped candidate searches now read. The visible h1 keeps its
 * voice; this is where the role is stated in a form a machine can act on.
 */
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dustin Reed",
  jobTitle: "Founding Product Designer & Design Engineer",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  email: `mailto:${EMAIL}`,
  description: HOME_DESCRIPTION,
  sameAs: [PROFILES.linkedin, PROFILES.github],
  worksFor: {
    "@type": "Organization",
    name: "CurbNTurf",
    url: "https://www.curbnturf.com",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "PR",
    addressCountry: "US",
  },
  knowsLanguage: ["en", "es"],
};

export const viewport: Viewport = {
  themeColor: "#0d2117",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* suppressHydrationWarning is load bearing, not noise suppression. The
       inline script below writes data-theme onto this element before paint,
       and the server rendered no such attribute - so on hydration React
       reconciles the difference by deleting it, and the reader's theme
       disappears the moment the page becomes interactive. Measured: the
       attribute reads 7 at DOMContentLoaded and undefined a tick later. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bigShoulders.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Before first paint, not in an effect. An effect runs after the
            browser has already painted, so a reader who picked a theme would
            watch the green flash past on every navigation before their own
            choice landed. Deliberately tiny, deliberately synchronous, and
            wrapped in try/catch because storage throws outright in some
            privacy modes rather than merely coming back empty. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('dr-theme');" +
              "if(t&&t!=='0')document.documentElement.dataset.theme=t;" +
              "if(localStorage.getItem('dr-grid')==='1')document.documentElement.dataset.grid='1';}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }}
        />
        {/* Site chrome, and deliberately outside AppShell: the drawn cursor
            belongs to the document, not to the nav and rail AppShell owns. */}
        <CustomCursor />
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
