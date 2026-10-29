import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout"); // LAYER 2 (proxy.ts was layer 1)
  return (
    <main id="main" className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
      <CheckoutForm defaultName={user.name} />
    </main>
  );
}
