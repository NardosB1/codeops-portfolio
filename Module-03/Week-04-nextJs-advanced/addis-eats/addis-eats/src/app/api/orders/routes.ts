import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { createOrder } from "@/lib/orders";
import { PlaceOrderSchema, zodFieldErrors } from "@/lib/schemas";

// For callers outside our own pages (a partner app, curl). Same rules as placeOrder.
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Send application/json" }, { status: 415 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 }); }

  const parsed = PlaceOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: zodFieldErrors(parsed.error) }, { status: 422 });
  }

  const result = createOrder(user.id, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });

  return NextResponse.json({ order: result.order }, { status: 201 });
}