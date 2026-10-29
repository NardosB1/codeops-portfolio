import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Dish } from "@/lib/dishes";
import { formatEtb } from "@/lib/format";

// Server component: markup only. Callers wrap it in a <ul>.
// data-id / data-category let MenuShell hide cards with CSS, so the list stays
// server-rendered and static while the person filters and searches.
export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <li
  className="dish-card flex flex-col justify-between rounded-xl border border-honey-200 bg-paper p-4 shadow-sm transition hover:border-honey-300 hover:shadow-md"
  data-id={dish.id}
  data-category={dish.category}>
      <div>
        <span className="mb-2 inline-block rounded-full bg-lake-100 px-2 py-0.5 text-xs font-medium text-lake-800">
        {dish.category}
        </span>
        <h2 className="text-lg font-semibold">
          <Link href={`/menu/${dish.id}`} className="underline">
            {dish.name}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-gray-600">{dish.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-honey-700">{formatEtb(dish.priceEtb)}</span>
        <AddToCartButton dish={{ id: dish.id, name: dish.name, priceEtb: dish.priceEtb }} />
      </div>
    </li>
  );
}
