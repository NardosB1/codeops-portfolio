"use client"; // onClick writes to the cart store

import { useEffect, useState } from "react";
import { useCart } from "@/components/Providers";

export default function AddToCartButton({ dish }: { dish: { id: string; name: string; priceEtb: number } }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <>
      <button
  type="button"
  onClick={() => {
    add({ dishId: dish.id, name: dish.name, priceEtb: dish.priceEtb });
    setAdded(true);
  }}
  className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
    added ? "bg-lake-700 text-white" : "bg-honey-400 text-ink hover:bg-honey-300"
  }`}
>
  {added ? "Added ✓" : "Add to order"}
</button>
      <span className="sr-only" role="status">
        {added ? `${dish.name} added to your cart` : ""}
      </span>
    </>
  );
}
