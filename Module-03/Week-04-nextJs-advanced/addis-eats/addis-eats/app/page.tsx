import type { Metadata } from "next";
import Link from "next/link";
import DishCard from "@/components/DishCard";
import { getTodaysSpecials } from "@/lib/dishes";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const specials = await getTodaysSpecials();
  return (
    <main id="main" className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-linear-to-br from-honey-100 to-honey-200 p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-honey-700">Fresh from Addis Ababa</p>
        <h1 className="mt-1 text-4xl font-bold text-lake-800">Addis Eats</h1>
        <p className="mt-2 max-w-prose text-lg">Today&apos;s specials, delivered across Addis Ababa.</p>
        <Link
          href="/menu"
          className="mt-5 inline-block rounded bg-lake-700 px-5 py-2.5 font-semibold text-white hover:bg-lake-800"
        >
          See the full menu
        </Link>
      </section>

      <h2 className="mb-4 text-xl font-semibold text-lake-800">Today&apos;s specials</h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {specials.map((d) => (
          <DishCard key={d.id} dish={d} />
        ))}
      </ul>
    </main>
  );
}