"use client"; // error boundaries must be client components

export default function MenuError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert">
      <h1 className="text-xl font-semibold">The menu couldn't load</h1>
      <p className="mt-2">Please try again.</p>
      <button type="button" onClick={reset} className="mt-3 rounded border px-3 py-1.5">Try again</button>
    </div>
  );
}