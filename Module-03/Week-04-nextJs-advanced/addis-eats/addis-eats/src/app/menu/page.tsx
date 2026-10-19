import type { Metadata } from "next";
import { getMenu } from "@/lib/queries";
export const metadata: Metadata = { title: "Menu" };
export const revalidate = 300;
export default async function MenuPage() { const dishes = await getMenu(); return <><h1 className="text-3xl font-bold">Our menu</h1><p className="mt-2 text-slate-600">Prices are displayed in Ethiopian birr.</p>{dishes.length === 0 ? <p className="mt-8 rounded-xl border bg-white p-6">No dishes have been added yet. Add dishes to your Neon database to populate this page.</p> : <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dishes.map(d => <li key={d.id} className="rounded-xl border bg-white p-5"><h2 className="text-lg font-semibold">{d.name}</h2><p className="mt-2 text-sm text-slate-600">{d.description}</p><p className="mt-4 font-bold">{(Number(d.price_cents)/100).toFixed(2)} ETB</p><a className="mt-3 inline-block text-sm font-semibold underline" href={`/menu/${d.slug}`}>Details</a></li>)}</ul>}</>; }
