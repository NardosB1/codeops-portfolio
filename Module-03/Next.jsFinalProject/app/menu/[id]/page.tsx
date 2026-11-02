import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { getDish, getDishes } from "@/lib/dishes";
import { formatEtb } from "@/lib/format";

export const revalidate = 3600; // keeps prices in step with /menu (see STRATEGY.md)

type Props = { params: Promise<{ id: string }> };

// Every dish id is known at build time, so each page is prerendered (●).
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: d.id }));
}

// Dynamic metadata: title, description, canonical and Open Graph come from the dish itself.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return { title: "Dish not found", robots: { index: false } };
  return {
    title: dish.name,
    description: dish.description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: { type: "website", title: `${dish.name} · Addis Eats`, description: dish.description },
  };
}

export default async function DishPage({ params }: Props) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound(); // unknown id renders not-found.tsx, not a crash

  return (
    <article>
      <Link href="/menu" className="text-sm underline">
        ← Back to the menu
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">{dish.name}</h1>
      <p className="mt-1 text-sm text-gray-600">{dish.category}</p>
      <p className="mt-4 max-w-prose">{dish.description}</p>
      <p className="mt-4 text-xl font-medium">{formatEtb(dish.priceEtb)}</p>
      <div className="mt-4">
        <AddToCartButton dish={{ id: dish.id, name: dish.name, priceEtb: dish.priceEtb }} />
      </div>
    </article>
  );
}
