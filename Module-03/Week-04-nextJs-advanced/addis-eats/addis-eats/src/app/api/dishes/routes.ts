import { NextResponse, type NextRequest } from "next/server";
import { getDishes } from "@/lib/dishes";

// Public, read-only. Nothing in our own pages calls this: server components
// query directly. It exists for the debounced search in Step 5.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dishes = await getDishes({
    category: searchParams.get("category") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });
  return NextResponse.json({ dishes });
}