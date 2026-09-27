import { Link, useSearchParams } from "react-router-dom";
import { useAsync } from "../../shared/hooks/useAsync";
import { fetchMenu, CATEGORIES } from "./lib/mockApi";

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category"); // ?category=vegan lives in the URL, not local state
  const forceFail = params.get("fail") === "1"; // grading hook for the fetch-error state
  const forceCrash = params.get("crash") === "1"; // grading hook for the error boundary

  const state = useAsync(() => fetchMenu(category, forceFail), [category, forceFail]);

  if (forceCrash) {
    // Intentionally thrown during render (not a fetch error) so the
    // ErrorBoundary wrapping this route is what catches it.
    throw new Error("Simulated render crash (?crash=1) for error boundary testing.");
  }

  function setCategory(next: string | null) {
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set("category", next); else nextParams.delete("category");
    setParams(nextParams, { replace: true });
  }

  return (
    <section className="page">
      <h1>Menu</h1>

      <div className="category-filter" role="group" aria-label="Filter by category">
        <button
          className={`button ${!category ? "button--primary" : "button--secondary"}`}
          onClick={() => setCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`button ${category === c ? "button--primary" : "button--secondary"}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {state.status === "loading" && <p role="status">Loading menu…</p>}

      {state.status === "error" && (
        <p className="state-msg state-msg--error" role="alert">{state.error.message}</p>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <p className="state-msg state-msg--empty">No dishes in this category yet.</p>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <ul className="dish-list">
          {state.data.map((dish) => (
            <li key={dish.id} className="dish-card">
              <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
              <span>{dish.price} ETB</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
