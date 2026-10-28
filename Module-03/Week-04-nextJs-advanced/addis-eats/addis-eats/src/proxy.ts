import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-config";

// Layer 1 only: does a cookie exist, and does it LOOK like a signed token
// (three dot-separated parts)? This is a fast front door, not security.
// The signature is verified in lib/session.ts (Layer 2) and again in every action (Layer 3).
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && token.split(".").length === 3) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = "/signin";
  url.search = "";
  url.searchParams.set("next", pathname + search); // safeNext() re-checks this on the way back in
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/orders/:path*", "/checkout/:path*", "/kitchen/:path*"],
};