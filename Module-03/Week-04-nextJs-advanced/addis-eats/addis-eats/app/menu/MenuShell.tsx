"use client"; // category + search state, and the debounced SWR search

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import useSWR from "swr";

type DishRef = { id: string; category: string };
type SearchResponse = { dishes: DishRef[] };

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;
const SAFE_ID = /^[a-z0-9-]+$/i; // ids go into a <style> rule, so only allow plain slugs

const fetcher = async (url: string): Promise<SearchResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

// Returns `value` only after it has stopped changing for `delay` ms.
function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// `children` is the server-rendered dish list. A client component may wrap
// server content only if it receives that content as children.
export default function MenuShell({
  categories,
  dishes,
  children,
}: {
  categories: string[];
  dishes: DishRef[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const showFilters = pathname === "/menu"; // not on a dish page
  const [selected, setSelected] = useState("All");
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query.trim(), DEBOUNCE_MS);
  const searching = showFilters && debounced.length >= MIN_CHARS;

  // A null key means "do not fetch": nothing is requested for empty or 1-character input.
  const key = searching ? `/api/dishes?q=${encodeURIComponent(debounced)}` : null;
  const { data, error, isValidating } = useSWR(key, fetcher, {
    fallbackData: { dishes }, // the server already rendered the full menu: no empty flash
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const matched = searching && data ? new Set(data.dishes.map((d) => d.id).filter((id) => SAFE_ID.test(id))) : null;
  const visibleCount = dishes.filter(
    (d) => (selected === "All" || d.category === selected) && (!matched || matched.has(d.id)),
  ).length;

  // Hide non-matching cards with CSS, so the page stays static and never re-fetches HTML.
  const rules: string[] = [];
  if (showFilters && selected !== "All") {
    rules.push(`.dish-card:not([data-category=${JSON.stringify(selected)}]){display:none}`);
  }
  if (showFilters && matched) {
    rules.push(
      matched.size > 0
        ? `.dish-card:not(:is(${[...matched].map((id) => `[data-id="${id}"]`).join(",")})){display:none}`
        : ".dish-card{display:none}",
    );
  }

  const options = ["All", ...categories];

  return (
    <main id="main" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row">
      {showFilters && (
        <div className="md:w-48 md:shrink-0">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4">
            <label htmlFor="menu-search" className="mb-1 block text-sm font-medium">
              Search the menu
            </label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              placeholder="e.g. lentil"
              className="w-full rounded border border-gray-400 px-3 py-2"
            />
          </form>
          <nav aria-label="Menu categories">
            <ul className="flex gap-2 overflow-x-auto md:flex-col">
              {options.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    aria-pressed={selected === c}
                    onClick={() => setSelected(c)}
                    className={`w-full rounded border px-3 py-1.5 text-left text-sm ${selected === c
                  ? "border-lake-700 bg-lake-700 text-white"
                  : "border-edge bg-paper hover:bg-honey-100"
                  }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {rules.length > 0 && <style>{rules.join("")}</style>}
        {showFilters && (
          <div className="mb-3 min-h-5 text-sm text-gray-600" role="status" aria-live="polite">
            {error
              ? "Search is unavailable right now, so the whole menu is shown."
              : visibleCount === 0
                ? `No dishes match “${query.trim()}”.`
                : isValidating && searching
                  ? "Searching…"
                  : `${visibleCount} ${visibleCount === 1 ? "dish" : "dishes"} shown`}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
