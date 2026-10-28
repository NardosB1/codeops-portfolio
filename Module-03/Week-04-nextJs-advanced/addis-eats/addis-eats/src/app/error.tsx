"use client";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main role="alert" className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2">That request was refused or failed.</p>
      {error.digest && <p className="mt-1 text-xs text-gray-500">Reference: {error.digest}</p>}
      <button type="button" onClick={reset} className="mt-4 rounded border px-3 py-1.5">Try again</button>
    </main>
  );
}