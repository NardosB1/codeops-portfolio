import type { MetadataRoute } from "next";
import { getMenu } from "@/lib/queries";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"; const dishes = await getMenu(); return [{ url: base, changeFrequency: "weekly", priority: 1 }, { url: `${base}/menu`, changeFrequency: "daily", priority: 0.9 }, ...dishes.map(d => ({ url: `${base}/menu/${d.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }))]; }
