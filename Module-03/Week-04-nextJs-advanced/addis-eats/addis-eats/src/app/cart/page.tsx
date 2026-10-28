import CartView from "./CartView";

export const metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
      <CartView />
    </main>
  );
}