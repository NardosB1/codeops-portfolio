import { requireStaff } from "@/lib/auth";
import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function KitchenPage() { await requireStaff(); const orders = await sql`SELECT id,status,total_cents,created_at FROM orders WHERE status IN ('placed','preparing','ready') ORDER BY created_at ASC`; return <><h1 className="text-3xl font-bold">Kitchen queue</h1><p className="mt-2 text-slate-600">Staff-only view. Status mutations must use updateOrderStatus.</p><ul className="mt-6 space-y-3">{orders.map(o => <li key={String(o.id)} className="rounded-xl border bg-white p-5">Order {String(o.id).slice(0,8)} · {String(o.status)} · {(Number(o.total_cents)/100).toFixed(2)} ETB</li>)}</ul></>; }
