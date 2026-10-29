"use client"; // useActionState (pending/error state) + reads the cart store

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { placeOrder, type PlaceOrderState } from "@/app/actions";
import { useCart } from "@/components/Providers";
import { formatEtb } from "@/lib/format";

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const { lines, ready, totalEtb, clear } = useCart();
  const [state, formAction, pending] = useActionState<PlaceOrderState, FormData>(placeOrder, {});

  // Once the server has saved the order, the browser's cart can go.
  useEffect(() => {
    if (state.orderId) clear();
  }, [state.orderId, clear]);

  if (state.orderId) {
    return (
      <div role="status" className="rounded border border-green-300 bg-green-50 p-4">
        <h2 className="text-lg font-semibold">Order placed</h2>
        <p className="mt-1">
          Your order number is <strong>{state.orderId}</strong>.
        </p>
        <Link href={`/orders/${state.orderId}`} className="mt-3 inline-block underline">
          Track your order
        </Link>
      </div>
    );
  }

  const cartIsEmpty = ready && lines.length === 0;
  // Only ids and quantities leave the browser: the server prices the order itself.
  const items = JSON.stringify(lines.map(({ dishId, qty }) => ({ dishId, qty })));
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="items" value={items} />

      {state.error && (
        <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <section aria-labelledby="summary-h">
        <h2 id="summary-h" className="mb-2 font-medium">
          Your order
        </h2>
        {!ready && <p aria-busy="true">Loading your cart…</p>}
        {cartIsEmpty && (
          <p>
            Your cart is empty.{" "}
            <Link href="/menu" className="underline">
              Browse the menu
            </Link>
          </p>
        )}
        {ready && lines.length > 0 && (
          <>
            <ul className="divide-y text-sm">
              {lines.map((l) => (
                <li key={l.dishId} className="flex justify-between py-1.5">
                  <span>
                    {l.qty} × {l.name}
                  </span>
                  <span>{formatEtb(l.priceEtb * l.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Total: {formatEtb(totalEtb)}</p>
            <p className="text-xs text-gray-600">The kitchen confirms the final price from its own menu.</p>
          </>
        )}
        {fe.items && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {fe.items}
          </p>
        )}
      </section>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          defaultValue={state.values?.name ?? defaultName}
          aria-invalid={!!fe.name}
          aria-describedby={fe.name ? "name-error" : undefined}
          className="w-full rounded border border-gray-400 px-3 py-2"
        />
        {fe.name && (
          <p id="name-error" className="mt-1 text-sm text-red-700">
            {fe.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={state.values?.phone ?? ""}
          aria-invalid={!!fe.phone}
          aria-describedby={fe.phone ? "phone-error" : undefined}
          className="w-full rounded border border-gray-400 px-3 py-2"
        />
        {fe.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-700">
            {fe.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium">
          Delivery note (optional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          defaultValue={state.values?.note ?? ""}
          aria-invalid={!!fe.note}
          aria-describedby={fe.note ? "note-error" : undefined}
          className="w-full rounded border border-gray-400 px-3 py-2"
        />
        {fe.note && (
          <p id="note-error" className="mt-1 text-sm text-red-700">
            {fe.note}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || cartIsEmpty}
        className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
