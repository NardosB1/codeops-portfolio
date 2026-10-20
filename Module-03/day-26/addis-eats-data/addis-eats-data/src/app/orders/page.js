import Link from "next/link";
import { getOrders } from "@/lib/orders";
import OrderTable from "./OrderTable";

const PAGE_SIZE = 10;
const SORTABLE = ["id", "customer", "neighbourhood", "total", "date"];

export default async function OrdersPage({ searchParams }) {
const params = await searchParams;
const sort = SORTABLE.includes(params.sort) ? params.sort : "date";
const dir = params.dir === "asc" ? "asc" : "desc";
const orders = await getOrders(params.state);

if (orders.length === 0) {
    return (
        <main className="wrap">
        <h1>Orders</h1>
        <div className="empty" role="status">
            <h2>No orders yet</h2>
            <p>New orders will appear in this table as soon as they come in.</p>
            <Link href="/dashboard">Back to dashboard</Link>
        </div>
        </main>
    );
}

const sorted = [...orders].sort((a, b) => {
    const x = a[sort], y = b[sort];
    const c = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
    return dir === "asc" ? c : -c;
});

const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
const page = Math.min(Math.max(parseInt(params.page) || 1, 1), totalPages);
const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

return (
    <main className="wrap">
        <h1>Orders</h1>
        <OrderTable rows={rows} sort={sort} dir={dir} page={page} totalPages={totalPages} />
        <p><Link href="/dashboard">← Back to dashboard</Link></p>
    </main>
);
}