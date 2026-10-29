"use client"; // reads the cart store

import Link from "next/link";
import { useCart } from "@/components/Providers";
import { formatEtb } from "@/lib/format";

export default function CartView() {
  const { lines, ready, totalEtb, setQty, remove } = useCart();

  if (!ready) return <p aria-busy="true">Loading your cart…</p>;

  if (lines.length === 0) {
    return (
      <div>
        <p className="mb-3">Your cart is empty.</p>
        <Link href="/menu" className="underline">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y">
        {lines.map((l) => (
          <li key={l.dishId} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium">{l.name}</p>
              <p className="text-sm text-gray-600">{formatEtb(l.priceEtb)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${l.name}`}
                disabled={l.qty <= 1}
                onClick={() => setQty(l.dishId, l.qty - 1)}
                className="rounded border px-2 disabled:opacity-40"
              >
                −
              </button>
              <span aria-live="polite" className="w-6 text-center">
                {l.qty}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${l.name}`}
                onClick={() => setQty(l.dishId, l.qty + 1)}
                className="rounded border px-2"
              >
                +
              </button>
              <button type="button" onClick={() => remove(l.dishId)} className="ml-2 text-sm underline">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-lg font-semibold">Total: {formatEtb(totalEtb)}</p>
      <Link href="/checkout" className="mt-4 inline-block rounded bg-black px-4 py-2 font-medium text-white">
        Go to checkout
      </Link>
    </div>
  );
}
