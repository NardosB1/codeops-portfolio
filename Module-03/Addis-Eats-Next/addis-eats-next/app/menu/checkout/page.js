import { cookies } from "next/headers";

export default function CheckoutPage() {
const sessionCookie = cookies().get("session");

return (
    <main className="p-8">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p>Session active: {sessionCookie ? "Yes" : "No"}</p>
    </main>
);
}