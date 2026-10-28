"use client"; // holds the selected-category state

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

// `children` is the server-rendered dish list. A client component may wrap
// server content only if it receives that content as children.
export default function MenuShell({ categories, children }: { categories: string[]; children: ReactNode }) {
  const pathname = usePathname();
  const [selected, setSelected] = useState("All");
  const showFilters = pathname === "/menu"; // not on a dish page
  const options = ["All", ...categories];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row">
      {showFilters && (
        <nav aria-label="Menu categories" className="md:w-44 md:shrink-0">
          <ul className="flex gap-2 overflow-x-auto md:flex-col">
            {options.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={selected === c}
                  onClick={() => setSelected(c)}
                  className={`w-full rounded border px-3 py-1.5 text-left text-sm ${
                    selected === c ? "border-black bg-black text-white" : "border-gray-400"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="min-w-0 flex-1">
        {/* Hide non-matching cards with CSS, so the page stays static and never re-fetches. */}
        {showFilters && selected !== "All" && (
          <style>{`.dish-card:not([data-category=${JSON.stringify(selected)}]){display:none}`}</style>
        )}
        {children}
      </div>
    </main>
  );
}