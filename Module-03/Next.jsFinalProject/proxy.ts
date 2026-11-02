import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-config";

// LAYER 1 of 3. A fast front door, NOT the security.
// It only asks: does a cookie exist, and does it look like a signed token
// (three dot-separated parts)? The signature is verified in lib/session.ts
// (layer 2, every page) and again inside every Server Action (layer 3).
// Keeping this check shallow is deliberate: CVE-2025-29927 showed that a
// proxy/middleware check can be bypassed, so nothing may rely on it alone.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && token.split(".").length === 3) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = "/signin";
  url.search = "";
  url.searchParams.set("next", pathname + search); // re-validated by safeNext() after sign-in
  return NextResponse.redirect(url);
}

// /api/* is excluded on purpose: an API client needs a 401 JSON answer from the
// handler itself, not a redirect to an HTML sign-in page.
export const config = {
  matcher: ["/orders/:path*", "/checkout/:path*", "/kitchen/:path*"],
};
