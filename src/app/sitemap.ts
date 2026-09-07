import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { pages } from "@/content/nav";



export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: SITE_URL + (page.href === "/" ? "" : page.href),
    lastModified: new Date(),
    changeFrequency: page.kind === "case" ? "monthly" : "weekly",
    priority: page.href === "/" ? 1 : page.kind === "case" ? 0.8 : 0.5,
  }));
}
