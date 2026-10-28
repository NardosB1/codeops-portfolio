import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Exists because the browser (header) needs it. Returns only what the UI
// needs: no id, no hash. Never cached.
export async function GET() {
  const user = await getSession();
  return NextResponse.json(
    { user: user ? { name: user.name, role: user.role } : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}