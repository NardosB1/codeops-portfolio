export default function Loading() {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      <div className="h-24 animate-pulse rounded bg-gray-200" />
      <div className="h-24 animate-pulse rounded bg-gray-200" />
      <span className="sr-only">Loading the menu…</span>
    </div>
  );
}
