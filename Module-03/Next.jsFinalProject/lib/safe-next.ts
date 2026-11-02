// Open-redirect defence for ?next=. Returns a same-site path, or "/".
// A bare startsWith("/") is not enough: "//evil.com" and "/\evil.com" both start
// with a slash but the browser treats them as another host.
export function safeNext(raw: unknown): string {
  if (typeof raw !== "string") return "/";
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";

  try {
    const base = "http://localhost";
    const url = new URL(value, base); // also normalises tabs/newlines the browser would strip
    if (url.origin !== base) return "/"; // resolved to a different host
    if (url.pathname === "/signin" || url.pathname.startsWith("/signin/")) return "/"; // no loops
    return url.pathname + url.search;
  } catch {
    return "/";
  }
}
