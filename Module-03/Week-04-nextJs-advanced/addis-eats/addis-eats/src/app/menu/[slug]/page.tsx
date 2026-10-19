import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDish } from "@/lib/queries";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const dish = await getDish(slug); return dish ? { title: dish.name, description: dish.description } : { title: "Dish not found" }; }
export default async function DishPage({ params }: Props) { const { slug } = await params; const dish = await getDish(slug); if (!dish) notFound(); return <article className="max-w-2xl rounded-2xl border bg-white p-8"><a href="/menu" className="text-sm underline">← Menu</a><h1 className="mt-5 text-3xl font-bold">{dish.name}</h1><p className="mt-3 text-slate-600">{dish.description}</p><p className="mt-6 text-xl font-bold">{(Number(dish.price_cents)/100).toFixed(2)} ETB</p><p className="mt-6 text-sm text-slate-500">Checkout UI can be connected to the validated placeOrder action after dishes are seeded.</p></article>; }
