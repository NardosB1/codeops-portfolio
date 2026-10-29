import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// robots.txt is advice for well-behaved crawlers, NOT access control.
// Private pages are protected by the three security layers; this just keeps them out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/orders", "/checkout", "/kitchen", "/signin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
