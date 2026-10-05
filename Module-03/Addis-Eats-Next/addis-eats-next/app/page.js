import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Addis Eats</h1>
      <Link href="/menu" className="text-blue-600 underline">View Menu</Link>
    </main>
  );
}