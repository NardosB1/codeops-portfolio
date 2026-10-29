import "server-only";
import { findDish } from "./dishes";
import type { OrderStatus, PlaceOrderInput } from "./schemas";
import type { SessionUser } from "./session";

export type { OrderStatus };
export type OrderLine = { dishId: string; name: string; priceEtb: number; qty: number };
export type Order = {
  id: string;
  userId: string; // the owner; set from the session, never from the request
  customerName: string;
  phone: string;
  note: string;
  lines: OrderLine[];
  totalEtb: number;
  status: OrderStatus;
  createdAt: string;
};

// In-memory store (course decision). It survives dev hot-reloads via globalThis,
// but it resets on restart and each Vercel instance has its own copy. See FUTURE.md.
// This file is the ONLY place that touches the store, so a real database replaces it here.
type Store = { orders: Order[]; nextId: number };
const g = globalThis as typeof globalThis & { __addisEats?: Store };

function line(dishId: string, qty: number): OrderLine {
  const d = findDish(dishId)!; // seed data only
  return { dishId, name: d.name, priceEtb: d.priceEtb, qty };
}
function seedOrder(
  id: string,
  userId: string,
  name: string,
  status: OrderStatus,
  createdAt: string,
  lines: OrderLine[],
): Order {
  return {
    id, userId, customerName: name, phone: "0911000000", note: "", lines, status, createdAt,
    totalEtb: lines.reduce((s, l) => s + l.priceEtb * l.qty, 0),
  };
}
function seed(): Store {
  return {
    nextId: 814,
    orders: [
      seedOrder("ord_811", "usr_1", "Almaz", "delivered", "2026-10-26T12:10:00+03:00", [line("shiro", 2), line("buna", 2)]),
      seedOrder("ord_812", "usr_2", "Dawit", "received", "2026-10-28T13:05:00+03:00", [line("kitfo", 1)]),
      seedOrder("ord_813", "usr_1", "Almaz", "received", "2026-10-28T13:20:00+03:00", [line("doro-wat", 1), line("sambusa", 2)]),
    ],
  };
}
const store: Store = (g.__addisEats ??= seed());

const copy = (o: Order): Order => ({ ...o, lines: o.lines.map((l) => ({ ...l })) });
const newestFirst = (a: Order, b: Order) => b.createdAt.localeCompare(a.createdAt);

// ---------- Reads: every one takes the owner ----------
export async function getOrdersFor(userId: string): Promise<Order[]> {
  return store.orders.filter((o) => o.userId === userId).sort(newestFirst).map(copy);
}

export async function getOrderFor(userId: string, orderId: string): Promise<Order | null> {
  const o = store.orders.find((o) => o.id === orderId && o.userId === userId); // owner is in the query
  return o ? copy(o) : null; // someone else's id looks exactly like a missing one
}

// Staff only, enforced here as well as in the page.
export async function getAllOrders(actor: SessionUser): Promise<Order[]> {
  if (actor.role !== "staff") throw new Error("Staff only");
  return [...store.orders].sort(newestFirst).map(copy);
}

// ---------- Writes ----------
export function createOrder(
  userId: string,
  input: PlaceOrderInput,
): { ok: true; order: Order } | { ok: false; error: string } {
  // Merge duplicate dishes, then price every line from OUR data.
  const qtyById = new Map<string, number>();
  for (const it of input.items) qtyById.set(it.dishId, Math.min((qtyById.get(it.dishId) ?? 0) + it.qty, 20));

  const lines: OrderLine[] = [];
  for (const [dishId, qty] of qtyById) {
    const d = findDish(dishId);
    if (!d) return { ok: false, error: `"${dishId}" is not on the menu.` };
    lines.push({ dishId, name: d.name, priceEtb: d.priceEtb, qty });
  }

  const order: Order = {
    id: `ord_${store.nextId++}`,
    userId,
    customerName: input.name,
    phone: input.phone,
    note: input.note,
    lines,
    totalEtb: lines.reduce((s, l) => s + l.priceEtb * l.qty, 0),
    status: "received",
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return { ok: true, order: copy(order) };
}

// Customers can only cancel their OWN order, and only before the kitchen starts.
export function cancelOrderFor(userId: string, orderId: string): "ok" | "not_found" | "too_late" {
  const o = store.orders.find((o) => o.id === orderId && o.userId === userId); // ownership check
  if (!o) return "not_found";
  if (o.status !== "received") return "too_late";
  o.status = "cancelled";
  return "ok";
}

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export function setOrderStatusAsStaff(
  actor: SessionUser,
  orderId: string,
  status: OrderStatus,
): "ok" | "not_found" | "bad_transition" {
  if (actor.role !== "staff") throw new Error("Staff only"); // re-checked at the data layer
  const o = store.orders.find((o) => o.id === orderId);
  if (!o) return "not_found";
  if (NEXT_STATUS[o.status] !== status) return "bad_transition";
  o.status = status;
  return "ok";
}
