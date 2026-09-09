import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { pages } from "@/content/nav";

/**
 * Real dates, per page.
 *
 * This was `new Date()`, so every deploy stamped all five URLs with the
 * same instant and a typo fix on one case study told Google the homepage,
 * the about page and two unrelated studies had changed too. Google works
 * out that the claim is always false and stops trusting lastmod for the
 * whole domain - so the day a page genuinely is rewritten, the signal that
 * would have earned a fast recrawl has already been spent.
 *
 * Kept here rather than in nav.ts because `npm run nav` regenerates that
 * file from the headings and would drop them. Update the line you touched;
 * `git log -1 --format=%cs -- <page file>` gives the date.
 */
const MODIFIED: Record<string, string> = {
  "/": "2026-09-09",
  "/work/curbnturf": "2026-09-08",
  "/work/coqui-cardboard": "2026-09-09",
  "/work/infocon-lrs": "2026-09-08",
  "/about": "2026-09-09",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: SITE_URL + (page.href === "/" ? "" : page.href),
    lastModified: new Date(MODIFIED[page.href] ?? "2026-09-09"),
    changeFrequency: page.kind === "case" ? "monthly" : "weekly",
    priority: page.href === "/" ? 1 : page.kind === "case" ? 0.8 : 0.5,
  }));
}
