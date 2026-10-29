import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusLive from "@/components/OrderStatusLive";
import { requireUser } from "@/lib/dal";
import { formatDate, formatEtb } from "@/lib/format";
import { getOrderFor } from "@/lib/orders";

export const metadata: Metadata = { title: "Order", robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/orders/${id}`); // LAYER 2
  const order = await getOrderFor(user.id, id); // the owner is part of the query
  if (!order) notFound(); // someone else's id looks exactly like a missing one

  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/orders" className="text-sm underline">
        ← All orders
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">Order {order.id}</h1>
      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>

      {/* The server's status seeds the poller, so there is no loading state. */}
      <OrderStatusLive orderId={order.id} initialStatus={order.status} />

      <ul className="mt-4 divide-y">
        {order.lines.map((l) => (
          <li key={l.dishId} className="flex justify-between py-2">
            <span>
              {l.qty} × {l.name}
            </span>
            <span>{formatEtb(l.priceEtb * l.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-lg font-semibold">Total: {formatEtb(order.totalEtb)}</p>
    </main>
  );
}
