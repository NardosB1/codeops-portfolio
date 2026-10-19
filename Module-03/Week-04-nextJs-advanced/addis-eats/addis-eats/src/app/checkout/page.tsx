import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function CheckoutPage() { await requireUser(); return <section className="rounded-2xl border bg-white p-7"><h1 className="text-3xl font-bold">Checkout</h1><p className="mt-3 text-slate-600">The server-side <code>placeOrder</code> action is implemented and recomputes prices from Neon. Connect your cart UI to it before enabling checkout in production.</p></section>; }
