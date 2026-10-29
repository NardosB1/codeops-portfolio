import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Tells the header who is signed in. Exposes only name and role, never the id or the token.
export async function GET() {
  const user = await getSession();
  return NextResponse.json(
    { user: user ? { name: user.name, role: user.role } : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
