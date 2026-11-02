import type { Metadata } from "next";
import CartView from "./CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false, follow: false } };

// Static shell. The contents are private to this browser, so CartView reads them on the client.
export default function CartPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
      <CartView />
    </main>
  );
}
