import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Dish } from "@/lib/dishes";
import { formatEtb } from "@/lib/format";

// Server component: markup only. Callers wrap it in a <ul>.
export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <li className="dish-card flex flex-col justify-between rounded border p-4" data-category={dish.category}>
      <div>
        <h2 className="text-lg font-semibold">
          <Link href={`/menu/${dish.id}`} className="underline">{dish.name}</Link>
        </h2>
        <p className="mt-1 text-sm text-gray-600">{dish.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium">{formatEtb(dish.priceEtb)}</span>
        <AddToCartButton dish={{ id: dish.id, name: dish.name, priceEtb: dish.priceEtb }} />
      </div>
    </li>
  );
}