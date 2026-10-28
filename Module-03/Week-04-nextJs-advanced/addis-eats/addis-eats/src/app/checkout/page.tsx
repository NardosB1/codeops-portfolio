import { requireUser } from "@/lib/dal";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout"); // Layer 2 (proxy.ts was Layer 1)
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
      <CheckoutForm defaultName={user.name} />
    </main>
  );
}