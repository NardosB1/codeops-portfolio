"use client"; // polls the status endpoint every few seconds

import useSWR from "swr";
import { statusBadgeClass } from "@/lib/format";
import { TERMINAL_STATUSES, type OrderStatus } from "@/lib/schemas";

type StatusResponse = { status: OrderStatus };

const POLL_MS = 5000;
const STEPS: OrderStatus[] = ["received", "preparing", "ready", "delivered"];
const isTerminal = (s: OrderStatus) => TERMINAL_STATUSES.includes(s);

const fetcher = async (url: string): Promise<StatusResponse> => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
};

// The server already knows the status when it renders the page, so it is passed
// in as fallbackData: the person sees real data immediately, never a spinner.
// Polling then runs every 5s and STOPS on its own once the status is final.
export default function OrderStatusLive({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const { data, error } = useSWR<StatusResponse>(`/api/orders/${orderId}/status`, fetcher, {
    fallbackData: { status: initialStatus },
    refreshInterval: (latest) => (latest && isTerminal(latest.status) ? 0 : POLL_MS),
  });

  const status = data?.status ?? initialStatus;
  const reached = STEPS.indexOf(status);

  return (
    <section aria-labelledby="status-h" className="mt-3">
      <h2 id="status-h" className="sr-only">
        Order status
      </h2>
      <p className="flex items-center gap-2">
        <span>Status:</span>
        <span
          role="status"
          aria-live="polite"
          className={`rounded border px-2 py-0.5 capitalize ${
i <= reached
    ? "border-honey-400 bg-honey-400 font-medium text-ink"
    : "border-edge text-gray-700"
}`}
        >
          {status}
        </span>
      </p>

      {status === "cancelled" ? (
        <p className="mt-2 text-sm">This order was cancelled.</p>
      ) : (
        <ol className="mt-3 flex flex-wrap gap-2 text-sm">
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={s === status ? "step" : undefined}
              className={`rounded border px-2 py-0.5 capitalize ${
                i <= reached ? "border-black bg-black text-white" : "border-gray-400 text-gray-700"
              }`}
            >
              {s}
            </li>
          ))}
        </ol>
      )}

      <p className="mt-2 text-xs text-gray-600">
        {error
          ? "Live updates paused. Refresh the page."
          : isTerminal(status)
            ? "This is the final status."
            : "Updates automatically every 5 seconds."}
      </p>
    </section>
  );
}
