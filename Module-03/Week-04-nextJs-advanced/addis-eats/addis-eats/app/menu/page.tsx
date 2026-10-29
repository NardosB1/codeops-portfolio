import type { Metadata } from "next";
import DishCard from "@/components/DishCard";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600; // ISR: rebuilt at most once an hour (see STRATEGY.md)

export const metadata: Metadata = {
  title: "Menu",
  description: "Kitfo, doro wat, shiro, tibs and more. Browse the full Addis Eats menu.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const dishes = await getDishes();
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Menu</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {dishes.map((d) => (
          <DishCard key={d.id} dish={d} />
        ))}
      </ul>
    </>
  );
}
