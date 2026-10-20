import Link from "next/link";
import { getOrders, dayList, RANGE_LABEL } from "@/lib/orders";
import { RevenueChart, OrdersLineChart } from "./RevenueChart";

export default async function DashboardPage({ searchParams }) {
const { state } = await searchParams;
const orders = await getOrders(state);

if (orders.length === 0) {
    return (
        <main className="wrap">
        <h1>Addis Eats dashboard</h1>
        <div className="empty" role="status">
            <h2>No orders yet</h2>
            <p>When customers place orders, revenue and daily trends will show up here.</p>
            <Link href="/dashboard">Reload dashboard</Link>
        </div>
        </main>
    );
}

const byHood = {};
for (const o of orders) byHood[o.neighbourhood] = (byHood[o.neighbourhood] || 0) + o.total;
const revenue = Object.entries(byHood)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

const perDay = dayList().map((date) => ({
    date: date.slice(5), // MM-DD
    orders: orders.filter((o) => o.date === date).length,
}));

return (
    <main className="wrap">
        <h1>Addis Eats dashboard</h1>

        <section>
        <h2>Revenue by neighbourhood (ETB)</h2>
        <RevenueChart data={revenue} />
        </section>

        <section>
        <h2>Orders per day, {RANGE_LABEL} (number of orders)</h2>
        <OrdersLineChart data={perDay} />
        <table>
            <caption>Orders per day, {RANGE_LABEL}</caption>
            <thead>
            <tr><th scope="col">Date (MM-DD)</th><th scope="col">Orders</th></tr>
            </thead>
            <tbody>
            {perDay.map((d) => (
            <tr key={d.date}><td>{d.date}</td><td>{d.orders}</td></tr>
            ))}
            </tbody>
        </table>
        </section>

    <p><Link href="/orders">View all orders →</Link></p>
    </main>
);
}