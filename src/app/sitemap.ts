import { siteConfig } from "@/lib/utils";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const routes = ["", "/about/", "/opportunities/", "/insights/", "/contact/"];

  return routes.map((route) => ({
    url: `${base}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
