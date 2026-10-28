import Link from "next/link";
import DishCard from "@/components/DishCard";
import { getTodaysSpecials } from "@/lib/dishes";

export default async function Home() {
  const specials = await getTodaysSpecials(); // read at build time → static
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold">Addis Eats</h1>
      <p className="mb-8">Today's specials, delivered across Addis Ababa.</p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {specials.map((d) => <DishCard key={d.id} dish={d} />)}
      </ul>
      <Link href="/menu" className="mt-8 inline-block underline">See the full menu</Link>
    </main>
  );
}