import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"; return { rules: { userAgent: "*", allow: ["/", "/menu"], disallow: ["/account", "/orders", "/checkout", "/kitchen"] }, sitemap: `${base}/sitemap.xml` }; }
