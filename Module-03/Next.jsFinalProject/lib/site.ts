// Public origin used for canonical URLs, Open Graph and the sitemap.
// Priority: explicit NEXT_PUBLIC_SITE_URL > Vercel production URL > localhost.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Addis Eats";
export const SITE_DESCRIPTION = "Order Ethiopian food from Addis Ababa: kitfo, doro wat, shiro and more.";
