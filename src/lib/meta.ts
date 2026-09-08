import type { Metadata } from "next";

/**
 * Page metadata, built in one place.
 *
 * Next.js inherits `openGraph` and `alternates` from the root layout into
 * every child route, and inheriting them is almost never what you want:
 * a canonical of "/" on a case study tells a search engine the page is a
 * duplicate of the homepage and should not be indexed on its own, and an
 * inherited og:title makes every link anyone shares render the same card.
 * Both were true here until this existed.
 *
 * Titles are written once. The root layout's title template appends the
 * name for the browser tab, and `ogTitle` reproduces that for the social
 * card, because the two are separate fields and Next does not copy one
 * into the other.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/og.png",
}: {
  title: string;
  description: string;
  /** Route path, leading slash, no trailing slash. "/" for the homepage. */
  path: string;
  /** 1200x630, relative to the site root. */
  image?: string;
}): Metadata {
  const ogTitle = path === "/" ? title : `${title} — Dustin Reed`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: "Dustin Reed",
      type: path.startsWith("/work/") ? "article" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}
