import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOrderFor } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) { const session = await requireUser(); const { id } = await params; if (!/^[0-9a-f-]{36}$/i.test(id)) notFound(); const order = await getOrderFor(session.userId, id); if (!order) notFound(); return <section className="rounded-2xl border bg-white p-7"><h1 className="text-2xl font-bold">Order {order.id.slice(0,8)}</h1><p className="mt-4">Status: <strong>{order.status}</strong></p><p className="mt-2">Total: {(Number(order.total_cents)/100).toFixed(2)} ETB</p><p className="mt-5 text-sm text-slate-500">Order ownership is checked in the query, not inferred from the URL.</p></section>; }
