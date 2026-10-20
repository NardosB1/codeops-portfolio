import Link from "next/link";

const COLUMNS = [
    { key: "id", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "neighbourhood", label: "Neighbourhood" },
    { key: "total", label: "Total (ETB)" },
    { key: "date", label: "Date" },
];

export default function OrderTable({ rows, sort, dir, page, totalPages }) {
    const href = (s, d, p) => `/orders?sort=${s}&dir=${d}&page=${p}`;

return (
    <>
    <table>
        <caption>Orders, sorted by {sort} ({dir === "asc" ? "ascending" : "descending"})</caption>
        <thead>
            <tr>
            {COLUMNS.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort === c.key ? (dir === "asc" ? "ascending" : "descending") : "none"}>
                <Link href={href(c.key, sort === c.key && dir === "asc" ? "desc" : "asc", 1)}>
                {c.label}{sort === c.key ? (dir === "asc" ? " ▲" : " ▼") : ""}
                </Link>
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
        {rows.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.neighbourhood}</td>
              <td>{o.total.toLocaleString("en-US")}</td>
              <td>{o.date}</td>
            </tr>
    ))}
        </tbody>
    </table>

    <nav aria-label="Pagination" className="pager">
        {page > 1 ? (
        <Link href={href(sort, dir, page - 1)} rel="prev">← Previous</Link>
        ) : (
        <span aria-disabled="true">← Previous</span>
        )}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages ? (
        <Link href={href(sort, dir, page + 1)} rel="next">Next →</Link>
        ) : (
        <span aria-disabled="true">Next →</span>
        )}
    </nav>
    </>
);
}