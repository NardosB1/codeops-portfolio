import { updateOrderStatus } from "@/app/actions";
import { requireStaff } from "@/lib/dal";
import { formatDate } from "@/lib/format";
import { NEXT_STATUS, getAllOrders, type OrderStatus } from "@/lib/orders";

export const metadata = { title: "Kitchen" };

const LABEL: Partial<Record<OrderStatus, string>> = {
  preparing: "Start preparing",
  ready: "Mark ready",
  delivered: "Mark delivered",
};

export default async function KitchenPage() {
  const user = await requireStaff("/kitchen"); // Layer 2 + role
  const open = (await getAllOrders(user)).filter((o) => o.status !== "delivered" && o.status !== "cancelled");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Kitchen</h1>
      {open.length === 0 ? (
        <p>No open orders right now.</p>
      ) : (
        <ul className="divide-y">
          {open.map((o) => {
            const next = NEXT_STATUS[o.status];
            return (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{o.id} · {o.customerName}</p>
                  <p className="text-sm text-gray-600">
                    {o.lines.map((l) => `${l.qty} × ${l.name}`).join(", ")} · {formatDate(o.createdAt)}
                  </p>
                  {o.note && <p className="text-sm">Note: {o.note}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-sm capitalize">{o.status}</span>
                  {next && (
                    <form action={updateOrderStatus.bind(null, o.id, next)}>
                      <button type="submit" className="rounded bg-black px-3 py-1.5 text-sm text-white">{LABEL[next]}</button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}