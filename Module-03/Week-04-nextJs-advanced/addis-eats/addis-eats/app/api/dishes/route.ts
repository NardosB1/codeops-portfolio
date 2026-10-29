import { NextResponse, type NextRequest } from "next/server";
import { getDishes } from "@/lib/dishes";

// Public, read-only menu data. Used by the debounced search on /menu.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dishes = await getDishes({
    category: searchParams.get("category") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });
  return NextResponse.json(
    { dishes },
    // Same for everyone, so a CDN may cache it briefly.
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
