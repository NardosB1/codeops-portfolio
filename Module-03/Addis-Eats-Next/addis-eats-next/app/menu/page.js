import Link from "next/link";
import { Suspense } from "node:react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";

export const revalidate = 3600;

export default function MenuPage() {
return (
    <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Our Menu</h1>
        <Suspense fallback={<DishSkeleton />}>
            <DishList />
        </Suspense>
    </main>
);
}