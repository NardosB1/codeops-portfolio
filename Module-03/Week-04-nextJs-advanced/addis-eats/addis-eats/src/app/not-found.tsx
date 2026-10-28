import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">We couldn't find that</h1>
      <p className="mt-2">The page or dish you asked for doesn't exist.</p>
      <Link href="/menu" className="mt-4 inline-block underline">Back to the menu</Link>
    </main>
  );
}