"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,} from "recharts";

const etb = (v) => `ETB ${Number(v).toLocaleString("en-US")}`;

export function RevenueChart({ data }) {
return (
    <div style={{ height: 320 }} role="img" aria-label="Bar chart of revenue in ETB by neighbourhood">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={etb} width={90} />
            <Tooltip formatter={(v) => etb(v)} />
            <Bar dataKey="total" fill="#2a4d8a" />
        </BarChart>
    </ResponsiveContainer>
    </div>
);
}

export function OrdersLineChart({ data }) {
return (
    <div style={{ height: 280 }} role="img" aria-label="Line chart of orders per day. The same data is in the table below.">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#c9a227" strokeWidth={2} />
        </LineChart>
        </ResponsiveContainer>
    </div>
);
}