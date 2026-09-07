import type { MetadataRoute } from "next";
import { pages } from "@/content/nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: SITE_URL + (page.href === "/" ? "" : page.href),
    lastModified: new Date(),
    changeFrequency: page.kind === "case" ? "monthly" : "weekly",
    priority: page.href === "/" ? 1 : page.kind === "case" ? 0.8 : 0.5,
  }));
}
