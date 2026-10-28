import { NextResponse, type NextRequest } from "next/server";
import { getDish } from "@/lib/dishes";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return NextResponse.json({ error: "Dish not found" }, { status: 404 });
  return NextResponse.json({ dish });
}