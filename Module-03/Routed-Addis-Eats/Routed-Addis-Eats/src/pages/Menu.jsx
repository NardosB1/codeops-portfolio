import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchDishes } from "../api/menu";
import DishCard from "../components/DishCard";

export default function Menu() {
    const [dishes, setDishes] = useState([]);
    const [status, setStatus] = useState("loading");
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("category") || "All";

useEffect(() => {
    let ignore = false;
    setStatus("loading");
    fetchDishes().then((data) => {
        if (!ignore) {setDishes(data);
            setStatus("ready");}
    })
        .catch(() => { if (!ignore) setStatus("error");
    });
        return () => { ignore = true;
    };
}, []);

    const categories = useMemo(() => {
    const counts = new Map();
    dishes.forEach((dish) => {
    counts.set(dish.category, (counts.get(dish.category) || 0) + 1);
    });
    return [
    { name: "All", count: dishes.length },...[...counts.entries()].map(([name, count]) => ({ name, count })),];
}, [dishes]);

function handleCategoryClick(category) {
    const next = new URLSearchParams(searchParams);
    if (category === "All") next.delete("category");
    else next.set("category", category);
    setSearchParams(next);
}

const visibleDishes =
    activeCategory === "All" ? dishes : dishes.filter((dish) => dish.category === activeCategory);

if (status === "loading") {
    return (
      <section>
        <h1>Menu</h1>
        <p>Loading the menu&hellip; the backend can take a moment to wake up.</p>
      </section>
    );
}

if (status === "error") {
    return (
      <section>
        <h1>Menu</h1>
        <p>We couldn&rsquo;t reach the menu right now. Please try again shortly.</p>
      </section>
    );
}

return (
    <section>
        <h1>Menu</h1>
        <div className="category-filter">
        {categories.map((category) => (
            <button key={category.name} type="button" className={category.name === activeCategory ? "active" : ""}
            onClick={() => handleCategoryClick(category.name)}>
            {category.name}
            <span className="chip-count">{category.count}</span>
        </button>
        ))}
        </div>

    <div className="dish-list">
        {visibleDishes.map((dish) => (<DishCard key={dish.id} dish={dish} />))}
    </div>

    {visibleDishes.length === 0 && <p>No dishes in this category yet.</p>}
    </section>
);
}