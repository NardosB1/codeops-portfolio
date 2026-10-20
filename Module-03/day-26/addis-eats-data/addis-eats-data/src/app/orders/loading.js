export default function Loading() {
return (
    <main className="wrap" aria-busy="true" aria-live="polite">
        <h1>Orders</h1>
        <p className="sr-only">Loading orders…</p>
        <table aria-hidden="true">
        <thead>
            <tr>
            {["Order", "Customer", "Neighbourhood", "Total (ETB)", "Date"].map((h) => (
            <th key={h}>{h}</th>
            ))}
            </tr>
        </thead>
        <tbody>
        {Array.from({ length: 5 }, (_, r) => (
            <tr key={r}>
            {Array.from({ length: 5 }, (_, c) => (
                <td key={c}><div className="skeleton" /></td>
            ))}
            </tr>
        ))}
        </tbody>
    </table>
    </main>
);
}