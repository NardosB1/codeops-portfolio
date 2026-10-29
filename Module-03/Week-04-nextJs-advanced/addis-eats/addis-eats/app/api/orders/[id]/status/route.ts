import { NextResponse, type NextRequest } from "next/server";
import { getOrderFor } from "@/lib/orders";
import { OrderIdSchema } from "@/lib/schemas";
import { getSession } from "@/lib/session";

const NO_STORE = { "Cache-Control": "no-store" };

// Polled by <OrderStatusLive>. Re-checks the session AND ownership on every request:
// the page being protected does not protect this endpoint.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401, headers: NO_STORE });

  const { id } = await params;
  const parsed = OrderIdSchema.safeParse(id);
  const order = parsed.success ? await getOrderFor(user.id, parsed.data) : null;
  // Someone else's order and a missing order give the same answer.
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404, headers: NO_STORE });

  return NextResponse.json({ status: order.status }, { headers: NO_STORE });
}
