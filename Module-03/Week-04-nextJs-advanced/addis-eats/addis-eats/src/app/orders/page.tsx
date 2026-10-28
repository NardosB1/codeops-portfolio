import Link from "next/link";
import { cancelOrder } from "@/app/actions";
import { requireUser } from "@/lib/dal";
import { formatDate, formatEtb } from "@/lib/format";
import { getOrdersFor } from "@/lib/orders";

export const metadata = { title: "Your orders" };

export default async function OrdersPage() {
  const user = await requireUser("/orders"); // Layer 2
  const orders = await getOrdersFor(user.id); // scoped to the session id, never an id from the URL

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Your orders</h1>

      {orders.length === 0 ? (
        <p>You haven't ordered anything yet. <Link href="/menu" className="underline">See today's menu</Link></p>
      ) : (
        <ul className="divide-y">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <Link href={`/orders/${o.id}`} className="font-medium underline">Order {o.id}</Link>
                <p className="text-sm text-gray-600">{formatDate(o.createdAt)} · {formatEtb(o.totalEtb)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-gray-100 px-2 py-0.5 text-sm capitalize">{o.status}</span>
                {o.status === "received" && (
                  <form action={cancelOrder.bind(null, o.id)}>
                    <button type="submit" className="text-sm underline">Cancel</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}