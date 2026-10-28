import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { formatDate, formatEtb } from "@/lib/format";
import { getOrderFor } from "@/lib/orders";

export const metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/orders/${id}`); // Layer 2
  const order = await getOrderFor(user.id, id); // the owner is part of the query
  if (!order) notFound(); // someone else's id looks exactly like a missing one

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/orders" className="text-sm underline">← All orders</Link>
      <h1 className="mt-3 text-2xl font-semibold">Order {order.id}</h1>
      <p className="mt-1">Status: <strong className="capitalize">{order.status}</strong></p>
      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
      <ul className="mt-4 divide-y">
        {order.lines.map((l) => (
          <li key={l.dishId} className="flex justify-between py-2">
            <span>{l.qty} × {l.name}</span>
            <span>{formatEtb(l.priceEtb * l.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-lg font-semibold">Total: {formatEtb(order.totalEtb)}</p>
    </main>
  );
}