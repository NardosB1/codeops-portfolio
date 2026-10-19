import { requireUser } from "@/lib/auth";
import { getOrdersFor } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function OrdersPage() { const session = await requireUser(); const orders = await getOrdersFor(session.userId); return <><h1 className="text-3xl font-bold">Your orders</h1>{orders.length ? <ul className="mt-6 space-y-3">{orders.map(o => <li key={o.id} className="rounded-xl border bg-white p-5"><a className="font-semibold underline" href={`/orders/${o.id}`}>Order {o.id.slice(0,8)}</a><p className="mt-1 text-sm">Status: {o.status} · {(Number(o.total_cents)/100).toFixed(2)} ETB</p></li>)}</ul> : <p className="mt-5 rounded-xl border bg-white p-5">You have no orders yet.</p>}</>; }
