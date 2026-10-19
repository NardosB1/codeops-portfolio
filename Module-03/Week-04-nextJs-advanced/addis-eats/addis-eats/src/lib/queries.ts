import "server-only";
import { sql } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
export type Dish = { id: string; slug: string; name: string; description: string; price_cents: number; image_url: string | null; available: boolean };
export async function getMenu(): Promise<Dish[]> {
  const rows = await sql`SELECT id, slug, name, description, price_cents, image_url, available FROM dishes WHERE available = true ORDER BY name`;
  return rows as Dish[];
}
export async function getDish(slug: string): Promise<Dish | null> {
  const rows = await sql`SELECT id, slug, name, description, price_cents, image_url, available FROM dishes WHERE slug = ${slug} AND available = true LIMIT 1`;
  return (rows[0] as Dish | undefined) ?? null;
}
export type Order = { id: string; user_id: string; status: string; total_cents: number; created_at: string };
export async function getOrdersFor(userId: string): Promise<Order[]> {
  const rows = await sql`SELECT id, user_id, status, total_cents, created_at FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return rows as Order[];
}
export async function getOrderFor(userId: string, orderId: string): Promise<Order | null> {
  const rows = await sql`SELECT id, user_id, status, total_cents, created_at FROM orders WHERE user_id = ${userId} AND id = ${orderId} LIMIT 1`;
  return (rows[0] as Order | undefined) ?? null;
}
