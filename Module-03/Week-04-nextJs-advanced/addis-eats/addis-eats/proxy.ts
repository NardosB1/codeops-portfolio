import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-proxy";
const PRIVATE = ["/orders", "/checkout", "/kitchen", "/account"];
export function proxy(request: NextRequest) {
 const path = request.nextUrl.pathname;
 if (!PRIVATE.some(prefix => path === prefix || path.startsWith(`${prefix}/`))) return NextResponse.next();
 const token = request.cookies.get(SESSION_COOKIE)?.value;
 if (!token || !verifySessionToken(token)) { const url = new URL("/signin", request.url); url.searchParams.set("next", `${path}${request.nextUrl.search}`); return NextResponse.redirect(url); }
 return NextResponse.next();
}
export const config = { matcher: ["/orders/:path*", "/checkout/:path*", "/kitchen/:path*", "/account/:path*"] };
