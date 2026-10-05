import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const dishes = [{ id: "kitfo" }, { id: "shiro" }, { id: "doro-wat" }];
    return dishes.map((d) => ({ id: d.id }));
}

export default async function DishPage({ params }) {
const { id } = params;

if (id === "unknown-dish") {
    notFound();
}

return (
    <main className="p-6">
        <h1 className="text-2xl font-bold">Dish: {id}</h1>
    </main>
);
}