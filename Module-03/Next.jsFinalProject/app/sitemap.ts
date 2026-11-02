import type { MetadataRoute } from "next";
import { getDishes } from "@/lib/dishes";
import { SITE_URL } from "@/lib/site";

// Public, indexable pages only. Private routes (/orders, /checkout, /kitchen) are left out on purpose.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dishes = await getDishes();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...dishes.map((d) => ({
      url: `${SITE_URL}/menu/${d.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
