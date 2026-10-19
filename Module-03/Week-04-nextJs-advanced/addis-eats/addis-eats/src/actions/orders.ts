"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { orderIdSchema, placeOrderSchema, statusSchema } from "@/lib/validation";
export async function placeOrder(input: unknown): Promise<{ error?: string; orderId?: string }> {
  const session = await getSession(); if (!session) return { error: "Sign in before placing an order." };
  const parsed = placeOrderSchema.safeParse(input); if (!parsed.success) return { error: "Your cart is invalid." };
  // Re-read prices from the database. Never trust client-provided prices or totals.
  const ids = parsed.data.items.map(i => i.dishId);
  const dishes = await sql`SELECT id, price_cents FROM dishes WHERE available = true AND id = ANY(${ids}::uuid[])`;
  const priceMap = new Map(dishes.map(d => [String(d.id), Number(d.price_cents)]));
  if (priceMap.size !== new Set(ids).size) return { error: "One or more dishes are unavailable." };
  const total = parsed.data.items.reduce((sum, item) => sum + (priceMap.get(item.dishId) ?? 0) * item.quantity, 0);
  // Neon HTTP driver does not expose interactive transactions; use a single CTE statement for atomic order + items.
  const payload = JSON.stringify(parsed.data.items.map(i => ({ dishId: i.dishId, quantity: i.quantity, unitPrice: priceMap.get(i.dishId) })));
  const rows = await sql`WITH new_order AS (INSERT INTO orders (user_id,total_cents) VALUES (${session.userId},${total}) RETURNING id), input_items AS (SELECT * FROM jsonb_to_recordset(${payload}::jsonb) AS x("dishId" uuid, quantity integer, "unitPrice" integer)), inserted AS (INSERT INTO order_items (order_id,dish_id,quantity,unit_price_cents) SELECT o.id, i."dishId", i.quantity, i."unitPrice" FROM new_order o CROSS JOIN input_items i RETURNING order_id) SELECT id FROM new_order`;
  const orderId = rows[0]?.id as string | undefined; if (!orderId) return { error: "Order could not be created." };
  revalidatePath("/orders"); redirect(`/orders/${orderId}`);
}
export async function cancelOrder(orderId: string): Promise<{ error?: string }> {
  const session = await getSession(); if (!session) return { error: "Sign in required." };
  const parsed = orderIdSchema.safeParse(orderId); if (!parsed.success) return { error: "Invalid order." };
  const rows = await sql`UPDATE orders SET status = 'cancelled', updated_at = now() WHERE id = ${parsed.data} AND user_id = ${session.userId} AND status = 'placed' RETURNING id`;
  if (!rows.length) return { error: "Order not found or no longer cancellable." };
  revalidatePath("/orders"); return {};
}
export async function updateOrderStatus(orderId: string, status: string): Promise<{ error?: string }> {
  const session = await getSession(); if (!session) return { error: "Sign in required." };
  if (session.user.role !== "staff") return { error: "Staff access required." };
  const id = orderIdSchema.safeParse(orderId); const nextStatus = statusSchema.safeParse(status);
  if (!id.success || !nextStatus.success) return { error: "Invalid order update." };
  const rows = await sql`UPDATE orders SET status = ${nextStatus.data}, updated_at = now() WHERE id = ${id.data} AND status <> 'cancelled' RETURNING id`;
  if (!rows.length) return { error: "Order not found." };
  revalidatePath("/kitchen"); revalidatePath(`/orders/${id.data}`); return {};
}
